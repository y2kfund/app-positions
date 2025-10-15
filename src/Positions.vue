<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, watch, inject, nextTick } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import { usePositionsQuery, useThesisQuery, useThesisConnectionsQuery, extractSymbolRoot, type Position, type Thesis, type ThesisConnection, useSupabase } from '@y2kfund/core'
import { useQueryClient } from '@tanstack/vue-query'
import type { PositionsProps } from './index'

const props = withDefaults(defineProps<PositionsProps>(), {
  accountId: 'demo',
  highlightPnL: false,
  showHeaderLink: false,
  userId: null
})

const emit = defineEmits<{ 
  'row-click': [row: Position]
  'minimize': []
}>()

const numericFields = ['qty', 'avgPrice', 'price', 'market_value', 'unrealized_pnl', 'cash_flow_on_entry', 'cash_flow_on_exercise'] as const

// Query positions data
const q = usePositionsQuery(props.accountId, props.userId)
const sourcePositions = computed(() => {
  const positions = q.data.value || []
  if (!positions.length) return []
  
  return positions.map(p => {
    const newP = { ...p }
    for (const field of numericFields) {
      const value = (newP as any)[field]
      if (typeof value === 'number' && Number.isFinite(value)) {
        const decimalPart = value % 1
        if (Math.abs(value) * 1/100 > decimalPart || value == 0) {
          (newP as any)[field] = Math.trunc(value)
        }
      }
    }
    return newP
  })
})

// Query thesis data
const thesisQuery = useThesisQuery()
const thesisConnectionsQuery = useThesisConnectionsQuery()

// Tabulator instance
const tableDiv = ref<HTMLDivElement | null>(null)
let tabulator: Tabulator | null = null

// Symbol and thesis filters
const symbolTagFilters = ref<string[]>([])
const thesisTagFilters = ref<string[]>([])
const groupByThesis = ref(false)

// Active filters
type ActiveFilter = { field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis'; value: string }
const activeFilters = ref<ActiveFilter[]>([])

// Column visibility
type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'qty' | 'avgPrice' | 'price' | 'market_price' | 'market_value' | 'unrealized_pnl' | 'cash_flow_on_entry' | 'cash_flow_on_exercise' | 'be_price' | 'thesis'
const allColumnOptions: Array<{ field: ColumnField; label: string }> = [
  { field: 'legal_entity', label: 'Account' },
  { field: 'thesis', label: 'Thesis' },
  { field: 'symbol', label: 'Financial Instrument' },
  { field: 'asset_class', label: 'Asset Class' },
  { field: 'conid', label: 'Conid' },
  { field: 'undConid', label: 'Underlying Conid' },
  { field: 'multiplier', label: 'Multiplier' },
  { field: 'qty', label: 'Qty' },
  { field: 'avgPrice', label: 'Avg Price' },
  { field: 'price', label: 'Market Price' },
  { field: 'market_price', label: 'Ul CM Price' },
  { field: 'market_value', label: 'Market Value' },
  { field: 'unrealized_pnl', label: 'P&L Unrealized' },
  { field: 'cash_flow_on_entry', label: 'Entry cash flow' },
  { field: 'cash_flow_on_exercise', label: 'If exercised cash flow' },
  { field: 'be_price', label: 'BE Price' }
]

function parseVisibleColsFromUrl(): ColumnField[] {
  const url = new URL(window.location.href)
  const colsParam = url.searchParams.get('position_cols')
  if (!colsParam) {
    return allColumnOptions
      .map(c => c.field)
      .filter(field => !['asset_class', 'conid', 'undConid', 'multiplier', 'qty'].includes(field))
  }
  const fromUrl = colsParam.split('-and-').map(s => s.trim()).filter(Boolean) as ColumnField[]
  const valid = new Set(allColumnOptions.map(c => c.field))
  return fromUrl.filter(c => valid.has(c))
}

const visibleCols = ref<ColumnField[]>(parseVisibleColsFromUrl())

// Helper functions
function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return ''
  if (value % 1 == 0) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return ''
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value)
}

function extractTagsFromSymbol(symbolText: string): string[] {
  if (!symbolText) return []
  const text = String(symbolText)
  const symMatch = text.match(/^([A-Z]+)\b/)
  const base = symMatch?.[1] ?? ''
  const rightMatch = text.match(/\s([CP])\b/)
  const right = rightMatch?.[1] ?? ''
  const strikeMatch = text.match(/\s(\d+(?:\.\d+)?)\s+[CP]\b/)
  const strike = strikeMatch?.[1] ?? ''
  const codeMatch = text.match(/\b(\d{6})[CP]/)
  const expiry = codeMatch ? formatExpiryFromYyMmDd(codeMatch[1]) : ''
  return [base, expiry, strike, right].filter(Boolean)
}

function formatExpiryFromYyMmDd(code: string): string {
  if (!code || code.length !== 6) return ''
  const yy = code.substring(0, 2)
  const mm = code.substring(2, 4)
  const dd = code.substring(4, 6)
  return `20${yy}-${mm}-${dd}`
}

// Thesis cell editor
const supabase = useSupabase()
const queryClient = useQueryClient()

async function updateThesisConnection(symbolRoot: string, thesisId: string | null) {
  try {
    if (thesisId) {
      const { error } = await supabase
        .schema('hf')
        .from('positionsAndThesisConnection')
        .upsert({
          symbol_root: symbolRoot,
          thesis_id: thesisId,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'symbol_root,thesis_id'
        })
      if (error) throw error
    } else {
      const { error } = await supabase
        .schema('hf')
        .from('positionsAndThesisConnection')
        .delete()
        .eq('symbol_root', symbolRoot)
      if (error) throw error
    }
    
    // Invalidate queries and wait for them to complete
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['positions'] }),
      queryClient.invalidateQueries({ queryKey: ['thesisConnections'] })
    ])
    
    showToast('success', 'Thesis Updated', `All ${symbolRoot} positions have been updated`)
  } catch (error: any) {
    console.error('Error updating thesis connection:', error)
    showToast('error', 'Error', `Failed to update thesis: ${error.message}`)
    throw error
  }
}

