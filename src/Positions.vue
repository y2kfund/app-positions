<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, watch, inject } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule } from 'ag-grid-community'
import type { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { usePositionsQuery, useThesisQuery, type Position, type Thesis, useSupabase } from '@y2kfund/core'
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
// Query positions data with realtime updates - pass userId for access control
const q = usePositionsQuery(props.accountId, props.userId)
const sourcePositions = computed(() => {
  // 1. Get raw data from the query (q.data.value)
  const positions = q.data.value || [] 
  
  if (!positions.length) return []
  
  // 2. Log and proceed with truncation
  if (positions.length > 0) {
    console.log('✅ Raw data received. Starting truncation...')
  }

  return positions.map(p => {
    // Create a mutable copy of the position object
    const newP = { ...p }
    
    // Truncate decimal part for all numeric fields
    for (const field of numericFields) {
      // It is recommended to use an explicit 'as any' for dynamic property access/assignment in TypeScript
      const value = (newP as any)[field] 
      if (typeof value === 'number' && Number.isFinite(value)) {
        const decimalPart = value % 1
        if (Math.abs(value) * 1/100 > decimalPart || value == 0)
        {
          (newP as any)[field] = Math.trunc(value)
        }
        else
        {
          (newP as any)[field] = value
        }
        
      }
    }
    return newP
  })
})
// Query thesis data for dropdowns
const thesisQuery = useThesisQuery()

// Add debugging for thesis data
watch(() => thesisQuery.data.value, (thesisData) => {
  console.log('📊 Thesis data updated:', thesisData)
}, { immediate: true })

watch(() => thesisQuery.isLoading.value, (isLoading) => {
  console.log('📊 Thesis loading state:', isLoading)
}, { immediate: true })

watch(() => thesisQuery.error.value, (error) => {
  if (error) {
    console.error('📊 Thesis query error:', error)
  }
}, { immediate: true })

// Column metadata for visibility control
type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'qty' | 'avgPrice' | 'price' | 'market_price' | 'market_value' | 'unrealized_pnl' | 'cash_flow_on_entry' | 'cash_flow_on_exercise' | 'be_price' | 'thesis'
const allColumnOptions: Array<{ field: ColumnField; label: string }> = [
  { field: 'legal_entity', label: 'Account' },
  { field: 'thesis', label: 'Thesis' },
  { field: 'symbol', label: 'Symbol' },
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
  { field: 'cash_flow_on_exercise', label: 'If excercised cash flow' },
  { field: 'be_price', label: 'BE Price' }
]

// URL param helpers
function parseVisibleColsFromUrl(): ColumnField[] {
  const url = new URL(window.location.href)
  const colsParam = url.searchParams.get('position_cols')
  if (!colsParam) {
    // Default visible columns (exclude asset_class, conid, undConid, multiplier, qty)
    return allColumnOptions
      .map(c => c.field)
      .filter(field => !['asset_class', 'conid', 'undConid', 'multiplier', 'qty'].includes(field))
  }
  const fromUrl = colsParam.split('-and-').map(s => s.trim()).filter(Boolean) as ColumnField[]
  const valid = new Set(allColumnOptions.map(c => c.field))
  const filtered = fromUrl.filter(c => valid.has(c))
  return filtered.length ? filtered : allColumnOptions.map(c => c.field)
}

function writeVisibleColsToUrl(cols: ColumnField[]) {
  const url = new URL(window.location.href)
  url.searchParams.set('position_cols', cols.join('-and-'))
  window.history.replaceState({}, '', url.toString())
}

// Filter URL helpers (fsym: symbol, fac: asset_class)
function parseFiltersFromUrl(): { symbol?: string; asset_class?: string; legal_entity?: string } {
  const url = new URL(window.location.href)
  const symbolParam = url.searchParams.get('all_cts_fi')
  const symbol = symbolParam ? symbolParam.split('-and-').join(',') : undefined
  const asset = url.searchParams.get('fac') || undefined
  const account = url.searchParams.get('all_cts_clientId') || undefined
  return { symbol, asset_class: asset, legal_entity: account }
}

function writeFiltersToUrlFromModel(model: any) {
  const url = new URL(window.location.href)
  
  // Handle external symbol filters first
  if (symbolTagFilters.value.length > 0) {
    url.searchParams.set('all_cts_fi', symbolTagFilters.value.join('-and-'))
  } else {
    // Only handle ag-Grid symbol filter if no external filters
    const sym = model?.symbol?.filter || ''
    if (sym) url.searchParams.set('all_cts_fi', sym); else url.searchParams.delete('all_cts_fi')
  }
  
  // Handle other ag-Grid filters
  const ac = model?.asset_class?.filter || ''
  if (ac) url.searchParams.set('fac', ac); else url.searchParams.delete('fac')
  const acc = model?.legal_entity?.filter || ''
  if (acc) url.searchParams.set('all_cts_clientId', acc); else url.searchParams.delete('all_cts_clientId')
  
  window.history.replaceState({}, '', url.toString())
}

const visibleCols = ref<ColumnField[]>(parseVisibleColsFromUrl())
function isColVisible(field: ColumnField): boolean {
  return visibleCols.value.includes(field)
}

// Symbol tag filters for exact tag matching (supports multiple tags)
const symbolTagFilters = ref<string[]>([])

// Custom cell renderers
// Update the thesis cell renderer to remove grouping indicator
const thesisCellRenderer = (params: any) => {
  const thesis = params.value
  if (!thesis) return '<span style="color: #6c757d; font-style: italic;">No thesis</span>'
  
  return `<span title="${thesis.description || ''}">${thesis.title}</span>`
}

// Thesis cell editor as a proper ag-grid component class
class ThesisCellEditor {
  private eGui!: HTMLElement
  private eSelect!: HTMLSelectElement
  private currentValue: any = null
  private params: any

  init(params: any) {
    console.log('📝 Initializing thesis cell editor with value:', params.value)
    
    this.params = params
    this.currentValue = params.value

    // Create the select element
    this.eSelect = document.createElement('select')
    this.eSelect.style.width = '100%'
    this.eSelect.style.height = '100%'
    this.eSelect.style.border = 'none'
    this.eSelect.style.outline = 'none'
    this.eSelect.style.fontSize = '14px'

    // Add options
    const noThesisOption = document.createElement('option')
    noThesisOption.value = ''
    noThesisOption.textContent = 'No thesis'
    this.eSelect.appendChild(noThesisOption)

    // Get thesis options from cell editor params
    const thesisOptions = params.thesisOptions || []
    console.log('📊 Available thesis options:', thesisOptions)
    
    thesisOptions.forEach((thesis: Thesis) => {
      const option = document.createElement('option')
      option.value = thesis.id
      option.textContent = thesis.title
      if (this.currentValue && this.currentValue.id === thesis.id) {
        option.selected = true
      }
      this.eSelect.appendChild(option)
    })

    // Set initial value
    if (this.currentValue) {
      this.eSelect.value = this.currentValue.id || ''
    }

    // Create container
    this.eGui = document.createElement('div')
    this.eGui.style.width = '100%'
    this.eGui.style.height = '100%'
    this.eGui.appendChild(this.eSelect)

    // Handle value changes - UPDATE IMMEDIATELY
    this.eSelect.addEventListener('change', async () => {
      const selectedId = this.eSelect.value
      const oldValue = this.currentValue
      
      if (selectedId) {
        this.currentValue = thesisOptions.find((t: Thesis) => t.id === selectedId) || null
      } else {
        this.currentValue = null
      }
      
      console.log('📝 Thesis selection changed to:', this.currentValue)
      
      // Get position ID from the row data
      const positionId = this.params.data?.id
      if (!positionId) {
        console.error('No position ID found in row data:', this.params.data)
        return
      }
      
      // Call update function immediately
      try {
        console.log('🚀 Updating thesis immediately for position:', positionId)
        await updatePositionThesis(String(positionId), this.currentValue?.id || null)
        
        // Update the local data
        this.params.data.thesis = this.currentValue
        
        // Refresh the cell to show the updated value
        if (this.params.api && typeof this.params.api.refreshCells === 'function') {
          this.params.api.refreshCells({ 
            rowNodes: [this.params.node],
            columns: ['thesis']
          })
        }
        
        // Stop editing after successful update
        this.params.stopEditing()
        
      } catch (error) {
        console.error('❌ Failed to update thesis, reverting selection:', error)
        
        // Revert the selection on error
        this.currentValue = oldValue
        if (oldValue) {
          this.eSelect.value = oldValue.id || ''
        } else {
          this.eSelect.value = ''
        }
      }
    })

    // Handle keydown events
    this.eSelect.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.params.stopEditing()
      } else if (event.key === 'Escape') {
        this.params.stopEditing(true) // Cancel editing
      }
    })
  }

  getGui() {
    return this.eGui
  }

  getValue() {
    console.log('📝 Getting thesis editor value:', this.currentValue)
    return this.currentValue
  }

  afterGuiAttached() {
    console.log('📝 Thesis editor attached, focusing select')
    if (this.eSelect) {
      this.eSelect.focus()
      // Remove the showPicker() call to avoid the error
      // The select will still be focused and ready for interaction
    }
  }

  isCancelBeforeStart() {
    return false
  }

  isCancelAfterEnd() {
    return false
  }

  destroy() {
    console.log('📝 Destroying thesis editor')
    // Cleanup if needed
  }
}

