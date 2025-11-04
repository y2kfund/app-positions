<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, watch, inject, nextTick } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import { 
  usePositionsQuery, 
  useThesisQuery, 
  useThesisConnectionsQuery, 
  extractSymbolRoot, 
  type Position, 
  type Thesis, 
  type ThesisConnection, 
  useSupabase, 
  useSymbolCommentsQuery, 
  upsertSymbolComment, 
  generateCommentKey, 
  generatePositionMappingKey,
  savePositionTradeMappings,
  usePositionTradeMappingsQuery
} from '@y2kfund/core'
import { useQueryClient } from '@tanstack/vue-query'
import type { PositionsProps } from './index'
import html2canvas from 'html2canvas'
import { useTradesQuery, type Trade } from '@y2kfund/core/trades'

const props = withDefaults(defineProps<PositionsProps>(), {
  accountId: 'demo',
  highlightPnL: false,
  showHeaderLink: false,
  //userId: null,
  window: null,
  userId: '67e578fd-2cf7-48a4-b028-a11a3f89bb9b'
})

const emit = defineEmits<{ 
  'row-click': [row: Position]
  'minimize': []
  'maximize': []
}>()

const accountFilter = ref<string | null>(null)
const assetClassFilter = ref<string | null>(null)

const numericFields = ['qty', 'avgPrice', 'price', 'market_value', 'unrealized_pnl', 'computed_cash_flow_on_entry', 'computed_cash_flow_on_exercise'] as const
const windowId = props.window || inject<string | null>('positions', null)

const today = new Date().toISOString().slice(0, 10)
const asOfDate = ref<string | null>(null)
function clearAsOfDate() { asOfDate.value = null }

const symbolCommentsQuery = props.userId ? useSymbolCommentsQuery(props.userId) : null

// Query positions data
const q = usePositionsQuery(props.accountId, props.userId, asOfDate)
//console.log('Positions query data:', q.data)
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

    // Generate comment key from multiple columns
    const commentKey = generateCommentKey({
      internal_account_id: newP.internal_account_id,
      symbol: newP.symbol,
      qty: newP.qty,
      asset_class: newP.asset_class,
      conid: newP.conid
    })
    newP.symbol_comment = symbolCommentMap.value.get(commentKey) || ''

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
type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'qty' | 'avgPrice' | 'price' | 'market_price' | 'instrument_market_price' | 'market_value' | 'unrealized_pnl' | 'be_price_pnl' | 'computed_cash_flow_on_entry' | 'computed_cash_flow_on_exercise' | 'entry_exercise_cash_flow_pct' | 'computed_be_price' | 'thesis' | 'maintenance_margin_change' | 'symbol_comment'
const allColumnOptions: Array<{ field: ColumnField; label: string }> = [
  { field: 'legal_entity', label: 'Account' },
  { field: 'thesis', label: 'Thesis' },
  { field: 'symbol', label: 'Financial Instrument' },
  { field: 'symbol_comment', label: 'Comment' },
  { field: 'expiry_date', label: 'Expiry date' },
  { field: 'asset_class', label: 'Asset Class' },
  { field: 'conid', label: 'Conid' },
  { field: 'undConid', label: 'Underlying Conid' },
  { field: 'multiplier', label: 'Multiplier' },
  { field: 'qty', label: 'Qty' },
  { field: 'avgPrice', label: 'Avg Price' },
  { field: 'price', label: 'Market Price' },
  { field: 'market_price', label: 'Ul CM Price' },
  { field: 'instrument_market_price', label: 'Instrument current market price' },
  { field: 'market_value', label: 'Market Value' },
  { field: 'unrealized_pnl', label: 'P&L Unrealized' },
  { field: 'be_price_pnl', label: 'Break even price P&L (computed)' },
  { field: 'computed_cash_flow_on_entry', label: 'Entry cash flow' },
  { field: 'computed_cash_flow_on_exercise', label: 'If exercised cash flow' },
  { field: 'entry_exercise_cash_flow_pct', label: '(Entry / If exercised) cash flow (computed)' },
  { field: 'computed_be_price', label: 'BE Price' },
  { field: 'maintenance_margin_change', label: 'Maintenance Margin Change' }
]

type ColumnRenames = Partial<Record<ColumnField, string>>
const columnRenames = ref<ColumnRenames>({})

const symbolCommentMap = computed(() => {
  const map = new Map<string, string>()
  if (symbolCommentsQuery?.data.value) {
    for (const c of symbolCommentsQuery.data.value) {
      map.set(c.comment_key, c.comment)
    }
  }
  return map
})

const expandedPositions = ref<Set<string>>(new Set())

// Function to toggle position expansion
function togglePositionExpansion(positionKey: string) {
  if (expandedPositions.value.has(positionKey)) {
    expandedPositions.value.delete(positionKey)
  } else {
    expandedPositions.value.add(positionKey)
  }
  
  // Find and update the specific row
  if (tabulator) {
    const rows = tabulator.getRows()
    for (const row of rows) {
      const data = row.getData()
      if (data && !data._isThesisGroup) {
        const rowPosKey = getPositionKey(data)
        if (rowPosKey === positionKey) {
          // Force the row to reformat by temporarily updating data
          row.reformat()
          break
        }
      }
    }
  }
}

// --- Helpers for URL sync of column renames ---
function parseColumnRenamesFromUrl(): ColumnRenames {
  const url = new URL(window.location.href)
  const param = url.searchParams.get(`${windowId}_position_col_renames`)
  if (!param) return {}
  try {
    const pairs = param.split('-and-')
    const renames: ColumnRenames = {}
    pairs.forEach(pair => {
      const [field, ...rest] = pair.split(':')
      if (field && rest.length) {
        renames[field as ColumnField] = decodeURIComponent(rest.join(':'))
      }
    })
    return renames
  } catch {
    return {}
  }
}
function writeColumnRenamesToUrl(renames: ColumnRenames) {
  const url = new URL(window.location.href)
  const pairs = Object.entries(renames)
    .filter(([_, name]) => name && name.trim())
    .map(([field, name]) => `${field}:${encodeURIComponent(name)}`)
    .join('-and-')
  if (pairs) {
    url.searchParams.set(`${windowId}_position_col_renames`, pairs)
  } else {
    url.searchParams.delete(`${windowId}_position_col_renames`)
  }
  window.history.replaceState({}, '', url.toString())
}

// --- Dialog state for renaming columns ---
const showColRenameDialog = ref(false)
const colRenameField = ref<ColumnField | null>(null)
const colRenameValue = ref('')

function openColRenameDialog(field: ColumnField, current: string) {
  colRenameField.value = field
  colRenameValue.value = current
  showColRenameDialog.value = true
}
function saveColRename() {
  if (colRenameField.value) {
    columnRenames.value = {
      ...columnRenames.value,
      [colRenameField.value]: colRenameValue.value.trim()
    }
    writeColumnRenamesToUrl(columnRenames.value)
    showColRenameDialog.value = false
    nextTick(() => initializeTabulator())
  }
}
function cancelColRename() {
  showColRenameDialog.value = false
}

function parseVisibleColsFromUrl(): ColumnField[] {
  const url = new URL(window.location.href)
  const colsParam = url.searchParams.get(`${windowId}_position_cols`)
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

// Add URL parameter helpers for column widths
function parseColumnWidthsFromUrl(): Record<string, number> {
  const url = new URL(window.location.href)
  const widthsParam = url.searchParams.get(`${windowId}_position_col_widths`)
  if (!widthsParam) return {}
  
  try {
    const pairs = widthsParam.split('-and-')
    const widths: Record<string, number> = {}
    pairs.forEach(pair => {
      const [field, width] = pair.split(':')
      if (field && width) {
        widths[field] = parseInt(width)
      }
    })
    return widths
  } catch (error) {
    console.warn('Error parsing column widths from URL:', error)
    return {}
  }
}

function writeColumnWidthsToUrl(widths: Record<string, number>) {
  const url = new URL(window.location.href)
  const widthPairs = Object.entries(widths)
    .filter(([_, width]) => width > 0)
    .map(([field, width]) => `${field}:${width}`)
    .join('-and-')
  
  if (widthPairs) {
    url.searchParams.set(`${windowId}_position_col_widths`, widthPairs)
  } else {
    url.searchParams.delete(`${windowId}_position_col_widths`)
  }
  window.history.replaceState({}, '', url.toString())
}

// Store column widths
const columnWidths = ref<Record<string, number>>(parseColumnWidthsFromUrl())

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

function extractTagsFromTradesSymbol(symbolText: string): string[] {
  if (!symbolText) return []
  const text = String(symbolText).trim()
  
  // Match base symbol (one or more uppercase letters at start)
  const symMatch = text.match(/^([A-Z]+)\s*/)
  const base = symMatch?.[1] ?? ''
  
  // Remove base symbol from text for further processing
  const remaining = text.slice(symMatch?.[0]?.length || 0)
  
  // Match expiry code (6 digits) followed by option type (C/P)
  const expiryMatch = remaining.match(/(\d{6})([CP])/)
  let expiry = ''
  let right = ''
  let strike = ''
  
  if (expiryMatch) {
    expiry = formatExpiryFromYyMmDd(expiryMatch[1])
    right = expiryMatch[2]
    
    // Extract strike price (remaining digits after expiry and option type)
    const afterExpiry = remaining.slice(expiryMatch[0].length)
    const strikeMatch = afterExpiry.match(/(\d+)/)
    if (strikeMatch) {
      // Parse as number, divide by 1000 to handle decimal places, then format
      const strikeValue = parseInt(strikeMatch[1], 10) / 1000
      strike = strikeValue.toString()
    }
  }
  
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

// Generic timezone formatting function
function formatTimestampWithTimezone(timestamp: string | null | undefined): string {
  if (!timestamp) {
    return '⏱️ Last Updated: Not available'
  }
  
  try {
    const date = new Date(timestamp)
    
    // Detect user's timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    // Map common timezones to their abbreviations with DST support
    const timezoneMap: { [key: string]: string } = {
      'Asia/Kolkata': 'IST',
      'Asia/Calcutta': 'IST',
      'America/New_York': date.getMonth() >= 2 && date.getMonth() < 10 ? 'EDT' : 'EST',
      'America/Los_Angeles': date.getMonth() >= 2 && date.getMonth() < 10 ? 'PDT' : 'PST',
      'America/Chicago': date.getMonth() >= 2 && date.getMonth() < 10 ? 'CDT' : 'CST',
      'America/Denver': date.getMonth() >= 2 && date.getMonth() < 10 ? 'MDT' : 'MST',
      'Europe/London': date.getMonth() >= 2 && date.getMonth() < 9 ? 'BST' : 'GMT',
      'Europe/Paris': date.getMonth() >= 2 && date.getMonth() < 9 ? 'CEST' : 'CET',
      'Australia/Sydney': date.getMonth() >= 9 || date.getMonth() < 3 ? 'AEDT' : 'AEST',
    }
    
    // Get the timezone abbreviation
    const timezoneName = timezoneMap[userTimeZone] || userTimeZone
    
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: userTimeZone
    })
    
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: userTimeZone
    })
    
    return `⏱️ Last Updated: ${formattedDate} at ${formattedTime} ${timezoneName}`
  } catch (error) {
    return `⏱️ Last Updated: ${timestamp}`
  }
}

