<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, watch, inject, nextTick } from 'vue'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import { 
  usePositionsQuery, useThesisQuery, useThesisConnectionsQuery,
  extractSymbolRoot, type Position, type Thesis, type ThesisConnection,
  useSupabase
} from '@y2kfund/core'
import { useQueryClient } from '@tanstack/vue-query'
import type { PositionsProps } from './index'
import PositionSettings from './components/PositionSettings.vue'
import { useUrlState, type ColumnField, type ColumnRenames } from './composables'

const props = withDefaults(defineProps<PositionsProps>(), {
  accountId: 'demo', highlightPnL: false, showHeaderLink: false, window: null,
  userId: 'd87fdbc3-2190-4ebe-be93-ceccde557fb2'
})

const emit = defineEmits<{ 'row-click': [row: Position]; 'minimize': []; 'maximize': [] }>()

const accountFilter = ref<string | null>(null)
const assetClassFilter = ref<string | null>(null)
const numericFields = ['qty', 'avgPrice', 'price', 'market_value', 'unrealized_pnl', 'computed_cash_flow_on_entry', 'computed_cash_flow_on_exercise', 'contract_quantity', 'accounting_quantity'] as const
const windowId = props.window || inject<string | null>('positions', null)
const today = new Date().toISOString().slice(0, 10)
const asOfDate = ref<string | null>(null)
function clearAsOfDate() { asOfDate.value = null }

// Queries
const q = usePositionsQuery(props.accountId, props.userId, asOfDate)
const thesisQuery = useThesisQuery()
const thesisConnectionsQuery = useThesisConnectionsQuery()

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

// Tabulator
const tableDiv = ref<HTMLDivElement | null>(null)
let tabulator: Tabulator | null = null
const isTabulatorReady = ref(false)
const isTableInitialized = ref(false)

// Filters
const symbolTagFilters = ref<string[]>([])
const thesisTagFilters = ref<string[]>([])
type ActiveFilter = { field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis'; value: string }
const activeFilters = ref<ActiveFilter[]>([])

// Column visibility
const allColumnOptions: Array<{ field: ColumnField; label: string }> = [
  { field: 'legal_entity', label: 'Account' },
  { field: 'symbol', label: 'Name' },
  { field: 'avgPrice', label: 'Per Unit Price at Entry' },
  { field: 'instrument_market_price', label: 'Current Market Price' },
  { field: 'contract_quantity', label: 'Contract Qty' },
  { field: 'computed_cash_flow_on_entry', label: 'Premium Received' },
  { field: 'dte', label: 'DTE' },
  { field: 'delta', label: 'Delta' },
  { field: 'unrealized_pnl', label: 'P&L (Close Now)' },
  { field: 'be_price_pnl', label: 'P&L (Wait Till Expiry)' },
  { field: 'unrealized_pnl_pct', label: 'Unrealized P&L %' },
  { field: 'computed_be_price', label: 'Break Even Price' },
  { field: 'market_price', label: 'UL Current Market Price' },
  { field: 'ul_entry_price', label: 'UL Per Unit Price at Entry' },
  { field: 'computed_cash_flow_on_exercise', label: 'Buying Power if Exercised' },
  { field: 'entry_exercise_cash_flow_pct', label: 'Premium / Exercised %' },
  { field: 'ai_recommendation', label: 'AI Recommendation' },
  // Legacy
  { field: 'thesis', label: 'Thesis' },
  { field: 'expiry_date', label: 'Expiry date' },
  { field: 'asset_class', label: 'Asset Class' },
  { field: 'conid', label: 'Conid' },
  { field: 'undConid', label: 'Underlying Conid' },
  { field: 'multiplier', label: 'Multiplier' },
  { field: 'accounting_quantity', label: 'Accounting Quantity' },
  { field: 'weighted_avg_price', label: 'Weighted Avg Price' },
  { field: 'price', label: 'Market Price (raw)' },
  { field: 'market_value', label: 'Market Value' },
  { field: 'maintenance_margin_change', label: 'Maintenance Margin Change' }
]

const hiddenByDefault: ColumnField[] = ['thesis', 'expiry_date', 'asset_class', 'conid', 'undConid', 'multiplier', 'accounting_quantity', 'weighted_avg_price', 'price', 'market_value', 'maintenance_margin_change']
const urlState = useUrlState({ windowId, allColumnOptions, hiddenByDefault })
const {
  visibleCols: _visibleColsFromUrl, parseVisibleColsFromUrl, writeVisibleColsToUrl,
  parseColumnWidthsFromUrl, writeColumnWidthsToUrl,
  parseColumnRenamesFromUrl, writeColumnRenamesToUrl,
  parseSortFromUrl, writeSortToUrl, clearSortFromUrl,
  parseFiltersFromUrl, writeFiltersToUrl,
  writeAccountFilterToUrl, clearFiltersFromUrl,
  parseGroupByThesisFromUrl, writeGroupByThesisToUrl,
  parseAppNameFromUrl, writeAppNameToUrl
} = urlState

const visibleCols = ref<ColumnField[]>(parseVisibleColsFromUrl())
const columnWidths = ref<Record<string, number>>(parseColumnWidthsFromUrl())
const columnRenames = ref<ColumnRenames>({})

// Supabase + QueryClient
const supabase = useSupabase()
const queryClient = useQueryClient()

// ─── Helpers ───
function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return ''
  const opts: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD', minimumFractionDigits: value % 1 == 0 ? 0 : 2, maximumFractionDigits: value % 1 == 0 ? 0 : 2 }
  return new Intl.NumberFormat('en-US', opts).format(value)
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return ''
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)
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
  return `20${code.substring(0,2)}-${code.substring(2,4)}-${code.substring(4,6)}`
}

function getColLabel(field: ColumnField) {
  const opt = allColumnOptions.find(c => c.field === field)
  return columnRenames.value[field] || (opt?.label ?? field)
}