// Move these outside the function to be available in component scope
const supabase = useSupabase()
const queryClient = useQueryClient()

// Column definitions for ag-grid
const columnDefs = computed<ColDef[]>(() => [
  { 
    field: 'legal_entity',
    headerName: 'Account',
    width: 160,
    pinned: 'left' as const,
    hide: !isColVisible('legal_entity'),
    onCellClicked: (event: any) => {
      // Don't allow filtering on header/total rows
      if (event.data?.isThesisHeader || event.data?.isThesisTotal) return
      handleCellFilterClick('legal_entity', event?.value)
    }
  },
  { 
    field: 'thesis',
    headerName: 'Thesis',
    width: 180,
    hide: !isColVisible('thesis'),
    cellRenderer: (params: any) => {
      // Don't show thesis cell for header/total rows
      if (params.data?.isThesisHeader || params.data?.isThesisTotal) {
        return ''
      }
      return thesisCellRenderer(params)
    },
    cellEditor: ThesisCellEditor,
    editable: (params: any) => {
      // Only allow editing for regular position rows
      return !params.data?.isThesisHeader && !params.data?.isThesisTotal
    },
    singleClickEdit: false,
    cellEditorParams: {
      thesisOptions: thesisQuery.data.value || []
    },
    valueGetter: (params: any) => params.data.thesis,
    valueSetter: (params: any) => {
      params.data.thesis = params.newValue
      return true
    },
    getQuickFilterText: (params: any) => params.value?.title || '',
    filterValueGetter: (params: any) => params.data.thesis?.title || '',
    sortable: true,
    onCellClicked: (event: any) => {
      // Don't handle clicks on header/total rows
      if (event.data?.isThesisHeader || event.data?.isThesisTotal) return
      
      if (!event.event?.detail || event.event.detail === 1) {
        setTimeout(() => {
          if (event.api && !event.api.getEditingCells().length) {
            handleThesisCellFilterClick(event)
          }
        }, 200)
      }
    },
    onCellDoubleClicked: (event: any) => {
      // Don't allow editing header/total rows
      if (event.data?.isThesisHeader || event.data?.isThesisTotal) return
      
      console.log('📝 Double-clicked thesis cell, starting edit mode')
      if (event.api && typeof event.api.startEditingCell === 'function') {
        event.api.startEditingCell({
          rowIndex: event.rowIndex,
          colKey: 'thesis'
        })
      }
    }
  },
  { 
    field: 'symbol', 
    headerName: 'Financial Instrument',
    width: 120,
    pinned: 'left' as const,
    hide: !isColVisible('symbol'),
    cellRenderer: (params: any) => {
      // For thesis header/total rows, show the symbol as-is
      if (params.data?.isThesisHeader || params.data?.isThesisTotal) {
        return `<span style="font-weight: 600; color: ${params.data?.isThesisHeader ? '#495057' : '#007bff'};">${params.value || ''}</span>`
      }
      return renderFinancialInstrumentCell(params.value)
    },
    onCellClicked: (event: any) => {
      // Don't allow filtering on header/total rows
      if (event.data?.isThesisHeader || event.data?.isThesisTotal) return
      
      const clickedTag = extractClickedTagText(event)
      if (clickedTag) {
        handleCellFilterClick('symbol', clickedTag)
      }
    }
  },
  { 
    field: 'asset_class', 
    headerName: 'Asset Class',
    width: 100,
    hide: !isColVisible('asset_class'),
  },
  { 
    field: 'conid', 
    headerName: 'Conid',
    width: 120,
    hide: !isColVisible('conid')
  },
  { 
    field: 'undConid', 
    headerName: 'Underlying Conid',
    width: 140,
    hide: !isColVisible('undConid')
  },
  { 
    field: 'multiplier', 
    headerName: 'Multiplier',
    width: 110,
    type: 'rightAligned',
    hide: !isColVisible('multiplier'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      return formatNumber(params.value)
    }
  },
  { 
    field: 'qty', 
    headerName: 'Qty',
    width: 120,
    type: 'rightAligned',
    hide: !isColVisible('qty'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      return formatNumber(params.value)
    }
  },
  { 
    field: 'avgPrice', 
    headerName: 'Avg Price',
    width: 120,
    type: 'rightAligned',
    hide: !isColVisible('avgPrice'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      return formatCurrency(params.value)
    }
  },
  { 
    field: 'price', 
    headerName: 'Market Price',
    width: 130,
    type: 'rightAligned',
    hide: !isColVisible('price'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      return formatCurrency(params.value)
    }
  },
  { 
    field: 'market_price', 
    headerName: 'Ul CM Price',
    width: 130,
    type: 'rightAligned',
    hide: !isColVisible('market_price'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      if (params.value === null || params.value === undefined) return '-'
      return formatCurrency(params.value)
    },
    cellStyle: { backgroundColor: '#f8f9fa' }
  },
  { 
    field: 'market_value', 
    headerName: 'Market Value',
    width: 140,
    type: 'rightAligned',
    hide: !isColVisible('market_value'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      return formatCurrency(params.value)
    }
  },
  { 
    field: 'unrealized_pnl', 
    headerName: 'P&L Unrealized',
    width: 150,
    type: 'rightAligned',
    hide: !isColVisible('unrealized_pnl'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      return formatCurrency(params.value)
    },
    cellClassRules: {
      'pnl-positive': (params: any) => !params.data?.isThesisHeader && params.value > 0,
      'pnl-negative': (params: any) => !params.data?.isThesisHeader && params.value < 0,
      'pnl-zero': (params: any) => !params.data?.isThesisHeader && params.value === 0
    }
  },
  { 
    field: 'cash_flow_on_entry', 
    headerName: 'Entry cash flow',
    width: 160,
    type: 'rightAligned',
    hide: !isColVisible('cash_flow_on_entry'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      return formatCurrency(params.value)
    },
    cellClassRules: {
      'pnl-positive': (params: any) => !params.data?.isThesisHeader && params.value > 0,
      'pnl-negative': (params: any) => !params.data?.isThesisHeader && params.value < 0,
      'pnl-zero': (params: any) => !params.data?.isThesisHeader && params.value === 0
    }
  }, 
  { 
    field: 'cash_flow_on_exercise', 
    headerName: 'If excercised cash flow',
    width: 160,
    type: 'rightAligned',
    hide: !isColVisible('cash_flow_on_exercise'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      return formatCurrency(params.value)
    },
    cellClassRules: {
      'pnl-positive': (params: any) => !params.data?.isThesisHeader && params.value > 0,
      'pnl-negative': (params: any) => !params.data?.isThesisHeader && params.value < 0,
      'pnl-zero': (params: any) => !params.data?.isThesisHeader && params.value === 0
    },
  },
  { 
    field: 'be_price', 
    headerName: 'BE Price',
    width: 120,
    type: 'rightAligned',
    hide: !isColVisible('be_price'),
    valueFormatter: (params: any) => {
      if (params.data?.isThesisHeader) return ''
      // BE Price is only for options, so it might be null for stocks
      if (params.value === null || params.value === undefined) return '-'
      return formatCurrency(params.value)
    }
  }, 
])

