<template>
	<div class="modal-shadow" @keydown.esc="close" @click.self="close">
		<Transition name="modal-loader">
			<div v-if="loading" class="modal-loader">
				<div class="modal-loader-pulse">
					<span class="modal-loader-dot"></span>
					<span class="modal-loader-dot"></span>
					<span class="modal-loader-dot"></span>
				</div>
			</div>
		</Transition>

		<Transition name="modal-window">
			<div v-if="modalComponent && !loading" class="modal-window glass">
				<header v-if="visibleModal.options?.title" class="modal-header">
					<h3 class="modal-title">
						<!-- TODO: <v-icon v-if="visibleModal.options?.icon" color="cornflowerblue" :icon="visibleModal.options?.icon" size="1.2em"/> -->
						<span class="modal-title-text">{{ visibleModal.options.title }}</span>
					</h3>
				</header>
				<main class="main">
					<component :is="modalComponent" :payload="visibleModal.options?.payload"></component>
				</main>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue';

const appStore = useAppStore();
const visibleModal: any = computed(() => appStore.modals[appStore.modals.length-1] ?? {});
const modalLoaders = import.meta.glob('./*.vue');
const modalComponentCache = new Map<string, Component>();
const modalComponent = shallowRef<Component | null>(null);
const loading = ref(false);

async function loadModalComponent(template?: string) {
	if (!template) return null;
	const cached = modalComponentCache.get(template);
	if (cached) return cached;

	const candidates = [
		`./${template}.vue`,
		`./${template}Modal.vue`
	];
	const loaderKey = candidates.find((candidate) => candidate in modalLoaders);
	if (!loaderKey) return null;

	const loaded = await (modalLoaders[loaderKey] as () => Promise<{ default: Component }>)();
	const component = loaded.default;
	modalComponentCache.set(template, component);
	return component;
}

watch(() => visibleModal.value?.template, async (template) => {
	modalComponent.value = null;
	if (!template) {
		loading.value = false;
		return;
	}

	const cached = modalComponentCache.get(template);
	if (cached) {
		modalComponent.value = cached;
		loading.value = false;
		return;
	}

	loading.value = true;
	const component = await loadModalComponent(template);

	if (template !== visibleModal.value?.template) return;

	modalComponent.value = component;
	loading.value = false;
}, { immediate: true });

function onKeydown(e: KeyboardEvent) {
	if( e.key === 'Escape' ) {
		close(e);
	}
}

function close(e: Event) {
	if( !visibleModal.value?.options?.nonCloseable ) {
		appStore.modals.pop();
	}
}

onMounted(() => {
	window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKeydown);
});
</script>

<style lang="scss">
.modal-shadow {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	height:100vh;
	display: grid;
	place-items: center;
	transition:background-color 200ms ease-out 0s;
	background-color: rgb(20 33 51 / 30%);
	z-index:1000;

	.modal-loader {
		display: grid;
		place-items: center;
		grid-area: 1 / 1;
		width: 8em;
		height: 8em;
		border-radius: 50%;
		// background: rgb(255 255 255 / 78%);
		// box-shadow: 0 24px 70px rgb(16 24 40 / 18%);
		// backdrop-filter: blur(10px);

		.modal-loader-pulse {
			position: relative;
			width: 4.4em;
			height: 4.4em;

			.modal-loader-dot {
				position: absolute;
				inset: 0;
				border: 2px solid rgba(255  255  255 / 78%);
				border-radius: 50%;
				animation: modalPulse 1.35s ease-out infinite;

				&:nth-child(2) {
					border: 2px solid rgb(255 255 255 / 58%);
					animation-delay: .22s;
				}

				&:nth-child(3) {
					background-color: rgba(255  255  255 / 50%);
					border: 2px solid rgba(255  255  255 / 78%);
					animation-delay: .44s;
				}
			}
		}
	}

	.modal-window {
		background-color: #ffffff;
		min-width:600px;
		max-width: 800px;
		grid-area: 1 / 1;
		// background: white;
		border-radius:6px;

		.modal-header {
			border-radius:6px 6px 0 0;
			// color: #656565;
			border-bottom: 1px solid #ffffff30;
			// background: #f5f5f5;

			.modal-title {
				line-height: 3em;
				margin: 0 1em;
				font-size: 1.2em;

				.modal-title-text {
					vertical-align:middle;
					margin-left:.6em;
				}
			}
		}

		>.main {
			padding:.6em 1.8em 1em;
			// overflow: auto;
			max-height: 90vh;
		}
	}
}

.modal-loader-enter-active,
.modal-loader-leave-active {
	transition: opacity 180ms ease, transform 180ms ease;
}

.modal-loader-enter-from,
.modal-loader-leave-to {
	opacity: 0;
	transform: scale(.92);
}

.modal-window-enter-active,
.modal-window-leave-active {
	transition: opacity 180ms ease, transform 180ms ease;
}

.modal-window-enter-from,
.modal-window-leave-to {
	opacity: 0;
	transform: translateY(.4em) scale(.98);
}

@keyframes modalPulse {
	0% {
		opacity: .7;
		transform: scale(.35);
	}

	75% {
		opacity: 0;
		transform: scale(1);
	}

	100% {
		opacity: 0;
		transform: scale(1);
	}
}
</style>
