import { defineStore } from 'pinia';
import { portal } from '~/services/portal';
import { useUserStore } from '~/stores/UserStore';
import type { ControllerGroup, ControllerAreasPayload, RouteDetailsPayload } from '~/types/Portal';

export const useFieldworksStore = defineStore('fieldworks', () => {
	const areasData = ref<ControllerAreasPayload | null>(null);
	const controllerGroups = ref<ControllerGroup[]>([]);
	const controllerSelection = ref<{ id: number; mode: 'self' | 'group' } | null>(null);
	const selectedControllerId = computed(() => controllerSelection.value ? String(controllerSelection.value.id) : null);
	let groupsLoaded = false;
	let groupsRequest: Promise<void> | null = null;
	const loadedUserName = ref<string | null>(null);
	let pendingUserName: string | null = null;
	let areasRequest: Promise<ControllerAreasPayload> | null = null;
	let requestId = 0;
	const routeDetails = ref<Record<string, RouteDetailsPayload>>({});
	const loading = ref(false);
	const isAdmin = computed(() => useUserStore().userData?.role === 'ADMIN');
	const selectedUser = computed(() => {
		const nodes = [...controllerGroups.value];
		while (nodes.length) {
			const node = nodes.pop()!;
			if (node.id === controllerSelection.value?.id) return node;
			nodes.push(...node.children);
		}
		return null;
	});
	const userName = computed(() => isAdmin.value ? selectedUser.value?.name : useUserStore().userData?.userName);
	const currentData = computed(() => loadedUserName.value === userName.value ? areasData.value : null);
	const areas = computed(() => currentData.value?.controllers.flatMap(controller => controller.areas) ?? []);
	const statistics = computed(() => {
		const data = currentData.value;
		if (!data) return undefined;
		const totals = data.controllers.reduce((total, controller) => ({
			areaCount: total.areaCount + controller.statistics.areaCount,
			routeCount: total.routeCount + controller.statistics.routeCount,
			totalSubscribers: total.totalSubscribers + controller.statistics.totalSubscribers,
			collectedBySubscriber: total.collectedBySubscriber + controller.statistics.collectedBySubscriber,
			collectedByController: total.collectedByController + controller.statistics.collectedByController,
		}), { areaCount: 0, routeCount: 0, totalSubscribers: 0, collectedBySubscriber: 0, collectedByController: 0 });
		return {
			...totals,
			totalCollectedReadings: data.overallStatistics.collectedReadings,
			totalRemainingReadings: data.overallStatistics.remainingReadings,
			totalCollectionPercentage: data.overallStatistics.collectionPercentage,
		};
	});

	async function fetchAreas(force = false) {
		const name = userName.value;
		if (!name) throw new Error('Не указано имя контроллёра для загрузки участков');
		if (areasData.value && loadedUserName.value === name && !force) return areasData.value;
		if (areasRequest && pendingUserName === name) return areasRequest;
		const id = ++requestId;
		areasData.value = null;
		pendingUserName = name;
		loading.value = true;
		areasRequest = (async () => {
			try {
				const response = await portal.fetchAreas(name);
				if (id === requestId && name === userName.value) {
					loadedUserName.value = name;
					areasData.value = response;
				}
				return response;
			}
			finally {
				if (id === requestId) {
					loading.value = false;
					areasRequest = null;
					pendingUserName = null;
				}
			}
		})();
		return areasRequest;
	}

	async function fetchForRole(controllerId?: string) {
		if (!isAdmin.value) return fetchAreas();
		if (controllerId && Number.isFinite(Number(controllerId)) && controllerId !== selectedControllerId.value) {
			controllerSelection.value = { id: Number(controllerId), mode: 'self' };
		}
		if (!groupsLoaded) {
			if (!groupsRequest) {
				loading.value = true;
				groupsRequest = portal.fetchControllerGroups().then(response => {
					controllerGroups.value = response;
					groupsLoaded = true;
				}).finally(() => {
					loading.value = false;
					groupsRequest = null;
				});
			}
			await groupsRequest;
		}
		if (selectedUser.value) return fetchAreas();
		requestId++;
		areasData.value = null;
		areasRequest = null;
		pendingUserName = null;
		loadedUserName.value = null;
		loading.value = false;
	}

	async function fetchRoute(code: string, force = false): Promise<RouteDetailsPayload | null> {
		await fetchForRole();
		if (isAdmin.value && !selectedControllerId.value) return null;
		if (!areas.value.some(area => area.routes.some(route => route.routeCode === code))) return null;
		const key = `${isAdmin.value ? selectedControllerId.value : useUserStore().userData?.id}:${code}`;
		if (!routeDetails.value[key] || force) routeDetails.value[key] = await portal.fetchRouteByCode(code);
		return routeDetails.value[key];
	}

	return { areasData, controllerGroups, controllerSelection, selectedControllerId, areas, statistics, loading, isAdmin, fetchAreas, fetchForRole, fetchRoute };
});
