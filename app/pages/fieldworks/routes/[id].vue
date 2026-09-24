<template>
	<RouteDesktop v-if="isDesktop"/>
	<RouteMobile v-else/>
</template>

<script lang="ts" setup>
import useDevice from '~/composables/useDevice';
import { useLayout } from '~/composables/useLayout';
import RouteDesktop from './[id]Desktop.vue';
import RouteMobile from './[id]Mobile.vue';

const { isDesktop } = useDevice();
const { layout } = useLayout('controllers');

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTROLLER'],
	layout
});
</script>
