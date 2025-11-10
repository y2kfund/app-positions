<template>
  <div>
    <!-- Screenshot Buttons in Header -->
    <div class="screenshot-controls">
      <button 
        @click="promptScreenshotName" 
        class="screenshot-btn" 
        title="Take Screenshot" 
        :disabled="takingScreenshot"
      >
        <span v-if="takingScreenshot" class="screenshot-spinner"></span>
        <span v-else>📸</span>
      </button>
      <button 
        @click="showScreenshotsModal = true" 
        class="screenshot-btn" 
        title="See Old Screenshots"
      >
        🖼️
      </button>
    </div>

    <!-- Screenshot Name Modal -->
    <div v-if="showScreenshotNameModal" class="rename-dialog-backdrop">
      <div class="rename-dialog">
        <h3>Name screenshot</h3>
        <input 
          v-model="screenshotName" 
          placeholder="Enter a name (optional)" 
          @keyup.enter="takeScreenshotConfirmed"
        />
        <div class="dialog-actions" style="justify-content:flex-start;">
          <button @click="takeScreenshotConfirmed">Save & Capture</button>
          <button @click="showScreenshotNameModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Screenshots List Modal -->
    <div v-if="showScreenshotsModal" class="screenshots-modal">
      <div class="modal-content">
        <h3 class="screenshots-title">Past Screenshots</h3>
        <div v-if="screenshotsLoading" class="screenshots-loading">
          Loading screenshots...
        </div>
        <div v-else-if="screenshots.length === 0" class="screenshots-empty">
          No screenshots yet.
        </div>
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
              <span v-else style="color:#666; font-style:italic; display:block;">
                (Unnamed)
              </span>
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
                >
                  ⬇️
                </a>
                <button 
                  class="screenshot-archive-btn" 
                  @click.stop="archiveScreenshot(shot.id)" 
                  title="Archive screenshot"
                >
                  🗄️
                </button>
                <button 
                  class="screenshot-rename-btn" 
                  @click.stop="openScreenshotRenameModal(shot)" 
                  title="Rename screenshot"
                >
                  ✏️
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button @click="showScreenshotsModal = false" class="screenshots-close">
            Close
          </button>
        </div>
      </div>

      <!-- Image Preview Modal -->
      <div 
        v-if="previewScreenshot" 
        class="screenshot-preview-modal" 
        @click.self="previewScreenshot = null"
      >
        <div class="screenshot-preview-content">
          <img 
            :src="`data:image/png;base64,${previewScreenshot.image_data}`" 
            class="screenshot-full-img" 
          />
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
            >
              ⬇️ Download
            </a>
            <button @click="previewScreenshot = null" class="screenshot-preview-close">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Screenshot Rename Modal -->
    <div v-if="showScreenshotRenameModal" class="rename-dialog-backdrop">
      <div class="rename-dialog">
        <h3>Rename Screenshot</h3>
        <input 
          v-model="screenshotRenameValue" 
          placeholder="Enter new name"
          @keyup.enter="saveScreenshotRename"
        />
        <div class="dialog-actions">
          <button @click="saveScreenshotRename">Save</button>
          <button @click="showScreenshotRenameModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRef } from 'vue'
import html2canvas from 'html2canvas'
import type { SupabaseClient } from '@supabase/supabase-js'

interface ScreenshotMetadata {
  filters?: {
    account?: string | null
    assetClass?: string | null
    symbolTags?: string[]
    thesisTags?: string[]
    columns?: string[]
  }
}

interface Screenshot {
  id: number
  user_id: string
  created_at: string
  image_data: string
  name: string | null
  archived: boolean
  meta?: ScreenshotMetadata
}

interface Props {
  userId: string
  supabase: SupabaseClient
  captureElement: HTMLElement | null  // Changed from Ref<HTMLElement | null>
  metadata?: ScreenshotMetadata
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'screenshot-taken': [screenshot: Screenshot]
  'screenshot-archived': [id: number]
  'screenshot-renamed': [id: number, name: string]
  'toast': [type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string]
}>()

// State
const showScreenshotsModal = ref(false)
const screenshots = ref<Screenshot[]>([])
const previewScreenshot = ref<Screenshot | null>(null)
const screenshotsLoading = ref(false)
const takingScreenshot = ref(false)
const showScreenshotNameModal = ref(false)
const screenshotName = ref('')
const showScreenshotRenameModal = ref(false)
const screenshotRenameValue = ref('')
const screenshotRenameId = ref<number | null>(null)

// Functions
function promptScreenshotName() {
  screenshotName.value = ''
  showScreenshotNameModal.value = true
}

