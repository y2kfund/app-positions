<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Position } from '@y2kfund/core'

interface Props {
  positions: Position[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'close': []
}>()

// Group positions by symbol root and sum market values
const chartData = computed(() => {
  const grouped = new Map<string, number>()
  
  props.positions.forEach(pos => {
    // Extract symbol root (e.g., "META" from "META 241101P00550000")
    const symbolMatch = pos.symbol.match(/^([A-Z]+)/)
    const symbol = symbolMatch?.[1] || pos.symbol
    
    const currentValue = grouped.get(symbol) || 0
    grouped.set(symbol, currentValue + (pos.market_value || 0))
  })
  
  // Convert to array and sort by value
  return Array.from(grouped.entries())
    .map(([symbol, value]) => ({ symbol, value }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
})

const totalMarketValue = computed(() => 
  chartData.value.reduce((sum, item) => sum + Math.abs(item.value), 0)
)

// Generate colors for each slice
const colors = [
  '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
  '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6610f2',
  '#6c757d', '#343a40', '#f8f9fa', '#e9ecef', '#dee2e6'
]

function getColor(index: number): string {
  return colors[index % colors.length]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function getPercentage(value: number): string {
  if (totalMarketValue.value === 0) return '0%'
  return ((Math.abs(value) / totalMarketValue.value) * 100).toFixed(1) + '%'
}

// SVG pie chart calculations
const svgSize = 400
const radius = 180
const centerX = svgSize / 2
const centerY = svgSize / 2

const pieSlices = computed(() => {
  let currentAngle = 0
  
  return chartData.value.map((item, index) => {
    const percentage = Math.abs(item.value) / totalMarketValue.value
    const sliceAngle = percentage * 360
    
    // Calculate arc path
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle
    
    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (endAngle - 90) * Math.PI / 180
    
    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)
    
    const largeArc = sliceAngle > 180 ? 1 : 0
    
    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    // Label position (middle of slice, outside the pie)
    const labelAngle = (startAngle + endAngle) / 2
    const labelRad = (labelAngle - 90) * Math.PI / 180
    const labelRadius = radius + 40
    const labelX = centerX + labelRadius * Math.cos(labelRad)
    const labelY = centerY + labelRadius * Math.sin(labelRad)
    
    currentAngle = endAngle
    
    return {
      path,
      color: getColor(index),
      symbol: item.symbol,
      value: item.value,
      percentage: getPercentage(item.value),
      labelX,
      labelY
    }
  })
})

const hoveredSlice = ref<number | null>(null)
</script>

<template>
  <div class="pie-chart-overlay" @click="emit('close')">
    <div class="pie-chart-container" @click.stop>
      <div class="pie-chart-header">
        <h3>Positions by Financial Instrument</h3>
        <button class="close-btn" @click="emit('close')">&times;</button>
      </div>
      
      <div class="pie-chart-content">
        <div class="chart-wrapper">
          <svg :width="svgSize" :height="svgSize" class="pie-svg">
            <g
              v-for="(slice, index) in pieSlices"
              :key="slice.symbol"
              @mouseenter="hoveredSlice = index"
              @mouseleave="hoveredSlice = null"
            >
              <path
                :d="slice.path"
                :fill="slice.color"
                :class="{ 'hovered': hoveredSlice === index }"
                class="pie-slice"
              />
              <text
                v-if="parseFloat(slice.percentage) > 3"
                :x="slice.labelX"
                :y="slice.labelY"
                class="slice-label"
                text-anchor="middle"
              >
                {{ slice.symbol }}
              </text>
            </g>
            
            <!-- Center circle for donut effect (optional) -->
            <circle
              :cx="centerX"
              :cy="centerY"
              :r="60"
              fill="white"
              class="center-circle"
            />
            <text
              :x="centerX"
              :y="centerY - 10"
              text-anchor="middle"
              class="total-label"
            >
              Total
            </text>
            <text
              :x="centerX"
              :y="centerY + 15"
              text-anchor="middle"
              class="total-value"
            >
              {{ formatCurrency(totalMarketValue) }}
            </text>
          </svg>
        </div>
        
        <div class="legend">
          <div
            v-for="(item, index) in chartData"
            :key="item.symbol"
            class="legend-item"
            :class="{ 'hovered': hoveredSlice === index }"
            @mouseenter="hoveredSlice = index"
            @mouseleave="hoveredSlice = null"
          >
            <div class="legend-color" :style="{ backgroundColor: getColor(index) }"></div>
            <div class="legend-details">
              <div class="legend-symbol">{{ item.symbol }}</div>
              <div class="legend-value">
                {{ formatCurrency(Math.abs(item.value)) }}
                <span class="legend-percentage">({{ getPercentage(item.value) }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pie-chart-overlay {
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

.pie-chart-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 900px;
  width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pie-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.pie-chart-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.pie-chart-content {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  overflow-y: auto;
}

.chart-wrapper {
  flex-shrink: 0;
}

.pie-svg {
  display: block;
}

.pie-slice {
  cursor: pointer;
  transition: all 0.2s;
  stroke: white;
  stroke-width: 2;
}

.pie-slice:hover,
.pie-slice.hovered {
  opacity: 0.8;
  transform: scale(1.05);
  transform-origin: center;
}

.slice-label {
  font-size: 12px;
  font-weight: 600;
  fill: #2c3e50;
  pointer-events: none;
}

.center-circle {
  pointer-events: none;
}

.total-label {
  font-size: 14px;
  fill: #6c757d;
  font-weight: 500;
}

.total-value {
  font-size: 18px;
  fill: #2c3e50;
  font-weight: 700;
}

.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 500px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.legend-item:hover,
.legend-item.hovered {
  background: #f8f9fa;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-details {
  flex: 1;
  min-width: 0;
}

.legend-symbol {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.legend-value {
  font-size: 0.875rem;
  color: #6c757d;
}

.legend-percentage {
  color: #adb5bd;
  margin-left: 0.25rem;
}

@media (max-width: 768px) {
  .pie-chart-content {
    flex-direction: column;
  }
  
  .chart-wrapper {
    display: flex;
    justify-content: center;
  }
}
</style>