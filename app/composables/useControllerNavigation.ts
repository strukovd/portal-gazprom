import type { NavigationLink } from './useDefaultNavigation';

export const useControllerNavigation = () => {
	const userStore = useUserStore();
	const links: NavigationLink[] = [
		{
			title: 'Полевые работы',
			link: '/fieldworks/sectors',
			icon: 'mdi-map-marker-path',
		},
		{
			title: 'Настройки',
			link: '/settings',
			icon: 'mdi-cog',
		},
		{
			spacer: true,
			class: 'spacer',
		},
		{
			title: 'Выход',
			action: userStore.logout,
			icon: 'mdi-logout',
		},
	];

	return { links };
};