// Toast system
type ToastType = 'success' | 'error' | 'warning' | 'info'
interface Toast {
  id: number
  type: ToastType
  title: string
  message?: string
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

function showToast(type: ToastType, title: string, message?: string) {
  const id = toastIdCounter++
  toasts.value.push({ id, type, title, message })
  setTimeout(() => removeToast(id), 5000)
}

function removeToast(id: number) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) toasts.value.splice(index, 1)
}

// Initialize Tabulator
const isTabulatorReady = ref(false)

function initializeTabulator() {
  if (!tableDiv.value) return

  // Destroy existing table before creating new one
  if (tabulator) {
    try { tabulator.destroy() } catch (error) {}
    tabulator = null
  }

  isTabulatorReady.value = false // Reset before creating

  // Determine if we should show bottom calcs
  const shouldShowBottomCalcs = !groupByThesis.value

  const columns: any[] = [
    {
      title: 'Account',
      field: 'legal_entity',
      minWidth: 120,
      frozen: true,
      visible: visibleCols.value.includes('legal_entity'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? () => 'All Accounts' : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? () => 'All Accounts' : undefined,
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) {
          return cell.getValue() || ''
        }
        const value = cell.getValue()
        if (typeof value === 'object' && value !== null) {
          return value.name || value.id || ''
        }
        return value || ''
      },
      cellClick: (e: any, cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return
        const value = cell.getValue()
        const accountName = typeof value === 'object' && value !== null ? (value.name || value.id) : value
        handleCellFilterClick('legal_entity', accountName)
      }
    },
    {
      title: 'Financial Instrument',
      field: 'symbol',
      minWidth: 200,
      frozen: true,
      visible: visibleCols.value.includes('symbol'),
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) {
          const color = '#495057'
          const symbolValue = cell.getValue() || ''
          return `<span style="font-weight: 600; color: ${color};">${symbolValue}</span>`
        }
        const tags = extractTagsFromSymbol(cell.getValue())
        const selectedTags = new Set(symbolTagFilters.value)
        return tags.map(tag => {
          const isSelected = selectedTags.has(tag)
          const className = isSelected ? 'fi-tag fi-tag-selected' : 'fi-tag'
          return `<span class="${className}">${tag}</span>`
        }).join(' ')
      },
      cellClick: (e: any, cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return
        const target = (e as MouseEvent).target as HTMLElement
        const tagSpan = target.closest('.fi-tag')
        if (tagSpan) {
          const clickedTag = tagSpan.textContent?.trim()
          if (clickedTag) handleCellFilterClick('symbol', clickedTag)
        }
      }
    },
    {
      title: 'Thesis',
      field: 'thesis',
      minWidth: 150,
      visible: visibleCols.value.includes('thesis'),
      formatter: (cell: any) => {
        try {
          const data = cell.getRow().getData()
          if (data?._isThesisGroup) return ''
          const thesis = cell.getValue()
          if (!thesis) return '<span style="color: #6c757d; font-style: italic;">No thesis</span>'
          const isSelected = thesisTagFilters.value.includes(thesis.title)
          const className = isSelected ? 'thesis-tag thesis-tag-selected' : 'thesis-tag'
          return `<span class="${className}" title="${thesis.description || ''}">${thesis.title}</span>`
        } catch (error) {
          console.warn('Thesis formatter error:', error)
          return '<span style="color: #6c757d; font-style: italic;">Error</span>'
        }
      },
      accessor: (value: any) => {
        return value?.id || ''
      },
      editor: 'list',
      editorParams: (cell: any) => {
        try {
          const options: any = { '': 'No thesis' }
          ;(thesisQuery.data.value || []).forEach((t: Thesis) => {
            options[t.id] = t.title
          })
          
          const rowData = cell.getRow().getData()
          const currentThesis = rowData.thesis
          const currentValue = currentThesis?.id || ''
          
          return {
            values: options,
            defaultValue: currentValue,
            clearable: true,
            verticalNavigation: "editor"
          }
        } catch (error) {
          console.warn('Thesis editor params error:', error)
          return { values: { '': 'No thesis' } }
        }
      },
      mutator: (value: any, data: any, type: string) => {
        try {
          if (typeof value === 'object' && value !== null) {
            return value
          }
          if (typeof value === 'string') {
            if (!value) return null
            const thesis = (thesisQuery.data.value || []).find((t: Thesis) => t.id === value)
            return thesis ? { id: thesis.id, title: thesis.title, description: thesis.description } : null
          }
          return null
        } catch (error) {
          console.warn('Thesis mutator error:', error)
          return null
        }
      },
      cellEdited: async (cell: any) => {
        try {
          const newThesis = cell.getValue()
          const newThesisId = newThesis?.id || null
          const rowData = cell.getRow().getData()
          const symbol = rowData?.symbol
          
          if (!symbol) return
          
          const symbolRoot = extractSymbolRoot(symbol)
          if (!symbolRoot) return
          
          await updateThesisConnection(symbolRoot, newThesisId)
        } catch (error) {
          console.error('Failed to update thesis:', error)
          try {
            cell.restoreOldValue()
          } catch (revertError) {
            console.warn('Could not revert cell value:', revertError)
          }
        }
      },
      cellClick: (e: any, cell: any) => {
        try {
          const data = cell.getRow().getData()
          if (data?._isThesisGroup) return
          if (e.detail === 1) {
            setTimeout(() => handleThesisCellFilterClick(cell), 200)
          }
        } catch (error) {
          console.warn('Thesis cell click error:', error)
        }
      },
      cellDblClick: (e: any, cell: any) => {
        try {
          const data = cell.getRow().getData()
          if (!data?._isThesisGroup) {
            cell.edit()
          }
        } catch (error) {
          console.warn('Thesis cell double click error:', error)
        }
      }
    },
    {
      title: 'Asset Class',
      field: 'asset_class',
      minWidth: 100,
      visible: visibleCols.value.includes('asset_class'),
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return ''
        return cell.getValue() || ''
      }
    },
    {
      title: 'Conid',
      field: 'conid',
      minWidth: 80,
      visible: visibleCols.value.includes('conid'),
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return ''
        return cell.getValue() || ''
      }
    },
    {
      title: 'Underlying Conid',
      field: 'undConid',
      minWidth: 110,
      visible: visibleCols.value.includes('undConid'),
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return ''
        return cell.getValue() || ''
      }
    },
    {
      title: 'Multiplier',
      field: 'multiplier',
      minWidth: 80,
      hozAlign: 'right',
      visible: visibleCols.value.includes('multiplier'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatNumber(cell.getValue()) : undefined,
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        return formatNumber(cell.getValue())
      }
    },
    {
      title: 'Qty',
      field: 'qty',
      minWidth: 70,
      hozAlign: 'right',
      visible: visibleCols.value.includes('qty'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatNumber(cell.getValue()) : undefined,
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return formatNumber(cell.getValue())
        return formatNumber(cell.getValue())
      }
    },
    {
      title: 'Avg Price',
      field: 'avgPrice',
      minWidth: 90,
      hozAlign: 'right',
      visible: visibleCols.value.includes('avgPrice'),
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        return formatCurrency(cell.getValue())
      }
    },
    {
      title: 'Market Price',
      field: 'price',
      minWidth: 100,
      hozAlign: 'right',
      visible: visibleCols.value.includes('price'),
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        return formatCurrency(cell.getValue())
      }
    },
    {
      title: 'Ul CM Price',
      field: 'market_price',
      minWidth: 100,
      hozAlign: 'right',
      visible: visibleCols.value.includes('market_price'),
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        const value = cell.getValue()
        return value === null || value === undefined ? '-' : formatCurrency(value)
      }
    },
    {
      title: 'Market Value',
      field: 'market_value',
      minWidth: 110,
      hozAlign: 'right',
      visible: visibleCols.value.includes('market_value'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return formatCurrency(cell.getValue())
        return formatCurrency(cell.getValue())
      }
    },
    {
      title: 'P&L Unrealized',
      field: 'unrealized_pnl',
      minWidth: 120,
      hozAlign: 'right',
      visible: visibleCols.value.includes('unrealized_pnl'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
      formatter: (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      }
    },
    {
      title: 'Entry cash flow',
      field: 'cash_flow_on_entry',
      minWidth: 120,
      hozAlign: 'right',
      visible: visibleCols.value.includes('cash_flow_on_entry'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
      formatter: (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      }
    },
    {
      title: 'If exercised cash flow',
      field: 'cash_flow_on_exercise',
      minWidth: 130,
      hozAlign: 'right',
      visible: visibleCols.value.includes('cash_flow_on_exercise'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
      formatter: (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      }
    },
    {
      title: 'BE Price',
      field: 'be_price',
      minWidth: 100,
      hozAlign: 'right',
      visible: visibleCols.value.includes('be_price'),
      formatter: (cell: any) => {
        const value = cell.getValue()
        return value === null || value === undefined ? '-' : formatNumber(value)
      }
    }
  ]

  const tabulatorConfig: any = {
    data: gridRowData.value,
    columns,
    layout: 'fitColumns',
    height: '100%',
    renderHorizontal: 'basic',
    renderVertical: 'basic',
    placeholder: 'No positions available',
    columnDefaults: {
      resizable: true,
      headerSort: true,
      vertAlign: 'middle'
    },
    virtualDom: false,
    pagination: true,
    paginationSize: 100,
    paginationSizeSelector: [50, 100, 200, 500],
    rowFormatter: (row: any) => {
      try {
        const data = row.getData()
        const element = row.getElement()
        
        if (data?._isThesisGroup && element) {
          element.style.backgroundColor = '#f8f9fa'
          element.style.fontWeight = 'bold'
          element.style.borderTop = '2px solid #dee2e6'
        }
      } catch (error) {
        console.warn('Row formatter error:', error)
      }
    },
    rowClick: (e: any, row: any) => {
      try {
        const data = row.getData()
        if (!data._isThesisGroup) {
          emit('row-click', data)
          if (props.onRowClick) props.onRowClick(data)
        }
      } catch (error) {
        console.warn('Row click error:', error)
      }
    }
  }

  // Enable tree view when grouping by thesis
  if (groupByThesis.value) {
    tabulatorConfig.dataTree = true
    tabulatorConfig.dataTreeChildField = '_children'
    tabulatorConfig.dataTreeStartExpanded = true
    tabulatorConfig.dataTreeChildIndent = 20
    tabulatorConfig.dataTreeElementColumn = 'symbol'
    tabulatorConfig.pagination = false
  }

  try {
    tabulator = new Tabulator(tableDiv.value, tabulatorConfig)
    tabulator.on('tableBuilt', () => {
      isTabulatorReady.value = true
      setTimeout(() => {
        updateFilters()
        toggleBottomCalc()
      }, 50)
    })
  } catch (error) {
    console.error('Error creating Tabulator:', error)
  }
}

// Update data
const gridRowData = computed(() => {
  if (!groupByThesis.value) {
    return sourcePositions.value || []
  }
  return groupedHierarchicalData.value
})

const groupedHierarchicalData = computed(() => {
  if (!groupByThesis.value || !sourcePositions.value || !thesisQuery.data.value) {
    return sourcePositions.value || []
  }

  // --- ADD THIS BLOCK ---
  let positionsWithThesis = sourcePositions.value.filter(pos => pos.thesis && pos.thesis.id)

  // Apply account filter
  if (accountFilter.value) {
    positionsWithThesis = positionsWithThesis.filter(position => {
      const accountVal = typeof position.legal_entity === 'object' && position.legal_entity !== null
        ? (position.legal_entity.name || position.legal_entity.id)
        : position.legal_entity
      return accountVal === accountFilter.value
    })
  }
  // --- END BLOCK ---

  // Apply symbol and thesis filters
  positionsWithThesis = positionsWithThesis.filter(position => {
    if (symbolTagFilters.value.length > 0) {
      const symbolText = position.symbol
      if (!symbolText) return false
      const tags = extractTagsFromSymbol(symbolText)
      const symbolPass = symbolTagFilters.value.every(selectedTag => tags.includes(selectedTag))
      if (!symbolPass) return false
    }

    if (thesisTagFilters.value.length > 0) {
      const thesis = position.thesis
      if (!thesis || !thesis.title) return false
      const thesisPass = thesisTagFilters.value.includes(thesis.title)
      if (!thesisPass) return false
    }

    return true
  })
  
  // Build thesis hierarchy map
  const thesisMap = new Map<string, any>()
  ;(thesisQuery.data.value || []).forEach((t: Thesis) => {
    thesisMap.set(t.id, { ...t })
  })
  
  // Group positions by thesis
  const positionsByThesis = new Map<string, Position[]>()
  positionsWithThesis.forEach(position => {
    const thesisId = position.thesis.id
    if (!positionsByThesis.has(thesisId)) {
      positionsByThesis.set(thesisId, [])
    }
    positionsByThesis.get(thesisId)!.push(position)
  })
  
  // Build all thesis groups (including parents without direct positions)
  const allThesisGroups = new Map<string, any>()
  
  // Helper function to create a thesis group
  function createThesisGroup(thesisId: string, positions: Position[] = []) {
    const thesis = thesisMap.get(thesisId)
    if (!thesis) return null
    
    const thesisGroup = {
      id: `thesis-${thesisId}`,
      _isThesisGroup: true,
      thesis,
      symbol: `📋 ${thesis.title}`,
      legal_entity: `${positions.length} position${positions.length !== 1 ? 's' : ''}`,
      _children: positions.map(p => ({
        ...p,
        id: `pos-${p.conid}-${p.internal_account_id}`
      }))
    }
    
    // Calculate totals for the thesis group from direct positions
    for (const field of numericFields) {
      ;(thesisGroup as any)[field] = positions.reduce((sum: number, pos: any) => {
        const value = pos[field]
        return sum + (typeof value === 'number' && Number.isFinite(value) ? value : 0)
      }, 0)
    }
    
    return thesisGroup
  }
  
  // Helper function to aggregate child values into parent
  function aggregateChildValues(parentGroup: any, childGroup: any) {
    for (const field of numericFields) {
      const parentValue = (parentGroup as any)[field] || 0
      const childValue = (childGroup as any)[field] || 0
      ;(parentGroup as any)[field] = parentValue + childValue
    }
  }
  
  // First pass: Create groups for all theses that have positions OR have children with positions
  positionsByThesis.forEach((positions, thesisId) => {
    const group = createThesisGroup(thesisId, positions)
    if (group) {
      allThesisGroups.set(thesisId, group)
    }
  })
  
  // Second pass: Ensure parent thesis exist (even without direct positions)
  const thesisIdsWithData = new Set(allThesisGroups.keys())
  
  function ensureParentExists(thesisId: string): void {
    const thesis = thesisMap.get(thesisId)
    if (!thesis || !thesis.parent_thesis_id) return
    
    const parentId = thesis.parent_thesis_id
    
    // If parent doesn't exist, create it
    if (!allThesisGroups.has(parentId)) {
      const parentGroup = createThesisGroup(parentId, [])
      if (parentGroup) {
        allThesisGroups.set(parentId, parentGroup)
      }
    }
    
    // Recursively ensure grandparents exist
    ensureParentExists(parentId)
  }
  
  // Ensure all parent theses exist
  thesisIdsWithData.forEach(thesisId => {
    ensureParentExists(thesisId)
  })
  
  // Third pass: Build the hierarchy and aggregate values
  const childThesisMap = new Map<string, any[]>()
  
  allThesisGroups.forEach((group, thesisId) => {
    const thesis = thesisMap.get(thesisId)
    if (!thesis) return
    
    if (thesis.parent_thesis_id && allThesisGroups.has(thesis.parent_thesis_id)) {
      // This is a child thesis with an existing parent
      if (!childThesisMap.has(thesis.parent_thesis_id)) {
        childThesisMap.set(thesis.parent_thesis_id, [])
      }
      childThesisMap.get(thesis.parent_thesis_id)!.push(group)
    }
  })
  
  // Fourth pass: Attach children to parents and aggregate values
  const processedParents = new Set<string>()
  
  function attachChildrenAndAggregate(parentId: string): void {
    if (processedParents.has(parentId)) return
    processedParents.add(parentId)
    
    const parentGroup = allThesisGroups.get(parentId)
    if (!parentGroup) return
    
    const children = childThesisMap.get(parentId) || []
    
    // First, recursively process all children
    children.forEach(child => {
      attachChildrenAndAggregate(child.thesis.id)
    })
    
    // Then attach children and aggregate their values
    if (children.length > 0) {
      // Update the position count to include child positions
      const totalPositions = parentGroup._children.length + 
        children.reduce((sum, child) => {
          const childPositionCount = child.legal_entity.match(/\d+/)?.[0] || '0'
          return sum + parseInt(childPositionCount)
        }, 0)
      
      parentGroup.legal_entity = `${totalPositions} position${totalPositions !== 1 ? 's' : ''}`
      
      // Aggregate child values into parent
      children.forEach(child => {
        aggregateChildValues(parentGroup, child)
      })
      
      // Add children to parent
      parentGroup._children = [...parentGroup._children, ...children]
    }
  }
  
  // Process all root theses (and their descendants)
  allThesisGroups.forEach((group, thesisId) => {
    const thesis = thesisMap.get(thesisId)
    if (thesis && !thesis.parent_thesis_id) {
      attachChildrenAndAggregate(thesisId)
    }
  })
  
  // Fifth pass: Collect root thesis groups
  const rootThesisGroups: any[] = []
  allThesisGroups.forEach((group, thesisId) => {
    const thesis = thesisMap.get(thesisId)
    if (thesis && !thesis.parent_thesis_id) {
      rootThesisGroups.push(group)
    }
  })
  
  return rootThesisGroups
})

// Update filters to work with tree structure
function updateFilters() {
  if (!tabulator || !isTabulatorReady.value) return

  try {
    if (groupByThesis.value) {
      tabulator.replaceData(gridRowData.value)
    } else {
      tabulator.clearFilter()

      tabulator.setFilter((data: any) => {
        if (!data) return false

        // Account filter
        if (accountFilter.value) {
          // Support both string and object for legal_entity
          const accountVal = typeof data.legal_entity === 'object' && data.legal_entity !== null
            ? (data.legal_entity.name || data.legal_entity.id)
            : data.legal_entity
          if (accountVal !== accountFilter.value) return false
        }

        // Symbol filter
        if (symbolTagFilters.value.length > 0) {
          const symbolText = data.symbol
          if (!symbolText) return false
          const tags = extractTagsFromSymbol(symbolText)
          const symbolPass = symbolTagFilters.value.every(selectedTag => tags.includes(selectedTag))
          if (!symbolPass) return false
        }

        // Thesis filter
        if (thesisTagFilters.value.length > 0) {
          const thesis = data.thesis
          if (!thesis || !thesis.title) return false
          const thesisPass = thesisTagFilters.value.includes(thesis.title)
          if (!thesisPass) return false
        }

        return true
      })
    }

    syncActiveFiltersFromTable()
    nextTick(() => {
      if (tabulator) toggleBottomCalc()
    })
  } catch (error) {
    console.warn('Error in updateFilters:', error)
  }
}

function syncActiveFiltersFromTable() {
  const next: ActiveFilter[] = []
  if (accountFilter.value) {
    next.push({ field: 'legal_entity', value: accountFilter.value })
  }
  if (symbolTagFilters.value.length > 0) {
    next.push({ field: 'symbol', value: symbolTagFilters.value.join(', ') })
  }
  if (thesisTagFilters.value.length > 0) {
    next.push({ field: 'thesis', value: thesisTagFilters.value.join(', ') })
  }
  activeFilters.value = next
}

function clearFilter(field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis') {
  if (field === 'symbol') {
    symbolTagFilters.value = []
  } else if (field === 'thesis') {
    thesisTagFilters.value = []
  } else if (field === 'legal_entity') {
    accountFilter.value = null
    const url = new URL(window.location.href)
    url.searchParams.delete('all_cts_clientId')
    window.history.replaceState({}, '', url.toString())
    // --- ADD THIS ---
    if (eventBus) {
      eventBus.emit('account-filter-changed', {
        accountId: null,
        source: 'positions'
      })
    }
    // --- END ---
  }
  updateFilters()
}

function clearAllFilters() {
  symbolTagFilters.value = []
  thesisTagFilters.value = []
  accountFilter.value = null
  const url = new URL(window.location.href)
  url.searchParams.delete('all_cts_clientId')
  url.searchParams.delete('all_cts_fi')
  url.searchParams.delete('all_cts_thesis')
  window.history.replaceState({}, '', url.toString())
  // --- ADD THIS ---
  if (eventBus) {
    eventBus.emit('account-filter-changed', {
      accountId: null,
      source: 'positions'
    })
  }
  // --- END ---
  updateFilters()
}

// Column visibility popup
const showColumnsPopup = ref(false)
const columnsBtnRef = ref<HTMLElement | null>(null)
const columnsPopupRef = ref<HTMLElement | null>(null)

function toggleColumnsPopup() {
  showColumnsPopup.value = !showColumnsPopup.value
}

function closeColumnsPopup() {
  showColumnsPopup.value = false
}

function handleClickOutside(event: Event) {
  if (showColumnsPopup.value && 
      columnsPopupRef.value && 
      columnsBtnRef.value &&
      !columnsPopupRef.value.contains(event.target as Node) && 
      !columnsBtnRef.value.contains(event.target as Node)) {
    closeColumnsPopup()
  }
}

// Watch for BOTH data ready AND DOM ready
const isTableInitialized = ref(false)

watch([() => q.isSuccess.value, tableDiv], async ([isSuccess, divRef]) => {
  if (isSuccess && divRef && !isTableInitialized.value) {
    // Wait for next tick to ensure DOM is fully ready
    await nextTick()
    console.log('🚀 Initializing Tabulator with data:', gridRowData.value.length, 'rows')
    initializeTabulator()
    isTableInitialized.value = true
  }
}, { immediate: true })

watch(gridRowData, async (newData) => {
  if (!tabulator || !newData) return
  
  try {
    // Check if the table structure needs to change (grouping vs non-grouping)
    const needsRebuild = (groupByThesis.value && !tabulator.options.dataTree) || 
                        (!groupByThesis.value && tabulator.options.dataTree)
    
    if (needsRebuild) {
      // Rebuild the table when switching between grouped/non-grouped views
      initializeTabulator()
    } else {
      // For simple data updates, just replace the data
      tabulator.replaceData(newData)
    }
    
    // Update calculations after data change
    await nextTick()
    toggleBottomCalc()
  } catch (error) {
    console.warn('Error updating table data:', error)
    // If there's an error, rebuild the table as fallback
    try {
      initializeTabulator()
    } catch (rebuildError) {
      console.error('Failed to rebuild table:', rebuildError)
    }
  }
}, { deep: true })

watch(visibleCols, async (cols) => {
  // Write to URL first
  writeVisibleColsToUrl(cols)
  
  if (!tabulator) return
  
  try {
    // For column visibility changes, it's safest to rebuild the table
    // This prevents virtual DOM conflicts completely
    initializeTabulator()
  } catch (error) {
    console.warn('Error updating column visibility:', error)
  }
}, { deep: true })

watch(symbolTagFilters, () => {
  writeFiltersToUrl()
  if (tabulator && isTabulatorReady.value) {
    updateFilters()
    tabulator.redraw(true)
  }
}, { deep: true })

watch(thesisTagFilters, () => {
  writeFiltersToUrl()
  updateFilters()
  if (tabulator) {
    tabulator.redraw(true)
  }
}, { deep: true })

watch(groupByThesis, async (value) => {
  writeGroupByThesisToUrl(value)
  if (tabulator) {
    tabulator.destroy()
    tabulator = null
  }
  await nextTick()
  initializeTabulator()
  // Do NOT call updateFilters() here!
})

// Add URL synchronization for column visibility
function writeVisibleColsToUrl(cols: ColumnField[]) {
  const url = new URL(window.location.href)
  url.searchParams.set('position_cols', cols.join('-and-'))
  window.history.replaceState({}, '', url.toString())
}

// Add URL synchronization for filters
function parseFiltersFromUrl(): { symbol?: string; asset_class?: string; legal_entity?: string; thesis?: string } {
  const url = new URL(window.location.href)
  const symbolParam = url.searchParams.get('all_cts_fi')
  const symbol = symbolParam ? symbolParam.split('-and-').join(',') : undefined
  const asset = url.searchParams.get('fac') || undefined
  const account = url.searchParams.get('all_cts_clientId') || undefined
  const thesisParam = url.searchParams.get('all_cts_thesis')
  const thesis = thesisParam ? thesisParam.split('-and-').join(',') : undefined
  return { symbol, asset_class: asset, legal_entity: account, thesis }
}

function writeFiltersToUrl() {
  const url = new URL(window.location.href)
  
  // Handle symbol filters
  if (symbolTagFilters.value.length > 0) {
    url.searchParams.set('all_cts_fi', symbolTagFilters.value.join('-and-'))
  } else {
    url.searchParams.delete('all_cts_fi')
  }
  
  // Handle thesis filters
  if (thesisTagFilters.value.length > 0) {
    url.searchParams.set('all_cts_thesis', thesisTagFilters.value.join('-and-'))
  } else {
    url.searchParams.delete('all_cts_thesis')
  }
  
  window.history.replaceState({}, '', url.toString())
}

// Add URL synchronization for group by thesis
function parseGroupByThesisFromUrl(): boolean {
  const url = new URL(window.location.href)
  return url.searchParams.get('group_by_thesis') === 'true'
}

function writeGroupByThesisToUrl(isGrouped: boolean) {
  const url = new URL(window.location.href)
  if (isGrouped) {
    url.searchParams.set('group_by_thesis', 'true')
  } else {
    url.searchParams.delete('group_by_thesis')
  }
  window.history.replaceState({}, '', url.toString())
}

// Initialize group by thesis from URL
//const groupByThesis = ref(parseGroupByThesisFromUrl())

// Lifecycle
const eventBus = inject<any>('eventBus')

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  // Initialize filters from URL
  const filters = parseFiltersFromUrl()
  if (filters.symbol) symbolTagFilters.value = filters.symbol.split(',').map(s => s.trim())
  if (filters.thesis) thesisTagFilters.value = filters.thesis.split(',').map(s => s.trim())
  if (filters.legal_entity) accountFilter.value = filters.legal_entity

  // --- ADD THIS LINE ---
  groupByThesis.value = parseGroupByThesisFromUrl()
  // --- END ---

  // Try to initialize if data is already loaded
  if (q.isSuccess.value && tableDiv.value && !isTableInitialized.value) {
    await nextTick()
    console.log('🚀 Initializing Tabulator on mount with data:', gridRowData.value.length, 'rows')
    initializeTabulator()
    isTableInitialized.value = true
  }

  updateFilters()

  if (eventBus) {
    eventBus.on('account-filter-changed', handleExternalAccountFilter)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (tabulator) {
    tabulator.destroy()
  }
  if (eventBus) {
    eventBus.off('account-filter-changed', handleExternalAccountFilter)
  }
})

