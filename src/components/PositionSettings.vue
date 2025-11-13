<template>
  <div class="settings-controls">
    <!-- Settings Button -->
    <button 
      ref="settingsBtnRef" 
      class="settings-btn" 
      @click.stop="toggleSettingsPopup"
      title="Settings"
    >
      <svg class="icon" viewBox="0 0 24 24" width="18" height="18">
        <path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.21-.37-.3-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.03-.22-.22-.39-.44-.39h-3.84c-.22 0-.41.16-.44.39l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c.04.31.06.63.06.94s-.02.63-.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.21.37.3.59.22l2.39.96c.5.38 1.03.7 1.62.94l.36 2.54c.03.22.22.39.44.39h3.84c.22 0 .41-.16.44-.39l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.03-1.58ZM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5Z"/>
      </svg>
    </button>

    <!-- Settings Popup -->
    <div v-if="showSettingsPopup" ref="settingsPopupRef" class="settings-popup" @click.stop>
      <!-- App Name Section -->
      <div class="settings-section">
        <div class="settings-section-header">
          <h4>App Name</h4>
        </div>
        <div class="settings-section-content">
          <div class="app-name-display">
            <span>{{ appName }}</span>
            <button
              class="rename-btn"
              @click="openAppNameDialog"
              title="Rename app"
            >
              ✎
            </button>
          </div>
        </div>
      </div>

      <div class="settings-divider"></div>

      <!-- Column Visibility Section -->
      <div class="settings-section">
        <div class="settings-section-header">
          <h4>Column Visibility</h4>
          <button class="btn-link" @click="showAllColumns">Show All</button>
        </div>
        <div class="settings-section-content">
          <div class="columns-list">
            <!-- Checked columns with actions -->
            <label
              v-for="(opt, idx) in visibleColumns"
              :key="opt.field"
              class="column-item"
              draggable="true"
              @dragstart="handleDragStart(idx)"
              @dragover="handleDragOver"
              @drop="handleDrop(idx)"
            >
              <div class="column-item-left">
                <input type="checkbox" :value="opt.field" v-model="localVisibleCols" />
                <span class="column-label">
                  {{ getColumnDisplayName(opt) }}
                </span>
              </div>
              
              <div class="column-item-actions">
                <button
                  class="icon-btn"
                  type="button"
                  @click.stop="openColRenameDialog(opt.field)"
                  title="Rename column"
                >
                  ✎
                </button>
                <div class="move-btns">
                  <button
                    class="move-btn"
                    type="button"
                    @click.stop="moveColumnUp(idx)"
                    :disabled="idx === 0"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    class="move-btn"
                    type="button"
                    @click.stop="moveColumnDown(idx)"
                    :disabled="idx === visibleColumns.length - 1"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            </label>

            <!-- Unchecked columns - FIXED -->
            <label
              v-for="opt in hiddenColumns"
              :key="opt.field"
              class="column-item column-item-hidden"
            >
              <div class="column-item-left">
                <input type="checkbox" :value="opt.field" v-model="localVisibleCols" />
                <span class="column-label">{{ opt.label }}</span>
              </div>
              <!-- Add empty spacer to maintain alignment -->
              <div class="column-item-spacer"></div>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-footer">
        <button class="btn btn-secondary" @click="closeSettingsPopup">Close</button>
      </div>
    </div>

    <!-- App Name Dialog -->
    <div v-if="showAppNameDialog" class="dialog-backdrop" @click="closeAppNameDialog">
      <div class="dialog-box" @click.stop>
        <div class="dialog-header">
          <h3>Rename App</h3>
        </div>
        <div class="dialog-body">
          <input
            v-model="appNameInput"
            type="text"
            class="dialog-input"
            placeholder="Enter app name"
            @keyup.enter="saveAppName"
          />
        </div>
        <div class="dialog-footer">
          <button class="btn btn-primary" @click="saveAppName">Save</button>
          <button class="btn btn-secondary" @click="closeAppNameDialog">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Column Rename Dialog -->
    <div v-if="showColRenameDialog" class="dialog-backdrop" @click="closeColRenameDialog">
      <div class="dialog-box" @click.stop>
        <div class="dialog-header">
          <h3>Rename Column</h3>
        </div>
        <div class="dialog-body">
          <input
            v-model="colRenameValue"
            type="text"
            class="dialog-input"
            placeholder="Enter column name"
            @keyup.enter="saveColRename"
          />
        </div>
        <div class="dialog-footer">
          <button class="btn btn-primary" @click="saveColRename">Save</button>
          <button class="btn btn-secondary" @click="closeColRenameDialog">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

type ColumnField = 'legal_entity' | 'symbol' | 'asset_class' | 'conid' | 'undConid' | 'multiplier' | 'contract_quantity' | 'accounting_quantity' | 'avgPrice' | 'price' | 'market_price' | 'instrument_market_price' | 'market_value' | 'unrealized_pnl' | 'be_price_pnl' | 'computed_cash_flow_on_entry' | 'computed_cash_flow_on_exercise' | 'entry_exercise_cash_flow_pct' | 'computed_be_price' | 'thesis' | 'maintenance_margin_change' | 'symbol_comment' | 'weighted_avg_price' | 'expiry_date'

interface ColumnOption {
  field: ColumnField
  label: string
}

interface Props {
  appName: string
  visibleCols: ColumnField[]
  allColumnOptions: ColumnOption[]
  columnRenames: Partial<Record<ColumnField, string>>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:appName': [name: string]
  'update:visibleCols': [cols: ColumnField[]]
  'update:columnRenames': [renames: Partial<Record<ColumnField, string>>]
}>()

