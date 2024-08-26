import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import { Mode, plugin as markdown } from 'vite-plugin-markdown'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), markdown({ mode: [Mode.MARKDOWN]})],
})
