<template>
	<div class="modal-shadow" @keydown.esc="close" @click.self="close">
		<div class="modal-window glass">
			<header v-if="visibleModal.options?.title" class="modal-header">
				<h3>
					<!-- TODO: <v-icon v-if="visibleModal.options?.icon" color="cornflowerblue" :icon="visibleModal.options?.icon" size="1.2em"/> -->
					<span class="title">{{ visibleModal.options.title }}</span>
				</h3>
			</header>
			<nav></nav>
			<main class="main">
				<component v-if="modalComponent" :is="modalComponent" :payload="visibleModal.options?.payload"></component>
			</main>
			<footer class="footer"></footer>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const appStore = useAppStore();
const visibleModal: any = computed(() => appStore.modals[appStore.modals.length-1] ?? {});
const modalLoaders = import.meta.glob('./*.vue');
const modalComponentCache = new Map<string, ReturnType<typeof defineAsyncComponent>>();

function resolveModalComponent(template?: string) {
	if (!template) return null;
	const cached = modalComponentCache.get(template);
	if (cached) return cached;

	const candidates = [
		`./${template}.vue`,
		`./${template}Modal.vue`
	];
	const loaderKey = candidates.find((candidate) => candidate in modalLoaders);
	if (!loaderKey) return null;

	const component = defineAsyncComponent(modalLoaders[loaderKey] as () => Promise<any>);
	modalComponentCache.set(template, component);
	return component;
}
const modalComponent = computed(() => resolveModalComponent(visibleModal.value?.template));

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
	display: flex;
	transition:background-color 200ms ease-out 0s;
	background-color: rgb(20 33 51 / 10%);
	z-index:9999999;

	.modal-window {
		min-width:600px;
		max-width: 800px;
		margin:auto;
		// background: white;
		border-radius:6px;

		.modal-header {
			border-radius:6px 6px 0 0;
			// color: #656565;
			border-bottom: 1px solid #ffffff30;
			// background: #f5f5f5;

			h3 {
				line-height: 3em;
				margin: 0 1em;
				font-size: 1.2em;

				.title {
				vertical-align:middle;
				margin-left:.6em;
				}
			}
		}

		.main {
			padding:.6em 1.8em 1em;
			// overflow: auto;
			max-height: 90vh;
		}
	}
}
</style>