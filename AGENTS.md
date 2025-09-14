# AGENTS.md — y2kfund/app-positions

**Purpose:** This repo contains the **Positions app/component** for the y2kfund dashboard. It is a Vue 3 library package published privately to GitHub Packages as `@y2kfund/positions`.

- **Repo name:** `app-positions`
- **Package name:** `@y2kfund/positions`
- **Component export:** `Positions`
- **Org:** https://github.com/orgs/y2kfund/
- **Core shared pkg:** `@y2kfund/core` (provides `SUPABASE`, `useSupabase()`, `queryKeys`, shared types)

> This file is for AI coding assistants (Copilot/agents). Follow these rules exactly.

---

## 1) Architecture & Rules (authoritative)

- **Vue 3 only.** Package is a **library build (ESM)** that exports a Vue component. No web components, no module federation.
- **Single Supabase client**: the **dashboard host** creates it and provides it via `@y2kfund/core`. **Do not** create clients inside this library code.
- **Data fetching**: Use **TanStack Vue Query**. Cache persistence is configured in the **dashboard**, not here.
- **Realtime**: Subscribe to **Supabase Realtime** and **invalidate** (or patch) the right query key.
- **Styling**: Use `<style scoped>` or CSS Modules. Expose **CSS variables** for theming. Do **not** add global CSS.
- **Type-safety**: Put public props/events in `src/types.ts`, export from `src/index.ts`.
- **SemVer**: Any breaking change to props/events is a **major** version bump.
- **Naming**: Import as `import { Positions } from '@y2kfund/positions'` and use `<Positions .../>`.

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
  dev.ts               # creates/provides Supabase client, mounts <Positions/>
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

## 4) Supabase client (from @y2kfund/core)

**Never call `createClient()` inside library code.** Use core helpers.

```ts
// inside a composable or <script setup>
import { useSupabase } from '@y2kfund/core'
const supabase = useSupabase()  // typed client, throws if not provided
```

**Dev harness (allowed to create client for local runs):**

**`dev/dev.ts`**
```ts
import { createApp } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE } from '@y2kfund/core'
import Positions from '../src/Positions.vue'

const supabase = createClient(import.meta.env.VITE_SUPA_URL, import.meta.env.VITE_SUPA_ANON)

createApp(Positions, (window as any).__DEMO_PROPS__ || {})
  .provide(SUPABASE, supabase)
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
import { createClient } from '@supabase/supabase-js'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createIDBPersister } from '@tanstack/query-persist-client-idb'
import { SUPABASE } from '@y2kfund/core'

const supabase = createClient(import.meta.env.VITE_SUPA_URL, import.meta.env.VITE_SUPA_ANON)
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, gcTime: 86_400_000, refetchOnWindowFocus: false } } })

await persistQueryClient({
  queryClient,
  persister: await createIDBPersister({ databaseName: 'hf-cache', storeName: 'tanstack' }),
  maxAge: 86_400_000,
  buster: 'v1'
})

createApp(App)
  .use(VueQueryPlugin, { queryClient })
  .provide(SUPABASE, supabase)
  .mount('#app')
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

- ✅ Import keys/helpers from **`@y2kfund/core`** (`useSupabase()`, `queryKeys`).
- ✅ Use **TanStack Query**; rely on **dashboard** for persistence setup.
- ✅ Namespaced query keys via `queryKeys`.
- ✅ Emit typed events (`row-click`).
- ✅ Dev harness may create the Supabase client for local runs.
- ❌ Don’t create Supabase clients in library code.
- ❌ Don’t use localStorage for caching.
- ❌ Don’t add global CSS.

---

## 10) Optional: Make Copilot read this without duplication

If we keep only **AGENTS.md**, mirror it to Copilot’s path automatically:

**Symlink (macOS/Linux):**
```bash
mkdir -p .github
rm -f .github/copilot-instructions.md
ln -s ../AGENTS.md .github/copilot-instructions.md
```

**Portable script:**
```js
// scripts/sync-agents.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
const src = 'AGENTS.md', dst = '.github/copilot-instructions.md';
mkdirSync(dirname(dst), { recursive: true });
writeFileSync(dst, readFileSync(src, 'utf8'));
console.log(`[sync] ${src} -> ${dst}`);
```

```json
// package.json
{ "scripts": { "prepare": "node scripts/sync-agents.mjs" } }
```

---

**Definition of done for this repo**
- `pnpm dev` runs a standalone demo (dev harness provides Supabase).
- `pnpm build` produces `dist/` (ESM library).
- Publishing creates a private **`@y2kfund/positions`** package on GitHub Packages.
