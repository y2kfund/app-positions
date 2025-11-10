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
  usePositionTradeMappingsQuery,
  usePositionPositionMappingsQuery,
  savePositionPositionMappings,
  fetchPositionPositionMappings,
  fetchPositionsBySymbolRoot
} from '@y2kfund/core'
import { useQueryClient } from '@tanstack/vue-query'
import type { PositionsProps } from './index'
import html2canvas from 'html2canvas'
import { useTradeQuery, type Trade } from '@y2kfund/core/trades'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import PositionsPieChart from './components/PositionsPieChart.vue'

const props = withDefaults(defineProps<PositionsProps>(), {
  accountId: 'demo',
  highlightPnL: false,
  showHeaderLink: false,
  //userId: null,
  window: null,
  userId: '67e578fd-2cf7-48a4-b028-a11a3f89bb9b'
})
const showPieChart = ref(false)

const emit = defineEmits<{ 
  'row-click': [row: Position]
  'minimize': []
  'maximize': []
}>()

const accountFilter = ref<string | null>(null)
const assetClassFilter = ref<string | null>(null)

const numericFields = ['qty', 'avgPrice', 'price', 'market_value', 'unrealized_pnl', 'computed_cash_flow_on_entry', 'computed_cash_flow_on_exercise', 'contract_quantity', 'accounting_quantity'] as const
const windowId = props.window || inject<string | null>('positions', null)

const today = new Date().toISOString().slice(0, 10)
const asOfDate = ref<string | null>(null)
function clearAsOfDate() { asOfDate.value = null }
const processingPositions = ref<Set<string>>(new Set())

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
      contract_quantity: newP.contract_quantity,
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
type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'contract_quantity' | 'accounting_quantity' | 'avgPrice' | 'price' | 'market_price' | 'instrument_market_price' | 'market_value' | 'unrealized_pnl' | 'be_price_pnl' | 'computed_cash_flow_on_entry' | 'computed_cash_flow_on_exercise' | 'entry_exercise_cash_flow_pct' | 'computed_be_price' | 'thesis' | 'maintenance_margin_change' | 'symbol_comment' | 'weighted_avg_price'
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
  { field: 'contract_quantity', label: 'Contract Quantity' },
  { field: 'accounting_quantity', label: 'Accounting Quantity' },
  { field: 'avgPrice', label: 'Avg cost price per a/cing unit' },
  { field: 'weighted_avg_price', label: 'Weighted avg price per a/cing unit of all positions across different accounts for this instrument (computed)' },
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
  // Clear any pending processing
  processingPositions.value.delete(positionKey)
  
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
          // Force the row to reformat
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
      .filter(field => !['asset_class', 'conid', 'undConid', 'multiplier', 'qty', 'contract_quantity', 'accounting_quantity'].includes(field))
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

    if (right === 'C') {
      right = 'Call'
    } else if (right === 'P') {
      right = 'Put'
    }
    
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

