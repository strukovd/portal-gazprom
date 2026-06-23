import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	const createApiClient = (baseURL: string) => $fetch.create({
		baseURL,
		onRequest({ options }) {
			if(config.public.API_TOKEN) options.headers.set('api-token', config.public.API_TOKEN);

			if(import.meta.server) return;
			else {
				const token = localStorage.token;
				if (token) {
					options.headers.set('Authorization', `Bearer ${token}`);
				}
			}
		},
		onResponse({ response }) {
			// централизованная обработка
		},
		onResponseError({ response, request, options }) {
			// логика на 401/403/500 и т.п.
			switch (response.status) {
				case 401: // Пользователь не представился
					useUserStore().reset();
					navigateTo('/login');
					break;
				case 403: // Пользователь представился, но ему сюда нельзя
					nuxtApp.$flags.error(`
							<div>У данного пользовалтеля нет прав на выполнение данного запроса</div>
							<div><pre><code>${options.method} ${request}</code></pre></div>
							<div>Текущий пользователь: <code>${useUserStore().userData.login}</code> с ролью <code>${useUserStore().userData.role}</code></div>
						`,
						{
							title: `${response.status}. Нет доступа`,
						}
					);
					break;
			}
		},
	});

	const fetchApi = createApiClient(config.public.API_BASE_URL);
	const fetchCallGas = createApiClient(config.public.CALL_GAS_BASE_URL);
	const fetchPortal = createApiClient(config.public.PORTAL_BASE_URL);

	return {
		provide: {
			fetchApi,
			fetchCallGas,
			fetchPortal,
		}
	};
})