async function takeScreenshotConfirmed() {
  // Changed from props.captureElement.value to just props.captureElement
  if (!props.captureElement) {
    showScreenshotNameModal.value = false
    emit('toast', 'error', 'Screenshot Error', 'Cannot find element to capture')
    console.error('Capture element is null:', props.captureElement)
    return
  }

  showScreenshotNameModal.value = false
  takingScreenshot.value = true

  try {
    console.log('Capturing element:', props.captureElement)
    
    const canvas = await html2canvas(props.captureElement, {
      useCORS: true,
      allowTaint: true,
      logging: false,
      scale: 1,
      windowWidth: props.captureElement.scrollWidth,
      windowHeight: props.captureElement.scrollHeight
    })
    
    const base64 = canvas.toDataURL('image/png')

    const { data, error } = await props.supabase
      .schema('hf')
      .from('position_screenshots')
      .insert([{
        user_id: props.userId,
        created_at: new Date().toISOString(),
        image_data: base64.replace(/^data:image\/png;base64,/, ''),
        name: screenshotName.value ? screenshotName.value.trim() : null,
        archived: false,
        meta: props.metadata || {}
      }])
      .select()
      .single()

    if (error) throw error

    emit('toast', 'success', 'Screenshot saved!')
    emit('screenshot-taken', data)
    fetchScreenshots()
  } catch (err: any) {
    console.error('Screenshot error:', err)
    emit('toast', 'error', 'Screenshot failed', err.message)
  } finally {
    takingScreenshot.value = false
  }
}

async function archiveScreenshot(id: number) {
  try {
    const { error } = await props.supabase
      .schema('hf')
      .from('position_screenshots')
      .update({ archived: true })
      .eq('id', id)

    if (error) throw error

    emit('toast', 'success', 'Screenshot archived')
    emit('screenshot-archived', id)
    fetchScreenshots()
  } catch (err: any) {
    console.error('Archive error:', err)
    emit('toast', 'error', 'Archive failed', err.message)
  }
}

async function fetchScreenshots() {
  if (!props.userId) {
    screenshots.value = []
    return
  }

  screenshotsLoading.value = true

  try {
    const { data, error } = await props.supabase
      .schema('hf')
      .from('position_screenshots')
      .select('*')
      .eq('user_id', props.userId)
      .eq('archived', false)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    screenshots.value = data || []
  } catch (err: any) {
    console.error('Fetch screenshots error:', err)
    emit('toast', 'error', 'Failed to load screenshots', err.message)
  } finally {
    screenshotsLoading.value = false
  }
}

function openScreenshotRenameModal(shot: Screenshot) {
  screenshotRenameId.value = shot.id
  screenshotRenameValue.value = shot.name || ''
  showScreenshotRenameModal.value = true
}

async function saveScreenshotRename() {
  if (!screenshotRenameId.value) return

  try {
    const { error } = await props.supabase
      .schema('hf')
      .from('position_screenshots')
      .update({ name: screenshotRenameValue.value })
      .eq('id', screenshotRenameId.value)

    if (error) throw error

    showScreenshotRenameModal.value = false
    emit('toast', 'success', 'Screenshot renamed')
    emit('screenshot-renamed', screenshotRenameId.value, screenshotRenameValue.value)
    fetchScreenshots()
  } catch (err: any) {
    console.error('Rename error:', err)
    emit('toast', 'error', 'Rename failed', err.message)
  }
}

// Watch for modal open to fetch screenshots
watch(showScreenshotsModal, (open) => {
  if (open) fetchScreenshots()
})

// Expose methods for parent component if needed
defineExpose({
  promptScreenshotName,
  fetchScreenshots
})
</script>

<style scoped>
.screenshot-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.screenshot-btn {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: white;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
}

.screenshot-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.screenshot-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.screenshot-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #495057;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.screenshots-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  min-width: 400px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.screenshots-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #212529;
}

.screenshots-loading,
.screenshots-empty {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}

.screenshots-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.screenshot-list-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.screenshot-list-item:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.screenshot-thumb {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.screenshot-list-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.screenshot-download-link {
  font-size: 1.2rem;
  text-decoration: none;
  cursor: pointer;
}

.screenshot-archive-btn,
.screenshot-rename-btn {
  background: none;
  border: 1px solid #e9ecef;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.screenshot-archive-btn:hover,
.screenshot-rename-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.screenshots-close {
  padding: 0.5rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.screenshots-close:hover {
  background: #5a6268;
}

.screenshot-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.screenshot-preview-content {
  background: white;
  border-radius: 1.2rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
  font-size: 1rem;
  color: #444;
}

.screenshot-preview-close {
  margin-left: 1.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 7px;
  border: none;
  background: #6c757d;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.screenshot-preview-close:hover {
  background: #5a6268;
}

.rename-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rename-dialog {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  min-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.rename-dialog h3 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  color: #212529;
}

.rename-dialog input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.dialog-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.dialog-actions button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.dialog-actions button:first-child {
  background: #007bff;
  color: white;
}

.dialog-actions button:first-child:hover {
  background: #0056b3;
}

.dialog-actions button:last-child {
  background: #6c757d;
  color: white;
}

.dialog-actions button:last-child:hover {
  background: #5a6268;
}
</style>