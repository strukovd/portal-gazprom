import { defineStore } from 'pinia';
import { portal } from '~/services/portal';
import { useUserStore } from '~/stores/UserStore';
import type { AdminControllersPayload, ControllerAreasPayload, ControllerRoute, RouteDetailsPayload } from '~/types/Portal';

export const useFieldworksStore = defineStore('fieldworks', () => {
	const areasData = ref<ControllerAreasPayload | null>(null);
	const adminData = ref<AdminControllersPayload | null>(null);
	const selectedControllerId = ref<string | null>(null);
	const routeDetails = ref<Record<string, RouteDetailsPayload>>({});
	const loading = ref(false);
	const isAdmin = computed(() => useUserStore().userData?.role === 'ADMIN');
	const selectedController = computed(() => adminData.value?.controllers.find(item => item.controllerId === selectedControllerId.value));
	const areas = computed(() => isAdmin.value ? selectedController.value?.areas ?? [] : areasData.value?.areas ?? []);
	const statistics = computed(() => isAdmin.value ? selectedController.value?.statistics : areasData.value?.statistics);

	async function fetchAreas(force = false) {
		if (areasData.value && !force) return areasData.value;

		loading.value = true;
		try {
			const response = await portal.fetchAreas();
			areasData.value = response;
			return areasData.value;
		}
		finally {
			loading.value = false;
		}
	}

	async function fetchForRole(controllerId?: string) {
		if (!isAdmin.value) return fetchAreas();
		if (!adminData.value) {
			loading.value = true;
			try {
				adminData.value = await portal.fetchAllAreas();
			}
			finally {
				loading.value = false;
			}
		}
		if (controllerId) selectedControllerId.value = controllerId;
		else if (!selectedControllerId.value) selectedControllerId.value = adminData.value?.controllers[0]?.controllerId ?? null;
	}

	async function fetchRoute(code: string, force = false): Promise<ControllerRoute | RouteDetailsPayload | null> {
		if (!isAdmin.value) {
			const data = await fetchAreas(force);
			return data.areas.flatMap(area => area.routes).find(item => item.routeCode === code) ?? null;
		}
		await fetchForRole();
		if (!selectedController.value?.areas.some(area => area.routes.some(route => route.routeCode === code))) return null;
		const key = `${selectedControllerId.value}:${code}`;
		if (!routeDetails.value[key] || force) routeDetails.value[key] = await portal.fetchRouteByCode(code);
		return routeDetails.value[key];
	}

	return { areasData, adminData, selectedControllerId, selectedController, areas, statistics, loading, isAdmin, fetchAreas, fetchForRole, fetchRoute };
});