function handleExternalAccountFilter(payload: { accountId: string | null, source: string }) {
  console.log('📍 [Positions] Received account filter:', payload)
  if (payload.source === 'positions') return

  // Apply or clear the filter
  accountFilter.value = payload.accountId
  const url = new URL(window.location.href)
  if (payload.accountId) {
    url.searchParams.set('all_cts_clientId', payload.accountId)
  } else {
    url.searchParams.delete('all_cts_clientId')
  }
  window.history.replaceState({}, '', url.toString())
  updateFilters()
}

function handleHeaderClick() {
  // Try to navigate if router is available
  if (typeof window !== 'undefined' && (window as any).$router) {
    (window as any).$router.push('/positions')
  } else {
    // Fallback to regular navigation
    window.location.href = '/positions'
  }
}

// Remove the toggleBottomCalc function completely since we're setting it up during initialization
// Or keep it simple for just redrawing if needed
function toggleBottomCalc() {
  if (!tabulator || !isTabulatorReady.value) return
  try {
    tabulator.redraw()
  } catch (error) {
    console.warn('Error in toggleBottomCalc:', error)
  }
}

// Filter handlers
function handleCellFilterClick(field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis', value: any) {
  if (field === 'symbol') {
    const tag = String(value).trim()
    const currentIndex = symbolTagFilters.value.indexOf(tag)
    if (currentIndex >= 0) {
      symbolTagFilters.value.splice(currentIndex, 1)
    } else {
      symbolTagFilters.value.push(tag)
    }
    updateFilters()
    return
  } else if (field === 'thesis') {
    const thesisTitle = value?.title || String(value)
    const currentIndex = thesisTagFilters.value.indexOf(thesisTitle)
    if (currentIndex >= 0) {
      thesisTagFilters.value.splice(currentIndex, 1)
    } else {
      thesisTagFilters.value.push(thesisTitle)
    }
    updateFilters()
    return
  } else if (field === 'legal_entity') {
    const accountId = String(value)
    accountFilter.value = accountId // <-- Track filter
    const url = new URL(window.location.href)
    url.searchParams.set('all_cts_clientId', accountId)
    window.history.replaceState({}, '', url.toString())

    updateFilters() // <-- Only call updateFilters, don't set Tabulator filter directly

    if (eventBus) {
      eventBus.emit('account-filter-changed', {
        accountId,
        source: 'positions'
      })
    }
    return
  }
  // ...existing code for asset_class if needed...
}