// Grid API and totals that respect filtering/sorting
const gridApi = ref<any | null>(null)
const columnApiRef = ref<any | null>(null)
const pinnedBottomRowDataRef = ref<any[]>([])


// Active filters tracking for tag UI
type ActiveFilter = { field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis'; value: string }
const activeFilters = ref<ActiveFilter[]>([])

function syncActiveFiltersFromGrid() {
  const api = gridApi.value
  const next: ActiveFilter[] = []
  
  // Add external symbol filters if active (group all tags under one Financial Instrument filter)
  if (symbolTagFilters.value.length > 0) {
    next.push({ field: 'symbol', value: symbolTagFilters.value.join(', ') })
  }
  
  if (api) {
    const model = api.getFilterModel?.() || {}
    const getFilterValue = (field: string) => model?.[field]?.filter || model?.[field]?.values || null
    
    // Only add ag-Grid symbol filter if no external filters are active
    if (symbolTagFilters.value.length === 0) {
      const symbol = getFilterValue('symbol')
      if (typeof symbol === 'string' && symbol.length) next.push({ field: 'symbol', value: symbol })
    }
    
    const asset = getFilterValue('asset_class')
    if (typeof asset === 'string' && asset.length) next.push({ field: 'asset_class', value: asset })
    const account = getFilterValue('legal_entity')
    if (typeof account === 'string' && account.length) next.push({ field: 'legal_entity', value: account })
    // ADD THIS LINE - Handle thesis filter
    const thesis = getFilterValue('thesis')
    if (typeof thesis === 'string' && thesis.length) next.push({ field: 'thesis', value: thesis })
  }
  
  activeFilters.value = next
}

// Helper function to extract tags from symbol text
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

function handleThesisCellFilterClick(event: any) {
  // Don't trigger filter when in edit mode or when clicking select elements
  if (event.event?.target?.tagName === 'SELECT' || 
      event.event?.target?.closest('.ag-cell-edit-input')) {
    return
  }
  
  // Check if any cell is currently being edited
  if (event.api && event.api.getEditingCells().length > 0) {
    return
  }
  
  const thesis = event?.value
  if (!thesis || !thesis.title) return
  
  // Use the thesis title for filtering
  handleCellFilterClick('thesis', thesis.title)
}

function handleCellFilterClick(field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis', value: any) {
  const api = gridApi.value
  if (!api || value === undefined || value === null) return
  
  if (field === 'symbol') {
    // For symbol field, use external filter for exact tag matching
    const clickedTag = String(value).trim()
    
    // Toggle the tag: add if not present, remove if present
    const currentIndex = symbolTagFilters.value.indexOf(clickedTag)
    if (currentIndex >= 0) {
      // Tag already exists, remove it
      symbolTagFilters.value.splice(currentIndex, 1)
    } else {
      // Tag doesn't exist, add it
      symbolTagFilters.value.push(clickedTag)
    }
    
    // Trigger external filter
    if (typeof api.onFilterChanged === 'function') {
      api.onFilterChanged()
    }
    
    // URL update will be handled by the gridApi watcher via writeFiltersToUrlFromModel
  } else {
    // For other fields (including thesis), use normal ag-Grid filters
    const currentModel = (api.getFilterModel && api.getFilterModel()) || {}
    currentModel[field] = { 
      filterType: 'text',
      type: 'equals', 
      filter: String(value) 
    }
    
    if (typeof api.setFilterModel === 'function') {
      api.setFilterModel(currentModel)
    }
    if (typeof api.onFilterChanged === 'function') {
      api.onFilterChanged()
    }
    
    // Emit event for account filter changes
    if (field === 'legal_entity' && eventBus) {
      console.log('📍 [Positions] Emitting account filter change')
      eventBus.emit('account-filter-changed', {
        accountId: String(value),
        source: 'positions'
      })
    }
  }
  
  syncActiveFiltersFromGrid()
}

// Filter position data by account ID (client ID)
const filteredPositions = computed(() => {
  const positions = sourcePositions.value || []
  if (!props.accountId || props.accountId === 'demo') {
    return positions
  }
  
  return positions.filter(p => p.legal_entity?.id === props.accountId)
})

// Column metadata for visibility control
type ColumnField2 = 'id' | 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'qty' | 'avgPrice' | 'price' | 'market_price' | 'market_value' | 'unrealized_pnl' | 'cash_flow_on_entry' | 'cash_flow_on_exercise' | 'be_price'
const allColumnOptions2: Array<{ field: ColumnField2; label: string }> = [
  { field: 'legal_entity', label: 'Account' },
  { field: 'symbol', label: 'Symbol' },
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
  { field: 'cash_flow_on_exercise', label: 'If excercised cash flow' },
  { field: 'be_price', label: 'BE Price' }
]

const visibleCols2 = ref<ColumnField2[]>(parseVisibleColsFromUrl2())
function isColVisible2(field: ColumnField2): boolean {
  return visibleCols2.value.includes(field)
}

// URL param helpers
function parseVisibleColsFromUrl2(): ColumnField2[] {
  const url = new URL(window.location.href)
  const colsParam = url.searchParams.get('position_cols')
  if (!colsParam) {
    // Default visible columns (exclude asset_class, conid, undConid, multiplier, qty)
    return allColumnOptions2
      .map(c => c.field)
      .filter(field => !['asset_class', 'conid', 'undConid', 'multiplier', 'qty'].includes(field))
  }
  const fromUrl = colsParam.split('-and-').map(s => s.trim()).filter(Boolean) as ColumnField2[]
  const valid = new Set(allColumnOptions2.map(c => c.field))
  const filtered = fromUrl.filter(c => valid.has(c))
  return filtered.length ? filtered : allColumnOptions2.map(c => c.field)
}

function writeVisibleColsToUrl2(cols: ColumnField2[]) {
  const url = new URL(window.location.href)
  url.searchParams.set('position_cols', cols.join('-and-'))
  window.history.replaceState({}, '', url.toString())
}

// Persist visibility to URL and update grid when changed
watch(visibleCols2, (cols) => {
  writeVisibleColsToUrl2(cols)
  for (const opt of allColumnOptions2) {
    setColumnVisibility(opt.field, isColVisible2(opt.field))
  }
}, { deep: true })

// Recalculate when upstream data changes
watch(() => sourcePositions.value, () => {
  recalcPinnedTotals()
})

// Recalculate when external symbol filters change
watch(symbolTagFilters, () => {
  syncActiveFiltersFromGrid()
  recalcPinnedTotals()
  
  // Force re-render of Financial Instrument column to update selected tag styling
  const api = gridApi.value
  if (api && typeof api.refreshCells === 'function') {
    api.refreshCells({ columns: ['symbol'] })
  }
}, { deep: true })

// Keep active filter tags in sync whenever filters change via UI
watch(() => gridApi.value, (api) => {
  if (!api) return
  const listener = () => {
    syncActiveFiltersFromGrid()
    // Persist filter model to URL
    const model = api.getFilterModel?.() || {}
    writeFiltersToUrlFromModel(model)
    recalcPinnedTotals()
  }
  api.addEventListener?.('filterChanged', listener)
}, { immediate: true })

const groupByThesis = ref(false)
const groupedData = computed(() => {
  if (!groupByThesis.value || !sourcePositions.value) {
    return sourcePositions.value || []
  }
  
  // Filter only positions with thesis assigned
  const positionsWithThesis = sourcePositions.value.filter(pos => pos.thesis && pos.thesis.id)
  
  // Group by thesis
  const grouped = new Map<string, Position[]>()
  
  positionsWithThesis.forEach(position => {
    const thesisId = position.thesis.id
    if (!grouped.has(thesisId)) {
      grouped.set(thesisId, [])
    }
    grouped.get(thesisId)!.push(position)
  })
  
  // Create flat array with thesis groups and their totals
  const result: any[] = []
  
  for (const [thesisId, positions] of grouped.entries()) {
    const thesis = positions[0].thesis
    
    // Add thesis header row
    result.push({
      isThesisHeader: true,
      thesis,
      symbol: `📋 ${thesis.title}`,
      legal_entity: `${positions.length} position${positions.length !== 1 ? 's' : ''}`,
      asset_class: '',
      // Set all numeric fields to empty/null for header
      qty: null,
      avgPrice: null,
      price: null,
      market_value: null,
      unrealized_pnl: null,
      cash_flow_on_entry: null,
      cash_flow_on_exercise: null
    })
    
    // Add all positions for this thesis
    result.push(...positions)
    
    // Calculate totals for this thesis
    const totals: any = {
      isThesisTotal: true,
      thesisId,
      symbol: `Total for ${thesis.title}`,
      legal_entity: '',
      asset_class: '',
      thesis: null
    }
    
    for (const field of numericFields) {
      totals[field] = positions.reduce((sum: number, pos: any) => {
        const value = pos[field]
        const num = typeof value === 'number' && Number.isFinite(value) ? value : 0
        return sum + num
      }, 0)
    }
    
    result.push(totals)
  }
  
  return result
})

// Update the grid row data computed property
const gridRowData = computed(() => {
  return groupByThesis.value ? groupedData.value : (sourcePositions.value || [])
})

// Update the recalcPinnedTotals function to handle grouped data
function recalcPinnedTotals() {
  const api = gridApi.value
  
  if (groupByThesis.value) {
    // When grouping by thesis, don't show overall pinned totals
    pinnedBottomRowDataRef.value = []
    return
  }
  
  // Original totals logic for non-grouped view
  if (!api) {
    const rows = sourcePositions.value || []
    const totals: any = { symbol: 'Total', asset_class: '' }
    for (const field of numericFields) {
      totals[field] = rows.reduce((sum: number, row: any) => {
        const v = row?.[field]
        const n = typeof v === 'number' && Number.isFinite(v) ? v : 0
        return sum + n
      }, 0)
    }
    pinnedBottomRowDataRef.value = [totals]
    return
  }

  const totals: any = { symbol: 'Total', asset_class: '' }
  for (const field of numericFields) totals[field] = 0

  api.forEachNodeAfterFilterAndSort((node: any) => {
    const data = node.data || {}
    // Skip thesis header and total rows when calculating overall totals
    if (data.isThesisHeader || data.isThesisTotal) return
    
    for (const field of numericFields) {
      const v = data?.[field]
      const n = typeof v === 'number' && Number.isFinite(v) ? v : 0
      totals[field] += n
    }
  })

  pinnedBottomRowDataRef.value = [totals]
}

// Update the rowClicked function to handle grouped rows
function rowClicked(position: Position) {
  // Don't emit row click for thesis header/total rows
  if ((position as any).isThesisHeader || (position as any).isThesisTotal) {
    return
  }
  
  emit('row-click', position)
  if (props.onRowClick) {
    props.onRowClick(position)
  }
}

function setColumnVisibility(field: string, visible: boolean) {
  const api = gridApi.value
  if (!api) return
  
  try {
    if (typeof api.setColumnsVisible === 'function') {
      api.setColumnsVisible([field], visible)
    } else if (typeof api.setColumnVisible === 'function') {
      api.setColumnVisible(field, visible)
    }
  } catch (error) {
    console.warn('Could not set column visibility:', error)
  }
}

// Column visibility controls
const showColumnsPopup = ref(false)
const columnsBtnRef = ref<HTMLElement | null>(null)
const columnsPopupRef = ref<HTMLElement | null>(null)

function toggleColumnsPopup() {
  showColumnsPopup.value = !showColumnsPopup.value
}

function closeColumnsPopup() {
  showColumnsPopup.value = false
}

// Close popup when clicking outside
function handleClickOutside(event: Event) {
  if (showColumnsPopup.value && 
      columnsPopupRef.value && 
      columnsBtnRef.value &&
      !columnsPopupRef.value.contains(event.target as Node) && 
      !columnsBtnRef.value.contains(event.target as Node)) {
    closeColumnsPopup()
  }
}

// Persist visibility to URL and update grid when changed
watch(visibleCols, (cols) => {
  writeVisibleColsToUrl(cols)
  for (const opt of allColumnOptions) {
    setColumnVisibility(opt.field, isColVisible(opt.field))
  }
}, { deep: true })

// Inject event bus
const eventBus = inject<any>('eventBus')

// Add listener for external filter changes
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Listen for account filter changes from other components
  if (eventBus) {
    eventBus.on('account-filter-changed', handleExternalAccountFilter)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  
  // Clean up event listener
  if (eventBus) {
    eventBus.off('account-filter-changed', handleExternalAccountFilter)
  }
})

