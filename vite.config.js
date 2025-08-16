import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	root: '.', // корень проекта (по умолчанию текущая папка)
	server: {
		port: 3000, // можно указать свой порт
		open: true, // автоматически открывать браузер
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		outDir: 'dist', // куда складывать сборку
	},
})
