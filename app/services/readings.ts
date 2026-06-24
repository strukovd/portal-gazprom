import type { ReadingPayload, ReadingsResponse } from '~/types/Portal';

export const readings = {
	fetchToday(): Promise<ReadingPayload[] | void> {
		const { $fetchPortal } = useNuxtApp();
		const todayISO = new Date().toLocaleDateString('fr-CA');

		return $fetchPortal<ReadingsResponse>('/v1/portal/readings', {
			method: 'GET',
			query: {
				success: true,
				date: todayISO,
				sortOrder: 'ASC'
			}
		})
			.then((resp) => {
				return resp.data;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке показаний:', error);
			});
	}
};