// Handle external account filter changes
function handleExternalAccountFilter(payload: { accountId: string | null, source: string }) {
  console.log('📍 [Positions] Received account filter:', payload)
  
  // Ignore if this component is the source
  if (payload.source === 'positions') return
  
  const api = gridApi.value
  if (!api) {
    console.warn('📍 [Positions] Grid API not ready')
    return
  }
  
  if (payload.accountId) {
    // Apply filter
    const currentModel = (api.getFilterModel && api.getFilterModel()) || {}
    currentModel.legal_entity = { 
      filterType: 'text',
      type: 'equals', 
      filter: payload.accountId 
    }
    
    console.log('📍 [Positions] Applying filter model:', currentModel)
    
    if (typeof api.setFilterModel === 'function') {
      api.setFilterModel(currentModel)
    }
    if (typeof api.onFilterChanged === 'function') {
      api.onFilterChanged()
    }
    
    // Update URL
    writeFiltersToUrlFromModel(currentModel)
  } else {
    // Clear filter
    const currentModel = (api.getFilterModel && api.getFilterModel()) || {}
    delete currentModel.legal_entity
    
    console.log('📍 [Positions] Clearing account filter')
    
    if (typeof api.setFilterModel === 'function') {
      api.setFilterModel(currentModel)
    }
    if (typeof api.onFilterChanged === 'function') {
      api.onFilterChanged()
    }
    
    // Update URL
    writeFiltersToUrlFromModel(currentModel)
  }
  
  syncActiveFiltersFromGrid()
}

