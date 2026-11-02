import type { TariffPayload } from '~/types/Tariffs';

export const tariffs = {
	async fetch(): Promise<TariffPayload | void> {
		const { $fetchApi } = useNuxtApp();

		try {
			return await $fetchApi<TariffPayload>('/v1/portal/tariff', { method: 'GET' });
		}
		catch (error) {
			console.error('Ошибка при загрузке тарифов:', error);
		}
	}
};
