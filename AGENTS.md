# AGENTS.md — y2kfund/app-positions

**Purpose:** This repo contains the **Positions app**. The app also exposes a Vue 3 **component** that can be used by other apps. The component is published privately to GitHub Packages as `@y2kfund/positions`.

- **Repo name:** `app-positions`
- **Package name:** `@y2kfund/positions`
- **Component export:** `Positions`
- **Org:** https://github.com/orgs/y2kfund/
- **Core pkg:** `@y2kfund/core` (aka **app-core**) — provides initialization, injection keys, hooks, query-key helpers, and shared types.
- **Functionality:** Displays the positions table using ag-grid

**System layout**
- **app-core** (`@y2kfund/core`) ⟶ initializes Supabase client **and** TanStack Query (with IndexedDB persistence), and provides them to the app via a Vue plugin.
- **app-positions** (`@y2kfund/positions`) ⟶ consumes core’s client/query; exports `<Positions />`.
- **app-trades**, … ⟶ same pattern as positions.
- **app-dashboard** ⟶ uses **app-core** + **app-positions** + **app-trades**.

---

## 1) Architecture & Rules (authoritative)

- **Vue 3 only.** This package is a **library build (ESM)** that exports a Vue component. No Web Components, no Module Federation.
- **Single Supabase client & Query cache:** Both are **created and provided by `@y2kfund/core`**.  
  **Do not** create Supabase clients or `QueryClient` instances inside this repo’s library code.
- **Cache persistence:** Configured **inside `@y2kfund/core`** (TanStack Query + IndexedDB persister).
- **Data fetching:** Use **TanStack Vue Query** hooks (installed by core).
- **Realtime:** Subscribe to **Supabase Realtime** and **invalidate** (or patch) the right query key.
- **Styling:** Use `<style scoped>` or CSS Modules. Expose **CSS variables** for theming. Do **not** add global CSS.
- **Types:** Put public props/events in `src/types.ts`, export from `src/index.ts`.
- **SemVer:** Any breaking change to props/events is a **major** version bump.
- **Naming:** Import as `import { Positions } from '@y2kfund/positions'` and use `<Positions .../>`.
- **Code organization:** **Strong preference that each code file should be less than 300 lines.** When files approach this limit, consider extracting utility functions, splitting complex initialization logic, or creating focused helper modules.


---

## 2) File/Folder Layout (must follow)

```
src/
  Positions.vue        # main component
  index.ts             # library entry: export component + types
  usePositions.ts      # data composables (TanStack Query + Realtime)
  types.ts             # public props/event types
  styles.css           # optional, scoped/CSS vars only
dev/
  index.html           # local dev harness page
  dev.ts               # installs app-core plugin, mounts <Positions/>
package.json
vite.config.ts
tsconfig.json
README.md
AGENTS.md            # this file
```

---

## 3) Library entry & exports

**`src/index.ts`**
```ts
export { default as Positions } from './Positions.vue'
export * from './types'
```

**`src/types.ts`**
```ts
export interface PositionsProps {
  accountId: string
  highlightPnL?: boolean
  onRowClick?: (row: any) => void
}
```

---

## 4) Core-provided client & cache (no local creation)

**Never call `createClient()` or new `QueryClient()` inside this library.** Use core’s hooks.

```ts
// inside a composable or <script setup>
import { useSupabase } from '@y2kfund/core'
const supabase = useSupabase()  // typed client; throws if core is not installed
```

**Dev harness installs app-core (which creates/provides everything):**

**`dev/dev.ts`**
```ts
import { createApp } from 'vue'
import Positions from '../src/Positions.vue'
import { createCore } from '@y2kfund/core'
// createCore initializes Supabase + TanStack Query + IDB persistence and returns a Vue plugin.

const core = await createCore({
  supabaseUrl: import.meta.env.VITE_SUPA_URL,
  supabaseAnon: import.meta.env.VITE_SUPA_ANON,
  idb: { databaseName: 'y2k-cache', storeName: 'tanstack' },
  query: { staleTime: 60_000, gcTime: 86_400_000, refetchOnWindowFocus: false },
  buster: 'v1'
})

createApp(Positions, (window as any).__DEMO_PROPS__ || {})
  .use(core)
  .mount('#app')
```

**`dev/index.html`**
```html
<!doctype html>
<html>
  <body>
    <div id="app"></div>
    <script>window.__DEMO_PROPS__ = { accountId: 'demo' };</script>
    <script type="module" src="/dev/dev.ts"></script>
  </body>
</html>
```

