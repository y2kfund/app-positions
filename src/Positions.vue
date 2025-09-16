<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule } from 'ag-grid-community'
import type { ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { usePositionsQuery, type Position } from '@y2kfund/core'
import type { PositionsProps } from './index'

const props = withDefaults(defineProps<PositionsProps>(), {
  accountId: 'demo',
  highlightPnL: false
})

const emit = defineEmits<{ 
  'row-click': [row: Position]
}>()

// Query positions data with realtime updates
const q = usePositionsQuery(props.accountId)

// Column metadata for visibility control
type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'qty' | 'avgPrice' | 'price' | 'market_value' | 'unrealized_pnl'
const allColumnOptions: Array<{ field: ColumnField; label: string }> = [
  { field: 'legal_entity', label: 'Account' },
  { field: 'symbol', label: 'Symbol' },
  { field: 'asset_class', label: 'Asset Class' },
  { field: 'conid', label: 'Conid' },
  { field: 'undConid', label: 'Underlying Conid' },
  { field: 'multiplier', label: 'Multiplier' },
  { field: 'qty', label: 'Quantity' },
  { field: 'avgPrice', label: 'Avg Price' },
  { field: 'price', label: 'Market Price' },
  { field: 'market_value', label: 'Market Value' },
  { field: 'unrealized_pnl', label: 'Unrealized P&L' }
]

// URL param helpers
function parseVisibleColsFromUrl(): ColumnField[] {
  const url = new URL(window.location.href)
  const colsParam = url.searchParams.get('cols')
  if (!colsParam) {
    return allColumnOptions.map(c => c.field)
  }
  const fromUrl = colsParam.split(',').map(s => s.trim()).filter(Boolean) as ColumnField[]
  const valid = new Set(allColumnOptions.map(c => c.field))
  const filtered = fromUrl.filter(c => valid.has(c))
  return filtered.length ? filtered : allColumnOptions.map(c => c.field)
}

function writeVisibleColsToUrl(cols: ColumnField[]) {
  const url = new URL(window.location.href)
  url.searchParams.set('cols', cols.join(','))
  window.history.replaceState({}, '', url.toString())
}

// Filter URL helpers (fsym: symbol, fac: asset_class)
function parseFiltersFromUrl(): { symbol?: string; asset_class?: string; legal_entity?: string } {
  const url = new URL(window.location.href)
  const symbol = url.searchParams.get('fsym') || undefined
  const asset = url.searchParams.get('fac') || undefined
  const account = url.searchParams.get('facc') || undefined
  return { symbol, asset_class: asset, legal_entity: account }
}

function writeFiltersToUrlFromModel(model: any) {
  const url = new URL(window.location.href)
  const sym = model?.symbol?.filter || ''
  const ac = model?.asset_class?.filter || ''
  if (sym) url.searchParams.set('fsym', sym); else url.searchParams.delete('fsym')
  if (ac) url.searchParams.set('fac', ac); else url.searchParams.delete('fac')
  const acc = model?.legal_entity?.filter || ''
  if (acc) url.searchParams.set('facc', acc); else url.searchParams.delete('facc')
  window.history.replaceState({}, '', url.toString())
}

const visibleCols = ref<ColumnField[]>(parseVisibleColsFromUrl())
function isColVisible(field: ColumnField): boolean {
  return visibleCols.value.includes(field)
}

// Column definitions for ag-grid (hide based on visibleCols)
const columnDefs = computed<ColDef[]>(() => [
  { 
    field: 'legal_entity', 
    headerName: 'Account',
    width: 160,
    pinned: 'left' as const,
    hide: !isColVisible('legal_entity'),
    onCellClicked: (event: any) => handleCellFilterClick('legal_entity', event?.value)
  },
  { 
    field: 'symbol', 
    headerName: 'Financial Instrument',
    width: 120,
    pinned: 'left' as const,
    hide: !isColVisible('symbol'),
    cellRenderer: (params: any) => renderFinancialInstrumentCell(params.value),
    onCellClicked: (event: any) => {
      const clicked = extractClickedTagText(event)
      if (clicked) {
        handleCellFilterClick('symbol', clicked)
      }
    }
  },
  { 
    field: 'asset_class', 
    headerName: 'Asset Class',
    width: 100,
    hide: !isColVisible('asset_class'),
    // removed click-to-filter for Asset Class per requirements
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
    valueFormatter: (params: any) => formatNumber(params.value)
  },
  { 
    field: 'qty', 
    headerName: 'Quantity',
    width: 120,
    type: 'rightAligned',
    hide: !isColVisible('qty'),
    valueFormatter: (params: any) => formatNumber(params.value)
  },
  { 
    field: 'avgPrice', 
    headerName: 'Avg Price',
    width: 120,
    type: 'rightAligned',
    hide: !isColVisible('avgPrice'),
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'price', 
    headerName: 'Market Price',
    width: 130,
    type: 'rightAligned',
    hide: !isColVisible('price'),
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'market_value', 
    headerName: 'Market Value',
    width: 140,
    type: 'rightAligned',
    hide: !isColVisible('market_value'),
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'unrealized_pnl', 
    headerName: 'Unrealized P&L',
    width: 150,
    type: 'rightAligned',
    hide: !isColVisible('unrealized_pnl'),
    valueFormatter: (params: any) => formatCurrency(params.value),
    cellClassRules: {
      'pnl-positive': (params: any) => params.value > 0,
      'pnl-negative': (params: any) => params.value < 0,
      'pnl-zero': (params: any) => params.value === 0
    }
  }
])

// Grid API and totals that respect filtering/sorting
const gridApi = ref<any | null>(null)
const columnApiRef = ref<any | null>(null)
const pinnedBottomRowDataRef = ref<any[]>([])
const numericFields = ['qty', 'avgPrice', 'price', 'market_value', 'unrealized_pnl'] as const

// Active filters tracking for tag UI
type ActiveFilter = { field: 'symbol' | 'asset_class' | 'legal_entity'; value: string }
const activeFilters = ref<ActiveFilter[]>([])

function syncActiveFiltersFromGrid() {
  const api = gridApi.value
  const next: ActiveFilter[] = []
  if (!api) {
    activeFilters.value = next
    return
  }
  const model = api.getFilterModel?.() || {}
  const getFilterValue = (field: string) => model?.[field]?.filter || model?.[field]?.values || null
  const symbol = getFilterValue('symbol')
  if (typeof symbol === 'string' && symbol.length) next.push({ field: 'symbol', value: symbol })
  const asset = getFilterValue('asset_class')
  if (typeof asset === 'string' && asset.length) next.push({ field: 'asset_class', value: asset })
  const account = getFilterValue('legal_entity')
  if (typeof account === 'string' && account.length) next.push({ field: 'legal_entity', value: account })
  activeFilters.value = next
}

function handleCellFilterClick(field: 'symbol' | 'asset_class' | 'legal_entity', value: any) {
  const api = gridApi.value
  if (!api || value === undefined || value === null) return
  const currentModel = (api.getFilterModel && api.getFilterModel()) || {}
  const filterType = field === 'symbol' ? 'contains' : 'equals'
  currentModel[field] = { type: filterType, filter: String(value) }
  if (typeof api.setFilterModel === 'function') {
    api.setFilterModel(currentModel)
  }
  if (typeof api.onFilterChanged === 'function') {
    api.onFilterChanged()
  }
  writeFiltersToUrlFromModel(currentModel)
  syncActiveFiltersFromGrid()
}

function clearFilter(field: 'symbol' | 'asset_class' | 'legal_entity') {
  const api = gridApi.value
  if (!api) return
  const model = (api.getFilterModel && api.getFilterModel()) || {}
  delete model[field]
  if (typeof api.setFilterModel === 'function') {
    api.setFilterModel(model)
  }
  if (typeof api.onFilterChanged === 'function') {
    api.onFilterChanged()
  }
  writeFiltersToUrlFromModel(model)
  syncActiveFiltersFromGrid()
}

function clearAllFilters() {
  const api = gridApi.value
  if (!api) return
  if (typeof api.setFilterModel === 'function') {
    api.setFilterModel(null)
  }
  if (typeof api.onFilterChanged === 'function') {
    api.onFilterChanged()
  }
  writeFiltersToUrlFromModel({})
  syncActiveFiltersFromGrid()
}

// Compat helper: set column visibility across ag-Grid versions
function setColumnVisibility(field: string, visible: boolean) {
  const cApi: any = columnApiRef.value
  const gApi: any = gridApi.value
  if (cApi && typeof cApi.setColumnVisible === 'function') {
    cApi.setColumnVisible(field, visible)
    return
  }
  if (gApi) {
    if (typeof gApi.setColumnVisible === 'function') {
      gApi.setColumnVisible(field, visible)
      return
    }
    if (typeof gApi.setColumnsVisible === 'function') {
      gApi.setColumnsVisible([field], visible)
      return
    }
  }
}

// UI state: column settings dropdown
const showColumnsPopup = ref(false)
const columnsBtnRef = ref<HTMLElement | null>(null)
const columnsPopupRef = ref<HTMLElement | null>(null)

function toggleColumnsPopup() {
  showColumnsPopup.value = !showColumnsPopup.value
}

function closeColumnsPopup() {
  showColumnsPopup.value = false
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node | null
  const btnEl = columnsBtnRef.value
  const popEl = columnsPopupRef.value
  if (!btnEl || !popEl) return
  if (!btnEl.contains(target) && !popEl.contains(target)) {
    closeColumnsPopup()
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeColumnsPopup()
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleEscape)
})

