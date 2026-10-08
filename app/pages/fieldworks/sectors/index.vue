<template>
	<div v-if="fieldworksStore.isAdmin" class="fieldworks-controller-select">
		<HierarchyAutocomplete v-model="selectedController" placeholder="Выберите контроллёра или группу" :items="fieldworksStore.controllerGroups"/>
	</div>

	<SectorsDesktop v-if="isDesktop"/>
	<SectorsMobile v-else/>
</template>

<script lang="ts" setup>
import HierarchyAutocomplete, { type HierarchySelection } from '~/components/common/HierarchyAutocomplete.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';
import useDevice from '~/composables/useDevice';
import { useLayout } from '~/composables/useLayout';
import SectorsDesktop from './indexDesktop.vue';
import SectorsMobile from './indexMobile.vue';

const { isDesktop } = useDevice();
const { layout } = useLayout('controllers');
const route = useRoute();
const { $flags } = useNuxtApp();
const fieldworksStore = useFieldworksStore();
if (typeof route.query.controller === 'string' && Number.isFinite(Number(route.query.controller))) {
	fieldworksStore.controllerSelection = {
		id: Number(route.query.controller),
		mode: 'self',
	};
}
const selectedController = computed({
	get: () => fieldworksStore.controllerSelection,
	set: (selection: HierarchySelection) => {
		fieldworksStore.controllerSelection = selection;
		const query = { ...route.query };
		delete query.mode;
		navigateTo({ query: { ...query, controller: selection ? String(selection.id) : undefined } }, { replace: true });
	},
});

watch(() => route.query.controller, async id => {
	fieldworksStore.controllerSelection = typeof id === 'string' && id.trim() && Number.isFinite(Number(id))
		? { id: Number(id), mode: 'self' }
		: null;
	try {
		await fieldworksStore.fetchForRole();
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.message || 'Не удалось загрузить участки контроллёра');
	}
});

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTROLLER'],
	layout
});
</script>

<style lang="scss">
.fieldworks-controller-select {
	margin:1em 1em;
	// если экран широкий, то убрать отступ по бокам
	@media (min-width: 1024px) {
		margin:1em auto;
	}
}
</style>