// Generic context menu for columns showing fetched_at timestamp
function createFetchedAtContextMenu() {
  return [
    {
      label: "Margin Impact",
      action: (e: any, cell: any) => {
        const rowData = cell.getRow().getData()
        openMarginImpactModal(rowData)
      }
    },
    {
      separator: true
    },
    {
      label: (component: any) => {
        const rowData = component.getData()
        return formatTimestampWithTimezone(rowData.fetched_at)
      },
      action: () => {},
      disabled: true
    },
    {
      separator: true
    }
  ]
}

// Add function to hide column from header (add BEFORE initializeTabulator function)
function hideColumnFromHeader(field: ColumnField) {
  const index = visibleCols.value.indexOf(field)
  if (index > -1) {
    visibleCols.value.splice(index, 1)
    writeVisibleColsToUrl(visibleCols.value)
    
    // Rebuild table with new columns
    nextTick(() => {
      initializeTabulator()
    })
  }
}

function writeSortToUrl(field: string, dir: 'asc' | 'desc') {
  const url = new URL(window.location.href)
  url.searchParams.set(`${windowId}_positions_sort`, `${field}:${dir}`)
  window.history.replaceState({}, '', url.toString())
}

function parseSortFromUrl(): { field: string, dir: 'asc' | 'desc' } | null {
  const url = new URL(window.location.href)
  const param = url.searchParams.get(`${windowId}_positions_sort`)
  if (!param) return null
  const [field, dir] = param.split(':')
  if (field && (dir === 'asc' || dir === 'desc')) {
    return { field, dir }
  }
  return null
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

  // --- Build all column definitions as a map ---
  const allColumnsMap = new Map<string, any>()
  const allColumns: any[] = [
    // Copy all your column objects here, as in your current columns array
    // (You can copy-paste from your current columns array, no changes needed)
    // ...START COPY...
    {
      title: 'Account',
      field: 'legal_entity',
      minWidth: 80,
      width: columnWidths.value['legal_entity'] || undefined,
      frozen: true,
      visible: visibleCols.value.includes('legal_entity'),
      bottomCalc: shouldShowBottomCalcs ? () => 'All Accounts' : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? () => 'All Accounts' : undefined,
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('legal_entity')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        
        // Skip for thesis groups and trade rows
        if (data?._isThesisGroup || data?._isTrade) {
          return cell.getValue() || ''
        }
        
        const value = cell.getValue()
        const accountName = typeof value === 'object' && value !== null ? (value.name || value.id) : value
        
        // Check if this position has attached trades
        const posKey = getPositionKey(data)
        const attachedTradeIds = positionTradesMap.value.get(posKey)
        const hasAttachedTrades = attachedTradeIds && attachedTradeIds.size > 0
        const isExpanded = expandedPositions.value.has(posKey)
        
        // Show expand/collapse arrow if has trades
        const expandArrow = hasAttachedTrades 
          ? `<span class="expand-arrow ${isExpanded ? 'expanded' : ''}" data-position-key="${posKey}" title="${isExpanded ? 'Collapse' : 'Expand'} trades">
              ${isExpanded ? '▼' : '▶'}
            </span>`
          : '<span class="expand-arrow">&nbsp;</span>'
        
        // Add + icon for attaching trades
        return `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${expandArrow}
            <button 
              class="attach-trades-btn" 
              title="Attach trades"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span>${accountName}</span>
            ${hasAttachedTrades ? `<span class="trade-count">(${attachedTradeIds.size})</span>` : ''}
          </div>
        `
      },
      cellClick: (e: any, cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup || data?._isTrade) return
        
        const target = e.target as HTMLElement
        
        // Check for expand arrow click
        const expandArrow = target.closest('.expand-arrow')
        if (expandArrow) {
          e.stopPropagation()
          const posKey = expandArrow.getAttribute('data-position-key')
          if (posKey) {
            togglePositionExpansion(posKey)
          }
          return
        }
        
        // Check for attach button click
        const attachBtn = target.closest('.attach-trades-btn')
        if (attachBtn) {
          e.stopPropagation()
          openTradeAttachModal(data)
          return
        }
        
        const value = cell.getValue()
        const accountName = typeof value === 'object' && value !== null ? (value.name || value.id) : value
        handleCellFilterClick('legal_entity', accountName)
      },
      contextMenu: [
        ...createFetchedAtContextMenu()
      ]
    },
    {
      title: 'Financial Instrument',
      field: 'symbol',
      minWidth: 200,
      width: columnWidths.value['symbol'] || undefined, // ADD THIS LINE
      frozen: true,
      visible: visibleCols.value.includes('symbol'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('symbol')}</span>
        </div>`
      },
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
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Expiry date',
      field: 'expiry_date',
      minWidth: 110,
      width: columnWidths.value['expiry_date'] || undefined,
      hozAlign: 'center',
      visible: visibleCols.value.includes('expiry_date'),
      sorter: (a: any, b: any, aRow: any, bRow: any, column: any, dir: any, sorterParams: any) => {
        // Extract expiry string for OPT, otherwise empty string
        const getExpiry = (row: any) => {
          if (row.asset_class === 'OPT') {
            const tags = extractTagsFromSymbol(row.symbol)
            return tags[1] || ''
          }
          return ''
        }
        const expiryA = getExpiry(aRow.getData())
        const expiryB = getExpiry(bRow.getData())
        // Sort by date string (ISO format: YYYY-MM-DD)
        if (expiryA < expiryB) return -1
        if (expiryA > expiryB) return 1
        return 0
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>Expiry date</span>
        </div>`
      },
      formatter: (cell: any) => {
        const row = cell.getRow().getData()
        if (row.asset_class === 'OPT') {
          const tags = extractTagsFromSymbol(row.symbol)
          const expiry = tags[1] || ''
          return expiry ? expiry : '<span style="color:#aaa;font-style:italic;">Unknown</span>'
        }
        return '<span style="color:#aaa;font-style:italic;">Not applicable</span>'
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Thesis',
      field: 'thesis',
      minWidth: 80,
      width: columnWidths.value['thesis'] || undefined, // ADD THIS LINE
      visible: visibleCols.value.includes('thesis'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('thesis')}</span>
        </div>`
      },
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
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Comment',
      field: 'symbol_comment',
      minWidth: 120,
      width: columnWidths.value['symbol_comment'] || undefined,
      visible: visibleCols.value.includes('symbol_comment'),
      editor: 'input',
      titleFormatter: (cell: any) => `<div class="header-with-close"><span>Comment</span></div>`,
      formatter: (cell: any) => cell.getValue() || '',
      cellEdited: async (cell: any) => {
        const data = cell.getRow().getData()
        const commentKey = generateCommentKey({
          internal_account_id: data.internal_account_id,
          symbol: data.symbol,
          qty: data.qty,
          asset_class: data.asset_class,
          conid: data.conid
        })
        const comment = cell.getValue()
        if (commentKey && props.userId) {
          try {
            await upsertSymbolComment(supabase, commentKey, props.userId, comment)
            await symbolCommentsQuery?.refetch?.()
            cell.getRow().getTable().redraw(true)
            showToast('success', 'Comment saved')
          } catch (err: any) {
            showToast('error', 'Failed to save comment', err.message)
          }
        }
      },
      cellClick: (e: any, cell: any) => {
        if (!cell.getRow().getData()?._isThesisGroup) cell.edit()
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Asset Class',
      field: 'asset_class',
      minWidth: 80,
      width: columnWidths.value['asset_class'] || undefined,
      visible: visibleCols.value.includes('asset_class'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('asset_class')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return ''
        return cell.getValue() || ''
      },
      cellClick: (e: any, cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return
        const value = cell.getValue()
        handleCellFilterClick('asset_class', value)
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Conid',
      field: 'conid',
      minWidth: 80,
      width: columnWidths.value['conid'] || undefined, // ADD THIS LINE
      visible: visibleCols.value.includes('conid'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('conid')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return ''
        return cell.getValue() || ''
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Underlying Conid',
      field: 'undConid',
      minWidth: 80,
      width: columnWidths.value['undConid'] || undefined, // ADD THIS LINE
      visible: visibleCols.value.includes('undConid'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('undConid')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return ''
        return cell.getValue() || ''
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Multiplier',
      field: 'multiplier',
      minWidth: 80,
      width: columnWidths.value['multiplier'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('multiplier'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatNumber(cell.getValue()) : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatNumber(value)}</span>`
      } : undefined,
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('multiplier')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        return formatNumber(cell.getValue())
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Qty',
      field: 'qty',
      minWidth: 70,
      width: columnWidths.value['qty'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('qty'),
      sorter: 'number',
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatNumber(cell.getValue()) : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatNumber(value)}</span>`
      } : undefined,
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('qty')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return formatNumber(cell.getValue())
        return formatNumber(cell.getValue())
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Avg Price',
      field: 'avgPrice',
      minWidth: 80,
      width: columnWidths.value['avgPrice'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('avgPrice'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('avgPrice')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        return formatCurrency(cell.getValue())
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Market Price',
      field: 'price',
      minWidth: 80,
      width: columnWidths.value['price'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('price'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('price')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        return formatCurrency(cell.getValue())
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Ul CM Price',
      field: 'market_price',
      minWidth: 80,
      width: columnWidths.value['market_price'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('market_price'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('market_price')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        const row = cell.getRow().getData()
        if (row.asset_class === 'STK') {
          return `<span style="color:#aaa;font-style:italic;">Not applicable</span>`
        }
        const value = cell.getValue()
        return value === null || value === undefined ? '-' : formatCurrency(value)
      },
      contextMenu: [
        {
          label: (component: any) => {
            const rowData = component.getData()
            const fetchedAt = rowData.market_price_fetched_at
            
            if (!fetchedAt) {
              return '⏱️ Last Updated: Not available'
            }
            
            try {
              const date = new Date(fetchedAt)
              const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
              const timezoneMap: { [key: string]: string } = {
                'Asia/Kolkata': 'IST',
                'Asia/Calcutta': 'IST',
                'America/New_York': date.getMonth() >= 2 && date.getMonth() < 10 ? 'EDT' : 'EST',
                'America/Los_Angeles': date.getMonth() >= 2 && date.getMonth() < 10 ? 'PDT' : 'PST',
                'America/Chicago': date.getMonth() >= 2 && date.getMonth() < 10 ? 'CDT' : 'CST',
                'America/Denver': date.getMonth() >= 2 && date.getMonth() < 10 ? 'MDT' : 'MST',
                'Europe/London': date.getMonth() >= 2 && date.getMonth() < 9 ? 'BST' : 'GMT',
                'Europe/Paris': date.getMonth() >= 2 && date.getMonth() < 9 ? 'CEST' : 'CET',
                'Australia/Sydney': date.getMonth() >= 9 || date.getMonth() < 3 ? 'AEDT' : 'AEST',
              }
              const timezoneName = timezoneMap[userTimeZone] || userTimeZone
              const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: userTimeZone
              })
              const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: userTimeZone
              })
              return `⏱️ Last Updated: ${formattedDate} at ${formattedTime} ${timezoneName}`
            } catch (error) {
              return `⏱️ Last Updated: ${fetchedAt}`
            }
          },
          action: () => {},
          disabled: true
        },
        {
          separator: true
        }
      ]
    },
    {
      title: 'Instrument current market price',
      field: 'instrument_market_price',
      minWidth: 80,
      width: columnWidths.value['instrument_market_price'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('instrument_market_price'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('instrument_market_price')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return ''
        const row = cell.getRow().getData()
        // Show market prices based on asset class
        let value = null
        if (row.asset_class === 'OPT') {
          value = row.option_market_price
        } else if (row.asset_class === 'STK' || row.asset_class === 'FUND') {
          value = row.market_price
        }
        return value === null || value === undefined ? '-' : formatCurrency(value)
      },
      contextMenu: [
        {
          label: (component: any) => {
            const rowData = component.getData()
            const fetchedAt = rowData.market_price_fetched_at
            
            if (!fetchedAt) {
              return '⏱️ Last Updated: Not available'
            }
            
            try {
              const date = new Date(fetchedAt)
              const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
              const timezoneMap: { [key: string]: string } = {
                'Asia/Kolkata': 'IST',
                'Asia/Calcutta': 'IST',
                'America/New_York': date.getMonth() >= 2 && date.getMonth() < 10 ? 'EDT' : 'EST',
                'America/Los_Angeles': date.getMonth() >= 2 && date.getMonth() < 10 ? 'PDT' : 'PST',
                'America/Chicago': date.getMonth() >= 2 && date.getMonth() < 10 ? 'CDT' : 'CST',
                'America/Denver': date.getMonth() >= 2 && date.getMonth() < 10 ? 'MDT' : 'MST',
                'Europe/London': date.getMonth() >= 2 && date.getMonth() < 9 ? 'BST' : 'GMT',
                'Europe/Paris': date.getMonth() >= 2 && date.getMonth() < 9 ? 'CEST' : 'CET',
                'Australia/Sydney': date.getMonth() >= 9 || date.getMonth() < 3 ? 'AEDT' : 'AEST',
              }
              const timezoneName = timezoneMap[userTimeZone] || userTimeZone
              const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: userTimeZone
              })
              const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: userTimeZone
              })
              return `⏱️ Last Updated: ${formattedDate} at ${formattedTime} ${timezoneName}`
            } catch (error) {
              return `⏱️ Last Updated: ${fetchedAt}`
            }
          },
          action: () => {},
          disabled: true
        },
        {
          separator: true
        }
      ]
    },
    {
      title: 'Market Value',
      field: 'market_value',
      minWidth: 80,
      width: columnWidths.value['market_value'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('market_value'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      } : undefined,
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('market_value')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) return formatCurrency(cell.getValue())
        return formatCurrency(cell.getValue())
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'P&L Unrealized',
      field: 'unrealized_pnl',
      minWidth: 80,
      width: columnWidths.value['unrealized_pnl'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('unrealized_pnl'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      } : undefined,
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('unrealized_pnl')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      },
      contextMenu: createFetchedAtContextMenu()
    },
    // ...inside columns array, after 'unrealized_pnl' column...
    {
      title: 'Break even price P&L',
      field: 'be_price_pnl',
      minWidth: 80,
      width: columnWidths.value['be_price_pnl'] || undefined,
      hozAlign: 'right',
      visible: visibleCols.value.includes('be_price_pnl'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('be_price_pnl')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const row = cell.getRow().getData()
        // Only for put options
        if (row.asset_class === 'OPT' && row.symbol && row.symbol.includes('P')) {
          const ulCmPrice = row.market_price
          const bePrice = row.computed_be_price
          let qty = row.qty
          const multiplier = row.multiplier

          // Get strike price from third tag of symbol
          const tags = extractTagsFromSymbol(row.symbol)
          const strikeTag = tags[2]
          const strikePrice = strikeTag ? parseFloat(strikeTag) : null

          // Use absolute value for qty
          qty = Math.abs(qty)

          if (
            ulCmPrice !== null && ulCmPrice !== undefined &&
            bePrice !== null && bePrice !== undefined &&
            qty !== null && qty !== undefined &&
            multiplier !== null && multiplier !== undefined &&
            strikePrice !== null && !isNaN(strikePrice)
          ) {
            // min(UI CM Price, Strike price)
            const minPrice = Math.min(ulCmPrice, strikePrice)
            const pnl = (minPrice - bePrice) * qty * multiplier

            // --- DECIMAL DISPLAY LOGIC ---
            // If decimal part is less than 1% of the absolute value, show integer only
            const absPnl = Math.abs(pnl)
            const decimalPart = Math.abs(pnl % 1)
            let formatted
            if (absPnl === 0 || decimalPart < absPnl * 0.01) {
              formatted = formatCurrency(Math.trunc(pnl))
            } else {
              formatted = formatCurrency(pnl)
            }
            // --- END DECIMAL LOGIC ---

            let className = ''
            if (pnl > 0) className = 'pnl-positive'
            else if (pnl < 0) className = 'pnl-negative'
            else className = 'pnl-zero'

            return `<span class="${className}">${formatted}</span>`
          }
        }
        return `<span style="color:#aaa;font-style:italic;">Not applicable</span>`
      },
      bottomCalc: shouldShowBottomCalcs ? (values: any[], data: any[]) => {
        // Use only filtered data (data argument)
        let total = 0
        for (const row of data) {
          if (row.asset_class === 'OPT' && row.symbol && row.symbol.includes('P')) {
            const ulCmPrice = row.market_price
            const bePrice = row.computed_be_price
            let qty = row.qty
            const multiplier = row.multiplier
            const tags = extractTagsFromSymbol(row.symbol)
            const strikeTag = tags[2]
            const strikePrice = strikeTag ? parseFloat(strikeTag) : null
            qty = Math.abs(qty)
            if (
              ulCmPrice !== null && ulCmPrice !== undefined &&
              bePrice !== null && bePrice !== undefined &&
              qty !== null && qty !== undefined &&
              multiplier !== null && multiplier !== undefined &&
              strikePrice !== null && !isNaN(strikePrice)
            ) {
              const minPrice = Math.min(ulCmPrice, strikePrice)
              const pnl = (minPrice - bePrice) * qty * multiplier
              total += pnl
            }
          }
        }
        return total
      } : false,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => {
        const value = cell.getValue()
        // --- DECIMAL DISPLAY LOGIC FOR TOTAL ---
        const absVal = Math.abs(value)
        const decimalPart = Math.abs(value % 1)
        let formatted
        if (absVal === 0 || decimalPart < absVal * 0.01) {
          formatted = formatCurrency(Math.trunc(value))
        } else {
          formatted = formatCurrency(value)
        }
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatted}</span>`
      } : undefined,
      // --- CONTEXT MENU FOR FULL DECIMAL CALCULATION ---
      contextMenu: [
        {
          label: (component: any) => {
            const row = component.getData()
            if (row.asset_class === 'OPT' && row.symbol && row.symbol.includes('P')) {
              const ulCmPrice = row.market_price
              const bePrice = row.computed_be_price
              let qty = row.qty
              const multiplier = row.multiplier
              const tags = extractTagsFromSymbol(row.symbol)
              const strikeTag = tags[2]
              const strikePrice = strikeTag ? parseFloat(strikeTag) : null
              qty = Math.abs(qty)
              if (
                ulCmPrice !== null && ulCmPrice !== undefined &&
                bePrice !== null && bePrice !== undefined &&
                qty !== null && qty !== undefined &&
                multiplier !== null && multiplier !== undefined &&
                strikePrice !== null && !isNaN(strikePrice)
              ) {
                const minPrice = Math.min(ulCmPrice, strikePrice)
                const pnl = (minPrice - bePrice) * qty * multiplier
                // Always show full decimal in context menu
                return [
                  `Calculation: (min(Market Price, Strike Price) - BE Price) × |Qty| × Multiplier`,
                  `= (min(${formatCurrency(ulCmPrice)}, ${formatCurrency(strikePrice)}) - ${formatCurrency(bePrice)}) × ${qty} × ${multiplier}`,
                  `= (${formatCurrency(minPrice)} - ${formatCurrency(bePrice)}) × ${qty} × ${multiplier}`,
                  `= ${formatCurrency(minPrice - bePrice)} × ${qty} × ${multiplier}`,
                  `= ${formatCurrency((minPrice - bePrice) * qty)} × ${multiplier}`,
                  `<b>= ${formatCurrency(pnl)}</b> <span style="color:#888">(full decimal)</span>`
                ].join('<br>')
              }
            }
            return 'Not applicable for this row'
          },
          action: () => {},
          disabled: true
        },
        { separator: true }
      ]
    },
    {
      title: 'Entry cash flow',
      field: 'computed_cash_flow_on_entry',
      minWidth: 80,
      width: columnWidths.value['computed_cash_flow_on_entry'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('computed_cash_flow_on_entry'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      } : undefined,
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('computed_cash_flow_on_entry')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'If exercised cash flow',
      field: 'computed_cash_flow_on_exercise',
      minWidth: 80,
      width: columnWidths.value['computed_cash_flow_on_exercise'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('computed_cash_flow_on_exercise'),
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      //bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => formatCurrency(cell.getValue()) : undefined,
      bottomCalcFormatter: shouldShowBottomCalcs ? (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      } : undefined,
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('computed_cash_flow_on_exercise')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const value = cell.getValue()
        let className = ''
        if (value > 0) className = 'pnl-positive'
        else if (value < 0) className = 'pnl-negative'
        else className = 'pnl-zero'
        return `<span class="${className}">${formatCurrency(value)}</span>`
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: '(Entry / If exercised) cash flow',
      field: 'entry_exercise_cash_flow_pct',
      minWidth: 100,
      width: columnWidths.value['entry_exercise_cash_flow_pct'] || undefined,
      hozAlign: 'right',
      visible: visibleCols.value.includes('entry_exercise_cash_flow_pct'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('entry_exercise_cash_flow_pct')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const row = cell.getRow().getData()
        // Only for options (puts/calls)
        if (row.asset_class === 'OPT' && row.computed_cash_flow_on_entry != null && row.computed_cash_flow_on_exercise != null && row.computed_cash_flow_on_exercise !== 0) {
          const pct = (row.computed_cash_flow_on_entry / row.computed_cash_flow_on_exercise) * 100
          
          const formatted = Math.abs(pct.toFixed(2)) + '%'
          return `<span>${formatted}</span>`

          /*// Show as +12.34% or -12.34%
          const formatted = `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
          let className = ''
          if (pct > 0) className = 'pnl-positive'
          else if (pct < 0) className = 'pnl-negative'
          else className = 'pnl-zero'
          return `<span class="${className}">${formatted}</span>`*/
        }
        return `<span style="color:#aaa;font-style:italic;">Not applicable</span>`
      },
      bottomCalc: false,
      //contextMenu: createFetchedAtContextMenu(),
      contextMenu: [
        {
          label: (component: any) => {
            const row = component.getData()
            if (row.asset_class === 'OPT' && row.computed_cash_flow_on_entry != null && row.computed_cash_flow_on_exercise != null && row.computed_cash_flow_on_exercise !== 0) {
              const pct = (row.computed_cash_flow_on_entry / row.computed_cash_flow_on_exercise) * 100
              return [
                `Calculation: (Entry cash flow / If exercised cash flow) × 100`,
                `= (${formatCurrency(row.computed_cash_flow_on_entry)} / ${formatCurrency(row.computed_cash_flow_on_exercise)}) × 100`,
                `= ${pct.toFixed(2)}%`
              ].join('<br>')
            }
            return 'Not applicable for this row'
          },
          action: () => {},
          disabled: true
        },
        { separator: true }
      ]
    },
    {
      title: 'BE Price',
      field: 'computed_be_price',
      minWidth: 80,
      width: columnWidths.value['computed_be_price'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('computed_be_price'),
      titleFormatter: (cell: any) => {
        /*const bePriceCol = columnWidths.value['computed_be_price'] && columnWidths.value['computed_be_price'] >= 140 
          ? 'Break even price' 
          : 'BE Price'
        return `<div class="header-with-close">
          <span>${bePriceCol}</span>
          <button class="header-close-btn" data-field="computed_be_price" title="Hide column">✕</button>
        </div>`*/
        return `<div class="header-with-close">
          <span>${getColLabel('computed_be_price')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const value = cell.getValue()
        return value === null || value === undefined ? '-' : formatNumber(value)
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Maintenance Margin Change',
      field: 'maintenance_margin_change',
      minWidth: 180,
      width: columnWidths.value['maintenance_margin_change'] || undefined,
      hozAlign: 'right',
      visible: visibleCols.value.includes('maintenance_margin_change'),
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('maintenance_margin_change')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const value = cell.getValue()
        if (value === null || value === undefined || value === '') return '-'
        // Parse string to number: remove commas and convert
        const numValue = parseFloat(value.replace(/,/g, ''))
        return formatCurrency(numValue)
      },
      contextMenu: createFetchedAtContextMenu()
    }
  ]
  allColumns.forEach(col => allColumnsMap.set(col.field, col))

  // --- Build columns array in the order of visibleCols ---
  const columns: any[] = visibleCols.value
    .map(field => allColumnsMap.get(field))
    .filter(Boolean)

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
    pagination: false,
    paginationSize: 100,
    paginationSizeSelector: [100, 200, 500],
    rowFormatter: (row: any) => {
      try {
        const data = row.getData()
        const element = row.getElement()
        
        // Handle thesis group rows
        if (data?._isThesisGroup && element) {
          element.style.backgroundColor = '#f8f9fa'
          element.style.fontWeight = 'bold'
          element.style.borderTop = '2px solid #dee2e6'
          return
        }

        // Handle position rows with attached trades
        if (!groupByThesis.value && data && !data._isThesisGroup) {
          const posKey = getPositionKey(data)
          const attachedTradeIds = positionTradesMap.value.get(posKey)
          const isExpanded = expandedPositions.value.has(posKey)
          
          if (isExpanded && attachedTradeIds && attachedTradeIds.size > 0) {
            // Get attached trades
            const attachedTrades = (tradesQuery.data.value || [])
              .filter(trade => trade.tradeID && attachedTradeIds.has(trade.tradeID))
            
            if (attachedTrades.length > 0) {
              // Create nested table container
              const holderEl = document.createElement('div')
              holderEl.style.boxSizing = 'border-box'
              holderEl.style.padding = '10px 30px'
              holderEl.style.borderTop = '1px solid #dee2e6'
              holderEl.style.borderBottom = '1px solid #dee2e6'
              holderEl.style.background = '#f8f9fa'

              // Create nested table
              const tableEl = document.createElement('div')
              holderEl.appendChild(tableEl)

              element.appendChild(holderEl)

              // Initialize nested Tabulator with columns matching Trades.vue
              const nestedTable = new Tabulator(tableEl, {
                data: attachedTrades,
                layout: 'fitDataStretch',
                initialSort: [
                  { column: 'tradeDate', dir: 'desc' }
                ],
                columns: [
                  {
                    title: 'Side',
                    field: 'buySell',
                    width: 80,
                    formatter: (cell: any) => {
                      const value = cell.getValue()
                      if (value === 'BUY') {
                        return `<span style="color: #28a745; font-weight: bold;">BUY</span>`
                      }
                      if (value === 'SELL') {
                        return `<span style="color: #dc3545; font-weight: bold;">SELL</span>`
                      }
                      return value
                    }
                  },
                  {
                    title: 'Open/Close',
                    field: 'openCloseIndicator',
                    width: 100,
                    formatter: (cell: any) => {
                      const value = cell.getValue()
                      if (value === 'O') {
                        return `<span style="color: #17a2b8; font-weight: bold;">OPEN</span>`
                      }
                      if (value === 'C') {
                        return `<span style="color: #6f42c1; font-weight: bold;">CLOSE</span>`
                      }
                      return value
                    }
                  },
                  {
                    title: 'Symbol',
                    field: 'symbol',
                    width: 150,
                    formatter: (cell: any) => {
                      const symbol = cell.getValue()
                      if (!symbol) return '<span style="color: #6c757d; font-style: italic;">N/A</span>'
                      
                      const tags = extractTagsFromTradesSymbol(symbol)
                      const selectedTags = symbolTagFilters.value
                      
                      return tags.map(tag => {
                        const isSelected = selectedTags.includes(tag)
                        return `<span class="fi-tag" data-tag="${tag}">${tag}</span>`
                      }).join(' ')
                    }
                  },
                  {
                    title: 'Asset Class',
                    field: 'assetCategory',
                    width: 120
                  },
                  {
                    title: 'Quantity',
                    field: 'quantity',
                    width: 100,
                    hozAlign: 'right',
                    formatter: (cell: any) => {
                      const row = cell.getRow().getData()
                      const q = parseFloat(row?.quantity || 0) || 0
                      const m = parseFloat(row?.multiplier || 1) || 1
                      const effective = q * m
                      return formatNumber(effective)
                    }
                  },
                  {
                    title: 'Price',
                    field: 'tradePrice',
                    width: 100,
                    hozAlign: 'right',
                    formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue()))
                  },
                  {
                    title: 'Trade Date',
                    field: 'tradeDate',
                    width: 120,
                    hozAlign: 'center',
                    formatter: (cell: any) => {
                      const val = cell.getValue()
                      if (!val) return ''
                      const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(String(val).trim())
                      let dt: Date
                      if (m) {
                        const day = Number(m[1])
                        const month = Number(m[2]) - 1
                        let year = Number(m[3])
                        if (year < 100) year += 2000
                        dt = new Date(year, month, day)
                      } else {
                        dt = new Date(val)
                        if (isNaN(dt.getTime())) return String(val)
                      }
                      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    }
                  },
                  {
                    title: 'Settle Date',
                    field: 'settleDateTarget',
                    width: 120,
                    hozAlign: 'center',
                    formatter: (cell: any) => {
                      const val = cell.getValue()
                      if (!val) return ''
                      const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(String(val).trim())
                      let dt: Date
                      if (m) {
                        const day = Number(m[1])
                        const month = Number(m[2]) - 1
                        let year = Number(m[3])
                        if (year < 100) year += 2000
                        dt = new Date(year, month, day)
                      } else {
                        dt = new Date(val)
                        if (isNaN(dt.getTime())) return String(val)
                      }
                      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    }
                  },
                  {
                    title: 'Total Premium',
                    field: 'tradeMoney',
                    width: 120,
                    hozAlign: 'right',
                    formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue() || '0'))
                  },
                  {
                    title: 'Net Cash',
                    field: 'netCash',
                    width: 120,
                    hozAlign: 'right',
                    formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue() || '0'))
                  },
                  {
                    title: 'Commission',
                    field: 'ibCommission',
                    width: 100,
                    hozAlign: 'right',
                    formatter: (cell: any) => {
                      return `<span style="color: #dc3545; font-weight: 600;">${formatCurrency(parseFloat(cell.getValue() || '0'))}</span>`
                    }
                  },
                  {
                    title: 'FIFO Realized',
                    field: 'fifoPnlRealized',
                    width: 120,
                    hozAlign: 'right',
                    formatter: (cell: any) => {
                      const value = parseFloat(cell.getValue() || '0')
                      let className = ''
                      if (value > 0) className = 'pnl-positive'
                      else if (value < 0) className = 'pnl-negative'
                      else className = 'pnl-zero'
                      return `<span class="${className}" style="font-weight: 600;">${formatCurrency(value)}</span>`
                    }
                  },
                  {
                    title: 'MTM PnL',
                    field: 'mtmPnl',
                    width: 100,
                    hozAlign: 'right',
                    formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue() || '0'))
                  },
                  {
                    title: 'Close Price',
                    field: 'closePrice',
                    width: 100,
                    hozAlign: 'right',
                    formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue() || '0'))
                  },
                  {
                    title: 'Trade ID',
                    field: 'tradeID',
                    width: 150,
                    formatter: (cell: any) => {
                      return `<span style="font-size: 0.75rem; color: #6c757d;">${cell.getValue()}</span>`
                    }
                  }
                ]
              })
            }
          }
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
    },
    sortChanged: (sorters: any[]) => {
      if (sorters && sorters.length > 0) {
        const { field, dir } = sorters[0]
        writeSortToUrl(field, dir)
      } else {
        const url = new URL(window.location.href)
        url.searchParams.delete(`${windowId}_positions_sort`)
        window.history.replaceState({}, '', url.toString())
      }
    },
    movableColumns: true
  }

  const sortFromUrl = parseSortFromUrl()
  if (sortFromUrl) {
    tabulatorConfig.initialSort = [
      { column: sortFromUrl.field, dir: sortFromUrl.dir }
    ]
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

    // Add event listener for column width persistence
    tabulator.on('columnResized', (column: any) => {
      const field = column.getField()
      const width = column.getWidth()
      columnWidths.value[field] = width
      writeColumnWidthsToUrl(columnWidths.value)
      /*if (field === 'computed_be_price') {
        const newTitle = width >= 140 ? 'Break even price' : 'BE Price'
        column.updateDefinition({
          titleFormatter: (cell: any) => {
            return `<div class="header-with-close">
              <span>${newTitle}</span>
              <button class="header-close-btn" data-field="computed_be_price" title="Hide column">✕</button>
            </div>`
          }
        })
        tabulator.redraw(true)
      }*/
    })

    // Add event listener for header close buttons
    tabulator.on('tableBuilt', () => {
      const headers = tableDiv.value?.querySelectorAll('.header-close-btn')
      headers?.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          const field = (e.target as HTMLElement).getAttribute('data-field') as ColumnField
          if (field) {
            hideColumnFromHeader(field)
          }
        })
      })

      const column = tabulator.getColumn('computed_be_price')
      if (column) {
        const width = column.getWidth()
        column.updateDefinition({
          title: width >= 140 ? 'Break even price' : 'BE Price'
        })
        tabulator.redraw(true)
      }

      const renameBtns = tableDiv.value?.querySelectorAll('.header-rename-btn')
      renameBtns?.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          const field = (e.target as HTMLElement).getAttribute('data-field') as ColumnField
          if (field) {
            const opt = allColumnOptions.find(c => c.field === field)
            openColRenameDialog(field, columnRenames.value[field] || (opt?.label ?? field))
          }
        })
      })

      const headersCell = tableDiv.value?.querySelectorAll('.tabulator-col');
      headersCell?.forEach(header => {
        header.addEventListener('click', (e: any) => {
          // Find sorted column
          const sortedCol = tabulator.getSorters()[0];
          if (sortedCol) {
            writeSortToUrl(sortedCol.field, sortedCol.dir);
          }
        });
      });

      updateFilteredPositionsCount()
    })

    tabulator.on('dataFiltered', function() {
      updateFilteredPositionsCount()
    })

    isTabulatorReady.value = true
    setTimeout(() => {
      updateFilters()
      toggleBottomCalc()
      updateFilteredPositionsCount()
    }, 50)
  } catch (error) {
    console.error('Error creating Tabulator:', error)
  }
}

// Update data
const gridRowData = computed(() => {
  if (!groupByThesis.value) {
    // Return positions WITHOUT _children - we'll use rowFormatter for nested tables
    return sourcePositions.value
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
  // --- END ---

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
      tabulator.replaceData(gridRowData.value) 
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

        // Asset class filter
        if (assetClassFilter.value) {
          if (data.asset_class !== assetClassFilter.value) return false
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
      updateFilteredPositionsCount()
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
  if (assetClassFilter.value) {
    next.push({ field: 'asset_class', value: assetClassFilter.value })
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
    url.searchParams.delete(`${windowId}_all_cts_clientId`)
    window.history.replaceState({}, '', url.toString())
    // --- ADD THIS ---
    if (eventBus) {
      eventBus.emit('account-filter-changed', {
        accountId: null,
        source: 'positions'
      })
    }
    // --- END ---
  } else if (field === 'asset_class') {
    assetClassFilter.value = null
  }
  updateFilters()
}

function clearAllFilters() {
  symbolTagFilters.value = []
  thesisTagFilters.value = []
  accountFilter.value = null
  assetClassFilter.value = null 

  const url = new URL(window.location.href)
  url.searchParams.delete(`${windowId}_all_cts_clientId`)
  url.searchParams.delete(`${windowId}_all_cts_fi`)
  url.searchParams.delete(`${windowId}_all_cts_thesis`)
  url.searchParams.delete(`${windowId}_fac`)
  
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

// Margin Impact Modal
const showMarginImpactModal = ref(false)
const marginImpactRowData = ref<any>(null)
const marginImpactData = ref<any>(null)
const marginImpactLoading = ref(false)
const marginImpactError = ref<string | null>(null)

async function openMarginImpactModal(rowData: any) {
  marginImpactRowData.value = rowData
  showMarginImpactModal.value = true
  marginImpactData.value = null
  marginImpactError.value = null
  marginImpactLoading.value = true

  try {
    const internalAccountId = rowData.internal_account_id
    const conid = rowData.conid
    const quantity = Math.abs(rowData.qty)
    const side = rowData.qty > 0 ? 'SELL' : 'BUY'

    // Fetch account details from user_accounts_master
    const { data: accountData, error: accountError } = await supabase
      .schema('hf')
      .from('user_accounts_master')
      .select('broker_account_id, api_url')
      .eq('internal_account_id', internalAccountId)
      .single()

    if (accountError || !accountData) {
      throw new Error(`Account not found: ${accountError?.message || 'No account data'}`)
    }

    const brokerAccountId = accountData.broker_account_id
    const apiUrl = accountData.api_url

    const url = `${apiUrl}/api/margin-impact?conid=${conid}&side=${side}&quantity=${quantity}&account_id=${brokerAccountId}`

    //console.log('Fetching margin impact from URL:', url); return;
    const response = await fetch(url)
    const data = await response.json()

    marginImpactData.value = data
  } catch (error: any) {
    marginImpactError.value = error.message
  } finally {
    marginImpactLoading.value = false
  }
}function closeMarginImpactModal() {
  showMarginImpactModal.value = false
  marginImpactRowData.value = null
  marginImpactData.value = null
  marginImpactError.value = null
}

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

// Add state for trade attachment
const showTradeAttachModal = ref(false)
const selectedPositionForTrades = ref<Position | null>(null)
const tradeSearchQuery = ref('')
const selectedTradeIds = ref<Set<string>>(new Set())

// Query trades
const tradesQuery = useTradesQuery(props.accountId, props.userId)

// Computed filtered trades for modal
const filteredTrades = computed(() => {
  if (!tradesQuery.data.value) return []
  
  const query = tradeSearchQuery.value.toLowerCase().trim()
  if (!query) return tradesQuery.data.value
  
  // Split by comma and clean up each term
  const searchTerms = query.split(',').map(term => term.trim()).filter(Boolean)
  
  return tradesQuery.data.value.filter(trade => {
    // Check if ALL search terms match (AND logic)
    return searchTerms.every(term => {
      return (
        trade.symbol.toLowerCase().includes(term) ||
        trade.assetCategory.toLowerCase().includes(term) ||
        trade.buySell.toLowerCase().includes(term) ||
        trade.tradeDate.includes(term) ||
        (trade.description && trade.description.toLowerCase().includes(term)) ||
        (trade.tradeID && trade.tradeID.toLowerCase().includes(term))
      )
    })
  })
})

// Replace localStorage-based position trades map with Supabase query
const positionTradeMappingsQuery = usePositionTradeMappingsQuery(props.userId)

// Create computed ref for the mappings
const positionTradesMap = computed(() => {
  return positionTradeMappingsQuery.data.value || new Map<string, Set<string>>()
})

// Generate unique key for position
function getPositionKey(position: Position): string {
  return generatePositionMappingKey({
    internal_account_id: position.internal_account_id,
    symbol: position.symbol,
    qty: position.qty,
    asset_class: position.asset_class,
    conid: position.conid
  })
}

// Open trade attach modal
function openTradeAttachModal(position: Position) {
  selectedPositionForTrades.value = position
  tradeSearchQuery.value = ''
  
  // Load currently attached trades
  const posKey = getPositionKey(position)
  selectedTradeIds.value = new Set(positionTradesMap.value.get(posKey) || [])
  
  showTradeAttachModal.value = true
}

// Toggle trade selection
function toggleTradeSelection(tradeId: string) {
  if (selectedTradeIds.value.has(tradeId)) {
    selectedTradeIds.value.delete(tradeId)
  } else {
    selectedTradeIds.value.add(tradeId)
  }
}

const isSavingTrades = ref(false)
// Save attached trades
async function saveAttachedTrades() {
  if (!selectedPositionForTrades.value || !props.userId) return
  
  if (isSavingTrades.value) {
    console.log('⚠️ Save already in progress, skipping...')
    return
  }

  const posKey = getPositionKey(selectedPositionForTrades.value)
  
  try {
    // Save to Supabase
    await savePositionTradeMappings(
      supabase,
      props.userId,
      posKey,
      selectedTradeIds.value
    )
    
    // Invalidate and refetch the mappings query
    await queryClient.invalidateQueries({ queryKey: ['positionTradeMappings'] })
    await positionTradeMappingsQuery.refetch()
    
    showTradeAttachModal.value = false
    
    // Refresh table data
    initializeTabulator()
    
    showToast('success', 'Trades Attached', `${selectedTradeIds.value.size} trade(s) attached to position`)
  } catch (error: any) {
    console.error('Error saving trade mappings:', error)
    showToast('error', 'Failed to Save', error.message)
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

watch(assetClassFilter, () => {
  writeFiltersToUrl()
  updateFilters()
  if (tabulator) tabulator.redraw(true)
})

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
  url.searchParams.set(`${windowId}_position_cols`, cols.join('-and-'))
  window.history.replaceState({}, '', url.toString())
}

// Add URL synchronization for filters
function parseFiltersFromUrl(): { symbol?: string; asset_class?: string; legal_entity?: string; thesis?: string } {
  const url = new URL(window.location.href)
  const symbolParam = url.searchParams.get(`${windowId}_all_cts_fi`)
  const symbol = symbolParam ? symbolParam.split('-and-').join(',') : undefined
  const asset = url.searchParams.get(`${windowId}_fac`) || undefined
  const account = url.searchParams.get(`${windowId}_all_cts_clientId`) || undefined
  const thesisParam = url.searchParams.get(`${windowId}_all_cts_thesis`)
  const thesis = thesisParam ? thesisParam.split('-and-').join(',') : undefined
  return { symbol, asset_class: asset, legal_entity: account, thesis }
}

function writeFiltersToUrl() {
  const url = new URL(window.location.href)
  
  // Handle symbol filters
  if (symbolTagFilters.value.length > 0) {
    url.searchParams.set(`${windowId}_all_cts_fi`, symbolTagFilters.value.join('-and-'))
  } else {
    url.searchParams.delete(`${windowId}_all_cts_fi`)
  }
  
  // Handle thesis filters
  if (thesisTagFilters.value.length > 0) {
    url.searchParams.set(`${windowId}_all_cts_thesis`, thesisTagFilters.value.join('-and-'))
  } else {
    url.searchParams.delete(`${windowId}_all_cts_thesis`)
  }

  // --- ADD THIS BLOCK ---
  if (assetClassFilter.value) {
    url.searchParams.set(`${windowId}_fac`, assetClassFilter.value)
  } else {
    url.searchParams.delete(`${windowId}_fac`)
  }
  // --- END ---

  window.history.replaceState({}, '', url.toString())
}

// Add URL synchronization for group by thesis
function parseGroupByThesisFromUrl(): boolean {
  const url = new URL(window.location.href)
  return url.searchParams.get(`${windowId}_group_by_thesis`) === 'true'
}

function writeGroupByThesisToUrl(isGrouped: boolean) {
  const url = new URL(window.location.href)
  if (isGrouped) {
    url.searchParams.set(`${windowId}_group_by_thesis`, 'true')
  } else {
    url.searchParams.delete(`${windowId}_group_by_thesis`)
  }
  window.history.replaceState({}, '', url.toString())
}

// Initialize group by thesis from URL
//const groupByThesis = ref(parseGroupByThesisFromUrl())

// Lifecycle
const eventBus = inject<any>('eventBus')
const appName = ref('Positions')
const showAppNameDialog = ref(false)
const appNameInput = ref('')

function parseAppNameFromUrl(): string {
  const url = new URL(window.location.href)
  return url.searchParams.get(`${windowId}_positions_app_name`) || 'Positions'
}

function writeAppNameToUrl(name: string) {
  const url = new URL(window.location.href)
  if (name && name.trim() && name !== 'Positions') {
    url.searchParams.set(`${windowId}_positions_app_name`, name.trim())
  } else {
    url.searchParams.delete(`${windowId}_positions_app_name`)
  }
  window.history.replaceState({}, '', url.toString())
}

function openAppNameDialog() {
  appNameInput.value = appName.value
  showAppNameDialog.value = true
}

function saveAppName() {
  appName.value = appNameInput.value.trim() || 'Positions'
  writeAppNameToUrl(appName.value)
  showAppNameDialog.value = false
}

function handleEscKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (showTradeAttachModal.value) {
      showTradeAttachModal.value = false
    }
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscKey)
  appName.value = parseAppNameFromUrl()

  console.log('📍 [Positions] Mounted component, initializing filters from URL', props)
  // Initialize filters from URL
  const filters = parseFiltersFromUrl()
  if (filters.symbol) symbolTagFilters.value = filters.symbol.split(',').map(s => s.trim())
  if (filters.thesis) thesisTagFilters.value = filters.thesis.split(',').map(s => s.trim())
  if (filters.legal_entity) accountFilter.value = filters.legal_entity

  // --- ADD THIS LINE ---
  if (filters.asset_class) assetClassFilter.value = filters.asset_class
  // --- END ---

  columnRenames.value = parseColumnRenamesFromUrl()

  groupByThesis.value = parseGroupByThesisFromUrl()

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
    eventBus.on('symbol-filter-changed', handleExternalSymbolFilter)
  }

  nextTick(() => {
    updateFilteredPositionsCount()
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscKey)
  if (tabulator) {
    tabulator.destroy()
  }
  if (eventBus) {
    eventBus.off('account-filter-changed', handleExternalAccountFilter)
    eventBus.off('symbol-filter-changed', handleExternalSymbolFilter)
  }
})

function handleExternalAccountFilter(payload: { accountId: string | null, source: string }) {
  console.log('📍 [Positions] Received account filter:', payload)
  if (payload.source === 'positions') return

  // Apply or clear the filter
  accountFilter.value = payload.accountId
  const url = new URL(window.location.href)
  if (payload.accountId) {
    url.searchParams.set(`${windowId}_all_cts_clientId`, payload.accountId)
  } else {
    url.searchParams.delete(`${windowId}_all_cts_clientId`)
  }
  window.history.replaceState({}, '', url.toString())
  updateFilters()
}

function handleExternalSymbolFilter(payload: { symbolTags: string[], source: string }) {
  console.log('📍 [Positions] Received symbol filter:', payload)
  if (payload.source === 'positions') return

  // Apply the symbol filter
  symbolTagFilters.value = payload.symbolTags
  const url = new URL(window.location.href)
  if (payload.symbolTags.length > 0) {
    url.searchParams.set(`${windowId}_all_cts_fi`, payload.symbolTags.join('-and-'))
  } else {
    url.searchParams.delete(`${windowId}_all_cts_fi`)
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
    
    // Emit event to other components
    if (eventBus) {
      eventBus.emit('symbol-filter-changed', {
        symbolTags: symbolTagFilters.value,
        source: 'positions'
      })
    }
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
    url.searchParams.set(`${windowId}_all_cts_clientId`, accountId)
    window.history.replaceState({}, '', url.toString())

    updateFilters() // <-- Only call updateFilters, don't set Tabulator filter directly

    if (eventBus) {
      eventBus.emit('account-filter-changed', {
        accountId,
        source: 'positions'
      })
    }
    return
  } else if (field === 'asset_class') {
    const assetClass = String(value)
    assetClassFilter.value = assetClass
    updateFilters()
    return
  }
}

const dragIndex = ref<number | null>(null)

function handleDragStart(index: number) {
  dragIndex.value = index
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) return
  const cols = [...visibleCols.value]
  const [moved] = cols.splice(dragIndex.value, 1)
  cols.splice(index, 0, moved)
  visibleCols.value = cols
  dragIndex.value = null
}
function moveColumnUp(idx: number) {
  if (idx <= 0) return
  const cols = [...visibleCols.value]
  ;[cols[idx - 1], cols[idx]] = [cols[idx], cols[idx - 1]]
  visibleCols.value = cols
}
function moveColumnDown(idx: number) {
  if (idx >= visibleCols.value.length - 1) return
  const cols = [...visibleCols.value]
  ;[cols[idx], cols[idx + 1]] = [cols[idx + 1], cols[idx]]
  visibleCols.value = cols
}

//const accountFilter = ref<string | null>(null)
//const assetClassFilter = ref<string | null>(null)

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

  columnRenames.value = parseColumnRenamesFromUrl()
  updateFilters()
  const sortFromUrl = parseSortFromUrl()
  if (tabulator && sortFromUrl) {
    tabulator.setSort(sortFromUrl.field, sortFromUrl.dir)
  }

  appName.value = parseAppNameFromUrl()
})

// --- In initializeTabulator(), update column titles and add rename button ---
function getColLabel(field: ColumnField) {
  const opt = allColumnOptions.find(c => c.field === field)
  return columnRenames.value[field] || (opt?.label ?? field)
}

const showRenameDialog = ref(false)
const renameAccountId = ref<string | null>(null)
const renameAccountCurrent = ref<string>('')
const renameAccountValue = ref<string>('')

function openRenameAccountDialog(accountId: string, currentName: string) {
  renameAccountId.value = accountId
  renameAccountCurrent.value = currentName
  renameAccountValue.value = currentName
  showRenameDialog.value = true

  console.log('Opening rename dialog for account:', accountId, 'current name:', currentName)
}

async function saveAccountAlias() {
  console.log('Saving account alias:', props.userId, 'for account ID:', renameAccountId.value)
  if (!props.userId || !renameAccountId.value) return
  try {
    const { error } = await supabase
      .schema('hf')
      .from('user_account_alias')
      .upsert({
        user_id: props.userId,
        internal_account_id: renameAccountId.value,
        alias: renameAccountValue.value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,internal_account_id' })
    if (error) throw error
    showRenameDialog.value = false
    await queryClient.invalidateQueries({ queryKey: ['positions'] })
    showToast('success', 'Account renamed', `Account name updated to "${renameAccountValue.value}"`)
  } catch (err: any) {
    showToast('error', 'Rename failed', err.message)
  }
}

const filteredPositionsCount = ref(0)

function updateFilteredPositionsCount() {
  if (!tabulator) {
    filteredPositionsCount.value = 0
    return
  }

  const filteredRows = tabulator.rowManager.getDisplayRows().filter(row => row.type === "row")
  filteredPositionsCount.value = filteredRows.length
}

// Screenshot functionality
const showScreenshotsModal = ref(false)
const screenshots = ref<any[]>([])
const previewScreenshot = ref<any | null>(null)
const screenshotsLoading = ref(false)
const takingScreenshot = ref(false)
const showScreenshotNameModal = ref(false)
const screenshotName = ref('')
const showScreenshotRenameModal = ref(false)
const screenshotRenameValue = ref('')
const screenshotRenameId = ref<number | null>(null)

// Open name modal
function promptScreenshotName() {
  screenshotName.value = ''
  showScreenshotNameModal.value = true
}

// Actual screenshot save (called after user confirms name)
async function takeScreenshotConfirmed() {
  if (!tableDiv.value) {
    showScreenshotNameModal.value = false
    return
  }
  showScreenshotNameModal.value = false
  takingScreenshot.value = true
  try {
    const canvas = await html2canvas(tableDiv.value)
    const base64 = canvas.toDataURL('image/png')

    const { error } = await supabase
      .schema('hf')
      .from('position_screenshots')
      .insert([{
        user_id: props.userId,
        created_at: new Date().toISOString(),
        image_data: base64.replace(/^data:image\/png;base64,/, ''),
        name: screenshotName.value ? screenshotName.value.trim() : null,
        archived: false,
        meta: {
          filters: {
            account: accountFilter.value,
            assetClass: assetClassFilter.value,
            symbolTags: symbolTagFilters.value,
            thesisTags: thesisTagFilters.value,
            columns: visibleCols.value
          }
        }
      }])
    if (error) throw error

    showToast('success', 'Screenshot saved!')
    fetchScreenshots()
  } catch (err: any) {
    showToast('error', 'Screenshot failed', err.message)
  } finally {
    takingScreenshot.value = false
  }
}

// Mark screenshot archived (soft-delete)
async function archiveScreenshot(id: number) {
  try {
    const { error } = await supabase
      .schema('hf')
      .from('position_screenshots')
      .update({ archived: true })
      .eq('id', id)
    if (error) throw error
    showToast('success', 'Screenshot archived')
    fetchScreenshots()
  } catch (err: any) {
    showToast('error', 'Archive failed', err.message)
  }
}

// Update fetchScreenshots to ignore archived items
async function fetchScreenshots() {
  if (!props.userId) {
    screenshots.value = []
    return
  }
  screenshotsLoading.value = true
  const { data, error } = await supabase
    .schema('hf')
    .from('position_screenshots')
    .select('*')
    .eq('user_id', props.userId)
    .eq('archived', false)             // <-- only non-archived
    .order('created_at', { ascending: false })
    .limit(20)
  if (!error) screenshots.value = data || []
  screenshotsLoading.value = false
}

function openScreenshotRenameModal(shot: any) {
  screenshotRenameId.value = shot.id
  screenshotRenameValue.value = shot.name || ''
  showScreenshotRenameModal.value = true
}

async function saveScreenshotRename() {
  if (!screenshotRenameId.value) return
  try {
    const { error } = await supabase
      .schema('hf')
      .from('position_screenshots')
      .update({ name: screenshotRenameValue.value })
      .eq('id', screenshotRenameId.value)
    if (error) throw error
    showScreenshotRenameModal.value = false
    showToast('success', 'Screenshot renamed')
    fetchScreenshots()
  } catch (err: any) {
    showToast('error', 'Rename failed', err.message)
  }
}

function formatTradeDate(dateStr: string): string {
  if (!dateStr) return ''
  
  // Check if it's in DD/MM/YYYY format (day first)
  const ddmmyyyyMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(String(dateStr).trim())
  let dt: Date
  
  if (ddmmyyyyMatch) {
    const day = parseInt(ddmmyyyyMatch[1])      // First number is day
    const month = parseInt(ddmmyyyyMatch[2]) - 1 // Second number is month (0-indexed)
    let year = parseInt(ddmmyyyyMatch[3])
    if (year < 100) {
      year = 2000 + year
    }
    dt = new Date(year, month, day)
  } else {
    // Try parsing as ISO date or other format
    dt = new Date(dateStr)
    if (isNaN(dt.getTime())) return String(dateStr)
  }
  
  // Format as DD-MMM-YYYY (e.g., 31-OCT-2025)
  const day = dt.getDate().toString().padStart(2, '0')
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const month = monthNames[dt.getMonth()]
  const year = dt.getFullYear()
  
  return `${day}-${month}-${year}`
}

watch(showScreenshotsModal, (open) => {
  if (open) fetchScreenshots()
})

watch(asOfDate, () => {
  if (q.refetch) q.refetch()
})

watch(expandedPositions, () => {
  if (tabulator) {
    tabulator.redraw(true)
  }
}, { deep: true })
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
          <span v-if="showHeaderLink" class="positions-link" @click="handleHeaderClick">{{ appName }}</span>
          <span v-else>{{ appName }}</span>
          <button
            class="appname-rename-btn"
            @click="openAppNameDialog"
            title="Rename app"
            style="width:auto;padding: 2px 7px; font-size: 13px; background: none; border: none; color: #888; cursor: pointer;"
          >✎</button>
        </h2>
        <div class="positions-date-picker">
          <label for="asOfDate">As of:</label>
          <input
            id="asOfDate"
            type="date"
            v-model="asOfDate"
            :max="today"
            style="margin-left: 0.5em;"
          />
          <button v-if="asOfDate" @click="clearAsOfDate" style="margin-left: 0.5em;">Clear</button>
          <span v-if="q.isFetching.value" style="margin-left: 0.7em; color: #888;">Loading...</span>
        </div>
        <div class="positions-tools">
          <div class="positions-count">{{ filteredPositionsCount }} positions</div>
          
          <button @click="promptScreenshotName" class="screenshot-btn" title="Take Screenshot" :disabled="takingScreenshot">
            <span v-if="takingScreenshot" class="screenshot-spinner"></span>
            <span v-else>📸</span>
          </button>
          <button @click="showScreenshotsModal = true" class="screenshot-btn" title="See Old Screenshots">🖼️</button>
          
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
          
          <button
              @click="emit('maximize')"
              class="minimize-button"
              title="Maximize"
            >
            ⤢
          </button>
          <button @click="emit('minimize')" class="minimize-button" title="Close">
            X
          </button>
          
          <div v-if="showColumnsPopup" ref="columnsPopupRef" class="columns-popup" @click.stop>
            <div class="popup-header">Columns</div>
            <div class="popup-list">
              <label
                v-for="(opt, idx) in visibleCols.map(f => allColumnOptions.find(c => c.field === f)).filter(Boolean)"
                :key="opt.field"
                class="popup-item"
                draggable="true"
                @dragstart="handleDragStart(idx)"
                @dragover="handleDragOver"
                @drop="handleDrop(idx)"
                style="align-items: center;"
              >
                <input type="checkbox" :value="opt.field" v-model="visibleCols" />
                <span>
                  {{ columnRenames[opt.field] || opt.label }}
                  <span v-if="columnRenames[opt.field]" style="font-size: 11px; color: #888; font-style: italic; display: inline-block;">
                    ({{ opt.label }})
                  </span>
                </span>
                <button
                  class="col-rename-btn"
                  type="button"
                  @click.stop="openColRenameDialog(opt.field, columnRenames[opt.field] || opt.label)"
                  title="Rename column"
                  style="margin-left: 6px; font-size: 13px; background: none; border: none; color: #888; cursor: pointer;"
                >✎</button>
                <span class="move-icons" style="display: flex; flex-direction: column; margin-left: 8px;">
                  <button
                    type="button"
                    @click.stop="moveColumnUp(idx)"
                    :disabled="idx === 0"
                    title="Move up"
                    style="background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 2px;"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    @click.stop="moveColumnDown(idx)"
                    :disabled="idx === visibleCols.length - 1"
                    title="Move down"
                    style="background: none; border: none; cursor: pointer; padding: 0;"
                  >
                    ▼
                  </button>
                </span>
              </label>
              <!-- Show unchecked columns at the end -->
              <label
                v-for="opt in allColumnOptions.filter(c => !visibleCols.includes(c.field))"
                :key="opt.field"
                class="popup-item"
              >
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

    <div v-if="showRenameDialog" class="rename-dialog-backdrop">
      <div class="rename-dialog">
        <h3>Rename Account</h3>
        <input v-model="renameAccountValue" :placeholder="renameAccountCurrent" />
        <div class="dialog-actions">
          <button @click="saveAccountAlias">Save</button>
          <button @click="showRenameDialog = false">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showColRenameDialog" class="rename-dialog-backdrop">
      <div class="rename-dialog">
        <h3>Rename Column</h3>
        <input v-model="colRenameValue" placeholder="Column name" />
        <div class="dialog-actions">
          <button @click="saveColRename">Save</button>
          <button @click="cancelColRename">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Modal for old screenshots -->
    <div v-if="showScreenshotsModal" class="screenshots-modal">
      <div class="modal-content">
        <h3 class="screenshots-title">Past Screenshots</h3>
        <div v-if="screenshotsLoading" class="screenshots-loading">Loading screenshots...</div>
        <div v-else-if="screenshots.length === 0" class="screenshots-empty">No screenshots yet.</div>
        <div v-else class="screenshots-list-vertical">
          <div
            v-for="shot in screenshots"
            :key="shot.id"
            class="screenshot-list-item"
            @click="previewScreenshot = shot"
          >
            <img
              :src="`data:image/png;base64,${shot.image_data}`"
              class="screenshot-thumb"
              :alt="`Screenshot taken at ${new Date(shot.created_at).toLocaleString()}`"
            />
            <div class="screenshot-list-meta">
              <strong v-if="shot.name">{{ shot.name }}</strong>
              <span v-else style="color:#666; font-style:italic; display:block;">(Unnamed)</span>
              <span>
                {{
                  new Date(shot.created_at).toLocaleString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })
                }}
                <span style="color:#888; font-size:12px;">PST</span>
              </span>
              <div style="display:flex; gap:8px; margin-top:6px;">
                <a
                  :href="`data:image/png;base64,${shot.image_data}`"
                  :download="`positions-screenshot-${shot.id}.png`"
                  class="screenshot-download-link"
                  @click.stop
                >⬇️</a>
                <button class="screenshot-archive-btn" @click.stop="archiveScreenshot(shot.id)" title="Archive screenshot" style="background:none;border:1px solid #e9ecef;padding:4px 8px;border-radius:6px;cursor:pointer;">
                  🗄️
                </button>
                <button class="screenshot-rename-btn" @click.stop="openScreenshotRenameModal(shot)" title="Rename screenshot" style="background:none;border:1px solid #e9ecef;padding:4px 8px;border-radius:6px;cursor:pointer;">
                  ✏️
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button @click="showScreenshotsModal = false" class="screenshots-close">Close</button>
        </div>
      </div>
      <!-- Image preview modal -->
      <div v-if="previewScreenshot" class="screenshot-preview-modal" @click.self="previewScreenshot = null">
        <div class="screenshot-preview-content">
          <img :src="`data:image/png;base64,${previewScreenshot.image_data}`" class="screenshot-full-img" />
          <div class="screenshot-preview-meta">
            <span>
              {{
                new Date(previewScreenshot.created_at).toLocaleString('en-US', {
                  timeZone: 'America/Los_Angeles',
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })
              }}
              <span style="color:#888; font-size:12px;">PST</span>
            </span>
            <a
              :href="`data:image/png;base64,${previewScreenshot.image_data}`"
              :download="`positions-screenshot-${previewScreenshot.id}.png`"
              class="screenshot-download-link"
            >⬇️ Download</a>
            <button @click="previewScreenshot = null" class="screenshot-preview-close">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showScreenshotNameModal" class="rename-dialog-backdrop">
      <div class="rename-dialog">
        <h3>Name screenshot</h3>
        <input v-model="screenshotName" placeholder="Enter a name (optional)" />
        <div class="dialog-actions" style="justify-content:flex-start;">
          <button @click="takeScreenshotConfirmed">Save & Capture</button>
          <button @click="showScreenshotNameModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="showScreenshotRenameModal" class="rename-dialog-backdrop">
      <div class="rename-dialog">
        <h3>Rename Screenshot</h3>
        <input v-model="screenshotRenameValue" placeholder="Enter new name" />
        <div class="dialog-actions">
          <button @click="saveScreenshotRename">Save</button>
          <button @click="showScreenshotRenameModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Margin Impact Modal -->
  <div v-if="showMarginImpactModal" class="modal-overlay" @click="closeMarginImpactModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Margin Impact</h3>
        <button class="modal-close" @click="closeMarginImpactModal">&times;</button>
      </div>
      <div class="modal-body">
        <p>Closing out this position would have the following impact on your margin requirements:</p>
        
        <div v-if="marginImpactLoading" class="loading-state">
          <div class="loading-spinner"></div>
          Loading margin impact data...
        </div>
        
        <div v-else-if="marginImpactError" class="error-state">
          Error loading margin impact: {{ marginImpactError }}
        </div>
        
        <div v-else-if="!marginImpactData" class="no-data-state">
          No margin impact data available
        </div>
        
        <div v-else>
          <table class="margin-impact-table">
            <thead>
              <tr>
                <th>Account Metric</th>
                <th>Current</th>
                <th>Change</th>
                <th>Post-Trade</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="marginImpactData.margin_impact?.equity_with_loan">
                <td>Equity with Loan</td>
                <td>{{ marginImpactData.margin_impact.equity_with_loan.current }}</td>
                <td>{{ marginImpactData.margin_impact.equity_with_loan.change }}</td>
                <td>{{ marginImpactData.margin_impact.equity_with_loan.post_trade }}</td>
              </tr>
              <tr v-if="marginImpactData.margin_impact?.initial_margin">
                <td>Initial Margin</td>
                <td>{{ marginImpactData.margin_impact.initial_margin.current }}</td>
                <td>{{ marginImpactData.margin_impact.initial_margin.change }}</td>
                <td>{{ marginImpactData.margin_impact.initial_margin.post_trade }}</td>
              </tr>
              <tr v-if="marginImpactData.margin_impact?.maintenance_margin">
                <td>Maintenance Margin</td>
                <td>{{ marginImpactData.margin_impact.maintenance_margin.current }}</td>
                <td>{{ marginImpactData.margin_impact.maintenance_margin.change }}</td>
                <td>{{ marginImpactData.margin_impact.maintenance_margin.post_trade }}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- <div v-if="marginImpactData.cost_info" class="cost-info-section">
            <h4>Cost Information</h4>
            <div class="cost-details">
              <div class="cost-item">
                <span class="cost-label">Amount:</span>
                <span class="cost-value">{{ marginImpactData.cost_info.amount }}</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">Commission:</span>
                <span class="cost-value">{{ marginImpactData.cost_info.commission }}</span>
              </div>
              <div class="cost-item">
                <span class="cost-label">Total:</span>
                <span class="cost-value">{{ marginImpactData.cost_info.total }}</span>
              </div>
            </div>
          </div> -->
          
          <!-- div v-if="marginImpactData.warnings && marginImpactData.warnings.length" class="warnings-section">
            <h4>Warnings</h4>
            <ul class="warnings-list">
              <li v-for="warning in marginImpactData.warnings" :key="warning" class="warning-item">
                {{ warning }}
              </li>
            </ul>
          </div -->
        </div>
      </div>
    </div>
  </div>
  <div v-if="showAppNameDialog" class="rename-dialog-backdrop">
    <div class="rename-dialog">
      <h3>Rename App</h3>
      <input v-model="appNameInput" placeholder="App name" />
      <div class="dialog-actions">
        <button @click="saveAppName">Save</button>
        <button @click="showAppNameDialog = false">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Trade Attachment Modal -->
  <div v-if="showTradeAttachModal" class="modal-overlay" @click="showTradeAttachModal = false">
    <div class="modal-content trade-attach-modal" @click.stop>
      <div class="modal-header">
        <h3>Attach Trades to Position</h3>
        <button class="modal-close" @click="showTradeAttachModal = false">&times;</button>
      </div>
      
      <div class="modal-body">
        <div v-if="selectedPositionForTrades" class="position-info">
          <strong>Position: </strong> 
          <span v-for="tag in extractTagsFromSymbol(selectedPositionForTrades.symbol)" :key="tag" class="fi-tag position-tag">
            {{ tag }}
          </span>
           •
          (Qty: {{ selectedPositionForTrades.qty }} . Avg price: {{ formatCurrency(selectedPositionForTrades.avgPrice) }})
        </div>
        
        <div class="trade-search">
          <input 
            v-model="tradeSearchQuery" 
            type="text" 
            placeholder="Search trades (e.g., 'META, BUY' or 'OPT, 31-OCT-2025')..."
            class="search-input"
          />
          <div class="search-hint">
            💡 Use commas to search multiple terms. All terms must match.
          </div>
        </div>
        
        <div v-if="tradesQuery.isLoading.value" class="loading-state">
          <div class="loading-spinner"></div>
          Loading trades...
        </div>
        
        <div v-else-if="tradesQuery.isError.value" class="error-state">
          Error loading trades
        </div>
        
        <div v-else class="trades-list">
          <div 
            v-for="trade in filteredTrades" 
            :key="trade.tradeID || trade.id"
            class="trade-item"
            :class="{ selected: trade.tradeID && selectedTradeIds.has(trade.tradeID) }"
            @click="trade.tradeID && toggleTradeSelection(trade.tradeID)"
          >
            <input 
              v-if="trade.tradeID"
              type="checkbox" 
              :checked="selectedTradeIds.has(trade.tradeID)"
              @click.stop="toggleTradeSelection(trade.tradeID)"
            />
            <span v-else style="color: #dc3545; font-size: 0.75rem;">⚠️</span>
            <div class="trade-details">
              <div class="trade-primary">
                <strong>
                  <span v-for="tag in extractTagsFromTradesSymbol(trade.symbol)" :key="tag" class="fi-tag position-tag">
                    {{ tag }}
                  </span>
                </strong>
                <span class="trade-side" :class="trade.buySell.toLowerCase()">
                  {{ trade.buySell }}
                </span>
                <span>Qty: {{ trade.quantity }} . Avg price: {{ formatCurrency(parseFloat(trade.tradePrice)) }}</span>
                <span v-if="trade.tradeID" style="color: #6c757d; font-size: 0.75rem; margin-left: 0.5rem;">
                  ID: {{ trade.tradeID }}
                </span>
              </div>
              <div class="trade-secondary">
                {{ trade.assetCategory }} • Trade date: {{ formatTradeDate(trade.tradeDate) }} • 
                Commission: {{ formatCurrency(parseFloat(trade.ibCommission)) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="showTradeAttachModal = false">Cancel</button>
        <button 
          class="btn btn-primary" 
          @click="saveAttachedTrades"
          :disabled="isSavingTrades"
        >
          <span v-if="isSavingTrades">Saving...</span>
          <span v-else>Attach {{ selectedTradeIds.size }} Trade(s)</span>
        </button>
      </div>
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
.screenshots-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  margin-bottom: 1.5rem;
  max-height: 50vh;
  overflow-y: auto;
}
.screenshot-list-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1rem;
  border-radius: 0.7rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: background 0.15s;
}
.screenshot-list-item:hover {
  background: #e3f2fd;
}
.screenshot-thumb {
  width: 110px;
  height: 60px;
  object-fit: contain;
  border-radius: 0.4rem;
  border: 1px solid #ccc;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.screenshot-list-meta {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 15px;
  color: #555;
}
.screenshot-download-link {
  color: #1976d2;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.05em;
  margin-top: 2px;
  transition: color 0.18s;
}
.screenshot-download-link:hover {
  color: #0d47a1;
  text-decoration: underline;
}

/* Preview modal */
.screenshot-preview-modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45); z-index: 100000;
  display: flex; align-items: center; justify-content: center;
}
.screenshot-preview-content {
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 90vh;
}
.screenshot-full-img {
  max-width: 80vw;
  max-height: 60vh;
  border-radius: 0.7rem;
  border: 1.5px solid #e9ecef;
  margin-bottom: 1.2rem;
  background: #f8f9fa;
}
.screenshot-preview-meta {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.1em;
  color: #444;
}
.screenshot-preview-close {
  margin-left: 1.5rem;
  padding: 0.4rem 1.2rem;
  border-radius: 7px;
  border: 1.5px solid #007bff;
  background: #007bff;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.screenshot-preview-close:hover {
  background: #0056b3;
  border-color: #0056b3;
}
button.screenshot-btn {
    background: transparent;
    padding: 2px 2px;
    border: 1px solid #dee2e6;
}
.screenshot-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.screenshot-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #e3e3e3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: screenshot-spin 0.7s linear infinite;
  vertical-align: middle;
}
@keyframes screenshot-spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
button.attach-trades-btn {
    border-radius: 50%;
    padding: 0 !important;
    height: 18px;
    width: 18px !important;
    border: 2px solid #28a745;
    color: #28a745;
    cursor: pointer;
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
  white-space: nowrap;
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
  border-radius:  6px;
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
  overflow: hidden; /* ADD THIS */
}

.columns-popup .popup-header {
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  border-bottom: 1px solid #f1f3f5;
}

.columns-popup .popup-list {
  max-height: 260px;
  overflow-y: auto; /* ADD THIS */
  padding: 0.5rem 0.75rem; /* ADD THIS */
}

.columns-popup .popup-item {
  display: flex; /* CHANGE from inline-flex to flex */
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #495057;
  padding: 0.4rem 0; /* ADD THIS for better spacing */
  cursor: pointer; /* ADD THIS */
}

.columns-popup .popup-item:hover {
  background: #f8f9fa; /* ADD THIS */
}

.columns-popup .popup-item input[type="checkbox"] {
  flex-shrink: 0; /* ADD THIS to prevent checkbox from shrinking */
  cursor: pointer; /* ADD THIS */
}

.columns-popup .popup-item span {
  flex: 1; /* ADD THIS to allow text to take remaining space */
  cursor: pointer; /* ADD THIS */
}

/* Loading and error states */
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
  padding-left: 0 !important;
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

<style scoped>
/* Header close button styles */
:deep(.header-with-close) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

:deep(.header-close-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  flex-shrink: 0;
}

:deep(.header-close-btn:hover) {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

:deep(.header-close-btn:active) {
  background: rgba(239, 68, 68, 0.2);
}

.columns-popup .popup-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid #f1f3f5;
  flex-shrink: 0;
}

.columns-popup .popup-actions .btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1.5px solid #007bff;
  background: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.columns-popup .popup-actions .btn:hover {
  background: #0056b3;
}

.columns-popup .popup-actions .btn-clear {
  background: white;
  color: #007bff;
  border: 1.5px solid #007bff;
}

.columns-popup .popup-actions .btn-clear:hover {
  background: #f1f3f5;
  color: #0056b3;
  border-color: #0056b3;
}
.rename-dialog-backdrop {
  position: fixed !important;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  z-index: 99999 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rename-dialog {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  z-index: 100000 !important;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}
.dialog-actions button {
    width: auto;
    margin: 5px 4px;
    padding: 8px 10px;
}
.columns-popup .move-icons button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
:deep(.header-rename-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #888;
  cursor: pointer;
  padding: 0;
  margin-left: 2px;
  opacity: 0.5;
  transition: background 0.2s, opacity 0.2s;
  outline: none;
}
:deep(.header-rename-btn svg) {
  display: block;
}
:deep(.header-with-close:hover .header-rename-btn),
:deep(.header-rename-btn:focus) {
  opacity: 1;
  background: #f1f3f5;
}
:deep(.header-rename-btn:hover) {
  background: #e3e8ef;
  color: #007bff;
  opacity: 1;
}
.rename-dialog-backdrop {
  position: fixed !important;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 99999 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rename-dialog {
  background: #fff;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  border-radius: 1.25rem;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popup-fade-in 0.2s;
}

@keyframes popup-fade-in {
  from { opacity: 0; transform: scale(0.98);}
  to   { opacity: 1; transform: scale(1);}
}

.rename-dialog h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #22223b;
  letter-spacing: -0.5px;
}

.rename-dialog input {
  width: 100%;
  font-size: 1.05rem;
  padding: 0.6rem 0.9rem;
  border: 1.5px solid #dbe2ef;
  border-radius: 7px;
  margin-bottom: 0.5rem;
  outline: none;
  transition: border 0.2s;
  background: #f8fafc;
  color: #22223b;
  box-sizing: border-box;
}

.rename-dialog input:focus {
  border-color: #007bff;
  background: #fff;
}

.dialog-actions {
  display: flex;
  gap: 0.7rem;
  width: 100%;
  justify-content: left;
}

.dialog-actions button {
  min-width: 90px;
  padding: 0.55rem 1.2rem;
  border-radius: 7px;
  border: 1.5px solid #007bff;
  background: #007bff;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.dialog-actions button:last-child {
  background: #fff;
  color: #007bff;
  border: 1.5px solid #007bff;
}

.dialog-actions button:hover {
  background: #0056b3;
  color: #fff;
  border-color: #0056b3;
}

.dialog-actions button:last-child:hover {
  background: #f1f3f5;
  color: #0056b3;
  border-color: #0056b3;
}
.screenshots-modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25); z-index: 99999;
  display: flex; align-items: center; justify-content: center;
}
.screenshots-modal .modal-content {
  background: #fff; padding: 1rem; border-radius: 1rem; min-width: 350px; max-width: 90vw;
}
.screenshots-list { display: flex; flex-wrap: wrap; gap: 1rem; }
.screenshot-item { max-width: 220px; }
.screenshot-meta { font-size: 12px; color: #888; margin-top: 4px; }
</style>

<style scoped>
/* Margin Impact Modal Styles */
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
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
  line-height: 1.5;
}

.margin-impact-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.margin-impact-table th,
.margin-impact-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.margin-impact-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
}

.margin-impact-table td {
  color: #6c757d;
  font-size: 0.875rem;
}

.margin-impact-table tr:last-child td {
  border-bottom: none;
}

.loading-state, .error-state, .no-data-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.error-state {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.cost-info-section, .warnings-section {
  margin-top: 1.5rem;
}

.cost-info-section h4, .warnings-section h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.cost-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.cost-label {
  font-weight: 500;
  color: #495057;
}

.cost-value {
  font-weight: 600;
  color: #6c757d;
}

.warnings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.warning-item {
  padding: 0.75rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  color: #856404;
  font-size: 0.875rem;
  line-height: 1.4;
}

.warning-item:last-child {
  margin-bottom: 0;
}

.attach-trades-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.attach-trades-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.trade-attach-modal {
  max-width: 800px;
  width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.position-info {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.trade-search {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
}

.trades-list {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.trade-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.trade-item:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.trade-item.selected {
  background: #e7f3ff;
  border-color: #007bff;
}

.trade-item input[type="checkbox"] {
  margin-top: 2px;
  cursor: pointer;
  width: auto;
}

.trade-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.trade-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.trade-side {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
}

.trade-side.buy {
  background: #d4edda;
  color: #155724;
}

.trade-side.sell {
  background: #f8d7da;
  color: #721c24;
}

.trade-secondary {
  font-size: 0.8rem;
  color: #6c757d;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  margin-top: auto;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: 1px solid #007bff;
}

.btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

/* Style for trade child rows */
:deep(.tabulator-row[data-_isTrade="true"]) {
  background-color: #f8f9fa !important;
  font-size: 0.85rem;
}

:deep(.tabulator-row[data-_isTrade="true"]:hover) {
  background-color: #e9ecef !important;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
:deep(.tabulator-row .tabulator) {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

:deep(.tabulator-row .tabulator .tabulator-header) {
  background-color: #e9ecef !important;
  font-size: 0.75rem;
}

:deep(.tabulator-row .tabulator .tabulator-row) {
  font-size: 0.8rem;
  background: white;
}

:deep(.tabulator-row .tabulator .tabulator-row:hover) {
  background: #f8f9fa !important;
}

:deep(.trade-side-badge) {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.trade-buy) {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

:deep(.trade-sell) {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
:deep(.expand-arrow) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 20px;
  font-size: 10px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 3px;
  user-select: none;
}

:deep(.expand-arrow:hover) {
  background: #f8f9fa;
  color: #007bff;
}

:deep(.expand-arrow.expanded) {
  color: #007bff;
}

:deep(.trade-count) {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
  margin-left: 4px;
}
.search-hint {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.5rem;
  font-style: italic;
}
</style>