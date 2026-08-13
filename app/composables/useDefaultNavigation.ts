export type NavigationLink = {
	title?: string
	link?: string
	icon?: string
	action?: () => void
	disabled?: boolean
	spacer?: boolean
	class?: string
	children?: NavigationLink[]
}

export const useDefaultNavigation = () => {
	const userStore = useUserStore();

	const links: NavigationLink[] = [
		{
			title: 'Панель правления',
			link: '/',
			icon: 'mdi-view-dashboard'
		},
		{
			title: 'Оперативные новости',
			link: '/news',
			icon: 'mdi-newspaper',
		},
		{
			spacer: true,
			class: 'splitter',
		},
		{
			title: 'Данные абонента',
			link: '/profile',
			icon: 'mdi-account',
		},
		{
			spacer: true,
			class: 'splitter',
		},
		{
			title: 'Тарифы',
			link: '/tariffs',
			icon: 'mdi-currency-usd',
		},
		{
			title: 'Офисы обслуживания',
			link: '/offices',
			icon: 'mdi-office-building',
		},
		{
			title: 'Жалобы',
			link: '/complaints',
			icon: 'mdi-alert-circle'
		},
		{
			spacer: true,
			class: 'spacer',
		},
		{
			title: 'Настройки',
			link: '/settings',
			icon: 'mdi-cog',
		},
		{
			title: 'Выход',
			action: userStore.logout,
			icon: 'mdi-logout',
		}
	];

	return {
		links,
	};
};
