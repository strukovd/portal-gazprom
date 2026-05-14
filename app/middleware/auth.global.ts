export default defineNuxtRouteMiddleware((to, from) => {
	// На сервере пропускаем (нет localStorage). Проверять будем на клиенте.
	if (import.meta.server) return;

	const user = useUserStore();
	const NEEDS_AUTH = false; // Boolean(to.meta.auth);
	const ALLOWED_ROLES = Array.isArray(to.meta.roles) ? (to.meta.roles as string[]) : null;

	// Если авторизация требуется
	if(NEEDS_AUTH) {
		if(!user.token) { // Если нет токена
			return navigateTo({
				path: '/login',
				// query: { redirect: to.fullPath }
			}, { replace: true })
		}
		else { // Если есть токен 🪙
			const role = user.userData?.role;
			if(ALLOWED_ROLES && ALLOWED_ROLES.length > 0) {
				if(!ALLOWED_ROLES.includes(role)) { // Если пользователь не иммет доступа (роли) к странице
					const page = determinePageByRole(role);
					return navigateTo(page, { replace: true });
				}
			}

		}
	}

	// Если уже авторизован и пришёл на /login — перекинуть на главную
	if (to.path.replace(/\/$/, '') === '/login' && user.token) {
		const role = user.userData?.role;
		const page = determinePageByRole(role);
		return navigateTo(page, { replace: true });
	}




	// 1) Если нужна авторизация, но её нет — на /login с возвратом после логина
	// if (pageReqAuth && !user.token) {
	// 	return navigateTo({
	// 		path: '/login',
	// 		query: { redirect: to.fullPath }
	// 	}, { replace: true })
	// }

	// // 2) Если авторизован, но роль не подходит — на /403 или куда сочтёте
	// if (pageReqAuth && allowedRoles && allowedRoles.length > 0) {
	// 	console.log(user.userData?.role);

	// 	if (!allowedRoles.includes(user.userData?.role)) {
	// 	// return navigateTo('/403', { replace: true })
	// 	}
	// }

	// // 3) Опционально: если уже авторизован и пришёл на /login — перекинуть на главную
	// if (to.path === '/login' && user.token) {
	// 	console.log(user);
	// 	const role = user.userData?.role;
	// 	return navigateTo('/', { replace: true });
	// }
})

const determinePageByRole = (role: string): string => {
	switch( String(role).toUpperCase() ) {
		case 'CONTRACTOR':
			return '/issues';
		case 'ADMIN':
			return '/';
		case 'CONTROLLER':
		case 'CALLCENTER':
			return '/readings';

		// Если токен не ошибочный и role не определена, или role неизвестна и не соответствует никакой странице
		default:
			return '/403';
	}
}
