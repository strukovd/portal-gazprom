// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	{
		rules: {
			'vue/attribute-hyphenation': 'off',
			'vue/first-attribute-linebreak': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/attributes-order': 'off',
		},
	},
)
