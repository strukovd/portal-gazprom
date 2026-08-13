<template>
	<div ref="progressLine" class="animated-progress-line">
		<div class="track" :style="{ height: props.height }">
			<div class="line" :style="{
				width: `${displayPercent}%`,
				background: props.color
			}"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	percent: { type: Number, default: 0 },
	color: String,
	height: String,
});

const mounted = ref(false);
const progressLine = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const normalizedPercent = computed(() => Math.min(Math.max(props.percent, 0), 100));
const displayPercent = computed(() => mounted.value ? normalizedPercent.value : 0);


function runAnimation() {
	requestAnimationFrame(() => { // прямо перед тем, как браузер соберется перерисовать экран
		requestAnimationFrame(() => { // след. кадр анимации
			mounted.value = true;
		});
	});
}

onMounted(() => {
	// Если браузер не поддерживает IntersectionObserver, то запускаем анимацию сразу
	if (!progressLine.value || !('IntersectionObserver' in window)) {
		runAnimation();
		return;
	}
	// Иначе, следим за progressLine, и запускаем анимацию, когда он появится в зоне видимости
	const onVisible = (entries: IntersectionObserverEntry[]) => {
		const entry = entries[0];
		if (!entry?.isIntersecting) return;

		runAnimation();
		observer?.disconnect();
		observer = null;
	};
	observer = new IntersectionObserver(onVisible, { threshold: .25 });

	observer.observe(progressLine.value);
});

onBeforeUnmount(() => {
	observer?.disconnect();
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
