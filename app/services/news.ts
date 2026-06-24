import type { NewsGetQuery, NewsPayload, NewsResponse } from '~/types/CallGas';

export const news = {
	fetch(query: Partial<NewsGetQuery> = {}): Promise<NewsPayload[] | void> {
		const { $fetchCallGas } = useNuxtApp();

		return $fetchCallGas<NewsResponse>('/news', {
			method: 'GET',
			query
		})
			.then((resp) => {
				return resp.data;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке новостей:', error);
			});
	}
};