function recalcPinnedTotals() {
  const api = gridApi.value
  // API not ready: compute from raw rows
  if (!api) {
    const rows = q.data.value || []
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
    for (const field of numericFields) {
      const v = data?.[field]
      const n = typeof v === 'number' && Number.isFinite(v) ? v : 0
      totals[field] += n
    }
  })

  pinnedBottomRowDataRef.value = [totals]
}

function onGridReady(event: any) {
  gridApi.value = event.api
  columnApiRef.value = event.columnApi
  // Apply initial column visibility from URL
  for (const opt of allColumnOptions) {
    setColumnVisibility(opt.field, isColVisible(opt.field))
  }
  // Apply initial filters from URL
  const fromUrl = parseFiltersFromUrl()
  const model: any = {}
  if (fromUrl.symbol) model.symbol = { type: 'contains', filter: fromUrl.symbol }
  if (fromUrl.asset_class) model.asset_class = { type: 'equals', filter: fromUrl.asset_class }
  if (fromUrl.legal_entity) model.legal_entity = { type: 'equals', filter: fromUrl.legal_entity }
  if (Object.keys(model).length && typeof event.api.setFilterModel === 'function') {
    event.api.setFilterModel(model)
    event.api.onFilterChanged?.()
  }
  syncActiveFiltersFromGrid()
  recalcPinnedTotals()
}

