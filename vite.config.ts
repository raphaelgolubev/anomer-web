import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit(), devtoolsJson()],

	server: {
		host: '0.0.0.0',
		port: 3000,
		strictPort: true,
		hmr: {
			// Порт для HMR, который мы пробросили в Docker
			clientPort: 24678 
		},
		proxy: {
			'/api': {
				target: 'http://backend:8000', // 'backend' — имя сервиса в docker-compose
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},
});