const accountFilter = ref<string | null>(null)

// Watch for BOTH data ready AND DOM ready
watch(
  [() => q.isSuccess.value, accountFilter, symbolTagFilters, thesisTagFilters, groupByThesis],
  async ([isSuccess]) => {
    if (isSuccess && isTableInitialized.value) {
      updateFilters()
      if (tabulator) tabulator.redraw(true)
    }
  },
  { immediate: true }
)

watch([() => q.isSuccess.value, isTableInitialized], ([isSuccess, isTableReady]) => {
  if (isSuccess && isTableReady) {
    updateFilters()
  }
})

window.addEventListener('popstate', () => {
  const filters = parseFiltersFromUrl()
  symbolTagFilters.value = filters.symbol ? filters.symbol.split(',').map(s => s.trim()) : []
  thesisTagFilters.value = filters.thesis ? filters.thesis.split(',').map(s => s.trim()) : []
  accountFilter.value = filters.legal_entity || null
  updateFilters()
})
</script>

<template>
  <div class="positions-card">
    <div v-if="q.isLoading.value" class="loading">
      <div class="loading-spinner"></div>
      Loading positions...
    </div>
    
    <div v-else-if="q.isError.value" class="error">
      <h3>Error loading positions</h3>
      <p>{{ q.error.value }}</p>
    </div>
    
    <div v-else-if="q.isSuccess.value" class="positions-container">
      <div class="positions-header">
        <h2>
          <span v-if="showHeaderLink" class="positions-link" @click="handleHeaderClick">Positions</span>
          <span v-else>Positions</span>
        </h2>
        <div class="positions-tools">
          <div class="positions-count">{{ q.data.value?.length || 0 }} positions</div>
          
          <button 
            class="thesis-group-btn" 
            :class="{ active: groupByThesis }"
            @click="groupByThesis = !groupByThesis" 
            title="Group positions by thesis"
          >
            <span class="icon">📊</span> 
            {{ groupByThesis ? 'Ungroup' : 'Group by Thesis' }}
          </button>
          
          <button ref="columnsBtnRef" class="columns-btn" @click.stop="toggleColumnsPopup">
            <svg class="icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.21-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.22-.22-.39-.44-.39h-3.84c-.22 0-.41.16-.44.39l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c.04.31.06.63.06.94s-.02.63-.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.21.37.3.59.22l2.39.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.22.22.39.44.39h3.84c.22 0 .41-.16.44-.39l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.03-1.58ZM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5Z"/>
            </svg>
          </button>
          
          <button @click="emit('minimize')" class="minimize-button" title="Minimize Positions">
            −
          </button>
          
          <div v-if="showColumnsPopup" ref="columnsPopupRef" class="columns-popup" @click.stop>
            <div class="popup-header">Columns</div>
            <div class="popup-list">
              <label v-for="opt in allColumnOptions" :key="opt.field" class="popup-item">
                <input type="checkbox" :value="opt.field" v-model="visibleCols" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
            <div class="popup-actions">
              <button class="btn btn-clear" @click="visibleCols = allColumnOptions.map(c=>c.field)">Show All</button>
              <button class="btn" @click="closeColumnsPopup">Done</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="activeFilters.length" class="filters-bar">
        <span class="filters-label">Filtered by:</span>
        <div class="filters-tags">
          <span v-for="f in activeFilters" :key="`${f.field}-${f.value}`" class="filter-tag">
            <strong>{{ 
              f.field === 'symbol' ? 'Financial Instrument' : 
              f.field === 'legal_entity' ? 'Account' : 
              f.field === 'thesis' ? 'Thesis' :
              'Asset Class' 
            }}:</strong> {{ f.value }}
            <button class="tag-clear" @click="clearFilter(f.field)">✕</button>
          </span>
          <button class="btn btn-clear-all" @click="clearAllFilters">Clear all</button>
        </div>
      </div>

      <div ref="tableDiv" class="positions-grid"></div>
    </div>

    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <span v-if="toast.type === 'success'">✅</span>
            <span v-else-if="toast.type === 'error'">❌</span>
            <span v-else-if="toast.type === 'warning'">⚠️</span>
            <span v-else>ℹ️</span>
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
/* Import Tabulator CSS globally (not scoped) */
@import 'tabulator-tables/dist/css/tabulator_modern.min.css';

