export type AppLayout = 'default' | 'controllers';

export const useLayout = (baseLayout: AppLayout = 'default') => {
	const userStore = useUserStore();
	const layout = computed<AppLayout>(() => userStore.userData?.role === 'CONTROLLER'
		? 'controllers'
		: baseLayout
	);

	return { layout };
};