// Update the handleCellFilterClick function to emit events

// Update clearFilter to emit events
function clearFilter(field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis') {
  const api = gridApi.value
  if (!api) return
  
  if (field === 'symbol') {
    // Clear external symbol filters
    symbolTagFilters.value = []
    if (typeof api.onFilterChanged === 'function') {
      api.onFilterChanged()
    }
  } else {
    // Clear ag-Grid filter for other fields
    const currentModel = (api.getFilterModel && api.getFilterModel()) || {}
    delete currentModel[field]
    
    if (typeof api.setFilterModel === 'function') {
      api.setFilterModel(currentModel)
    }
    if (typeof api.onFilterChanged === 'function') {
      api.onFilterChanged()
    }
    
    // Emit event for account filter clear
    if (field === 'legal_entity' && eventBus) {
      console.log('📍 [Positions] Clearing account filter via event')
      eventBus.emit('account-filter-changed', {
        accountId: null,
        source: 'positions'
      })
    }
  }
  
  syncActiveFiltersFromGrid()
}

// Update clearAllFilters to emit events
function clearAllFilters() {
  const api = gridApi.value
  if (!api) return
  
  // Check if account filter was active
  const currentModel = api.getFilterModel?.() || {}
  const hadAccountFilter = !!currentModel.legal_entity
  
  // Clear external symbol filters
  symbolTagFilters.value = []
  
  // Clear all ag-Grid filters
  if (typeof api.setFilterModel === 'function') {
    api.setFilterModel({})
  }
  if (typeof api.onFilterChanged === 'function') {
    api.onFilterChanged()
  }
  
  // Emit event if account filter was cleared
  if (hadAccountFilter && eventBus) {
    eventBus.emit('account-filter-changed', {
      accountId: null,
      source: 'positions'
    })
  }
  
  syncActiveFiltersFromGrid()
}

