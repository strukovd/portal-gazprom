<template>
	<div class="base-tabs">
		<header v-if="label" class="header" style="display:flex; align-items:start; padding-right:1em;">
			<div class="caption-container" style="flex:auto 1 1;">
				<span class="caption">{{ label }}</span>
			</div>
		</header>

		<section class="tabs">
			<button type="button" class="tab-button"
				v-for="button of items" :key="button.key"
				:id="`tab-${button.key}`"
				:class="{selected: modelValue === button.key}"
				:style="{background: modelValue === button.key && button.color ? button.color : ''}"
				@click="onSelected(button.key)"
			>
				<BaseIcon v-if="button.icon" :name="button.icon" size="1.2em" style="margin-right:.2em; opacity:.8; vertical-align:baseline;"></BaseIcon>
				<span style="font-weight:300;">{{ button.value }}</span>
				<span v-if="button.badge" class="tab-button-badge">{{ button.badge }}</span>
			</button>
		</section>
	</div>
</template>

<script lang="ts">
import BaseIcon from './BaseIcon.vue';

type TabModel = {
	key: any;
	icon?: string;
	value: string;
	color?: string;
	badge?: string | number;
}

export default defineComponent({
	name: 'FilterTabs',
	components: { BaseIcon },
	props: {
		modelValue: { type: [Object, String, Number], default: undefined },
		label: String,
		items: Array as () => Array<TabModel>,
		autoselect: { type: Boolean, default: false }
	},
	emits: [ 'update:modelValue' ],
	data() {
		return {
			selectedKey: null as any,
		};
	},
	watch: {
		items() {
			if( !this.modelValue ) {
				// Выбираем первый элемент, если включено autoselect
				if(this.autoselect && !this.selectedKey && this.items?.length) {
					this.selectedKey = this.items[0].key;
				}
			}
		},

		selectedKey() {
			// Когда происходит автовыбор, вызывает явно onSelected
			this.onSelected(this.selectedKey);
		}
	},
	beforeMount() {
		// Выбираем первый элемент, если включено autoselect
		if(this.autoselect && this.items?.length) {
			this.selectedKey = this.items[0].key;
		}
	},
	methods: {
		onSelected(selectedKey: any) {
			this.selectedKey = selectedKey;
			this.$emit('update:modelValue', this.selectedKey);
		}
	},
});
</script>

<style lang="scss">
.base-tabs {
	.caption {
		// font-size: 14px;
		// opacity: .6;
		line-height: 1.4em;
		margin-bottom: .4em;

		color: #4b5563;
		font-size: 0.82rem;
		font-weight: 700;
		opacity:1;
	}

	.tabs {
		display: flex;
		/* justify-content: center; */
		overflow-x: auto;
		align-items: center;
		margin:.4em 0 .6em 0;
		/* padding:.5em .7em; */
		// background: #FFFFFF;
		// backdrop-filter: blur(20px);
		/* box-shadow: 0px 0px 30px rgba(3, 100, 165, 0.1); */
		/* box-shadow: 0 0 3px rgba(0 0 0 / .12); */
		border-radius: 6px;
		/* border: 1px solid #E0E2E791; */

		.tab-button {
			display: flex;
			align-items: center;
			gap: .3em;
			line-height:1.4em;
			margin:0 .1em;
			background: #f3f4f6;
			font-size: .9em;
			font-weight: 500;
			border-radius: 4px;
			box-shadow: none;
			padding:.4em 1em;
			transition:all 300ms ease 0s;
			border-style: none;
			cursor: pointer;
			white-space: nowrap;
			outline: none;

			.tab-button-badge {
				background-color:rgb(255 255 255 / .8);
				color:inherit;
				display:inline-block;
				padding:0 .5em;
				border-radius:3px;
				font-size:.74em;
			}

			&.selected {
				background: #2563ea;
				color: #fff;

				&:hover {
					background: #1853d3;
				}

				.tab-button-badge {
					background-color:rgb(255 255 255 / .2);
				}
			}
		}
	}
}
</style>
