<script setup lang="ts">
import { onBeforeUnmount, computed, ref, watch } from 'vue'
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
type ColumnField = 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'qty' | 'avgPrice' | 'price' | 'market_value' | 'unrealized_pnl'
const allColumnOptions: Array<{ field: ColumnField; label: string }> = [
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

const visibleCols = ref<ColumnField[]>(parseVisibleColsFromUrl())
function isColVisible(field: ColumnField): boolean {
  return visibleCols.value.includes(field)
}

// Column definitions for ag-grid (hide based on visibleCols)
const columnDefs = computed<ColDef[]>(() => [
  { 
    field: 'symbol', 
    headerName: 'Symbol',
    width: 120,
    pinned: 'left' as const,
    hide: !isColVisible('symbol'),
    cellRenderer: (params: any) => `<span class="symbol">${params.value}</span>`
  },
  { 
    field: 'asset_class', 
    headerName: 'Asset Class',
    width: 100,
    hide: !isColVisible('asset_class')
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

// Clean up realtime subscription
onBeforeUnmount(() => {
  if (q._cleanup) {
    q._cleanup()
  }
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
</script>

<template>
  <section class="positions-card">
    <h1>Positions Dashboard</h1>
    
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
        <h2>Portfolio Positions</h2>
        <div class="positions-count">{{ q.data.value?.length || 0 }} positions</div>
      </div>
 
      <!-- Column Visibility Controls -->
      <div class="columns-controls">
        <span class="label">Columns:</span>
        <div class="columns-list">
          <label v-for="opt in allColumnOptions" :key="opt.field" class="col-toggle">
            <input type="checkbox" :value="opt.field" v-model="visibleCols" />
            <span>{{ opt.label }}</span>
          </label>
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
  height: 400px;
  min-height: 200px;
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