// Add these helper functions before columnDefs
function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return ''
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (!Number.isFinite(num)) return ''
  if (num % 1 == 0){
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return ''
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (!Number.isFinite(num)) return ''
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num)
}

function formatExpiryFromYyMmDd(code: string): string {
  if (!code || code.length !== 6) return ''
  const yy = code.substring(0, 2)
  const mm = code.substring(2, 4)
  const dd = code.substring(4, 6)
  return `20${yy}-${mm}-${dd}`
}

function renderFinancialInstrumentCell(symbolText: string): string {
  if (!symbolText) return ''
  
  const tags = extractTagsFromSymbol(symbolText)
  const selectedTags = new Set(symbolTagFilters.value)
  
  return tags.map(tag => {
    const isSelected = selectedTags.has(tag)
    const className = isSelected ? 'fi-tag fi-tag-selected' : 'fi-tag'
    return `<span class="${className}">${tag}</span>`
  }).join(' ')
}

function extractClickedTagText(event: any): string | null {
  const target = event.event?.target
  if (!target) return null
  
  const tagSpan = target.closest('.fi-tag')
  if (!tagSpan) return null
  
  return tagSpan.textContent?.trim() || null
}

// Add these thesis management functions
const showThesisModal = ref(false)
const thesisModalMode = ref<'view' | 'add' | 'edit'>('view')
const newThesis = ref({ title: '', description: '' })
const editThesisForm = ref({ id: '', title: '', description: '' })

function showThesisModalForView() {
  thesisModalMode.value = 'view'
  showThesisModal.value = true
}

async function addNewThesis() {
  if (!newThesis.value.title.trim()) return
  
  try {
    const { data, error } = await supabase
      .schema('hf')
      .from('thesisMaster')
      .insert([{
        title: newThesis.value.title.trim(),
        description: newThesis.value.description.trim() || null
      }])
      .select()
    
    if (error) throw error
    
    // Refresh thesis data
    queryClient.invalidateQueries({ queryKey: ['thesis'] })
    
    // Reset form and go back to view mode
    newThesis.value = { title: '', description: '' }
    thesisModalMode.value = 'view'
    
    showToast('success', 'Thesis Added', 'New thesis has been created successfully')
  } catch (error: any) {
    console.error('Error adding thesis:', error)
    showToast('error', 'Error', `Failed to add thesis: ${error.message}`)
  }
}

function startEditThesis(thesis: Thesis) {
  editThesisForm.value = {
    id: thesis.id,
    title: thesis.title,
    description: thesis.description || ''
  }
  thesisModalMode.value = 'edit'
}

function cancelEditThesis() {
  editThesisForm.value = { id: '', title: '', description: '' }
  thesisModalMode.value = 'view'
}

async function saveEditThesis() {
  if (!editThesisForm.value.title.trim()) return
  
  try {
    const { error } = await supabase
      .schema('hf')
      .from('thesisMaster')
      .update({
        title: editThesisForm.value.title.trim(),
        description: editThesisForm.value.description.trim() || null
      })
      .eq('id', editThesisForm.value.id)
    
    if (error) throw error
    
    // Refresh thesis data
    queryClient.invalidateQueries({ queryKey: ['thesis'] })
    
    // Reset form and go back to view mode
    editThesisForm.value = { id: '', title: '', description: '' }
    thesisModalMode.value = 'view'
    
    showToast('success', 'Thesis Updated', 'Thesis has been updated successfully')
  } catch (error: any) {
    console.error('Error updating thesis:', error)
    showToast('error', 'Error', `Failed to update thesis: ${error.message}`)
  }
}

async function deleteThesis(id: string, title: string) {
  if (!confirm(`Are you sure you want to delete thesis "${title}"?`)) return
  
  try {
    const { error } = await supabase
      .schema('hf')
      .from('thesisMaster')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    // Refresh thesis data
    queryClient.invalidateQueries({ queryKey: ['thesis'] })
    
    showToast('success', 'Thesis Deleted', 'Thesis has been deleted successfully')
  } catch (error: any) {
    console.error('Error deleting thesis:', error)
    showToast('error', 'Error', `Failed to delete thesis: ${error.message}`)
  }
}

async function updatePositionThesis(positionId: string, thesisId: string | null) {
  try {
    const { error } = await supabase
      .schema('hf')
      .from('positions')
      .update({ thesis_id: thesisId })
      .eq('id', positionId)
    
    if (error) throw error
    
    // Refresh positions data
    queryClient.invalidateQueries({ queryKey: ['positions'] })
    
    showToast('success', 'Thesis Updated', 'Position thesis has been updated')
  } catch (error: any) {
    console.error('Error updating position thesis:', error)
    showToast('error', 'Error', `Failed to update thesis: ${error.message}`)
    throw error
  }
}

