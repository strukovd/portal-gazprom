type FlagsPlugin = {
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


export default defineNuxtPlugin((nuxtApp) => {
	const flags: FlagsPlugin = {
		show: (params: FlagsModel) => {
			const appStore = useAppStore();
			if (appStore) {
				const id = params.id = params.id ?? Math.random().toString(36).substring(2, 9);
				appStore.flags.push(params);

				if(params.autoclose || params.autoclose === undefined && params.type !== 'error') {
					setTimeout(() => {
						appStore.flags = appStore.flags.filter(flag => flag.id !== id);
					}, params.timeout ?? 6000);
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

	nuxtApp.provide('flags', flags);
});