/* Tree expand/collapse icons - make them more visible */
.tabulator .tabulator-row .tabulator-data-tree-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #fff;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tabulator .tabulator-row .tabulator-data-tree-control:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.tabulator .tabulator-row .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after {
  content: "−";
  font-size: 16px;
  font-weight: bold;
  color: #495057;
  line-height: 1;
}

.tabulator .tabulator-row .tabulator-data-tree-control .tabulator-data-tree-control-expand:after {
  content: "+";
  font-size: 16px;
  font-weight: bold;
  color: #495057;
  line-height: 1;
}

/* Style for thesis group rows */
.tabulator .tabulator-row.tabulator-tree-level-0, 
.tabulator-row.tabulator-tree-level-0 .tabulator-cell {
  background-color: #e3f2fd !important;
  font-weight: 600;
}

/* Style for child thesis rows (level 1) */
.tabulator .tabulator-row.tabulator-tree-level-1,
.tabulator-row.tabulator-tree-level-1 .tabulator-cell {
  background-color: #f3e5f5 !important;
  font-weight: 500;
}

/* Style for position rows (level 2+) */
.tabulator .tabulator-row.tabulator-tree-level-2 {
  background-color: #fff;
}

/* Add subtle indentation visual guide */
.tabulator .tabulator-row.tabulator-tree-level-1 .tabulator-cell:first-child,
.tabulator .tabulator-row.tabulator-tree-level-2 .tabulator-cell:first-child {
  border-left: 2px solid #e9ecef;
}