// ─── Toast System ───
type ToastType = 'success' | 'error' | 'warning' | 'info'
interface Toast { id: number; type: ToastType; title: string; message?: string }
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

// ─── Margin Impact Modal ───
const showMarginImpactModal = ref(false)
const marginImpactRowData = ref<any>(null)
const marginImpactData = ref<any>(null)
const marginImpactError = ref<string | null>(null)
const marginImpactLoading = ref(false)

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
    const { data: accountData, error: accountError } = await supabase
      .schema('hf').from('user_accounts_master')
      .select('broker_account_id, api_url')
      .eq('internal_account_id', internalAccountId).single()
    if (accountError || !accountData) throw new Error(`Account not found: ${accountError?.message || 'No data'}`)
    const url = `${accountData.api_url}/api/margin-impact?conid=${conid}&side=${side}&quantity=${quantity}&account_id=${accountData.broker_account_id}`
    const response = await fetch(url)
    marginImpactData.value = await response.json()
  } catch (error: any) {
    marginImpactError.value = error.message
  } finally {
    marginImpactLoading.value = false
  }
}
function closeMarginImpactModal() {
  showMarginImpactModal.value = false
  marginImpactRowData.value = null
  marginImpactData.value = null
  marginImpactError.value = null
}

// ─── IBKR Price Fetching ───
async function fetchLatestPriceForConid(rowData: any) {
  try {
    showToast('info', 'Fetching Price', `Fetching latest price for ${rowData.symbol}...`)
    const conid = rowData.conid
    const undConid = rowData.undConid
    if (!conid) { showToast('error', 'Error', 'No conid available'); return }
    const latestFetchQuery = await supabase.schema('hf').from('market_price').select('last_fetched_at').order('id', { ascending: false }).limit(1).single()
    let latestFetchedAt = latestFetchQuery.data?.last_fetched_at || new Date().toISOString()

    async function fetchAndUpsertPrice(targetConid: string, targetSymbol: string) {
      const ibkrApiUrl = `https://ibkr.bansi.to5001.aiworkspace.pro/api/marketdata?conid=${targetConid}`
      const response = await fetch(ibkrApiUrl)
      if (!response.ok) return null
      const data = await response.json()
      let price = null
      if (data?.['31']) {
        price = parseFloat(String(data['31']).replace(/^[^\d.-]+/, ''))
      }
      if (!price || isNaN(price)) return null
      const existing = await supabase.schema('hf').from('market_price').select('id, conid').eq('conid', targetConid).limit(1)
      if (existing.data?.length) {
        await supabase.schema('hf').from('market_price').update({ market_price: price, last_fetched_at: latestFetchedAt, updated_at: new Date().toISOString() }).eq('conid', targetConid)
      } else {
        await supabase.schema('hf').from('market_price').insert({ conid: targetConid, symbol: targetSymbol, market_price: price, last_fetched_at: latestFetchedAt, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      }
      return { conid: targetConid, price }
    }

    const results = []
    const r1 = await fetchAndUpsertPrice(conid, rowData.symbol)
    if (r1) results.push(r1)
    if (undConid && undConid !== conid) {
      const r2 = await fetchAndUpsertPrice(undConid, rowData.symbol)
      if (r2) results.push(r2)
    }
    if (results.length === 0) { showToast('error', 'Error', 'Could not fetch any prices'); return }
    showToast('success', 'Price Updated', `Updated price for ${rowData.symbol}: ${formatCurrency(results[0].price)}`)
    await queryClient.invalidateQueries({ queryKey: ['positions'] })
  } catch (error: any) {
    showToast('error', 'Error', `Failed to fetch price: ${error.message}`)
  }
}

// ─── Context Menus ───
function formatTimestampWithTimezone(timestamp: string | null | undefined): string {
  if (!timestamp) return '⏱️ Last Updated: Not available'
  try {
    const date = new Date(timestamp)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const tzMap: Record<string, string> = {
      'Asia/Kolkata': 'IST', 'Asia/Calcutta': 'IST',
      'America/New_York': date.getMonth() >= 2 && date.getMonth() < 10 ? 'EDT' : 'EST',
    }
    const tzName = tzMap[tz] || tz
    const d = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: tz })
    const t = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: tz })
    return `⏱️ Last Updated: ${d} at ${t} ${tzName}`
  } catch { return `⏱️ Last Updated: ${timestamp}` }
}

function createFetchedAtContextMenu() {
  return [
    { label: "Margin Impact", action: (e: any, cell: any) => { openMarginImpactModal(cell.getRow().getData()) } },
    { separator: true },
    { label: "Fetch Latest Price", action: (e: any, cell: any) => { fetchLatestPriceForConid(cell.getRow().getData()) } },
    { separator: true },
    { label: (component: any) => formatTimestampWithTimezone(component.getData().fetched_at), action: () => {}, disabled: true },
    { separator: true }
  ]
}

// ─── Numeric Header Filter ───
function numericHeaderFilter(headerValue: any, rowValue: any): boolean {
  if (!headerValue) return true
  const s = String(headerValue).trim()
  const opMatch = s.match(/^(<=|>=|=|!=|<|>)/)
  let op = '=', numStr = s
  if (opMatch) { op = opMatch[1]; numStr = s.slice(op.length).trim() }
  const numVal = parseFloat(numStr)
  if (isNaN(numVal)) return false
  const val = parseFloat(rowValue) || 0
  switch (op) {
    case '=': return val === numVal; case '!=': return val !== numVal
    case '<': return val < numVal; case '<=': return val <= numVal
    case '>': return val > numVal; case '>=': return val >= numVal
    default: return false
  }
}

