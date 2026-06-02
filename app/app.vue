<template>
  <div>
	<transition name="modal">
		<ModalWrapper v-if="appStore.modals.length"/>
	</transition>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import ModalWrapper from './components/modals/ModalWrapper.vue';

const appStore = useAppStore();

</script>

<style>
body {
	margin:0;
}

h1 {
	font-size:36px;
}
</style>
