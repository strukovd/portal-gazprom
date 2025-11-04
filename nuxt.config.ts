// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	css: [
		'@mdi/font/css/materialdesignicons.min.css',
	],
	nitro: { // Для генерации статических файлов
		preset: 'github-pages',
	},
	app: {
		head: {
			title: 'Portal',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/portal.svg' }
			]
		},
		baseURL: process.env.BASE_URL ?? '/',
	},
	modules: [
		'@pinia/nuxt',
	],
	runtimeConfig: {
		public: {
			apiURL: process.env.NUXT_PUBLIC_API_BASE ?? 'https://api.gazprom.kg/api',
			apiToken: process.env.NUXT_PUBLIC_API_TOKEN
		},
	}
})
