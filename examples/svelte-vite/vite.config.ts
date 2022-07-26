import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { webUpdateNotice } from '@plugin-web-update-notify/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), webUpdateNotice()],
})
