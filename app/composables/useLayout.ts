export type AppLayout = 'default' | 'controllers';

export const useLayout = (baseLayout: AppLayout = 'default') => {
	const layout = computed<AppLayout>(() => useUserStore().userData?.role === 'CONTROLLER'
		? 'controllers'
		: baseLayout
	);

	return { layout };
};
