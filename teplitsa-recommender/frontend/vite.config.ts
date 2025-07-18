import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		outDir: 'build',
	},
	server: {
        host: true,
		proxy: {
			'/api': 'http://192.168.31.15:8000',
		},
	},
})
