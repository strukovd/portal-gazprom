<template>
	<RouteReading v-if="subscriber" :subscriber="subscriber" @close="close" @saved="close(true)"/>
</template>

<script lang="ts" setup>
import RouteReading from '~/components/fieldworks/RouteReading.vue';
import type { ControllerSubscriber } from '~/types/Portal';

const props = defineProps<{
	payload?: { subscriber?: ControllerSubscriber };
}>();
const subscriber = computed(() => props.payload?.subscriber);

function close(saved = false) {
	const modal = useAppStore().modals.pop();
	modal?.resolve?.(saved);
}
</script>
