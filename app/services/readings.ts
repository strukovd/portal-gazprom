import type { ReadingPayload, ReadingsQuery, ReadingsResponse } from '~/types/Portal';

export const readings = {
	fetch(query: Partial<ReadingsQuery> = {}): Promise<ReadingPayload[] | void> {
		const { $fetchPortal } = useNuxtApp();

		return $fetchPortal<ReadingsResponse>('/v1/portal/readings', {
			method: 'GET',
			query
		})
			.then((resp) => {
				return resp.data;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке показаний:', error);
			});
	},

	fetchToday(query: Partial<ReadingsQuery> = {}): Promise<ReadingPayload[] | void> {
		const todayISO = new Date().toLocaleDateString('fr-CA');

		return readings.fetch({
			success: true,
			date: todayISO,
			sortOrder: 'ASC',
			...query
		});
	}
};
