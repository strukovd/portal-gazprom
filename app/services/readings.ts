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
	},

	create(account: string, reading: number): Promise<unknown> {
		const { $fetchPortal } = useNuxtApp();

		return $fetchPortal<ReadingsResponse>('/v1/portal/readings', {
			method: 'POST',
			body: { account, reading }
		})
			.then((resp) => {
				return resp;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке показаний:', error);
			});
	},

	delete(account: string, id: string): Promise<unknown> {
		const { $fetchPortal } = useNuxtApp();

		return $fetchPortal<ReadingsResponse>('/v1/portal/readings', {
			method: 'DELETE',
			body: { account, id }
		})
			.then((resp) => {
				return resp.data;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке показаний:', error);
			});
	}
};