// Toast notification system
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
  
  setTimeout(() => {
    removeToast(id)
  }, 5000)
}

function removeToast(id: number) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// External filter for symbol tags
function isExternalFilterPresent(): boolean {
  return symbolTagFilters.value.length > 0
}

function doesExternalFilterPass(node: any): boolean {
  if (symbolTagFilters.value.length === 0) return true
  
  const symbolText = node.data?.symbol
  if (!symbolText) return false
  
  const tags = extractTagsFromSymbol(symbolText)
  
  // ALL selected tags must be present in the symbol
  return symbolTagFilters.value.every(selectedTag => tags.includes(selectedTag))
}

// Grid ready handler
function onGridReady(params: any) {
  gridApi.value = params.api
  columnApiRef.value = params.columnApi
  
  // Apply initial filters from URL
  const filters = parseFiltersFromUrl()
  const model: any = {}
  
  if (filters.symbol) {
    // For symbol filter from URL, use external filter
    symbolTagFilters.value = filters.symbol.split(',').map(s => s.trim())
  }
  if (filters.asset_class) {
    model.asset_class = { type: 'equals', filter: filters.asset_class }
  }
  if (filters.legal_entity) {
    model.legal_entity = { type: 'equals', filter: filters.legal_entity }
  }
  
  if (Object.keys(model).length > 0) {
    params.api.setFilterModel(model)
  }
  
  syncActiveFiltersFromGrid()
  recalcPinnedTotals()
}

// ...rest of existing code...
</script>

