// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	devServer: {
		host: '0.0.0.0',
		port: 3000,
	},
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	css: [
		'@mdi/font/css/materialdesignicons.min.css',
		'~/assets/styles/global.scss'
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
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
			]
		},
		baseURL: process.env.BASE_URL ?? '/',
	},
	modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/fonts', 'nuxt-echarts', 'nuxt-aos'],
	runtimeConfig: {
		public: {
			API_TOKEN: process.env.NUXT_PUBLIC_API_TOKEN,
			API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL ?? 'https://api.gazprom.kg/api',
			CALL_GAS_BASE_URL: process.env.NUXT_PUBLIC_CALL_GAS_BASE_URL ?? 'https://api.gazprom.kg/api',
			PORTAL_BASE_URL: process.env.NUXT_PUBLIC_PORTAL_BASE_URL ?? 'https://api.gazprom.kg/api',
		},
	},
	fonts: {
		families: [
			{ name: 'Roboto', provider: 'fontsource', weights: [300, 400, 700] },
		]
	},
	echarts: {
		renderer: 'canvas',
		charts: ['BarChart', 'LineChart', 'PieChart', 'GaugeChart', 'RadarChart', 'ScatterChart'],
		components: ['TitleComponent', 'TooltipComponent', 'GridComponent', 'LegendComponent', 'DataZoomComponent', 'VisualMapComponent'],
		features: ['LabelLayout', 'UniversalTransition']
	}
})