// Fetch latest price for a specific conid and undConid
async function fetchLatestPriceForConid(rowData: any) {
  try {
    showToast('info', 'Fetching Price', `Fetching latest price for ${rowData.symbol}...`)
    
    const conid = rowData.conid
    const undConid = rowData.undConid
    
    if (!conid) {
      showToast('error', 'Error', 'No conid available for this position')
      return
    }

    // Step 1: Get the latest last_fetched_at value from market_price table
    const latestFetchQuery = await supabase
      .schema('hf')
      .from('market_price')
      .select('last_fetched_at')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    let latestFetchedAt = new Date().toISOString()
    if (latestFetchQuery.data) {
      latestFetchedAt = latestFetchQuery.data.last_fetched_at
    }

    // Helper function to fetch and upsert a single price
    async function fetchAndUpsertPrice(targetConid: string, targetSymbol: string) {
      const ibkrApiUrl = `https://ibkr.bansi.to5001.aiworkspace.pro/api/marketdata?conid=${targetConid}`
      console.log('Fetching price from IBKR API URL:', ibkrApiUrl, 'for symbol:', targetSymbol)
      
      const response = await fetch(ibkrApiUrl)
      if (!response.ok) {
        console.warn(`Failed to fetch price for conid ${targetConid}: ${response.status}`)
        return null
      }

      const data = await response.json()
      console.log('API Response data:', data)
      
      // Parse the price from API response (price is in the '31' key)
      let price = null
      if (data && data['31']) {
        const rawPriceStr = String(data['31'])
        const priceStr = rawPriceStr.replace(/^[^\d.-]+/, '') // Remove non-numeric prefix (e.g., "C" from "C95.20")
        price = parseFloat(priceStr)
        console.log(`Price parsing for conid ${targetConid}:`, { raw: rawPriceStr, cleaned: priceStr, parsed: price })
      }

      if (!price || isNaN(price)) {
        console.warn(`Could not parse price for conid ${targetConid}, data['31']:`, data['31'])
        return null
      }

      // Check if conid exists in market_price table
      const existingQuery = await supabase
        .schema('hf')
        .from('market_price')
        .select('id, conid')
        .eq('conid', targetConid)
        .limit(1)

      if (existingQuery.data && existingQuery.data.length > 0) {
        // Update all rows with this conid
        const { error: updateError } = await supabase
          .schema('hf')
          .from('market_price')
          .update({
            market_price: price,
            last_fetched_at: latestFetchedAt,
            updated_at: new Date().toISOString()
          })
          .eq('conid', targetConid)

        if (updateError) {
          throw updateError
        }

        return { action: 'updated', conid: targetConid, price }
      } else {
        // Insert new row
        const { error: insertError } = await supabase
          .schema('hf')
          .from('market_price')
          .insert({
            conid: targetConid,
            symbol: targetSymbol,
            market_price: price,
            last_fetched_at: latestFetchedAt,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          throw insertError
        }

        return { action: 'inserted', conid: targetConid, price }
      }
    }

    // Step 2: Fetch prices for both conid and undConid (if available)
    const results = []
    
    // Fetch price for the main conid
    const conidResult = await fetchAndUpsertPrice(conid, rowData.symbol)
    if (conidResult) {
      results.push(conidResult)
    }

    // Fetch price for undConid if it exists (for options)
    if (undConid && undConid !== conid) {
      const undConidResult = await fetchAndUpsertPrice(undConid, rowData.symbol)
      if (undConidResult) {
        results.push(undConidResult)
      }
    }

    // Show success message
    if (results.length === 0) {
      showToast('error', 'Error', 'Could not fetch any prices')
      return
    }

    if (results.length === 1) {
      const result = results[0]
      const action = result.action === 'updated' ? 'Updated' : 'Added'
      showToast('success', `Price ${action}`, `${action} price for ${rowData.symbol}: ${formatCurrency(result.price)}`)
    } else {
      const messages = results.map(r => `${r.conid}: ${formatCurrency(r.price)}`).join(', ')
      showToast('success', 'Prices Updated', `Updated ${results.length} prices for ${rowData.symbol} (${messages})`)
    }

    // Refresh positions data
    await queryClient.invalidateQueries({ queryKey: ['positions'] })

  } catch (error: any) {
    console.error('Error fetching latest price:', error)
    showToast('error', 'Error', `Failed to fetch price: ${error.message}`)
  }
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

function parseDate(val: any): number | null {
  if (!val) return null
  const s = String(val).trim()
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(s)
  if (m) {
    let day = Number(m[1])
    let month = Number(m[2]) - 1
    let year = Number(m[3])
    if (year < 100) year += 2000
    const dt = new Date(year, month, day)
    return isNaN(dt.getTime()) ? null : dt.getTime()
  }
  const dt = new Date(s)
  return isNaN(dt.getTime()) ? null : dt.getTime()
}

const weightedAveragePrices = computed(() => {
  const map = new Map<string, { totalWeightedPrice: number; totalQty: number }>()
  
  sourcePositions.value.forEach(position => {
    const symbol = position.symbol
    if (!symbol) return
    
    const avgPrice = position.avgPrice
    const accountingQty = position.accounting_quantity
    
    if (avgPrice == null || accountingQty == null) return
    
    if (!map.has(symbol)) {
      map.set(symbol, { totalWeightedPrice: 0, totalQty: 0 })
    }
    
    const entry = map.get(symbol)!
    entry.totalWeightedPrice += avgPrice * accountingQty
    entry.totalQty += accountingQty
  })
  
  // Calculate weighted average for each symbol
  const result = new Map<string, number>()
  map.forEach((value, symbol) => {
    if (value.totalQty !== 0) {
      result.set(symbol, value.totalWeightedPrice / value.totalQty)
    }
  })
  
  return result
})

function getWeightedAvgDetails(symbol: string): string {
  const positions = sourcePositions.value.filter(p => p.symbol === symbol)
  if (positions.length === 0) return 'No positions found'
  
  const calculations: string[] = []
  let totalWeightedPrice = 0
  let totalQty = 0
  
  positions.forEach((pos, index) => {
    const avgPrice = pos.avgPrice || 0
    const accountingQty = pos.accounting_quantity || 0
    const weightedPrice = avgPrice * accountingQty
    
    totalWeightedPrice += weightedPrice
    totalQty += accountingQty
    
    const accountName = typeof pos.legal_entity === 'object' && pos.legal_entity !== null
      ? (pos.legal_entity.name || pos.legal_entity.id)
      : pos.legal_entity
    
    calculations.push(
      `${accountName}: ${formatCurrency(avgPrice)} × ${accountingQty} = ${formatCurrency(weightedPrice)}`
    )
  })
  
  const weightedAvg = totalQty !== 0 ? totalWeightedPrice / totalQty : 0
  
  return [
    '<b>Weighted Average Price Calculation:</b>',
    '',
    ...calculations,
    '',
    `<b>Total Weighted Price:</b> ${formatCurrency(totalWeightedPrice)}`,
    `<b>Total Quantity:</b> ${totalQty}`,
    '',
    `<b>Weighted Average:</b> ${formatCurrency(totalWeightedPrice)} ÷ ${totalQty} = <b>${formatCurrency(weightedAvg)}</b>`
  ].join('<br>')
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'Filter',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const accountVal = (typeof rowValue === 'object' && rowValue !== null)
          ? (rowValue.name || rowValue.id || '')
          : (rowValue || '')
        return String(accountVal).toLowerCase().includes(String(headerValue).toLowerCase())
      },
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
        
        // Check if this position has attached trades OR positions
        const posKey = getPositionKey(data)
        const attachedTradeIds = positionTradesMap.value.get(posKey)
        const attachedPositionKeys = positionPositionsMap.value.get(posKey)
        const hasAttachments = (attachedTradeIds && attachedTradeIds.size > 0) || (attachedPositionKeys && attachedPositionKeys.size > 0)
        const isExpanded = expandedPositions.value.has(posKey)
        
        // Show expand/collapse arrow if has any attachments
        const expandArrow = hasAttachments
          ? `<span class="expand-arrow ${isExpanded ? 'expanded' : ''}" data-position-key="${posKey}" title="${isExpanded ? 'Collapse' : 'Expand'} attachments">
              ${isExpanded ? '▼' : '▶'}
            </span>`
          : '<span class="expand-arrow">&nbsp;</span>'
        
        // Calculate total attachment count
        const totalAttachments = (attachedTradeIds?.size || 0) + (attachedPositionKeys?.size || 0)
        const attachmentLabel = totalAttachments > 0 
          ? `<span class="trade-count">(${totalAttachments})</span>`
          : ''
        
        // Add + icon for attaching trades/positions
        return `
          <div style="display: flex; align-items: center; gap: 6px;">
            ${expandArrow}
            <button 
              class="attach-trades-btn" 
              title="Attach trades or positions"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span>${accountName}</span>
            ${attachmentLabel}
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'Filter',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const symbol = String(rowValue || '')
        return symbol.toLowerCase().includes(String(headerValue).toLowerCase())
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('symbol')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup) {
          const isParent = !data.thesis?.parent_thesis_id
          const badge = isParent 
            ? '<span style="background:#1e3a8a;color:white;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;margin-right:8px;">PARENT THESIS</span>'
            : '<span style="background:#7c3aed;color:white;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;margin-right:8px;">SUB-THESIS</span>'
          
          const icon = isParent ? '📊' : '📁'
          return `${badge}${icon} ${data.thesis.title}`
        }
        
        // Position rows
        const tags = extractTagsFromSymbol(cell.getValue())
        const selectedTags = new Set(symbolTagFilters.value)
        return '<span style="color:#666;margin-right:6px;">📄</span>' + 
          tags.map(tag => {
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
      headerFilter: function(cell: any, onRendered: any, success: any) {
        const container = document.createElement('div')
        container.style.position = 'relative'
        const input = document.createElement('input')
        input.type = 'text'
        input.placeholder = 'Select date range'
        input.style.width = '100%'
        input.style.boxSizing = 'border-box'
        input.style.paddingRight = '28px'
        container.appendChild(input)

        const clearBtn = document.createElement('button')
        clearBtn.type = 'button'
        clearBtn.innerText = '✕'
        clearBtn.title = 'Clear'
        clearBtn.style.position = 'absolute'
        clearBtn.style.right = '6px'
        clearBtn.style.top = '50%'
        clearBtn.style.transform = 'translateY(-50%)'
        clearBtn.style.border = 'none'
        clearBtn.style.background = 'transparent'
        clearBtn.style.cursor = 'pointer'
        clearBtn.style.fontSize = '12px'
        clearBtn.style.padding = '2px 6px'
        clearBtn.style.display = 'none'
        clearBtn.style.color = '#6c757d'
        clearBtn.style.borderRadius = '3px'
        container.appendChild(clearBtn)

        let fp: any = null

        function updateClearVisibility() {
          const hasValue = !!input.value && input.value.trim() !== ''
          if (hasValue && container.matches(':hover')) {
            clearBtn.style.display = 'block'
          } else {
            clearBtn.style.display = 'none'
          }
        }

        container.addEventListener('mouseenter', updateClearVisibility)
        container.addEventListener('mouseleave', updateClearVisibility)

        onRendered(() => {
          try {
            fp = flatpickr(input, {
              mode: 'range',
              dateFormat: 'Y-m-d',
              allowInput: true,
              onChange: (selectedDates: Date[]) => {
                if (!selectedDates || selectedDates.length === 0) {
                  success({ min: '', max: '' })
                  input.value = ''
                  updateClearVisibility()
                  return
                }
                const min = selectedDates[0] ? selectedDates[0].toISOString().slice(0, 10) : ''
                const max = selectedDates[1] ? selectedDates[1].toISOString().slice(0, 10) : ''
                input.value = max ? `${min} to ${max}` : min
                success({ min: min || '', max: max || '' })
                updateClearVisibility()
              }
            })
          } catch (e) {
            input.addEventListener('change', () => {
              const val = input.value || ''
              const parts = val.split(' to ').map(s => s.trim())
              success({ min: parts[0] || '', max: parts[1] || '' })
              updateClearVisibility()
            })
          }
        })

        clearBtn.addEventListener('click', (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          if (fp) {
            try { fp.clear() } catch (err) {}
          }
          input.value = ''
          success({ min: '', max: '' })
          updateClearVisibility()
        })

        input.addEventListener('input', updateClearVisibility)

        return container
      },
      headerFilterFunc: (headerValue: any, rowValue: any, rowData: any) => {
        if (!headerValue || (!headerValue.min && !headerValue.max)) return true
        
        // Extract expiry date from symbol tags for OPT
        if (rowData.asset_class !== 'OPT') return true
        
        const tags = extractTagsFromSymbol(rowData.symbol)
        const expiryStr = tags[1] || ''
        if (!expiryStr) return false
        
        const ts = new Date(expiryStr).getTime()
        if (isNaN(ts)) return false
        
        if (headerValue.min) {
          const minTs = new Date(headerValue.min).getTime()
          if (isNaN(minTs)) return false
          if (ts < minTs) return false
        }
        if (headerValue.max) {
          const maxTs = new Date(headerValue.max).getTime()
          if (isNaN(maxTs)) return false
          const maxInclusive = maxTs + (24 * 60 * 60 * 1000) - 1
          if (ts > maxInclusive) return false
        }
        return true
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'Filter',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const comment = String(rowValue || '')
        //console.log('Filtering comment:', comment, 'against', headerValue)
        return comment.toLowerCase().includes(String(headerValue).toLowerCase())
      },
      titleFormatter: (cell: any) => `<div class="header-with-close"><span>Comment</span></div>`,
      formatter: (cell: any) => cell.getValue() || '',
      cellEdited: async (cell: any) => {
        const data = cell.getRow().getData()
        //console.log('Saving comment for', data)
        const commentKey = generateCommentKey({
          internal_account_id: data.internal_account_id,
          symbol: data.symbol,
          contract_quantity: data.contract_quantity,
          asset_class: data.asset_class,
          conid: data.conid
        })
        const comment = cell.getValue()
        //console.log('Generated comment key:', commentKey, 'userId:', props.userId)
        if (commentKey && props.userId) {
          try {
            //console.log('Upserting comment:', commentKey, comment)
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'Filter',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const v = String(rowValue || '')
        return v.toLowerCase().includes(String(headerValue).toLowerCase())
      },
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
      title: 'Contract Quantity',
      field: 'contract_quantity',
      minWidth: 100,
      width: columnWidths.value['contract_quantity'] || undefined,
      hozAlign: 'right',
      visible: visibleCols.value.includes('contract_quantity'),
      sorter: 'number',
      headerFilter: 'input',
      headerFilterPlaceholder: 'e.g. >100 or 100',
      headerFilterFunc: (headerValue: any, rowValue: any) => {
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
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
          <span>${getColLabel('contract_quantity')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return formatNumber(cell.getValue())
        return formatNumber(cell.getValue())
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Accounting Quantity',
      field: 'accounting_quantity',
      minWidth: 100,
      width: columnWidths.value['accounting_quantity'] || undefined,
      hozAlign: 'right',
      visible: visibleCols.value.includes('accounting_quantity'),
      sorter: 'number',
      headerFilter: 'input',
      headerFilterPlaceholder: 'e.g. >100 or 100',
      headerFilterFunc: (headerValue: any, rowValue: any) => {
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
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
          <span>${getColLabel('accounting_quantity')}</span>
        </div>`
      },
      formatter: (cell: any) => {
        if (cell.getRow().getData()?._isThesisGroup) return formatNumber(cell.getValue())
        return formatNumber(cell.getValue())
      },
      contextMenu: createFetchedAtContextMenu()
    },
    {
      title: 'Avg cost price per a/cing unit',
      field: 'avgPrice',
      minWidth: 80,
      width: columnWidths.value['avgPrice'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('avgPrice'),
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
      title: 'Weighted avg price per a/cing unit of all positions across different accounts for this instrument (computed)',
      field: 'weighted_avg_price',
      minWidth: 180,
      width: columnWidths.value['weighted_avg_price'] || undefined,
      hozAlign: 'right',
      visible: visibleCols.value.includes('weighted_avg_price'),
      headerFilter: 'input',
      headerFilterPlaceholder: 'e.g. >100 or 100',
      headerFilterFunc: (headerValue: any, rowValue: any) => {
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
      titleFormatter: (cell: any) => {
        return `<div class="header-with-close">
          <span>${getColLabel('weighted_avg_price')}</span>
        </div>`
      },
      accessor: (value: any, data: any) => {
        if (data?._isThesisGroup || data?._isTrade) return null
        return weightedAveragePrices.value.get(data.symbol) || null
      },
      formatter: (cell: any) => {
        const data = cell.getRow().getData()
        if (data?._isThesisGroup || data?._isTrade) return ''
        
        // Get the value directly from the computed map instead of cell.getValue()
        const value = weightedAveragePrices.value.get(data.symbol)
        
        return value === null || value === undefined ? '-' : formatCurrency(value)
      },
      contextMenu: [
        {
          label: (component: any) => {
            const row = component.getData()
            if (row?._isThesisGroup || row?._isTrade) {
              return 'Not applicable for this row'
            }
            return getWeightedAvgDetails(row.symbol)
          },
          action: () => {},
          disabled: true
        },
        { separator: true },
        ...createFetchedAtContextMenu()
      ]
    },
    {
      title: 'Market Price',
      field: 'price',
      minWidth: 80,
      width: columnWidths.value['price'] || undefined, // ADD THIS LINE
      hozAlign: 'right',
      visible: visibleCols.value.includes('price'),
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
          label: "🔄 Fetch latest price",
          action: (e: any, cell: any) => {
            const rowData = cell.getRow().getData()
            fetchLatestPriceForConid(rowData)
          }
        },
        {
          separator: true
        },
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
          label: "🔄 Fetch latest price",
          action: (e: any, cell: any) => {
            const rowData = cell.getRow().getData()
            fetchLatestPriceForConid(rowData)
          }
        },
        {
          separator: true
        },
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
      sorter: 'number',
      // Set bottom calc during initialization
      bottomCalc: shouldShowBottomCalcs ? 'sum' : undefined,
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
          let qty = row.contract_quantity
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
            let qty = row.contract_quantity
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
              let qty = row.contract_quantity
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
      headerFilter: 'input',  // ADD THIS
      headerFilterPlaceholder: 'e.g. >100 or 100',  // ADD THIS
      headerFilterFunc: (headerValue: any, rowValue: any) => {  // ADD THIS
        if (!headerValue) return true
        const s = String(headerValue).trim()
        const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
        let op = '='
        let numStr = s
        if (opMatch) {
          op = opMatch[1]
          numStr = s.slice(op.length).trim()
        }
        const numVal = parseFloat(numStr)
        if (isNaN(numVal)) return false
        const val = parseFloat(rowValue) || 0
        switch (op) {
          case '=': return val === numVal
          case '!=': return val !== numVal
          case '<': return val < numVal
          case '<=': return val <= numVal
          case '>': return val > numVal
          case '>=': return val >= numVal
          default: return false
        }
      },
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
    rowFormatter: async (row: any) => {
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

        // Handle position rows with attached trades or positions
        if (!groupByThesis.value && data && !data._isThesisGroup) {
          const posKey = getPositionKey(data)
          const attachedTradeIds = positionTradesMap.value.get(posKey)
          const attachedPositionKeys = positionPositionsMap.value.get(posKey)
          const isExpanded = expandedPositions.value.has(posKey)
          
          // ALWAYS remove existing nested tables first, regardless of expanded state
          const existingNested = element.querySelector('.nested-tables-container')
          if (existingNested) {
            existingNested.remove()
          }

          // Check if we're already processing this position
          if (processingPositions.value.has(posKey)) {
            console.log(`⚠️ Already processing position: ${posKey}, skipping...`)
            return
          }

          // Only create NEW nested tables when expanded AND has attachments
          if (isExpanded && (
            (attachedTradeIds && attachedTradeIds.size > 0) || 
            (attachedPositionKeys && attachedPositionKeys.size > 0)
          )) {
            // Mark as processing
            processingPositions.value.add(posKey)
            console.log(`📊 Creating nested tables for position: ${posKey}`)
            
            try {
              const container = document.createElement('div')
              container.className = 'nested-tables-container'
              container.style.cssText = 'padding: 1rem; background: #f8f9fa; border-top: 1px solid #dee2e6;'

              // Add Trades section
              if (attachedTradeIds && attachedTradeIds.size > 0) {
                const tradesTitle = document.createElement('h4')
                tradesTitle.textContent = `Attached Trades (${attachedTradeIds.size})`
                tradesTitle.style.cssText = 'margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #495057;'
                container.appendChild(tradesTitle)

                const tradesTableDiv = document.createElement('div')
                tradesTableDiv.className = 'nested-trades-table'
                tradesTableDiv.style.cssText = 'margin-bottom: 1rem;'
                container.appendChild(tradesTableDiv)

                const tradesData = tradesQuery.data.value?.filter((t: Trade) => 
                  attachedTradeIds.has(t.tradeID || '')
                ) || []

                console.log(`📊 Creating trades table with ${tradesData.length} trades for key: ${posKey}`)

                // Create trades table with ALL columns from Trades.vue
                new Tabulator(tradesTableDiv, {
                  data: tradesData,
                  layout: 'fitColumns',
                  columns: [
                    { 
                      title: 'Account', 
                      field: 'legal_entity', 
                      width: 120,
                      formatter: (cell: any) => {
                        const value = cell.getValue()
                        if (typeof value === 'object' && value !== null) {
                          return value.name || value.id || ''
                        }
                        return value || ''
                      }
                    },
                    { 
                      title: 'Symbol', 
                      field: 'symbol', 
                      width: 200,
                      formatter: (cell: any) => {
                        const symbol = cell.getValue()
                        if (!symbol) return '<span style="color: #6c757d; font-style: italic;">N/A</span>'
                        
                        const tags = extractTagsFromTradesSymbol(symbol)
                        const selectedTags = new Set(symbolTagFilters.value)
                        
                        return tags.map(tag => {
                          const isSelected = selectedTags.has(tag)
                          const className = isSelected ? 'fi-tag fi-tag-selected' : 'fi-tag'
                          return `<span class="${className}" data-tag="${tag}">${tag}</span>`
                        }).join(' ')
                      }
                    },
                    { 
                      title: 'Side', 
                      field: 'buySell', 
                      width: 80, 
                      formatter: (cell: any) => {
                        const side = cell.getValue()
                        const className = side === 'BUY' ? 'trade-buy' : 'trade-sell'
                        return `<span class="trade-side-badge ${className}">${side}</span>`
                      }
                    },
                    { 
                      title: 'Open/Close', 
                      field: 'openCloseIndicator', 
                      width: 100,
                      formatter: (cell: any) => {
                        const value = cell.getValue()
                        if (value === 'O') return '<span style="color: #17a2b8; font-weight: bold;">OPEN</span>'
                        if (value === 'C') return '<span style="color: #6f42c1; font-weight: bold;">CLOSE</span>'
                        return value
                      }
                    },
                    { 
                      title: 'Asset Class', 
                      field: 'assetCategory', 
                      width: 120 
                    },
                    { 
                      title: 'Trade Date', 
                      field: 'tradeDate', 
                      width: 120,
                      formatter: (cell: any) => formatTradeDate(cell.getValue())
                    },
                    { 
                      title: 'Settlement Date', 
                      field: 'settleDateTarget', 
                      width: 140,
                      formatter: (cell: any) => formatTradeDate(cell.getValue())
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
                      formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue()) || 0)
                    },
                    { 
                      title: 'Total Premium', 
                      field: 'tradeMoney', 
                      width: 120, 
                      hozAlign: 'right',
                      formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue()) || 0)
                    },
                    { 
                      title: 'Net Cash', 
                      field: 'netCash', 
                      width: 120, 
                      hozAlign: 'right',
                      formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue()) || 0)
                    },
                    { 
                      title: 'MTM PnL', 
                      field: 'mtmPnl', 
                      width: 100, 
                      hozAlign: 'right',
                      formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue()) || 0)
                    },
                    { 
                      title: 'FIFO Realized', 
                      field: 'fifoPnlRealized', 
                      width: 120, 
                      hozAlign: 'right',
                      formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue()) || 0)
                    },
                    { 
                      title: 'Commission', 
                      field: 'ibCommission', 
                      width: 100, 
                      hozAlign: 'right',
                      formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue()) || 0)
                    },
                    { 
                      title: 'Close Price', 
                      field: 'closePrice', 
                      width: 100, 
                      hozAlign: 'right',
                      formatter: (cell: any) => formatCurrency(parseFloat(cell.getValue()) || 0)
                    }
                  ]
                })
              }

              // Add Positions section
              if (attachedPositionKeys && attachedPositionKeys.size > 0) {
                const positionsTitle = document.createElement('h4')
                positionsTitle.textContent = `Attached Positions (${attachedPositionKeys.size})`
                positionsTitle.style.cssText = 'margin: 1rem 0 0.5rem 0; font-size: 0.9rem; color: #495057;'
                container.appendChild(positionsTitle)

                const positionsTableDiv = document.createElement('div')
                positionsTableDiv.className = 'nested-positions-table'
                container.appendChild(positionsTableDiv)

                console.log(`📊 Fetching ${attachedPositionKeys.size} attached positions for key: ${posKey}`)

                // Fetch attached positions
                const attachedPositionsData = await fetchAttachedPositionsForDisplay(posKey, attachedPositionKeys)

                console.log(`📊 Got ${attachedPositionsData.length} positions to display for key: ${posKey}`)

                if (attachedPositionsData.length === 0) {
                  positionsTableDiv.innerHTML = '<div style="padding: 1rem; text-align: center; color: #6c757d;">No positions found</div>'
                } else {
                  // Create positions table with ALL columns from parent Positions component
                  new Tabulator(positionsTableDiv, {
                    data: attachedPositionsData,
                    layout: 'fitColumns',
                    columns: [
                      {
                        title: 'Status',
                        field: '_status',
                        width: 80,
                        formatter: (cell: any) => {
                          const pos = cell.getRow().getData()
                          const expired = isPositionExpired(pos)
                          return expired 
                            ? '<span style="color: #6c757d; font-weight: bold;">EXPIRED</span>'
                            : '<span style="color: #28a745; font-weight: bold;">ACTIVE</span>'
                        }
                      },
                      { 
                        title: 'Account', 
                        field: 'legal_entity', 
                        width: 150, 
                        formatter: (cell: any) => {
                          const value = cell.getValue()
                          return typeof value === 'object' && value !== null 
                            ? (value.name || value.id) 
                            : value
                        }
                      },
                      { 
                        title: 'Symbol', 
                        field: 'symbol', 
                        width: 200,
                        formatter: (cell: any) => {
                          const symbol = cell.getValue()
                          if (!symbol) return '<span style="color: #6c757d; font-style: italic;">N/A</span>'
                          
                          const tags = extractTagsFromSymbol(symbol)
                          const selectedTags = new Set(symbolTagFilters.value)
                          
                          return tags.map(tag => {
                            const isSelected = selectedTags.has(tag)
                            const className = isSelected ? 'fi-tag fi-tag-selected' : 'fi-tag'
                            return `<span class="${className}" data-tag="${tag}">${tag}</span>`
                          }).join(' ')
                        }
                      },
                      { 
                        title: 'Expiry Date', 
                        field: 'expiry_date', 
                        width: 110,
                        hozAlign: 'center',
                        formatter: (cell: any) => {
                          const row = cell.getRow().getData()
                          if (row.asset_class === 'OPT') {
                            const tags = extractTagsFromSymbol(row.symbol)
                            const expiry = tags[1] || ''
                            return expiry ? expiry : '<span style="color:#aaa;font-style:italic;">Unknown</span>'
                          }
                          return '<span style="color:#aaa;font-style:italic;">Not applicable</span>'
                        }
                      },
                      { 
                        title: 'Asset Class', 
                        field: 'asset_class', 
                        width: 100 
                      },
                      { 
                        title: 'Conid', 
                        field: 'conid', 
                        width: 100 
                      },
                      { 
                        title: 'Underlying Conid', 
                        field: 'undConid', 
                        width: 120 
                      },
                      { 
                        title: 'Multiplier', 
                        field: 'multiplier', 
                        width: 100, 
                        hozAlign: 'right', 
                        formatter: (cell: any) => formatNumber(cell.getValue()) 
                      },
                      { 
                        title: 'Contract Quantity', 
                        field: 'contract_quantity', 
                        width: 120, 
                        hozAlign: 'right', 
                        formatter: (cell: any) => formatNumber(cell.getValue()) 
                      },
                      { 
                        title: 'Accounting Quantity', 
                        field: 'accounting_quantity', 
                        width: 140, 
                        hozAlign: 'right', 
                        formatter: (cell: any) => formatNumber(cell.getValue()) 
                      },
                      { 
                        title: 'Avg Price', 
                        field: 'avgPrice', 
                        width: 100, 
                        hozAlign: 'right', 
                        formatter: (cell: any) => formatCurrency(cell.getValue()) 
                      },
                      { 
                        title: 'Market Price', 
                        field: 'price', 
                        width: 100, 
                        hozAlign: 'right', 
                        formatter: (cell: any) => formatCurrency(cell.getValue()) 
                      },
                      { 
                        title: 'Ul CM Price', 
                        field: 'market_price', 
                        width: 100, 
                        hozAlign: 'right',
                        formatter: (cell: any) => {
                          const row = cell.getRow().getData()
                          if (row.asset_class === 'STK') {
                            return `<span style="color:#aaa;font-style:italic;">Not applicable</span>`
                          }
                          const value = cell.getValue()
                          return value === null || value === undefined ? '-' : formatCurrency(value)
                        }
                      },
                      { 
                        title: 'Instrument Market Price', 
                        field: 'instrument_market_price', 
                        width: 160, 
                        hozAlign: 'right',
                        formatter: (cell: any) => {
                          const row = cell.getRow().getData()
                          let value = null
                          if (row.asset_class === 'OPT') {
                            value = row.option_market_price
                          } else if (row.asset_class === 'STK' || row.asset_class === 'FUND') {
                            value = row.market_price
                          }
                          return value === null || value === undefined ? '-' : formatCurrency(value)
                        }
                      },
                      { 
                        title: 'Market Value', 
                        field: 'market_value', 
                        width: 120, 
                        hozAlign: 'right', 
                        formatter: (cell: any) => formatCurrency(cell.getValue()) 
                      },
                      { 
                        title: 'P&L Unrealized', 
                        field: 'unrealized_pnl', 
                        width: 120, 
                        hozAlign: 'right',
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
                        title: 'BE Price P&L', 
                        field: 'be_price_pnl', 
                        width: 120, 
                        hozAlign: 'right',
                        formatter: (cell: any) => {
                          const row = cell.getRow().getData()
                          if (row.asset_class === 'OPT' && row.symbol && row.symbol.includes('P')) {
                            const ulCmPrice = row.market_price
                            const bePrice = row.computed_be_price
                            let qty = row.contract_quantity
                            const multiplier = row.multiplier
                            const tags = extractTagsFromSymbol(row.symbol)
                            const strikeTag = tags[2]
                            const strikePrice = strikeTag ? parseFloat(strikeTag) : null
                            qty = Math.abs(qty)
                            if (ulCmPrice != null && bePrice != null && qty != null && multiplier != null && strikePrice != null && !isNaN(strikePrice)) {
                              const minPrice = Math.min(ulCmPrice, strikePrice)
                              const pnl = (minPrice - bePrice) * qty * multiplier
                              const absPnl = Math.abs(pnl)
                              const decimalPart = Math.abs(pnl % 1)
                              let formatted
                              if (absPnl === 0 || decimalPart < absPnl * 0.01) {
                                formatted = formatCurrency(Math.trunc(pnl))
                              } else {
                                formatted = formatCurrency(pnl)
                              }
                              let className = ''
                              if (pnl > 0) className = 'pnl-positive'
                              else if (pnl < 0) className = 'pnl-negative'
                              else className = 'pnl-zero'
                              return `<span class="${className}">${formatted}</span>`
                            }
                          }
                          return `<span style="color:#aaa;font-style:italic;">Not applicable</span>`
                        }
                      },
                      { 
                        title: 'Entry Cash Flow', 
                        field: 'computed_cash_flow_on_entry', 
                        width: 140, 
                        hozAlign: 'right',
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
                        title: 'If Exercised Cash Flow', 
                        field: 'computed_cash_flow_on_exercise', 
                        width: 160, 
                        hozAlign: 'right',
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
                        title: 'Entry/Exercise %', 
                        field: 'entry_exercise_cash_flow_pct', 
                        width: 130, 
                        hozAlign: 'right',
                        formatter: (cell: any) => {
                          const row = cell.getRow().getData()
                          if (row.asset_class === 'OPT' && row.computed_cash_flow_on_entry != null && row.computed_cash_flow_on_exercise != null && row.computed_cash_flow_on_exercise !== 0) {
                            const pct = (row.computed_cash_flow_on_entry / row.computed_cash_flow_on_exercise) * 100
                            const formatted = Math.abs(pct.toFixed(2)) + '%'
                            return `<span>${formatted}</span>`
                          }
                          return `<span style="color:#aaa;font-style:italic;">Not applicable</span>`
                        }
                      },
                      { 
                        title: 'BE Price', 
                        field: 'computed_be_price', 
                        width: 100, 
                        hozAlign: 'right',
                        formatter: (cell: any) => {
                          const value = cell.getValue()
                          return value === null || value === undefined ? '-' : formatNumber(value)
                        }
                      },
                      { 
                        title: 'Maintenance Margin Change', 
                        field: 'maintenance_margin_change', 
                        width: 180, 
                        hozAlign: 'right',
                        formatter: (cell: any) => {
                          const value = cell.getValue()
                          if (value === null || value === undefined || value === '') return '-'
                          const numValue = parseFloat(value.replace(/,/g, ''))
                          return formatCurrency(numValue)
                        }
                      }
                    ]
                  })
                }
              }

              // Append the container to the row element
              element.appendChild(container)
              console.log(`✅ Nested tables appended to row for key: ${posKey}`)
            } finally {
              // Always remove from processing set, even if there's an error
              setTimeout(() => {
                processingPositions.value.delete(posKey)
                console.log(`🔓 Finished processing position: ${posKey}`)
              }, 100)
            }
          }
        }
      } catch (error) {
        console.error('❌ Row formatter error:', error)
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
      _isParentThesis: !thesis.parent_thesis_id,
      thesis,
      symbol: thesis.parent_thesis_id 
        ? `  ├─ 📁 ${thesis.title}` 
        : `📊 PARENT: ${thesis.title}`,
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
    url.searchParams.delete(`all_cts_clientId`)
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
  url.searchParams.delete(`all_cts_clientId`)
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
    const quantity = Math.abs(rowData.contract_quantity)
    const side = rowData.contract_quantity > 0 ? 'SELL' : 'BUY'

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

const showPositionAttachModal = ref(false)
const selectedPositionForPositions = ref<Position | null>(null)
const positionSearchQuery = ref('')
const selectedPositionKeys = ref<Set<string>>(new Set())
const attachmentTab = ref<'trades' | 'positions'>('trades')

// Query trades
const tradesQuery = useTradeQuery(props.accountId, props.userId)

// Computed filtered trades for modal
/*const filteredTrades = computed(() => {
  if (!tradesQuery.data.value) return []
  
  const query = tradeSearchQuery.value.toLowerCase().trim()
  if (!query) return tradesQuery.data.value
  
  // Split by comma and clean up each term
  const searchTerms = query.split(',').map(term => term.trim()).filter(Boolean)
  
  return tradesQuery.data.value.filter(trade => {
    const symbolTags = extractTagsFromTradesSymbol(trade.symbol).map(tag => tag.toLowerCase())
    
    // Check if ALL search terms match (AND logic)
    return searchTerms.every(term => {
      // First, try exact match against symbol tags
      if (symbolTags.some(tag => tag === term)) {
        return true
      }
      
      // Then try exact match against other fields (not partial matching)
      // This prevents "p" from matching "OPT"
      return (
        trade.assetCategory.toLowerCase() === term ||
        trade.buySell.toLowerCase() === term ||
        trade.tradeDate === term ||
        (trade.description && trade.description.toLowerCase() === term) ||
        (trade.tradeID && trade.tradeID.toLowerCase() === term)
      )
    })
  })
})*/

// Query position-position mappings
const positionPositionMappingsQuery = usePositionPositionMappingsQuery(props.userId)

// Create computed ref for the position mappings
const positionPositionsMap = computed(() => {
  return positionPositionMappingsQuery.data.value || new Map<string, Set<string>>()
})

const filteredPositionsForAttach = ref<Position[]>([])
const loadingAttachablePositions = ref(false)

async function loadAttachablePositions() {
  if (!selectedPositionForPositions.value || !props.userId) {
    filteredPositionsForAttach.value = []
    return
  }
  
  loadingAttachablePositions.value = true
  
  try {
    // Get symbol root of the selected position
    const selectedRoot = extractSymbolRoot(selectedPositionForPositions.value.symbol)
    if (!selectedRoot) {
      filteredPositionsForAttach.value = []
      return
    }
    
    // Fetch positions from database using the new function
    const positions = await fetchPositionsBySymbolRoot(
      supabase,
      selectedRoot,
      props.userId,
      selectedPositionForPositions.value.internal_account_id
    )
    console.log(`Fetched attachable positions for root: ${selectedRoot}`, positions)
    const query = positionSearchQuery.value.toLowerCase().trim()
    
    // Apply search filter if present
    if (query) {
      const searchTerms = query.split(',').map(term => term.trim()).filter(Boolean)
      filteredPositionsForAttach.value = positions.filter(pos => {
        const symbolTags = extractTagsFromSymbol(pos.symbol).map(tag => tag.toLowerCase())
        
        return searchTerms.every(term => {
          return (
            symbolTags.some(tag => tag.includes(term)) ||
            pos.asset_class.toLowerCase().includes(term) ||
            (pos.legal_entity && String(pos.legal_entity).toLowerCase().includes(term))
          )
        })
      })
    } else {
      filteredPositionsForAttach.value = positions
    }
  } catch (error) {
    console.error('Error loading attachable positions:', error)
    filteredPositionsForAttach.value = []
  } finally {
    loadingAttachablePositions.value = false
  }
}

// Add a new ref to store positions for display in nested tables
const attachedPositionsCache = ref<Map<string, Position[]>>(new Map())

// Add a function to fetch attached positions for display
async function fetchAttachedPositionsForDisplay(positionKey: string, attachedKeys: Set<string>) {
  try {
    // Check cache first
    if (attachedPositionsCache.value.has(positionKey)) {
      const cached = attachedPositionsCache.value.get(positionKey) || []
      console.log('📦 Using cached positions:', cached.length)
      return cached
    }

    console.log('🔍 Fetching attached positions for key:', positionKey)
    console.log('🔍 Attached keys:', Array.from(attachedKeys))

    // Parse the position key to get symbol root
    const parts = positionKey.split('|')
    if (parts.length < 2) {
      console.error('❌ Invalid position key format:', positionKey)
      return []
    }

    const accountId = parts[0]
    const symbol = parts[1]
    const symbolRoot = extractSymbolRoot(symbol)
    
    if (!symbolRoot || !accountId) {
      console.error('❌ Could not extract symbol root or account from key:', positionKey)
      return []
    }

    console.log('📊 Extracted - Account:', accountId, 'Symbol Root:', symbolRoot)

    // Fetch all positions with same symbol root from the SAME account
    const allPositions = await fetchPositionsBySymbolRoot(
      supabase,
      symbolRoot,
      props.userId,
      accountId  // Pass the account ID to filter by same account
    )
    
    console.log('📊 Fetched positions for symbol root:', symbolRoot, 'count:', allPositions.length)

    // Filter to only include positions that match the attached keys
    const attachedPositions = allPositions.filter(pos => {
      const key = getPositionKey(pos)
      const isIncluded = attachedKeys.has(key)
      console.log(`${isIncluded ? '✅' : '❌'} Position key: ${key}`)
      return isIncluded
    })

    console.log('✅ Filtered to attached positions:', attachedPositions.length)
    console.log('📋 Attached position details:', attachedPositions.map(p => ({
      symbol: p.symbol,
      qty: p.contract_quantity,
      account: p.legal_entity,
      key: getPositionKey(p)
    })))

    // Cache the result
    if (attachedPositions.length > 0) {
      attachedPositionsCache.value.set(positionKey, attachedPositions)
    }
    
    return attachedPositions
  } catch (error) {
    console.error('❌ Error fetching attached positions:', error)
    return []
  }
}

// Check if position is expired
function isPositionExpired(position: Position): boolean {
  if (position.asset_class !== 'OPT') return false
  
  const tags = extractTagsFromSymbol(position.symbol)
  const expiryStr = tags[1] // Date is second tag
  if (!expiryStr) return false
  
  const expiryDate = new Date(expiryStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return expiryDate < today
}

// Open position attach modal
function openPositionAttachModal(position: Position) {
  selectedPositionForPositions.value = position
  positionSearchQuery.value = ''
  attachmentTab.value = 'trades' // Start with trades tab
  
  // Load currently attached positions
  const posKey = getPositionKey(position)
  selectedPositionKeys.value = new Set(positionPositionsMap.value.get(posKey) || [])
  
  showPositionAttachModal.value = true
  
  // Load attachable positions when modal opens
  loadAttachablePositions()
}

// Watch for search query changes
watch(positionSearchQuery, () => {
  if (showPositionAttachModal.value && attachmentTab.value === 'positions') {
    loadAttachablePositions()
  }
})

// Watch for tab changes
watch(attachmentTab, (newTab) => {
  if (newTab === 'positions' && showPositionAttachModal.value) {
    loadAttachablePositions()
  }
})

// Toggle position selection
function togglePositionSelection(positionKey: string) {
  if (selectedPositionKeys.value.has(positionKey)) {
    selectedPositionKeys.value.delete(positionKey)
  } else {
    selectedPositionKeys.value.add(positionKey)
  }
}

const isSavingPositions = ref(false)

// Save attached positions
async function saveAttachedPositions() {
  if (!selectedPositionForPositions.value || !props.userId) return
  
  if (isSavingPositions.value) {
    console.log('⚠️ Save already in progress, skipping...')
    return
  }

  const posKey = getPositionKey(selectedPositionForPositions.value)
  isSavingPositions.value = true
  
  try {
    await savePositionPositionMappings(
      supabase,
      props.userId,
      posKey,
      selectedPositionKeys.value
    )
    
    await queryClient.invalidateQueries({ queryKey: ['positionPositionMappings'] })
    await positionPositionMappingsQuery.refetch()
    
    showPositionAttachModal.value = false
    initializeTabulator()
    
    showToast('success', 'Positions Attached', `${selectedPositionKeys.value.size} position(s) attached`)
  } catch (error: any) {
    console.error('Error saving position mappings:', error)
    showToast('error', 'Failed to Save', error.message)
  } finally {
    isSavingPositions.value = false
  }
}

const filteredTrades = computed(() => {
  if (!tradesQuery.data.value) return []
  
  const query = tradeSearchQuery.value.toLowerCase().trim()
  if (!query) return tradesQuery.data.value
  
  // Split by comma and clean up each term
  const searchTerms = query.split(',').map(term => term.trim()).filter(Boolean)
  
  return tradesQuery.data.value.filter(trade => {
    const symbolTags = extractTagsFromTradesSymbol(trade.symbol).map(tag => tag.toLowerCase())
    
    // Check if ALL search terms match (AND logic)
    return searchTerms.every(term => {
      // Normalize search term: treat 'put' as 'p' and 'call' as 'c'
      let normalizedTerm = term
      if (term === 'put') normalizedTerm = 'p'
      if (term === 'call') normalizedTerm = 'c'
      
      // Check if any tag contains the normalized term
      if (symbolTags.some(tag => tag.includes(normalizedTerm))) {
        return true
      }
      
      // For fallback matching, check other fields
      return (
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
    contract_quantity: position.contract_quantity,
    asset_class: position.asset_class,
    conid: position.conid
  })
}

// Open trade attach modal
function openTradeAttachModal(position: Position) {
  selectedPositionForTrades.value = position
  selectedPositionForPositions.value = position
  tradeSearchQuery.value = ''
  positionSearchQuery.value = ''
  attachmentTab.value = 'trades'
  
  const posKey = getPositionKey(position)
  selectedTradeIds.value = new Set(positionTradesMap.value.get(posKey) || [])
  selectedPositionKeys.value = new Set(positionPositionsMap.value.get(posKey) || [])
  
  showPositionAttachModal.value = true
}

async function saveAttachments() {
  if (attachmentTab.value === 'trades') {
    await saveAttachedTrades()
  } else {
    await saveAttachedPositions()
  }
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
  const account = url.searchParams.get(`all_cts_clientId`) || undefined
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
  //if (payload.source === 'positions') return

  // Apply or clear the filter
  accountFilter.value = payload.accountId
  const url = new URL(window.location.href)
  if (payload.accountId) {
    url.searchParams.set(`all_cts_clientId`, payload.accountId)
  } else {
    url.searchParams.delete(`all_cts_clientId`)
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
    url.searchParams.set(`all_cts_clientId`, accountId)
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

const filteredPositions = computed(() => {
  if (!tabulator) return sourcePositions.value
  
  // Get filtered rows from tabulator
  const rows = tabulator.rowManager?.getDisplayRows() || []
  return rows
    .filter((row: any) => row.type === 'row' && !row.getData()?._isThesisGroup)
    .map((row: any) => row.getData())
})

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
  
  // Format as YYYY-MM-DD
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1).toString().padStart(2, '0')
  const day = dt.getDate().toString().padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

watch(showScreenshotsModal, (open) => {
  if (open) fetchScreenshots()
})

watch(asOfDate, () => {
  if (q.refetch) q.refetch()
})

watch(expandedPositions, (newVal, oldVal) => {
  // If position was collapsed, remove it from processing
  if (oldVal) {
    oldVal.forEach(key => {
      if (!newVal.has(key)) {
        processingPositions.value.delete(key)
      }
    })
  }
}, { deep: true })

// Clear cache when mappings change
watch([positionPositionsMap, positionTradesMap], () => {
  console.log('🔄 Clearing attached positions cache and processing flags due to mapping changes')
  attachedPositionsCache.value.clear()
  processingPositions.value.clear()
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

          <button @click="showPieChart = true" class="screenshot-btn" title="View Pie Chart">
            📊
          </button>
          
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
  <div v-if="showPositionAttachModal" class="modal-overlay" @click="showPositionAttachModal = false">
    <div class="modal-content trade-attach-modal" @click.stop>
      <div class="modal-header">
        <h3>Attach to Position</h3>
        <button class="modal-close" @click="showPositionAttachModal = false">&times;</button>
      </div>
      
      <div class="modal-body">
        <div v-if="selectedPositionForPositions" class="position-info">
          <strong>Position:</strong> 
          <span v-for="tag in extractTagsFromSymbol(selectedPositionForPositions.symbol)" :key="tag" class="fi-tag position-tag">
            {{ tag }}
          </span>
          • (Contract Qty: {{ selectedPositionForPositions.contract_quantity }} . Avg price: ${{ selectedPositionForPositions.avgPrice }})
        </div>

        <!-- Tabs -->
        <div class="attachment-tabs">
          <button 
            class="tab-button" 
            :class="{ active: attachmentTab === 'trades' }"
            @click="attachmentTab = 'trades'"
          >
            Trades
          </button>
          <button 
            class="tab-button" 
            :class="{ active: attachmentTab === 'positions' }"
            @click="attachmentTab = 'positions'"
          >
            Positions
          </button>
        </div>

        <!-- Trades Tab -->
        <div v-if="attachmentTab === 'trades'">
          <div class="trade-search">
            <input
              v-model="tradeSearchQuery"
              type="text"
              class="search-input"
              placeholder="Search trades (e.g., 'Put' or 'Call, 250')..."
            />
            <div class="search-hint">
              💡 <em>Use commas to search multiple terms (AND logic)</em>
            </div>
          </div>
          
          <div class="trades-list">
            <div
              v-for="trade in filteredTrades"
              :key="trade.tradeID"
              class="trade-item"
              :class="{ selected: selectedTradeIds.has(trade.tradeID!) }"
              @click="toggleTradeSelection(trade.tradeID!)"
            >
              <input
                type="checkbox"
                :checked="selectedTradeIds.has(trade.tradeID!)"
                @click.stop="toggleTradeSelection(trade.tradeID!)"
              />
              <div class="trade-details">
                <div class="trade-primary">
                  <span class="trade-side" :class="trade.buySell.toLowerCase()">
                    {{ trade.buySell }}
                  </span>
                  <strong>
                    <span v-for="tag in extractTagsFromTradesSymbol(trade.symbol)" :key="tag" class="fi-tag position-tag">
                      {{ tag }}
                    </span>
                  </strong>
                  <span style="color: #6c757d;">Qty: {{ trade.quantity }}</span>
                  <span style="color: #6c757d;">. Avg price: {{ trade.tradePrice }}</span>
                </div>
                <div class="trade-secondary">
                  <span>Trade date: {{ formatTradeDate(trade.tradeDate) }}</span>
                  <span>•</span>
                  <span>{{ trade.assetCategory }}</span>
                  <span v-if="trade.description">• {{ trade.description }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="filteredTrades.length === 0" style="padding: 2rem; text-align: center; color: #6c757d;">
              No trades found
            </div>
          </div>
        </div>

        <!-- Positions Tab -->
        <div v-else-if="attachmentTab === 'positions'">
          <div class="trade-search">
            <input
              v-model="positionSearchQuery"
              type="text"
              class="search-input"
              placeholder="Search positions (e.g., 'Put' or 'Call, 250')..."
            />
            <div class="search-hint">
              💡 <em>Showing positions with same underlying symbol. Use commas to search multiple terms.</em>
            </div>
          </div>
          
          <!-- Add loading state -->
          <div v-if="loadingAttachablePositions" style="padding: 2rem; text-align: center; color: #6c757d;">
            Loading positions...
          </div>
          
          <div v-else class="trades-list">
            <div
              v-for="position in filteredPositionsForAttach"
              :key="getPositionKey(position)"
              class="trade-item"
              :class="{ 
                selected: selectedPositionKeys.has(getPositionKey(position)),
                expired: isPositionExpired(position)
              }"
              @click="togglePositionSelection(getPositionKey(position))"
            >
              <input
                type="checkbox"
                :checked="selectedPositionKeys.has(getPositionKey(position))"
                @click.stop="togglePositionSelection(getPositionKey(position))"
              />
              <div class="trade-details">
                <div class="trade-primary">
                  <strong>
                    <span v-for="tag in extractTagsFromSymbol(position.symbol)" :key="tag" class="fi-tag position-tag">
                      {{ tag }}
                    </span>
                  </strong>
                  <span style="color: #6c757d;">Qty: {{ position.contract_quantity }}</span>
                  <span style="color: #6c757d;">Avg price: ${{ position.avgPrice }}</span>
                  <span v-if="isPositionExpired(position)" class="expired-badge">EXPIRED</span>
                </div>
                <div class="trade-secondary">
                  <span>{{ position.asset_class }}</span>
                  <span>•</span>
                  <span>{{ position.legal_entity }}</span>
                  <span v-if="position.market_value">• MV: ${{ formatCurrency(position.market_value) }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="filteredPositionsForAttach.length === 0" style="padding: 2rem; text-align: center; color: #6c757d;">
              No positions found
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="showPositionAttachModal = false">
          Cancel
        </button>
        <button 
          class="btn btn-primary" 
          @click="saveAttachments"
          :disabled="attachmentTab === 'trades' ? selectedTradeIds.size === 0 : selectedPositionKeys.size === 0"
        >
          Attach {{ attachmentTab === 'trades' ? selectedTradeIds.size : selectedPositionKeys.size }} 
          {{ attachmentTab === 'trades' ? 'Trade(s)' : 'Position(s)' }}
        </button>
      </div>
    </div>
  </div>

  <PositionsPieChart
    v-if="showPieChart"
    :positions="filteredPositions"
    @close="showPieChart = false"
  />
</template>

<style>
/* Import Tabulator CSS globally (not scoped) */
@import 'tabulator-tables/dist/css/tabulator_modern.min.css';
@import './styles/position-style.css';
</style>

<style scoped>
@import './styles/position-scoped.css';
</style>