<template>
	<RouteDesktop v-if="isDesktop"/>
	<RouteMobile v-else/>
</template>

<script lang="ts" setup>
import useDevice from '~/composables/useDevice';
import RouteDesktop from './[id]Desktop.vue';
import RouteMobile from './[id]Mobile.vue';

const { isDesktop } = useDevice();

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTROLLER'],
	layout: 'controllers'
});
</script>
