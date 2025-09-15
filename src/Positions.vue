<script setup lang="ts">
import { onBeforeUnmount, computed } from 'vue'
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

// Column definitions for ag-grid
const columnDefs = computed<ColDef[]>(() => [
  { 
    field: 'symbol', 
    headerName: 'Symbol',
    width: 120,
    pinned: 'left' as const,
    cellRenderer: (params: any) => `<span class="symbol">${params.value}</span>`
  },
  { 
    field: 'asset_class', 
    headerName: 'Asset Class',
    width: 100
  },
  { 
    field: 'qty', 
    headerName: 'Quantity',
    width: 120,
    type: 'rightAligned',
    valueFormatter: (params: any) => formatNumber(params.value)
  },
  { 
    field: 'avgPrice', 
    headerName: 'Avg Price',
    width: 120,
    type: 'rightAligned',
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'price', 
    headerName: 'Market Price',
    width: 130,
    type: 'rightAligned',
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'market_value', 
    headerName: 'Market Value',
    width: 140,
    type: 'rightAligned',
    valueFormatter: (params: any) => formatCurrency(params.value)
  },
  { 
    field: 'unrealized_pnl', 
    headerName: 'Unrealized P&L',
    width: 150,
    type: 'rightAligned',
    valueFormatter: (params: any) => formatCurrency(params.value),
    cellClassRules: {
      'pnl-positive': (params: any) => params.value > 0,
      'pnl-negative': (params: any) => params.value < 0,
      'pnl-zero': (params: any) => params.value === 0
    }
  }
])

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
  margin-top: 1rem;
  height: 400px;
  min-height: 200px;
}

/* ag-Grid styling */
:deep(.ag-theme-alpine) {
  --ag-header-background-color: #f8f9fa;
  --ag-header-foreground-color: #495057;
  --ag-border-color: #dee2e6;
  --ag-row-hover-color: #f8f9fa;
  --ag-selected-row-background-color: #e3f2fd;
}

:deep(.ag-theme-alpine .ag-header-cell) {
  font-weight: 600;
  font-size: 0.875rem;
}

:deep(.ag-theme-alpine .ag-cell) {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

:deep(.symbol) {
  font-weight: 600;
  color: #007bff;
}

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