// State
const showSettingsPopup = ref(false)
const settingsBtnRef = ref<HTMLElement | null>(null)
const settingsPopupRef = ref<HTMLElement | null>(null)

const showAppNameDialog = ref(false)
const appNameInput = ref('')

const showColRenameDialog = ref(false)
const colRenameField = ref<ColumnField | null>(null)
const colRenameValue = ref('')

const dragIndex = ref<number | null>(null)

// Local copy of visible columns for manipulation
const localVisibleCols = ref<ColumnField[]>([...props.visibleCols])

// Computed
const visibleColumns = computed(() => {
  return localVisibleCols.value
    .map(field => props.allColumnOptions.find(c => c.field === field))
    .filter((opt): opt is ColumnOption => opt !== undefined)
})

const hiddenColumns = computed(() => {
  return props.allColumnOptions.filter(c => !localVisibleCols.value.includes(c.field))
})

// Watch for changes to emit updates
watch(localVisibleCols, (newCols) => {
  emit('update:visibleCols', newCols)
}, { deep: true })

// Functions
function toggleSettingsPopup() {
  showSettingsPopup.value = !showSettingsPopup.value
}

function closeSettingsPopup() {
  showSettingsPopup.value = false
}

function openAppNameDialog() {
  appNameInput.value = props.appName
  showAppNameDialog.value = true
}

function closeAppNameDialog() {
  showAppNameDialog.value = false
}

function saveAppName() {
  const newName = appNameInput.value.trim() || 'Positions'
  emit('update:appName', newName)
  closeAppNameDialog()
}

function showAllColumns() {
  localVisibleCols.value = props.allColumnOptions.map(c => c.field)
}

function getColumnDisplayName(opt: ColumnOption): string {
  const customName = props.columnRenames[opt.field]
  if (customName) {
    return `${customName} (${opt.label})`
  }
  return opt.label
}

function openColRenameDialog(field: ColumnField) {
  colRenameField.value = field
  const opt = props.allColumnOptions.find(c => c.field === field)
  colRenameValue.value = props.columnRenames[field] || opt?.label || ''
  showColRenameDialog.value = true
}

function closeColRenameDialog() {
  showColRenameDialog.value = false
  colRenameField.value = null
  colRenameValue.value = ''
}

function saveColRename() {
  if (colRenameField.value) {
    const newRenames = {
      ...props.columnRenames,
      [colRenameField.value]: colRenameValue.value.trim()
    }
    emit('update:columnRenames', newRenames)
  }
  closeColRenameDialog()
}

// Drag and drop functions
function handleDragStart(index: number) {
  dragIndex.value = index
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) return
  const cols = [...localVisibleCols.value]
  const [moved] = cols.splice(dragIndex.value, 1)
  cols.splice(index, 0, moved)
  localVisibleCols.value = cols
  dragIndex.value = null
}

function moveColumnUp(idx: number) {
  if (idx <= 0) return
  const cols = [...localVisibleCols.value]
  ;[cols[idx - 1], cols[idx]] = [cols[idx], cols[idx - 1]]
  localVisibleCols.value = cols
}

function moveColumnDown(idx: number) {
  if (idx >= localVisibleCols.value.length - 1) return
  const cols = [...localVisibleCols.value]
  ;[cols[idx], cols[idx + 1]] = [cols[idx + 1], cols[idx]]
  localVisibleCols.value = cols
}

function handleClickOutside(event: Event) {
  if (showSettingsPopup.value && 
      settingsPopupRef.value && 
      settingsBtnRef.value &&
      !settingsPopupRef.value.contains(event.target as Node) && 
      !settingsBtnRef.value.contains(event.target as Node)) {
    closeSettingsPopup()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose for parent component if needed
defineExpose({
  closeSettingsPopup
})
</script>

<style scoped>
.settings-controls {
  position: relative;
}

.settings-btn {
  width: auto;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.settings-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.icon {
  display: block;
}

.settings-popup {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 400px;
  max-height: 80vh;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.settings-popup input,
.settings-popup button {
  width: auto;
}

.settings-section {
  padding: 1rem;
}

.settings-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.settings-section-header h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #212529;
}

.btn-link {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

.settings-section-content {
  font-size: 0.9rem;
}

.app-name-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.app-name-display span {
  flex: 1;
  font-weight: 500;
}

.rename-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.rename-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.settings-divider {
  height: 1px;
  background: #dee2e6;
  margin: 0;
}

.columns-list {
  max-height: 400px;
  overflow-y: auto;
}

.column-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 4px;
  gap: 0.5rem;
}

.column-item:hover {
  background: #f8f9fa;
}

.column-item-hidden {
  opacity: 0.6;
}

.column-item-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.column-label {
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.column-item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0; /* ADD THIS */
}

/* ADD THIS NEW CLASS */
.column-item-spacer {
  width: 70px; /* Approximate width of rename + move buttons */
  flex-shrink: 0;
}

.icon-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.9rem;
  border-radius: 3px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.move-btns {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.move-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0 0.25rem;
  font-size: 0.7rem;
  line-height: 1;
  transition: all 0.2s;
}

.move-btn:hover:not(:disabled) {
  color: #495057;
}

.move-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.settings-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid #dee2e6;
  background: #f8f9fa;
}

.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.dialog-box {
  background: white;
  border-radius: 8px;
  min-width: 400px;
  max-width: 90vw;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  padding: 1.25rem;
  border-bottom: 1px solid #dee2e6;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #212529;
}

.dialog-body {
  padding: 1.25rem;
}

.dialog-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.dialog-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.dialog-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>