/* Make the tree branch lines more visible */
.tabulator .tabulator-row .tabulator-data-tree-branch {
  border-left: 2px solid #dee2e6;
  border-bottom: 2px solid #dee2e6;
}

/* Clear column borders - make them visible like the demo */
.tabulator .tabulator-col {
  border-right: 1px solid #dee2e6 !important;
}

.tabulator .tabulator-cell {
  border-right: 1px solid #dee2e6 !important;
}

/* Make sure the last column also has a border */
.tabulator .tabulator-col:last-child,
.tabulator .tabulator-cell:last-child {
  border-right: 1px solid #dee2e6 !important;
}
</style>

<style scoped>
.positions-card {
  border-radius: 0.75rem;
  background: white;
}

h1 { 
  margin: 0 0 1.5rem 0; 
  font-size: 1.75rem; 
  font-weight: 600;
  color: var(--positions-header-color, #2c3e50);
}

.positions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.positions-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #495057;
}

.positions-header h2 a {
  color: #3b82f6;
  text-decoration: none;
}

.positions-link {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: none;
}

.positions-link:hover {
  text-decoration: underline;
}

.positions-count {
  font-size: 0.875rem;
  color: #6c757d;
  background: #f8f9fa;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 500;
}

.positions-tools {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.thesis-group-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.thesis-group-btn:hover {
  background: #f8f9fa;
}

.thesis-group-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.thesis-group-btn.active:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.columns-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background: #fff;
  color: #495057;
  cursor: pointer;
}
.columns-btn:hover { background: #f8f9fa; }
.columns-btn .icon { pointer-events: none; }

.minimize-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background: #fff;
  color: #495057;
  cursor: pointer;
  font-size: 1.125rem;
  transition: all 0.2s;
}

