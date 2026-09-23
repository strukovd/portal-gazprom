<template>
	<Desktop v-if="isDesktop"/>
	<Mobile v-else/>
</template>

<script lang="ts" setup>
import useDevice from '~/composables/useDevice';
import Desktop from './[id]Desktop.vue';
import Mobile from './[id]Mobile.vue';

const { isDesktop } = useDevice();

definePageMeta({ auth: true, roles: ['ADMIN', 'CONTROLLER'], layout: 'fieldworks' });
</script>
