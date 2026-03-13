import type { ElectrobunConfig } from "electrobun";

export default {
	app: {
		name: "Anomer",
		identifier: "com.raphaelgolubev.anomer",
		version: "0.0.1",
	},
	build: {
        bun: {
            entrypoint: "desktop/src/bun/index.ts", 
        },
		// Копируем из папки build (стандарт SvelteKit), а не dist (стандарт Vite)
		copy: {
			"build/index.html": "views/mainview/index.html",
			"build/_app": "views/mainview/_app", // SvelteKit хранит JS/CSS тут
			"static": "views/mainview/static"    // Твои звуки и картинки
		},
		mac: {
			bundleCEF: false,
		},
		linux: {
			bundleCEF: false,
		},
		win: {
			bundleCEF: false,
		},
	},
} satisfies ElectrobunConfig;
