export const determinePathByRole = (role: string): string => {
	switch( String(role).toUpperCase() ) {
		case 'CONTRACTOR': // Исполнители СМР
			return '/issues';
		case 'ADMIN':
			return '/';
		case 'CONTROLLER':
			return '/fieldworks/sectors';
		case 'CALLCENTER_COMPLAINT_ASSIGNEE':
		case 'CALLCENTER':
			return '/';

		// Если токен не ошибочный и role не определена, или role неизвестна и не соответствует никакой странице
		default:
			return '/403';
	}
}

