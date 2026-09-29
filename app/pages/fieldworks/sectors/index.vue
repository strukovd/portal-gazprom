<template>
	<div v-if="fieldworksStore.isAdmin" class="fieldworks-controller-select">
		<BaseAutocomplete v-model="selectedControllerId" label="Контроллёр" placeholder="Выберите контроллёра" :items="controllers"/>
	</div>

	<SectorsDesktop v-if="isDesktop"/>
	<SectorsMobile v-else/>
</template>

<script lang="ts" setup>
import BaseAutocomplete from '~/components/common/base/BaseAutocomplete.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';
import useDevice from '~/composables/useDevice';
import { useLayout } from '~/composables/useLayout';
import SectorsDesktop from './indexDesktop.vue';
import SectorsMobile from './indexMobile.vue';

const { isDesktop } = useDevice();
const { layout } = useLayout('controllers');
const route = useRoute();
const fieldworksStore = useFieldworksStore();
const controllers = computed(() => fieldworksStore.adminData?.controllers.map(item => ({ key: item.controllerId, value: item.controllerName || item.controllerId })) ?? []);
const selectedControllerId = computed({
	get: () => fieldworksStore.selectedControllerId ?? '',
	set: (id: string | undefined) => {
		if (!id || id === fieldworksStore.selectedControllerId) return;
		fieldworksStore.selectedControllerId = id;
		navigateTo({ query: { ...route.query, controller: id } }, { replace: true });
	},
});

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTROLLER'],
	layout
});
</script>

<style lang="scss">
.fieldworks-controller-select {
	max-width: 24em;
}
</style>
