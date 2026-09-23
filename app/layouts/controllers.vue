<template>
	<ControllersDesktop v-if="isDesktop" :links="links">
		<slot/>
	</ControllersDesktop>
	<ControllersMobile v-else :links="links">
		<slot/>
	</ControllersMobile>
</template>

<script lang="ts" setup>
import ControllersDesktop from './controllersDesktop.vue';
import ControllersMobile from './controllersMobile.vue';
import useDevice from '~/composables/useDevice';
import { useControllerNavigation } from '~/composables/useControllerNavigation';

const { isDesktop } = useDevice();
const { links } = useControllerNavigation();
</script>
