import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [vue(), dts()],
      build: {
        lib: {
          entry: './src/index.ts',
          name: 'Positions',
          fileName: 'positions'
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
    }
  }

  return {
    plugins: [vue()],
    server: { port: 5101 }
  }
})