// Persist visibility to URL and update grid when changed
watch(visibleCols, (cols) => {
  writeVisibleColsToUrl(cols)
  for (const opt of allColumnOptions) {
    setColumnVisibility(opt.field, isColVisible(opt.field))
  }
}, { deep: true })

// Recalculate when upstream data changes
watch(() => q.data.value, () => {
  recalcPinnedTotals()
})

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

// Clean up realtime subscription
onBeforeUnmount(() => {
  if (q._cleanup) {
    q._cleanup()
  }
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleEscape)
})

function rowClicked(position: Position) {
  emit('row-click', position)
  if (props.onRowClick) {
    props.onRowClick(position)
  }
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

// Renderer helpers for Financial Instrument tags
function formatExpiryFromYyMmDd(yyMmDd: string): string {
  // yyMmDd: e.g., '251219' => DEC-19-2025
  if (!/^[0-9]{6}$/.test(yyMmDd)) return ''
  const yy = Number(yyMmDd.slice(0, 2))
  const mm = Number(yyMmDd.slice(2, 4))
  const dd = Number(yyMmDd.slice(4, 6))
  const year = 2000 + yy
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  const mon = months[(mm - 1) >= 0 && (mm - 1) < 12 ? (mm - 1) : 0]
  return `${mon}-${String(dd).padStart(2,'0')}-${year}`
}

function renderFinancialInstrumentCell(value: any): string {
  const text = String(value ?? '')
  if (!text) return ''
  // Extract base symbol (first token)
  const symMatch = text.match(/^([A-Z]+)\b/)
  const base = symMatch?.[1] ?? ''
  // Extract right (C/P)
  const rightMatch = text.match(/\s([CP])\b/)
  const right = rightMatch?.[1] ?? ''
  // Extract strike (the number before right token)
  const strikeMatch = text.match(/\s(\d+(?:\.\d+)?)\s+[CP]\b/)
  const strike = strikeMatch?.[1] ?? ''
  // Extract 6 digits before C/P inside bracket code, e.g. ... [AAPL 251219C00235000 100]
  const codeMatch = text.match(/\b(\d{6})[CP]/)
  const expiry = codeMatch ? formatExpiryFromYyMmDd(codeMatch[1]) : ''

  const tag = (label: string, extraClass = '') => `<span class="fi-tag fi-tag-click ${extraClass}">${label}</span>`
  const parts = [
    base && tag(base, 'fi-tag-symbol'),
    expiry && tag(expiry, 'fi-tag-expiry'),
    strike && tag(strike, 'fi-tag-strike'),
    right && tag(right, 'fi-tag-right')
  ]
  return parts.filter(Boolean).join(' ')
}

function extractClickedTagText(evt: any): string | null {
  const target: any = evt?.event?.target
  if (!target) return null
  const tagEl = (target.closest && target.closest('.fi-tag')) || null
  if (!tagEl) return null
  const txt = String(tagEl.textContent || '').trim()
  return txt || null
}
</script>

<template>
  <section class="positions-card">
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
        <h2>Positions:</h2>
        <div class="positions-tools">
          <div class="positions-count">{{ q.data.value?.length || 0 }} positions</div>
          <button ref="columnsBtnRef" class="columns-btn" aria-label="Column settings" @click.stop="toggleColumnsPopup">
            <svg class="icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.21-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.22-.22-.39-.44-.39h-3.84c-.22 0-.41.16-.44.39l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.21.37.3.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.22.22.39.44.39h3.84c.22 0 .41-.16.44-.39l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.03-1.58ZM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5Z"/>
            </svg>
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
          <span v-for="f in activeFilters" :key="f.field" class="filter-tag">
            <strong>{{ f.field === 'symbol' ? 'Financial Instrument' : (f.field === 'legal_entity' ? 'Account' : 'Asset Class') }}:</strong> {{ f.value }}
            <button class="tag-clear" @click="clearFilter(f.field)" aria-label="Clear filter">✕</button>
          </span>
          <button class="btn btn-clear-all" @click="clearAllFilters">Clear all</button>
        </div>
      </div>

      <div class="ag-theme-alpine positions-grid">
        <AgGridVue
          :columnDefs="columnDefs"
          :rowData="q.data.value || []"
          :modules="[AllCommunityModule]"
          :defaultColDef="{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 100
          }"
          :animateRows="true"
          :rowSelection="'single'"
          :domLayout="'autoHeight'"
          :pinnedBottomRowData="pinnedBottomRowDataRef"
          @grid-ready="onGridReady"
          @filter-changed="recalcPinnedTotals"
          @sort-changed="recalcPinnedTotals"
          @row-data-updated="recalcPinnedTotals"
          @row-clicked="(event: any) => event.data && rowClicked(event.data)"
          style="width: 100%;"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.positions-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(0,0,0,.1);
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
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
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.positions-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #495057;
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
  .positions-card {
    padding: 1rem;
  }
  
  .positions-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .positions-grid {
    height: 300px;
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