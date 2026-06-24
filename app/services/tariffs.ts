import type { TariffPayload } from "~/types/GapromAppService";

export const tariffs = {
	fetch(query: Record<string, any> = {}): Promise<TariffPayload | void> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<TariffPayload>('/v1/gazprom-app/content/tariff', {
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
