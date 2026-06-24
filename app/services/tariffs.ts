export const tariffs = {
	fetch(query: Record<string, any> = {}): Promise<any | void> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<any>('/v1/gazprom-app/content/tariff', {
			method: 'GET',
			query
		})
			.then((resp) => {
				return resp;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке тарифов:', error);
			});
	}
};