.minimize-button:hover {
  background: #f9f9fa;
  border-color: #adb5bd;
  transform: scale(1.05);
}

.minimize-button:active {
  transform: scale(0.95);
}

.columns-popup {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 260px;
  background: #fff;
  border: 1px solid #dee2e6;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  border-radius: 8px;
  z-index: 10;
}

.columns-popup .popup-header {
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  border-bottom: 1px solid #f1f3f5;
}

.columns-popup .popup-list {
  max-height: 260px;
  overflow: auto;
  padding: 0.5rem 0.75rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.35rem;
}

.columns-popup .popup-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #495057;
}

.columns-popup .popup-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem 0.75rem 0.75rem;
  border-top: 1px solid #f1f3f5;
}

.columns-popup .btn {
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background: #fff;
  cursor: pointer;
  font-size: 0.8125rem;
}
.columns-popup .btn:hover { background: #f8f9fa; }
.columns-popup .btn-clear { color: #6c757d; }

.loading, .error {
  padding: 2rem;
  text-align: center;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.loading {
  background-color: #f8f9fa;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e9ecef;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.error h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
}

.error p {
  margin: 0;
  font-family: monospace;
  font-size: 0.875rem;
}

.positions-grid {
  margin-top: 0.5rem;
  height: 600px;
  min-height: 200px;
}

/* Financial Instrument tags */
:deep(.fi-tag) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid #dbe2ea;
  border-radius: 999px;
  background: #f5f7fa;
  color: #425466;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 4px;
}

:deep(.fi-tag:hover) {
  background: #e8eef6;
  border-color: #b8c5d1;
}

:deep(.fi-tag-selected) {
  background: #007bff !important;
  color: white !important;
  border-color: #0056b3 !important;
}

/* Thesis tags */
:deep(.thesis-tag) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid #dbe2ea;
  border-radius: 999px;
  background: #f5f7fa;
  color: #425466;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.thesis-tag:hover) {
  background: #e8eef6;
  border-color: #b8c5d1;
}

:deep(.thesis-tag-selected) {
  background: #28a745 !important;
  color: white !important;
  border-color: #1e7e34 !important;
}

.filters-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.filters-label {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 600;
}
.filters-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #f1f3f5;
  color: #495057;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #e9ecef;
  font-size: 0.8125rem;
}
.filter-tag .tag-clear {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6c757d;
}
.btn-clear-all {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid #dee2e6;
  background: #fff;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.8125rem;
}