// ─── Weighted Average Prices ───
const weightedAveragePrices = computed(() => {
  const map = new Map<string, { totalWeightedPrice: number; totalQty: number }>()
  sourcePositions.value.forEach(position => {
    const symbol = position.symbol
    if (!symbol || position.avgPrice == null || position.accounting_quantity == null) return
    if (!map.has(symbol)) map.set(symbol, { totalWeightedPrice: 0, totalQty: 0 })
    const entry = map.get(symbol)!
    entry.totalWeightedPrice += position.avgPrice * position.accounting_quantity
    entry.totalQty += position.accounting_quantity
  })
  const result = new Map<string, number>()
  map.forEach((value, symbol) => { if (value.totalQty !== 0) result.set(symbol, value.totalWeightedPrice / value.totalQty) })
  return result
})

// ─── Grid Data ───
const gridRowData = computed(() => sourcePositions.value)

// ─── Forward declarations ───
let updateFilters: () => void
let initializeTabulator: () => void

// ─── initializeTabulator ───
initializeTabulator = function() {
  if (!tableDiv.value) return
  if (tabulator) { try { tabulator.destroy() } catch {} tabulator = null }
  isTabulatorReady.value = false

  const allColumnsMap = new Map<string, any>()
  const allColumns: any[] = [
    { title: 'Account', field: 'legal_entity', minWidth: 80, width: columnWidths.value['legal_entity'] || undefined, frozen: true,
      visible: visibleCols.value.includes('legal_entity'), headerFilter: 'input', headerFilterPlaceholder: 'Filter',
      headerFilterFunc: (hv: any, rv: any) => { if (!hv) return true; const v = typeof rv === 'object' && rv !== null ? (rv.name || rv.id || '') : (rv || ''); return String(v).toLowerCase().includes(String(hv).toLowerCase()) },
      bottomCalc: () => 'Total', bottomCalcFormatter: () => 'Total',
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('legal_entity')}</span></div>`,
      formatter: (cell: any) => { const v = cell.getValue(); return typeof v === 'object' && v !== null ? (v.name || v.id) : v },
      cellClick: (e: any, cell: any) => { const v = cell.getValue(); handleCellFilterClick('legal_entity', typeof v === 'object' && v !== null ? (v.name || v.id) : v) },
      contextMenu: createFetchedAtContextMenu()
    },
    { title: 'Name', field: 'symbol', minWidth: 120, width: columnWidths.value['symbol'] || undefined,
      cssClass: 'col-group-start',
      visible: visibleCols.value.includes('symbol'), headerFilter: 'input', headerFilterPlaceholder: 'Filter symbol',
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('symbol')}</span></div>`,
      formatter: (cell: any) => {
        const val = cell.getValue(); if (!val) return ''
        const tags = extractTagsFromSymbol(val)
        return tags.map(t => `<span class="fi-tag">${t}</span>`).join(' ')
      },
      cellClick: (e: any, cell: any) => {
        const target = e.target as HTMLElement
        if (target.classList.contains('fi-tag')) handleCellFilterClick('symbol', target.textContent?.trim() || '')
      },
      contextMenu: createFetchedAtContextMenu()
    },
    { title: 'Per Unit Price at Entry', field: 'avgPrice', minWidth: 80, width: columnWidths.value['avgPrice'] || undefined, hozAlign: 'right',
      visible: visibleCols.value.includes('avgPrice'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >100',
      headerFilterFunc: numericHeaderFilter, bottomCalc: 'avg',
      bottomCalcFormatter: (cell: any) => { const v = cell.getValue(); if (v == null || !Number.isFinite(v)) return ''; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) },
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('avgPrice')}</span></div>`,
      formatter: (cell: any) => { const v = cell.getValue(); if (v == null || !Number.isFinite(v)) return ''; return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) },
      contextMenu: createFetchedAtContextMenu()
    },
    { title: 'Current Market Price', field: 'instrument_market_price', minWidth: 80, width: columnWidths.value['instrument_market_price'] || undefined, hozAlign: 'right',
      visible: visibleCols.value.includes('instrument_market_price'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >100', headerFilterFunc: numericHeaderFilter,
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('instrument_market_price')}</span></div>`,
      mutator: (value: any, data: any) => {
        if (data.asset_class === 'OPT') return data.option_market_price ?? data.price ?? null
        return data.market_price ?? data.price ?? null
      },
      formatter: (cell: any) => { const v = cell.getValue(); return v != null ? formatCurrency(v) : '<span style="color:#aaa;">-</span>' },
      contextMenu: createFetchedAtContextMenu()
    },
    { title: 'Contract Qty', field: 'contract_quantity', minWidth: 60, width: columnWidths.value['contract_quantity'] || undefined, hozAlign: 'right',
      visible: visibleCols.value.includes('contract_quantity'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >10', headerFilterFunc: numericHeaderFilter,
      bottomCalc: 'sum', bottomCalcFormatter: (cell: any) => formatNumber(cell.getValue()),
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('contract_quantity')}</span></div>`,
      formatter: (cell: any) => formatNumber(cell.getValue()),
      contextMenu: createFetchedAtContextMenu()
    },
    { title: 'Premium Received', field: 'computed_cash_flow_on_entry', minWidth: 80, width: columnWidths.value['computed_cash_flow_on_entry'] || undefined, hozAlign: 'right',
      cssClass: 'col-group-end',
      visible: visibleCols.value.includes('computed_cash_flow_on_entry'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >1000', headerFilterFunc: numericHeaderFilter,
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => { const v = cell.getValue(); return `<span class="${v > 0 ? 'pnl-positive' : v < 0 ? 'pnl-negative' : 'pnl-zero'}">${formatCurrency(v)}</span>` },
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('computed_cash_flow_on_entry')}</span></div>`,
      formatter: (cell: any) => { const v = cell.getValue(); return `<span class="${v > 0 ? 'pnl-positive' : v < 0 ? 'pnl-negative' : 'pnl-zero'}">${formatCurrency(v)}</span>` },
      contextMenu: createFetchedAtContextMenu()
    },
    // DTE
    { title: 'DTE', field: 'dte', minWidth: 60, width: columnWidths.value['dte'] || 80, hozAlign: 'right',
      visible: visibleCols.value.includes('dte'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >30', headerFilterFunc: numericHeaderFilter,
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('dte')}</span></div>`,
      formatter: (cell: any) => {
        const row = cell.getRow().getData()
        if (row.asset_class !== 'OPT') return '<span style="color:#aaa;font-style:italic;">N/A</span>'
        const tags = extractTagsFromSymbol(row.symbol)
        const expiryStr = tags[1]
        if (!expiryStr) return '-'
        const expiry = new Date(expiryStr); const now = new Date(); now.setHours(0,0,0,0); expiry.setHours(0,0,0,0)
        const days = Math.ceil((expiry.getTime() - now.getTime()) / 86400000)
        if (days < 0) return '<span style="color:#dc3545;font-weight:bold;">Expired</span>'
        const style = days <= 7 ? 'color:#dc3545;font-weight:bold;' : days <= 30 ? 'color:#fd7e14;font-weight:bold;' : 'color:inherit;'
        return `<span style="${style}">${days}d</span>`
      },
      sorter: (a: any, b: any, aRow: any, bRow: any) => {
        const getDte = (d: any) => {
          if (d.asset_class !== 'OPT') return Infinity
          const t = extractTagsFromSymbol(d.symbol)
          if (!t[1]) return Infinity
          const days = Math.ceil((new Date(t[1]).getTime() - Date.now()) / 86400000)
          return days < 0 ? Infinity : days  // expired → always last in ASC
        }
        return getDte(aRow.getData()) - getDte(bRow.getData())
      },
      contextMenu: createFetchedAtContextMenu()
    },
    // Delta
    { title: 'Delta', field: 'delta', minWidth: 60, width: columnWidths.value['delta'] || 80, hozAlign: 'right',
      visible: visibleCols.value.includes('delta'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >0.5', headerFilterFunc: numericHeaderFilter,
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('delta')}</span></div>`,
      formatter: (cell: any) => {
        const row = cell.getRow().getData()
        if (row.asset_class !== 'OPT') return ''
        const v = cell.getValue()
        if (v == null) return '<span style="color:#aaa;">-</span>'
        const d = parseFloat(v); if (isNaN(d)) return '-'
        const abs = Math.abs(d)
        const s = abs >= 0.7 ? 'color:#dc3545;font-weight:bold;' : abs >= 0.3 ? 'color:#fd7e14;' : 'color:#28a745;'
        return `<span style="${s}">${d.toFixed(2)}</span>`
      },
      bottomCalc: false, contextMenu: createFetchedAtContextMenu()
    },
    // P&L Close Now
    { title: 'Close Now', field: 'unrealized_pnl', minWidth: 80, width: columnWidths.value['unrealized_pnl'] || undefined, hozAlign: 'right',
      cssClass: 'col-group-start',
      visible: visibleCols.value.includes('unrealized_pnl'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >0', headerFilterFunc: numericHeaderFilter,
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => { const v = cell.getValue(); return `<span class="${v > 0 ? 'pnl-positive' : v < 0 ? 'pnl-negative' : 'pnl-zero'}">${formatCurrency(Math.round(v))}</span>` },
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('unrealized_pnl')}</span></div>`,
      formatter: (cell: any) => { const v = cell.getValue(); return `<span class="${v > 0 ? 'pnl-positive' : v < 0 ? 'pnl-negative' : 'pnl-zero'}">${formatCurrency(Math.round(v))}</span>` },
      contextMenu: createFetchedAtContextMenu()
    },
    // P&L Wait Till Expiry (BE Price P&L)
    { title: 'Wait Till Expiry', field: 'be_price_pnl', minWidth: 80, width: columnWidths.value['be_price_pnl'] || undefined, hozAlign: 'right',
      visible: visibleCols.value.includes('be_price_pnl'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >0', headerFilterFunc: numericHeaderFilter,
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('be_price_pnl')}</span></div>`,
      mutator: (value: any, data: any) => {
        // Only for put options (matches Positions.vue logic)
        if (data.asset_class !== 'OPT' || !data.computed_be_price || !data.market_price) return null
        if (!data.symbol || !data.symbol.includes('P')) return null
        const bePrice = parseFloat(data.computed_be_price)
        const marketPrice = parseFloat(data.market_price)
        if (isNaN(bePrice) || isNaN(marketPrice)) return null
        // Extract strike price from symbol tags (3rd tag)
        const tags = extractTagsFromSymbol(data.symbol)
        const strikePrice = tags[2] ? parseFloat(tags[2]) : null
        if (strikePrice === null || isNaN(strikePrice)) return null
        const qty = Math.abs(data.contract_quantity || data.qty || 0)
        const mult = data.multiplier || 100
        // min(underlyingCurrentPrice, strikePrice) — caps payout at strike
        const effectivePrice = Math.min(marketPrice, strikePrice)
        return (effectivePrice - bePrice) * qty * mult
      },
      formatter: (cell: any) => {
        const v = cell.getValue()
        if (v == null) return '<span style="color:#aaa;font-style:italic;">N/A</span>'
        return `<span class="${v > 0 ? 'pnl-positive' : v < 0 ? 'pnl-negative' : 'pnl-zero'}">${formatCurrency(Math.round(v))}</span>`
      },
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => { const v = cell.getValue(); return `<span class="${v > 0 ? 'pnl-positive' : v < 0 ? 'pnl-negative' : 'pnl-zero'}">${formatCurrency(Math.round(v))}</span>` },
      contextMenu: createFetchedAtContextMenu()
    },
    // Unrealized P&L %
    { title: 'Unrealized %', field: 'unrealized_pnl_pct', minWidth: 80, width: columnWidths.value['unrealized_pnl_pct'] || 100, hozAlign: 'right',
      cssClass: 'col-group-end',
      visible: visibleCols.value.includes('unrealized_pnl_pct'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >50', headerFilterFunc: numericHeaderFilter,
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('unrealized_pnl_pct')}</span></div>`,
      mutator: (value: any, data: any) => {
        const pnl = parseFloat(data.unrealized_pnl); const entry = parseFloat(data.computed_cash_flow_on_entry)
        if (isNaN(pnl) || isNaN(entry) || entry === 0) return null
        return (pnl / Math.abs(entry)) * 100
      },
      formatter: (cell: any) => {
        const v = cell.getValue()
        if (v == null) return '<span style="color:#aaa;font-style:italic;">N/A</span>'
        const pct = parseFloat(v); if (isNaN(pct)) return '-'
        const fmt = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
        return `<span class="${pct > 0 ? 'pnl-positive' : pct < 0 ? 'pnl-negative' : 'pnl-zero'}">${fmt}</span>`
      },
      bottomCalc: false, contextMenu: createFetchedAtContextMenu()
    },
    // Break Even Price (first col of Underlying Instrument group)
    { title: 'Break Even Price', field: 'computed_be_price', minWidth: 80, width: columnWidths.value['computed_be_price'] || undefined, hozAlign: 'right',
      cssClass: 'col-group-start',
      visible: visibleCols.value.includes('computed_be_price'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >100', headerFilterFunc: numericHeaderFilter,
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('computed_be_price')}</span></div>`,
      formatter: (cell: any) => {
        const v = cell.getValue(); if (v == null) return '-'
        const row = cell.getRow().getData(); const tags = extractTagsFromSymbol(row.symbol); const right = tags[3]
        let prefix = ''
        if (row.qty < 0) { if (right === 'P') prefix = '> '; else if (right === 'C') prefix = '< ' }
        return prefix + formatNumber(v)
      },
      contextMenu: createFetchedAtContextMenu()
    },
    // UL Current Market Price
    { title: 'Current Mkt Price', field: 'market_price', minWidth: 80, width: columnWidths.value['market_price'] || undefined, hozAlign: 'right',
      visible: visibleCols.value.includes('market_price'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >100', headerFilterFunc: numericHeaderFilter,
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('market_price')}</span></div>`,
      formatter: (cell: any) => { const v = cell.getValue(); return v != null ? formatCurrency(v) : '<span style="color:#aaa;">-</span>' },
      contextMenu: createFetchedAtContextMenu()
    },
    // UL Per Unit Price at Entry (N/A — last col of Underlying Instrument group)
    { title: 'Entry Price', field: 'ul_entry_price', minWidth: 80, width: columnWidths.value['ul_entry_price'] || 100, hozAlign: 'right',
      cssClass: 'col-group-end',
      visible: visibleCols.value.includes('ul_entry_price'),
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('ul_entry_price')}</span></div>`,
      formatter: () => '<span style="color:#aaa;font-style:italic;">N/A</span>', bottomCalc: false
    },
    // Buying Power if Exercised
    { title: 'Buying Power if Exercised', field: 'computed_cash_flow_on_exercise', minWidth: 80, width: columnWidths.value['computed_cash_flow_on_exercise'] || undefined, hozAlign: 'right',
      visible: visibleCols.value.includes('computed_cash_flow_on_exercise'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >1000', headerFilterFunc: numericHeaderFilter,
      bottomCalc: 'sum',
      bottomCalcFormatter: (cell: any) => { const v = cell.getValue(); return `<span class="${v > 0 ? 'pnl-positive' : v < 0 ? 'pnl-negative' : 'pnl-zero'}">${formatCurrency(v)}</span>` },
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('computed_cash_flow_on_exercise')}</span></div>`,
      formatter: (cell: any) => { const v = cell.getValue(); return `<span class="${v > 0 ? 'pnl-positive' : v < 0 ? 'pnl-negative' : 'pnl-zero'}">${formatCurrency(v)}</span>` },
      contextMenu: createFetchedAtContextMenu()
    },
    // Premium / Exercised %
    { title: 'Premium / Exercised %', field: 'entry_exercise_cash_flow_pct', minWidth: 100, width: columnWidths.value['entry_exercise_cash_flow_pct'] || undefined, hozAlign: 'right',
      visible: visibleCols.value.includes('entry_exercise_cash_flow_pct'), headerFilter: 'input', headerFilterPlaceholder: 'e.g. >100', headerFilterFunc: numericHeaderFilter,
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('entry_exercise_cash_flow_pct')}</span></div>`,
      formatter: (cell: any) => {
        const row = cell.getRow().getData()
        if (row.asset_class === 'OPT' && row.computed_cash_flow_on_entry != null && row.computed_cash_flow_on_exercise != null && row.computed_cash_flow_on_exercise !== 0) {
          const pct = (row.computed_cash_flow_on_entry / row.computed_cash_flow_on_exercise) * 100
          return `<span>${Math.abs(parseFloat(pct.toFixed(2)))}%</span>`
        }
        return '<span style="color:#aaa;font-style:italic;">N/A</span>'
      },
      bottomCalc: false, contextMenu: createFetchedAtContextMenu()
    },
    // AI Recommendation
    { title: 'AI Recommendation', field: 'ai_recommendation', minWidth: 100, width: columnWidths.value['ai_recommendation'] || 140, hozAlign: 'center',
      visible: visibleCols.value.includes('ai_recommendation'),
      titleFormatter: () => `<div class="header-with-close"><span>${getColLabel('ai_recommendation')}</span></div>`,
      formatter: (cell: any) => {
        const row = cell.getRow().getData()
        if (row.asset_class !== 'OPT') return ''
        // Recompute unrealized_pnl_pct (same formula as the mutator)
        const pnl = parseFloat(row.unrealized_pnl)
        const entry = parseFloat(row.computed_cash_flow_on_entry)
        if (isNaN(pnl) || isNaN(entry) || entry === 0) return ''
        const pct = (pnl / Math.abs(entry)) * 100
        if (pct >= 60) {
          return `<span title="Unrealized P&L is >= 60% of premium collected. Consider closing (BTC) to lock in gains and rolling to a new position (STO)." style="color:#155724;background:#d4edda;border:1px solid #c3e6cb;border-radius:4px;padding:2px 6px;font-size:0.8em;font-weight:600;white-space:nowrap;cursor:help;">📈 Unrealized P&amp;L ≥ 60%. Claim the profit &amp; roll</span>`
        }
        return ''
      }, bottomCalc: false
    },
    // Legacy columns (hidden by default)
    { title: 'Thesis', field: 'thesis', visible: visibleCols.value.includes('thesis'), formatter: (cell: any) => cell.getValue()?.title || '', contextMenu: createFetchedAtContextMenu() },
    { title: 'Expiry', field: 'expiry_date', visible: visibleCols.value.includes('expiry_date'), formatter: (cell: any) => { const tags = extractTagsFromSymbol(cell.getRow().getData().symbol); return tags[1] || '-' }, contextMenu: createFetchedAtContextMenu() },
    { title: 'Asset Class', field: 'asset_class', visible: visibleCols.value.includes('asset_class'), cellClick: (e: any, cell: any) => handleCellFilterClick('asset_class', cell.getValue()), contextMenu: createFetchedAtContextMenu() },
    { title: 'Conid', field: 'conid', visible: visibleCols.value.includes('conid') },
    { title: 'UndConid', field: 'undConid', visible: visibleCols.value.includes('undConid') },
    { title: 'Multiplier', field: 'multiplier', visible: visibleCols.value.includes('multiplier') },
    { title: 'Acct Qty', field: 'accounting_quantity', visible: visibleCols.value.includes('accounting_quantity'), hozAlign: 'right', formatter: (cell: any) => formatNumber(cell.getValue()) },
    { title: 'Weighted Avg', field: 'weighted_avg_price', visible: visibleCols.value.includes('weighted_avg_price'), hozAlign: 'right',
      mutator: (v: any, d: any) => weightedAveragePrices.value.get(d.symbol) ?? null,
      formatter: (cell: any) => { const v = cell.getValue(); return v != null ? formatCurrency(v) : '-' }
    },
    { title: 'Price', field: 'price', visible: visibleCols.value.includes('price'), hozAlign: 'right', formatter: (cell: any) => formatCurrency(cell.getValue()) },
    { title: 'Market Value', field: 'market_value', visible: visibleCols.value.includes('market_value'), hozAlign: 'right', formatter: (cell: any) => formatCurrency(cell.getValue()), bottomCalc: 'sum', bottomCalcFormatter: (cell: any) => formatCurrency(cell.getValue()) },
    { title: 'Margin Change', field: 'maintenance_margin_change', visible: visibleCols.value.includes('maintenance_margin_change'), hozAlign: 'right', formatter: (cell: any) => { const v = cell.getValue(); if (!v) return '-'; return formatCurrency(parseFloat(v.replace(/,/g, ''))) } },
  ]
  allColumns.forEach(col => allColumnsMap.set(col.field, col))

  // Build grouped columns
  const getCol = (field: string) => allColumnsMap.get(field)
  const columns: any[] = [
    getCol('legal_entity'),
    { title: 'Financial Instrument', headerHozAlign: 'center', columns: [getCol('symbol'), getCol('avgPrice'), getCol('instrument_market_price'), getCol('contract_quantity'), getCol('computed_cash_flow_on_entry')].filter(Boolean) },
    getCol('dte'),
    getCol('delta'),
    { title: 'P&L', headerHozAlign: 'center', columns: [getCol('unrealized_pnl'), getCol('be_price_pnl'), getCol('unrealized_pnl_pct')].filter(Boolean) },
    { title: 'Underlying Instrument', headerHozAlign: 'center', columns: [getCol('computed_be_price'), getCol('market_price'), getCol('ul_entry_price')].filter(Boolean) },
    getCol('computed_cash_flow_on_exercise'),
    getCol('entry_exercise_cash_flow_pct'),
    getCol('ai_recommendation'),
    // Legacy
    getCol('thesis'), getCol('expiry_date'), getCol('asset_class'), getCol('conid'), getCol('undConid'),
    getCol('multiplier'), getCol('accounting_quantity'), getCol('weighted_avg_price'), getCol('price'),
    getCol('market_value'), getCol('maintenance_margin_change'),
  ].filter(Boolean)

  tabulator = new Tabulator(tableDiv.value, {
    data: gridRowData.value,
    columns,
    columnHeaderVertAlign: 'bottom',
    layout: 'fitDataFill',
    height: '100%',
    renderHorizontal: 'basic',
    movableColumns: true,
    resizableColumns: true,
    headerSortClickElement: 'icon',
    initialSort: parseSortFromUrl() ? [parseSortFromUrl()!] : [{ column: 'dte', dir: 'asc' }],
    placeholder: 'No positions to display',
  })

  tabulator.on('tableBuilt', () => {
    isTabulatorReady.value = true
    isTableInitialized.value = true
    if (updateFilters) updateFilters()
    updateFilteredPositionsCount()
  })

  tabulator.on('dataSorted', (sorters: any) => {
    if (sorters.length > 0) writeSortToUrl(sorters[0].field, sorters[0].dir)
    else clearSortFromUrl()
  })

  tabulator.on('columnResized', (column: any) => {
    const field = column.getField()
    const width = column.getWidth()
    columnWidths.value[field] = width
    writeColumnWidthsToUrl(columnWidths.value)
  })

  tabulator.on('dataFiltered', () => updateFilteredPositionsCount())
  tabulator.on('rowClick', (e: any, row: any) => {
    const data = row.getData()
    if (data) emit('row-click', data)
  })
}

