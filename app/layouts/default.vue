<template>
	<DefaultDesktop v-if="isDesktop">
		<slot/>
	</DefaultDesktop>
	<DefaultMobile v-else>
		<slot/>
	</DefaultMobile>
</template>

<script lang="ts" setup>
import useDevice from '~/composables/useDevice';
import DefaultDesktop from './defaultDesktop.vue';
import DefaultMobile from './defaultMobile.vue';

const { isDesktop } = useDevice();
</script>