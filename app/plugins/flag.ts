export type FlagsPlugin = {
	show:		(options: FlagsModel) => void;
	success:	(message: string, params?: Omit<FlagsModel, 'type' | 'message'>) => void;
	info:		(message: string, params?: Omit<FlagsModel, 'type' | 'message'>) => void;
	warn:		(message: string, params?: Omit<FlagsModel, 'type' | 'message'>) => void;
	error:		(message: string, params?: Omit<FlagsModel, 'type' | 'message'>) => void;
}
export type FlagsModel = {
	id?: string;
	title?: string;
	message?: string;
	type?: 'success' | 'error' | 'warning' | 'info';
	timeout?: number;
	autoclose?: boolean;
}
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$flags: FlagsPlugin;
	}
}
declare module '#app' {
	interface NuxtApp {
		$flags: FlagsPlugin;
	}
}


export default defineNuxtPlugin(() => {
	const flags: FlagsPlugin = {
		show: (params: FlagsModel) => {
			const appStore = useAppStore();
			if (appStore) {
				const id = params.id ?? Math.random().toString(36).substring(2, 9);
				const timeout = params.timeout ?? params.type === 'error' ? 20000 : 6000; // По умолчанию 6 секунд, для ошибок 20
				const autoclose = params.autoclose !== false; // Включаем, если явно не указано false

				appStore.flags.push({ ...params, id, timeout, autoclose });

				// Запускаем таймер автозакрытия
				if(autoclose) {
					setTimeout(() => {
						appStore.flags = appStore.flags.filter(flag => flag.id !== id);
					}, timeout);
				}
			} else {
				console.warn('Метод $flag.show: Невозможно показать флаг, appStore еще не инициализирован');
			}
		},
		success: (message: string, params?: Omit<FlagsModel, 'type' | 'message'>) => {
			flags.show({ type: 'success', message,  ...params });
		},
		info: (message: string, params?: Omit<FlagsModel, 'type' | 'message'>) => {
			flags.show({ type: 'info',  message,  ...params });
		},
		warn: (message: string, params?: Omit<FlagsModel, 'type' | 'message'>) => {
			flags.show({ type: 'warning',  message,  ...params });
		},
		error: (message: string, params?: Omit<FlagsModel, 'type' | 'message'>) => {
			flags.show({ type: 'error',  message,  ...params });
		},
	};

	return {
		provide: {
			flags,
		}
	};
});