/* P&L styling */
:deep(.pnl-positive) {
  color: #28a745 !important;
  font-weight: 600;
}

:deep(.pnl-negative) {
  color: #dc3545 !important;
  font-weight: 600;
}

:deep(.pnl-zero) {
  color: #6c757d !important;
}

/* Tabulator theme overrides */
:deep(.tabulator) {
  font-size: 0.875rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.tabulator-header) {
  background-color: #f8f9fa !important;
  border-bottom: 2px solid #dee2e6 !important;
  padding-left: 0;
}

:deep(.tabulator-col) {
  border-right: 1px solid #dee2e6 !important;
  font-weight: 600;
}

:deep(.tabulator-row) {
  border-bottom: 1px solid #f1f3f5;
  margin-bottom: 0;
}

:deep(.tabulator-row:hover) {
  background-color: #f8f9fa !important;
}

:deep(.tabulator-cell) {
  border-right: 1px solid #dee2e6 !important;
  padding: 4px 8px;
}

/* Bottom calc row (totals) */
:deep(.tabulator-row.tabulator-calcs) {
  background-color: #f1f3f5 !important;
  font-weight: 600;
  border-top: 2px solid #dee2e6 !important;
}

/* Toast notification styles */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: auto;
  min-width: 300px;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border-left: 4px solid #28a745;
}

.toast-error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.toast-warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  border-left: 4px solid #ffc107;
}

.toast-info {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  color: #0c5460;
  border-left: 4px solid #17a2b8;
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
  line-height: 1;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

/* Toast animations */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .positions-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .positions-grid {
    height: 400px;
  }
  
  .toast-container {
    left: 10px;
    right: 10px;
    top: 10px;
    max-width: none;
  }
  
  .toast {
    min-width: auto;
  }
}
</style>

<style>
.ag-simple-filter-body-wrapper {
  background-color: #fff;
}
.ag-input-wrapper:before {
  content: none;
}
</style>