<template>
  <div class="positions-card">
    <!-- Loading state -->
    <div v-if="q.isLoading.value" class="loading">
      <div class="loading-spinner"></div>
      Loading positions...
    </div>
    
    <!-- Error state -->
    <div v-else-if="q.isError.value" class="error">
      <h3>Error loading positions</h3>
      <p>{{ q.error.value }}</p>
    </div>
    
    <!-- Success state with ag-grid -->
    <div v-else-if="q.isSuccess.value" class="positions-container">
      <div class="positions-header">
        <h2>
          <router-link v-if="showHeaderLink" to="/positions">Positions</router-link>
          <span v-else>Positions</span>
        </h2>
        <div class="positions-tools">
          <div class="positions-count">{{ q.data.value?.length || 0 }} positions</div>
          
          <!-- Add the Group by Thesis button -->
          <button 
            class="thesis-group-btn" 
            :class="{ active: groupByThesis }"
            @click="groupByThesis = !groupByThesis" 
            title="Group positions by thesis"
          >
            <span class="icon">📊</span> 
            {{ groupByThesis ? 'Ungroup' : 'Group by Thesis' }}
          </button>
          
          <!-- Keep the thesis management button -->
          <button class="thesis-btn" @click="showThesisModalForView" title="Manage thesis">
            <span class="icon">📋</span> Manage Thesis
          </button>
          
          <button ref="columnsBtnRef" class="columns-btn" aria-label="Column settings" @click.stop="toggleColumnsPopup">
            <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.21-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.22-.22-.39-.44-.39h-3.84c-.22 0-.41.16-.44.39l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c.04.31.06.63.06.94s-.02.63-.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.21.37.3.59.22l2.39.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.22.22.39.44.39h3.84c.22 0 .41-.16.44-.39l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.03-1.58ZM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5Z"/>
            </svg>
          </button>
          
          <button 
            @click="emit('minimize')"
            class="minimize-button"
            title="Minimize Positions"
          >
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
      
      <!-- Active filter tags -->
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
            <button class="tag-clear" @click="clearFilter(f.field)" aria-label="Clear filter">✕</button>
          </span>
          <button class="btn btn-clear-all" @click="clearAllFilters">Clear all</button>
        </div>
      </div>

      <div class="ag-theme-alpine positions-grid">
        <AgGridVue
          :columnDefs="columnDefs"
          :rowData="gridRowData"
          :modules="[AllCommunityModule]"
          :defaultColDef="{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 100
          }"
          :animateRows="true"
          :domLayout="'autoHeight'"
          :pinnedBottomRowData="pinnedBottomRowDataRef"
          :isExternalFilterPresent="isExternalFilterPresent"
          :doesExternalFilterPass="doesExternalFilterPass"
          :gridOptions="{
            getRowStyle: (params) => {
              if (params.data?.isThesisHeader) {
                return { 
                  'background-color': '#f8f9fa', 
                  'font-weight': 'bold',
                  'border-top': '2px solid #dee2e6'
                };
              }
              if (params.data?.isThesisTotal) {
                return { 
                  'background-color': '#e9ecef', 
                  'font-weight': 'bold',
                  'font-style': 'italic',
                  'border-bottom': '2px solid #dee2e6'
                };
              }
              return null;
            }
          }"
          @grid-ready="onGridReady"
          @filter-changed="recalcPinnedTotals"
          @sort-changed="recalcPinnedTotals"
          @row-data-updated="recalcPinnedTotals"
          @row-clicked="(event: any) => event.data && rowClicked(event.data)"
          style="width: 100%;"
        />
      </div>
    </div>

    <!-- Enhanced Thesis Modal -->
    <div v-if="showThesisModal" class="modal-overlay" @click="showThesisModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ thesisModalMode === 'add' ? 'Add New Thesis' : 'Manage Thesis' }}</h3>
          <button class="modal-close" @click="showThesisModal = false">×</button>
        </div>
        
        <!-- View/Manage Mode -->
        <div v-if="thesisModalMode === 'view'" class="modal-body">
          <div class="thesis-actions">
            <button 
              class="btn btn-primary" 
              @click="thesisModalMode = 'add'"
            >
              + Add New Thesis
            </button>
          </div>
          
          <div class="thesis-list">
            <div v-if="thesisQuery.isLoading.value" class="thesis-loading">
              Loading thesis...
            </div>
            
            <div v-else-if="thesisQuery.error.value" class="thesis-error">
              Error loading thesis: {{ thesisQuery.error.value }}
            </div>
            
            <div v-else-if="!thesisQuery.data.value || thesisQuery.data.value.length === 0" class="thesis-empty">
              No thesis found. Click "Add New Thesis" to create one.
            </div>
            
            <div v-else class="thesis-items">
              <div 
                v-for="thesis in thesisQuery.data.value" 
                :key="thesis.id" 
                class="thesis-item"
              >
                <div class="thesis-content">
                  <div class="thesis-title">{{ thesis.title }}</div>
                  <div v-if="thesis.description" class="thesis-description">
                    {{ thesis.description }}
                  </div>
                  <div class="thesis-meta">
                    <span v-if="thesis.created_at" class="thesis-date">
                      Created: {{ new Date(thesis.created_at).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
                <div class="thesis-actions">
                  <button 
                    class="btn btn-secondary btn-sm" 
                    @click="startEditThesis(thesis)"
                    title="Edit thesis"
                    style="margin-right: 8px;"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    class="btn btn-danger btn-sm" 
                    @click="deleteThesis(thesis.id, thesis.title)"
                    title="Delete thesis"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Add Mode -->
        <div v-else-if="thesisModalMode === 'add'" class="modal-body">
          <div class="form-group">
            <label for="thesis-title">Title *</label>
            <input 
              id="thesis-title"
              v-model="newThesis.title" 
              type="text" 
              placeholder="Enter thesis title"
              maxlength="100"
            />
          </div>
          <div class="form-group">
            <label for="thesis-description">Description</label>
            <textarea 
              id="thesis-description"
              v-model="newThesis.description" 
              placeholder="Enter thesis description (optional)"
              rows="3"
              maxlength="500"
            ></textarea>
          </div>
        </div>
        
        <!-- Edit Mode -->
        <div v-else-if="thesisModalMode === 'edit'" class="modal-body">
          <div class="form-group">
            <label for="edit-thesis-title">Title *</label>
            <input 
              id="edit-thesis-title"
              v-model="editThesisForm.title" 
              type="text" 
              placeholder="Enter thesis title"
              maxlength="100"
            />
          </div>
          <div class="form-group">
            <label for="edit-thesis-description">Description</label>
            <textarea 
              id="edit-thesis-description"
              v-model="editThesisForm.description" 
              placeholder="Enter thesis description (optional)"
              rows="3"
              maxlength="500"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <div v-if="thesisModalMode === 'add'">
            <button class="btn btn-cancel" @click="thesisModalMode = 'view'">← Back to List</button>
            <button 
              class="btn btn-primary" 
              @click="addNewThesis"
              :disabled="!newThesis.title.trim()"
            >
              Add Thesis
            </button>
          </div>
          <div v-else-if="thesisModalMode === 'edit'">
            <button class="btn btn-cancel" @click="cancelEditThesis">← Back to List</button>
            <button 
              class="btn btn-primary" 
              @click="saveEditThesis"
              :disabled="!editThesisForm.title.trim()"
            >
              Save Changes
            </button>
          </div>
          <div v-else>
            <button class="btn btn-cancel" @click="showThesisModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Container -->
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
            <span v-else-if="toast.type === 'info'">ℹ️</span>
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div v-if="toast.message" class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" @click.stop="removeToast(toast.id)" aria-label="Close notification">
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.positions-card {
  /* padding: 1.5rem; */
  border-radius: 0.75rem;
  /* border: 1px solid rgba(0,0,0,.1); */
  /* box-shadow: 0 4px 12px rgba(0,0,0,.1); */
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
  margin-bottom: 1rem;
  /* padding-bottom: 1rem; */
  /*border-bottom: 1px solid #e9ecef;*/
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
  padding: 8px 12px;
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

.thesis-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.thesis-btn:hover {
  background: #f8f9fa;
}

.columns-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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
  width: 32px;
  height: 32px;
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

.columns-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin: 0.5rem 0 0.25rem 0;
}

.columns-controls .label {
  font-size: 0.875rem;
  color: #495057;
  font-weight: 600;
}

.columns-list {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.col-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: #495057;
}

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
  height: 100%;
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

.filters-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
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

/* ag-Grid styling */
::deep(.ag-theme-alpine) {
  --ag-header-background-color: #f8f9fa;
  --ag-header-foreground-color: #495057;
  --ag-border-color: #dee2e6;
  --ag-row-hover-color: #f8f9fa;
  --ag-selected-row-background-color: #e3f2fd;
}

::deep(.ag-theme-alpine .ag-header-cell) {
  font-weight: 600;
  font-size: 0.875rem;
  border-right: 1px solid #dee2e6;
}

::deep(.ag-theme-alpine .ag-cell) {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  border-right: 1px solid #dee2e6;
}

/* Highlight pinned bottom total row */
::deep(.ag-theme-alpine .ag-row-pinned-bottom) {
  background-color: #f1f3f5 !important;
  font-weight: 600;
}
::deep(.ag-theme-alpine .ag-row-pinned-bottom .ag-cell) {
  border-top: 2px solid #dee2e6;
}

::deep(.symbol) {
  font-weight: 600;
  color: #007bff;
}

::deep(.symbol-click) { cursor: pointer; }

::deep(.pnl-positive) {
  color: #28a745 !important;
  font-weight: 600;
}

::deep(.pnl-negative) {
  color: #dc3545 !important;
  font-weight: 600;
}

::deep(.pnl-zero) {
  color: #6c757d !important;
}

@media (max-width: 768px) {
  /* .positions-card {
    padding: 1rem;
  } */
  
  .positions-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .positions-grid {
    height: 300px;
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px; /* Increased from 500px */
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: white;
  color: #6c757d;
}

.btn-cancel:hover {
  background: #f8f9fa;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background: #545b62;
  border-color: #4e555b;
}

/* Add these new styles */
.thesis-actions {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
}

.thesis-list {
  max-height: 400px;
  overflow-y: auto;
}

.thesis-loading, .thesis-error, .thesis-empty {
  padding: 20px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.thesis-error {
  color: #dc3545;
}

.thesis-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thesis-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.thesis-item:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.thesis-content {
  flex: 1;
  min-width: 0;
}

.thesis-title {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 6px;
}

.thesis-description {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
}

.thesis-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #868e96;
}

.thesis-actions {
  margin-left: 12px;
  flex-shrink: 0;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn-danger:hover {
  background: #c82333;
  border-color: #bd2130;
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
  background: rgba(0, 0, 0,    0.1);
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

/* Responsive adjustments */
@media (max-width: 480px) {
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