---

## 5) Data pattern (TanStack Query + Realtime)

**`src/usePositions.ts`**
```ts
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useSupabase, queryKeys } from '@y2kfund/core'

export function usePositions(accountId: string) {
  const supabase = useSupabase()
  const key = queryKeys.positions(accountId)
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('account_id', accountId)
      if (error) throw error
      return data
    },
    staleTime: 60_000
  })

  const channel = supabase
    .channel(`positions:${accountId}`)
    .on('postgres_changes',
      { schema: 'public', table: 'positions', event: '*', filter: `account_id=eq.${accountId}` },
      () => qc.invalidateQueries({ queryKey: key })
    )
    .subscribe()

  // The component using this composable must unsubscribe:
  return { ...query, _rt: channel }
}
```

**`src/Positions.vue`**
```vue
<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { usePositions } from './usePositions'
import type { PositionsProps } from './types'

const props = defineProps<PositionsProps>()
const emit = defineEmits<{ (e:'row-click', row:any): void }>()

const q = usePositions(props.accountId)
onBeforeUnmount(() => q._rt?.unsubscribe?.())

function rowClicked(row:any){ emit('row-click', row) }
</script>

<template>
  <div>
    <div v-if="q.isLoading">Loading…</div>
    <div v-else>
      <div v-if="q.isFetching" style="opacity:.6">Updating…</div>
      <table>
        <tr v-for="r in q.data" :key="r.id" @click="rowClicked(r)">
          <td>{{ r.symbol }}</td><td>{{ r.qty }}</td><td>{{ r.pnl }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Theme via CSS variables only; no global styles */
</style>
```

---

## 6) Build config (library ESM only)

**`vite.config.ts`**
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'Positions',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue', '@y2kfund/core']
    }
  },
  server: { port: 5101 }
})
```

---

## 7) Package metadata (private GitHub Packages)

**`package.json` (key fields)**
```json
{
  "name": "@y2kfund/positions",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md"],
  "repository": "github:y2kfund/app-positions",
  "publishConfig": { "registry": "https://npm.pkg.github.com" },
  "peerDependencies": {
    "vue": "^3.4.0",
    "@y2kfund/core": "^0.1.0"
  },
  "scripts": {
    "dev": "vite --open --port 5101",
    "build": "vite build",
    "preview": "vite preview --port 5173",
    "typecheck": "tsc --noEmit",
    "release": "npm publish --access restricted"
  }
}
```

**`.npmrc` for publishers/consumers**
```
@y2kfund:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GH_PACKAGES_TOKEN}
always-auth=true
```

**CI publish on tag** — `.github/workflows/release.yml`
```yaml
name: release
on:
  push:
    tags: ['v*.*.*']
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: npm publish --access restricted
        env:
          GH_PACKAGES_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 8) Usage in the dashboard (for reference)

```ts
// main.ts (dashboard host)
import { createApp } from 'vue'
import App from './App.vue'
import { createCore } from '@y2kfund/core'

const core = await createCore({
  supabaseUrl: import.meta.env.VITE_SUPA_URL,
  supabaseAnon: import.meta.env.VITE_SUPA_ANON,
  idb: { databaseName: 'y2k-cache', storeName: 'tanstack' },
  query: { staleTime: 60_000, gcTime: 86_400_000, refetchOnWindowFocus: false },
  buster: 'v1'
})

createApp(App).use(core).mount('#app')
```

```ts
// some dashboard file
import { Positions } from '@y2kfund/positions'
app.component('Positions', Positions)
```
```vue
<Positions :account-id="selectedId" @row-click="onRow" />
```

---

## 9) Do / Don’t

- ✅ Install **app-core** and consume its hooks: `useSupabase()`, `queryKeys`, and TanStack Query context.
- ✅ Use **TanStack Query**; persistence is handled by **app-core**.
- ✅ Namespaced query keys via `@y2kfund/core/queryKeys`.
- ✅ Emit typed events (`row-click`).
- ❌ Don’t create Supabase clients or `QueryClient`s in this library.
- ❌ Don’t use localStorage for caching.
- ❌ Don’t add global CSS.

---

**Definition of done for this repo**
- `pnpm dev` runs a standalone demo (dev harness installs app-core).
- `pnpm build` produces `dist/` (ESM library).
- Publishing creates a private **`@y2kfund/positions`** package on GitHub Packages.
