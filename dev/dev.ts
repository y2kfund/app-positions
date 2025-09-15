import { createApp } from 'vue'
import Positions from '../src/Positions.vue'
import { createCore } from '@y2kfund/core'

async function initializeApp() {
  try {
    // Check for required environment variables
    const supabaseUrl = import.meta.env.VITE_SUPA_URL
    const supabaseAnon = import.meta.env.VITE_SUPA_ANON

    if (!supabaseUrl || !supabaseAnon) {
      throw new Error('Missing required environment variables: VITE_SUPA_URL and VITE_SUPA_ANON must be set in .env file')
    }

    // Initialize app-core with Supabase and TanStack Query
    // This provides the Supabase client that usePositionsQuery needs
    const core = await createCore({
      supabaseUrl,
      supabaseAnon,
      query: { 
        staleTime: 60_000, 
        gcTime: 86_400_000, 
        refetchOnWindowFocus: false 
      }
    })

    // Get demo props from window
    const props = (window as any).__DEMO_PROPS__ || { accountId: '1' }

    // Create and mount the app with app-core plugin
    createApp(Positions, props)
      .use(core)  // This is crucial - provides Supabase client and TanStack Query
      .mount('#app')

    console.log('✅ Positions app initialized successfully with app-core')

  } catch (error) {
    console.error('Failed to initialize positions app:', error)
    
    // Show error message in the DOM
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <div style="padding: 2rem; background: #f8d7da; color: #721c24; border-radius: 0.5rem; margin: 1rem;">
          <h2>Development Setup Error</h2>
          <p>Failed to initialize app-core: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <div style="margin: 1rem 0;">
            <h3>Checklist:</h3>
            <ul style="text-align: left;">
              <li>✅ @y2kfund/core is built and linked</li>
              <li>❓ Is Supabase running? <code>npx supabase status --workdir ./supabase/data/developer</code></li>
              <li>❓ Does hf.positions table exist?</li>
              <li>❓ Are environment variables set in .env file?</li>
            </ul>
          </div>
          <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem;">
            Required .env file:<br>
            VITE_SUPA_URL=http://127.0.0.1:54321<br>
            VITE_SUPA_ANON=your_anon_key_here
          </div>
        </div>
      `
    }
  }
}

initializeApp()