// ─── Lifecycle ───
// Watch both data AND tableDiv - covers all timing scenarios
watch([() => q.data.value, tableDiv], async ([data, div]) => {
  if (data && div && q.isSuccess.value && !isTableInitialized.value) {
    await nextTick()
    initializeTabulator()
  }
})

// Re-filter when filter state changes
watch([accountFilter, symbolTagFilters, thesisTagFilters], () => {
  if (isTableInitialized.value) {
    updateFilters()
    if (tabulator) tabulator.redraw(true)
  }
})

watch(asOfDate, () => { if (q.refetch) q.refetch() })

function handleExternalAccountFilter(payload: { accountId: string | null, source: string }) {
  accountFilter.value = payload.accountId
  const url = new URL(window.location.href)
  if (payload.accountId) url.searchParams.set('all_cts_clientId', payload.accountId)
  else url.searchParams.delete('all_cts_clientId')
  window.history.replaceState({}, '', url.toString())
  updateFilters()
}

function handleExternalSymbolFilter(payload: { symbolTags: string[], source: string }) {
  if (payload.source === 'positions') return
  symbolTagFilters.value = payload.symbolTags
  const url = new URL(window.location.href)
  if (payload.symbolTags.length > 0) url.searchParams.set(`${windowId}_all_cts_fi`, payload.symbolTags.join('-and-'))
  else url.searchParams.delete(`${windowId}_all_cts_fi`)
  window.history.replaceState({}, '', url.toString())
  updateFilters()
}

