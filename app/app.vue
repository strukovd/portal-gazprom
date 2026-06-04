<template>
	<div>
		<transition name="modal">
			<ModalWrapper v-if="appStore.modals.length"/>
		</transition>
		<FlagWrapper v-if="appStore.flags.length"/>
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import ModalWrapper from './components/modals/ModalWrapper.vue';
import FlagWrapper from './components/common/FlagWrapper.vue';
const appStore = useAppStore();

</script>

<style>
body {
	margin: 0;
}

h1 {
	font-size: 36px;
}

.app {
	.modal-enter-active, .modal-leave-active {
		transition:opacity .2s ease-in 0s;
	}
	.modal-enter-from, .modal-leave-to {
		opacity: 0;
	}
}
</style>
