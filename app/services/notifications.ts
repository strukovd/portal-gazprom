import { io, type Socket } from 'socket.io-client';

export type NotificationsPayload = {
	id: number;
	status: string;
	moduleType: string;
	type?: string;
	notificationType?: string;
	moduleId: number;
	title: string;
	comment: string;
	createdAt: string;
	receivedAt?: string;
	readAt?: string;
	data?: {
		id: number;
		subject: string; // Тема уведомления
	};
};
export type NotificationsResponse = {
	success: boolean;
	data: NotificationsPayload[];
};
export type NotificationsBody = {
	notificationIds: number[]
}
export type NotificationsSocketHandlers = {
	onMessage?: (notification: NotificationsPayload) => void;
	onOpen?: () => void;
	onClose?: () => void;
	onError?: (error: Error) => void;
};

export const notifications = {
	fetch(query: Record<string, any> = {}): Promise<NotificationsPayload[]> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<NotificationsResponse | NotificationsPayload[]>('/v1/notifications', {
			method: 'GET',
			query
		})
			.then((resp) => {
				return Array.isArray(resp) ? resp : resp.data;
			});
	},

	markAsRead(body: NotificationsBody): Promise<void> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<void>('/v1/notifications/read', {
			method: 'PUT',
			body
		});
	},

	markAsReceived(body: NotificationsBody): Promise<void> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<void>('/v1/notifications/received', {
			method: 'PUT',
			body
		});
	},

	delete(body: NotificationsBody): Promise<void> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<void>('/v1/notifications', {
			method: 'DELETE',
			body
		});
	},

	connectSocket(handlers: NotificationsSocketHandlers = {}): Socket | null {
		if (import.meta.server) return null;

		const config = useRuntimeConfig();
		let socket: Socket;

		try {
			const url = new URL(String(config.public.NOTIFICATIONS_WS_URL));
			const token = localStorage.token;
			const authorization = token ? `Bearer ${token}` : '';

			socket = io(url.toString(), {
				transports: ['websocket'],
				auth: { 
					token,
					authorization,
				},
				query: {
					authorization,
					'api-token': String(config.public.API_TOKEN || ''),
				},
			});
		}
		catch (error) {
			console.error('Не удалось создать сокет уведомлений:', error);
			return null;
		}

		socket.on('connect', () => handlers.onOpen?.());
		socket.on('disconnect', () => handlers.onClose?.());
		socket.on('connect_error', error => handlers.onError?.(error));
		socket.on('notification', payload => pushSocketPayload(payload, handlers));
		socket.on('notifications', payload => pushSocketPayload(payload, handlers));
		socket.on('message', payload => pushSocketPayload(payload, handlers));
		socket.onAny((event, payload) => {
			console.info('Событие сокета уведомлений:', event, payload);
		});

		return socket;
	}
};

function pushSocketPayload(payload: any, handlers: NotificationsSocketHandlers) {
	try {
		if (typeof payload === 'string') payload = JSON.parse(payload);
	}
	catch (error) {
		console.error('Ошибка при чтении уведомления из сокета:', error);
		return;
	}
	const value = payload?.data || payload;

	if (Array.isArray(value)) {
		value.forEach(item => handlers.onMessage?.(item));
		return;
	}

	handlers.onMessage?.(value);
}
