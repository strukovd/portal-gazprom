<template>
	<div class="animated-progress-line">
		<div class="track">
			<div class="line" :style="{ width: `${displayPercent}%` }"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	percent: {
		type: Number,
		default: 0
	}
});

const mounted = ref(false);

const normalizedPercent = computed(() => Math.min(Math.max(props.percent, 0), 100));
const displayPercent = computed(() => mounted.value ? normalizedPercent.value : 0);

onMounted(() => {
	requestAnimationFrame(() => {
		mounted.value = true;
	});
});
</script>

<style lang="scss">
.animated-progress-line {
	width: 100%;

	.track {
		position: relative;
		overflow: hidden;
		height: .72em;
		border-radius: 999px;
		background: #eef2ff;

		.line {
			height: 100%;
			border-radius: inherit;
			background: linear-gradient(90deg, #2563eb, #38bdf8);
			transition: width 680ms cubic-bezier(.22, 1, .36, 1);
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.animated-progress-line {
		.track {
			.line {
				transition: none;
			}
		}
	}
}
</style>
