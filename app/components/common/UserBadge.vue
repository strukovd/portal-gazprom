<template>
	<div class="user-badge" :style="{ '--ub-bg': badgeColor.background, '--ub-color': badgeColor.color, '--ub-border': badgeColor.border }">
		<BaseIcon v-if="prependIcon" class="ub-icon" :name="prependIcon" size="1.2em"/>

		<div class="ub-info">
			<div class="ub-name">{{ name || login }}</div>
			<div v-if="login" class="ub-login">{{ login }}</div>
		</div>

		<BaseIcon v-if="appendIcon" class="ub-icon" :name="appendIcon" size="1.2em"/>

		<button v-if="removable" type="button" class="ub-remove" title="Удалить исполнителя" @click.stop="emit('remove')">
			<BaseIcon name="mdi-close" size="1em"/>
		</button>
	</div>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/base/BaseIcon.vue';

const emit = defineEmits<{
	remove: [];
}>();

const props = defineProps<{
	name?: string;
	login?: string;
	prependIcon?: string;
	appendIcon?: string;
	removable?: boolean;
}>();

const badgeColor = computed(() => {
	const colors = [
		{ background: '#dcfce7', color: '#166534', border: '#bbf7d0' },
		{ background: '#fee2e2', color: '#dc2626', border: '#fecaca' },
		{ background: '#e0f2fe', color: '#2563ea', border: '#bae6fd' },
		{ background: '#f3f4f6', color: '#374151', border: '#e5e7eb' },
		{ background: '#fffbeb', color: '#a16207', border: '#fde68a' },
		{ background: '#fff1e6', color: '#b45309', border: '#fed7aa' },
		{ background: '#fce7f3', color: '#be185d', border: '#fbcfe8' },
		{ background: '#f7fee7', color: '#65a30d', border: '#d9f99d' },
		{ background: '#eef2ff', color: '#4338ca', border: '#c7d2fe' },
		{ background: '#ccfbf1', color: '#0f766e', border: '#99f6e4' },
		{ background: '#f3e8ff', color: '#7e22ce', border: '#e9d5ff' },
	];
	const value = props.name || props.login || '';
	const hash = value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
	return colors[hash % colors.length] || colors[0];
});
</script>

<style lang="scss">
.user-badge {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: .55em;
	padding: .45em .55em;
	border: 1px solid var(--ub-border);
	border-radius: 7px;
	background: var(--ub-bg);

	.ub-icon {
		flex: 0 0 auto;
		color: var(--ub-color);
	}

	.ub-info {
		display: grid;
		gap: .15em;
		flex: 1 1 auto;
		min-width: 0;

		.ub-name {
			color: var(--ub-color);
			font-weight: 800;
		}

		.ub-login {
			color: color-mix(in srgb, var(--ub-color) 72%, #64748b);
			font-size: .78em;
			font-weight: 700;
		}
	}

	.ub-remove {
		aspect-ratio: 1/1;
		color: var(--ub-color);
		background: #fff;
		border: 1px solid var(--ub-border);
		border-radius: 6px;
		padding:.3em .4em;
		cursor: pointer;
		transition: color 180ms ease 0s, border-color 180ms ease 0s, background 180ms ease 0s;

		&:hover {
			color: #dc2626;
			background: #fff1f2;
			border-color: #fecdd3;
		}
	}
}
</style>
