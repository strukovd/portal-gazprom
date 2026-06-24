import type { OfficesPayload } from '~/types/GapromAppService';

export const offices = {
	fetch(query: Record<string, any> = {}): Promise<OfficesPayload[] | void> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<OfficesPayload[]>('/v1/gazprom-app/content/offices', {
			method: 'GET',
			query
		})
			.then((resp) => {
				return resp;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке офисов:', error);
			});
	}
};
