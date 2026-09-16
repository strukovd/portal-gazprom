
import { determinePathByRole } from '@/utils/auth'
export default defineNuxtRouteMiddleware((to, from) => {
	// На сервере пропускаем (нет localStorage). Проверять будем на клиенте.
	if (import.meta.server) return;

	const user = useUserStore();
	const NEEDS_AUTH = Boolean(to.meta.auth);
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
			const role = String(user.userData?.role);
			if(ALLOWED_ROLES && ALLOWED_ROLES.length > 0) {
				if(!ALLOWED_ROLES.includes(role)) { // Если пользователь не иммет доступа (роли) к странице
					// let page = '/403';
					let page = determinePathByRole(role);
					if(page === to.path) page = '/403'; // Анти-зацикливание
					console.warn(`Пользователю с ролью ${role} - доступ к странице ${to.path} запрещен, перенаправляю на ${page}`);
					return navigateTo(page, { replace: true });
				}
			}

		}
	}

	// Если уже авторизован и пришёл на /login — перекинуть на главную
	if (to.path.replace(/\/$/, '') === '/login' && user.token) {
		const role = String(user.userData?.role);
		const page = determinePathByRole(role);
		return navigateTo(page, { replace: true });
	}
})