onMounted(async () => {
  appName.value = parseAppNameFromUrl()
  const filters = parseFiltersFromUrl()
  if (filters.symbol) symbolTagFilters.value = filters.symbol.split(',').map(s => s.trim())
  if (filters.thesis) thesisTagFilters.value = filters.thesis.split(',').map(s => s.trim())
  if (filters.legal_entity) accountFilter.value = filters.legal_entity
  if (filters.asset_class) assetClassFilter.value = filters.asset_class
  columnRenames.value = parseColumnRenamesFromUrl()
  if (q.isSuccess.value && tableDiv.value && !isTableInitialized.value) {
    await nextTick()
    initializeTabulator()
  }
  updateFilters()
  if (eventBus) {
    eventBus.on('account-filter-changed', handleExternalAccountFilter)
    eventBus.on('symbol-filter-changed', handleExternalSymbolFilter)
  }
  nextTick(() => updateFilteredPositionsCount())
})

onBeforeUnmount(() => {
  if (tabulator) tabulator.destroy()
  if (eventBus) {
    eventBus.off('account-filter-changed', handleExternalAccountFilter)
    eventBus.off('symbol-filter-changed', handleExternalSymbolFilter)
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
  if (tabulator && sortFromUrl) tabulator.setSort(sortFromUrl.field, sortFromUrl.dir)
  appName.value = parseAppNameFromUrl()
})

function syncActiveFiltersFromTable() {
  const next: ActiveFilter[] = []
  if (accountFilter.value) next.push({ field: 'legal_entity', value: accountFilter.value })
  if (assetClassFilter.value) next.push({ field: 'asset_class', value: assetClassFilter.value })
  if (symbolTagFilters.value.length > 0) next.push({ field: 'symbol', value: symbolTagFilters.value.join(', ') })
  if (thesisTagFilters.value.length > 0) next.push({ field: 'thesis', value: thesisTagFilters.value.join(', ') })
  activeFilters.value = next
}

updateFilters = function() {
  if (!tabulator || !isTabulatorReady.value) return
  try {
    tabulator.replaceData(gridRowData.value)
    tabulator.clearFilter()
    tabulator.setFilter((data: any) => {
      if (!data) return false
      if (accountFilter.value) {
        const accountVal = typeof data.legal_entity === 'object' && data.legal_entity !== null ? (data.legal_entity.name || data.legal_entity.id) : data.legal_entity
        if (accountVal !== accountFilter.value) return false
      }
      if (assetClassFilter.value && data.asset_class !== assetClassFilter.value) return false
      if (symbolTagFilters.value.length > 0) {
        const tags = extractTagsFromSymbol(data.symbol || '')
        if (!symbolTagFilters.value.every(t => tags.includes(t))) return false
      }
      if (thesisTagFilters.value.length > 0) {
        if (!data.thesis?.title || !thesisTagFilters.value.includes(data.thesis.title)) return false
      }
      return true
    })
    syncActiveFiltersFromTable()
    nextTick(() => updateFilteredPositionsCount())
  } catch (error) { console.warn('Error in updateFilters:', error) }
}

const filteredPositionsCount = ref(0)
function updateFilteredPositionsCount() {
  if (!tabulator) { filteredPositionsCount.value = 0; return }
  filteredPositionsCount.value = tabulator.rowManager.getDisplayRows().filter(row => row.type === "row").length
}

const filteredPositions = computed(() => {
  if (!tabulator) return sourcePositions.value
  return (tabulator.rowManager?.getDisplayRows() || []).filter((r: any) => r.type === 'row').map((r: any) => r.getData())
})

// ─── Filter Handlers ───
const eventBus = inject<any>('eventBus')
const appName = ref('Positions')

function handleCellFilterClick(field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis', value: any) {
  if (field === 'symbol') {
    const tag = String(value).trim()
    const idx = symbolTagFilters.value.indexOf(tag)
    if (idx >= 0) symbolTagFilters.value.splice(idx, 1)
    else symbolTagFilters.value.push(tag)
    updateFilters()
    if (eventBus) eventBus.emit('symbol-filter-changed', { symbolTags: symbolTagFilters.value, source: 'positions' })
  } else if (field === 'legal_entity') {
    accountFilter.value = String(value)
    const url = new URL(window.location.href)
    url.searchParams.set('all_cts_clientId', String(value))
    window.history.replaceState({}, '', url.toString())
    updateFilters()
    if (eventBus) eventBus.emit('account-filter-changed', { accountId: value, source: 'positions' })
  } else if (field === 'asset_class') {
    assetClassFilter.value = String(value)
    updateFilters()
  } else if (field === 'thesis') {
    const title = value?.title || String(value)
    const idx = thesisTagFilters.value.indexOf(title)
    if (idx >= 0) thesisTagFilters.value.splice(idx, 1)
    else thesisTagFilters.value.push(title)
    updateFilters()
  }
}

function clearFilter(field: 'symbol' | 'asset_class' | 'legal_entity' | 'thesis') {
  if (field === 'symbol') symbolTagFilters.value = []
  else if (field === 'thesis') thesisTagFilters.value = []
  else if (field === 'legal_entity') {
    accountFilter.value = null
    const url = new URL(window.location.href); url.searchParams.delete('all_cts_clientId'); window.history.replaceState({}, '', url.toString())
    if (eventBus) eventBus.emit('account-filter-changed', { accountId: null, source: 'positions' })
  } else if (field === 'asset_class') assetClassFilter.value = null
  updateFilters()
}

function clearAllFilters() {
  symbolTagFilters.value = []; thesisTagFilters.value = []; accountFilter.value = null; assetClassFilter.value = null
  const url = new URL(window.location.href)
  url.searchParams.delete('all_cts_clientId'); url.searchParams.delete(`${windowId}_all_cts_fi`)
  url.searchParams.delete(`${windowId}_all_cts_thesis`); url.searchParams.delete(`${windowId}_fac`)
  window.history.replaceState({}, '', url.toString())
  if (eventBus) eventBus.emit('account-filter-changed', { accountId: null, source: 'positions' })
  updateFilters()
}

function handleAppNameUpdate(newName: string) { appName.value = newName; writeAppNameToUrl(newName) }
function handleVisibleColsUpdate(newCols: ColumnField[]) { visibleCols.value = newCols; writeVisibleColsToUrl(newCols); nextTick(() => initializeTabulator()) }
function handleColumnRenamesUpdate(newRenames: ColumnRenames) { columnRenames.value = newRenames; writeColumnRenamesToUrl(newRenames); nextTick(() => initializeTabulator()) }
function handleHeaderClick() { window.location.href = '/positions' }

function syncFiltersToUrl() {
  writeFiltersToUrl({ symbolTagFilters: symbolTagFilters.value, thesisTagFilters: thesisTagFilters.value, assetClassFilter: assetClassFilter.value })
}

function toggleBottomCalc() {
  if (!tabulator || !isTabulatorReady.value) return
  try { tabulator.redraw() } catch {}
}

function hideColumnFromHeader(field: ColumnField) {
  const index = visibleCols.value.indexOf(field)
  if (index > -1) {
    visibleCols.value.splice(index, 1)
    writeVisibleColsToUrl(visibleCols.value)
    nextTick(() => initializeTabulator())
  }
}


</script>

<template>
  <div class="positions-card dashboard-container">
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
        </h2>
        <div class="positions-date-picker">
          <label for="asOfDate">As of:</label>
          <input id="asOfDate" type="date" v-model="asOfDate" :max="today" style="margin-left: 0.5em;" />
          <button v-if="asOfDate" @click="clearAsOfDate" style="margin-left: 0.5em;">Clear</button>
          <span v-if="q.isFetching.value" style="margin-left: 0.7em; color: #888;">Loading...</span>
        </div>
        <div class="positions-tools">
          <div class="positions-count">{{ filteredPositionsCount }} positions</div>
          <PositionSettings
            :app-name="appName"
            :visible-cols="visibleCols"
            :all-column-options="allColumnOptions"
            :column-renames="columnRenames"
            @update:app-name="handleAppNameUpdate"
            @update:visible-cols="handleVisibleColsUpdate"
            @update:column-renames="handleColumnRenamesUpdate"
          />
          <button @click="emit('maximize')" class="minimize-button" title="Maximize">⤢</button>
          <button @click="emit('minimize')" class="minimize-button" title="Close">X</button>
        </div>
      </div>
      
      <div v-if="activeFilters.length" class="filters-bar">
        <span class="filters-label">Filtered by:</span>
        <div class="filters-tags">
          <span v-for="f in activeFilters" :key="`${f.field}-${f.value}`" class="filter-tag">
            <strong>{{ f.field === 'symbol' ? 'Instrument' : f.field === 'legal_entity' ? 'Account' : f.field === 'thesis' ? 'Thesis' : 'Asset Class' }}:</strong> {{ f.value }}
            <button class="tag-clear" @click="clearFilter(f.field)">✕</button>
          </span>
          <button class="btn btn-clear-all" @click="clearAllFilters">Clear all</button>
        </div>
      </div>

      <div ref="tableDiv" class="positions-grid"></div>
    </div>

    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast', `toast-${toast.type}`]" @click="removeToast(toast.id)">
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

  <!-- Margin Impact Modal -->
  <div v-if="showMarginImpactModal" class="modal-overlay" @click="closeMarginImpactModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Margin Impact</h3>
        <button class="modal-close" @click="closeMarginImpactModal">&times;</button>
      </div>
      <div class="modal-body">
        <p>Closing out this position would have the following impact on your margin requirements:</p>
        <div v-if="marginImpactLoading" class="loading-state"><div class="loading-spinner"></div> Loading...</div>
        <div v-else-if="marginImpactError" class="error-state">Error: {{ marginImpactError }}</div>
        <div v-else-if="!marginImpactData" class="no-data-state">No margin impact data available</div>
        <div v-else>
          <table class="margin-impact-table">
            <thead><tr><th>Metric</th><th>Current</th><th>Change</th><th>Post-Trade</th></tr></thead>
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
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import 'tabulator-tables/dist/css/tabulator_modern.min.css';
@import './styles/position-style.css';

/* Column group boundary separators */
.tabulator .tabulator-cell.col-group-start,
.tabulator .tabulator-col.col-group-start {
  border-left: 2px solid #4a90d9 !important;
}
.tabulator .tabulator-cell.col-group-end,
.tabulator .tabulator-col.col-group-end {
  border-right: 2px solid #4a90d9 !important;
}

/* Hide background on stretched last-column cells (fitDataFill filler) */
.tabulator .tabulator-row .tabulator-cell:last-child:empty,
.tabulator .tabulator-row .tabulator-cell[tabulator-field="ai_recommendation"] {
  background: transparent !important;
}
</style>

<style scoped>
@import './styles/position-scoped.css';
</style>
