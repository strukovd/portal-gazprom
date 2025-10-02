export default defineNuxtRouteMiddleware((to, from) => {
	// На сервере пропускаем (нет localStorage). Проверять будем на клиенте.
	if (import.meta.server) return;

	const user = useUserStore();

	const needsAuth = Boolean(to.meta.auth)
	const allowedRoles = Array.isArray(to.meta.roles) ? (to.meta.roles as string[]) : null

	// 1) Если нужна авторизация, но её нет — на /login с возвратом после логина
	if (needsAuth && !user.token) {
		return navigateTo({
			path: '/login',
			query: { redirect: to.fullPath }
		}, { replace: true })
	}

	// 2) Если авторизован, но роль не подходит — на /403 или куда сочтёте
	if (needsAuth && allowedRoles && allowedRoles.length > 0) {
		console.log(user.userData?.role);

		if (!allowedRoles.includes(user.userData?.role)) {
		// return navigateTo('/403', { replace: true })
		}
	}

	// 3) Опционально: если уже авторизован и пришёл на /login — перекинуть на главную
	if (to.path === '/login' && user.token) {
		console.log(user);
		// return navigateTo('/', { replace: true });
	}
})
