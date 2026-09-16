import { defineStore } from 'pinia';
import { portal } from '~/services/portal';
import type { ControllerAreasPayload } from '~/types/Portal';

export const useFieldworksStore = defineStore('fieldworks', () => {
	const areasData = ref<ControllerAreasPayload | null>(null);
	const loading = ref(false);

	async function fetchAreas() {
		if (areasData.value) return areasData.value;

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

	return { areasData, loading, fetchAreas };
});
