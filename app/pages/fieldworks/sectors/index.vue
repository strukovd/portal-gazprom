<template>
	<SectorsDesktop v-if="isDesktop"/>
	<SectorsMobile v-else/>
</template>

<script lang="ts" setup>
import useDevice from '~/composables/useDevice';
import SectorsDesktop from './indexDesktop.vue';
import SectorsMobile from './indexMobile.vue';

const { isDesktop } = useDevice();

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTROLLER'],
	layout: 'controllers'
});
</script>
