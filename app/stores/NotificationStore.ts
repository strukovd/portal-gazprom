import { defineStore } from 'pinia';
import type { Socket } from 'socket.io-client';
import { notifications, type NotificationsPayload } from '~/services/notifications';

function notificationIsRead(notification: NotificationsPayload) {
	return notification.status === 'READ' || Boolean(notification.readAt);
}

export const useNotificationStore = defineStore('notifications', {
	state: () => ({
		items: [] as NotificationsPayload[],
		loaded: false,
		socket: null as Socket | null,
	}),

	getters: {
		unreadCount: state => state.items.filter(item => !notificationIsRead(item)).length,
	},

	actions: {
		async init() {
			if (!this.loaded) await this.fetch();
			this.connectSocket();
		},

		isRead(notification: NotificationsPayload) {
			return notificationIsRead(notification);
		},

		async fetch() {
			const { $flags } = useNuxtApp();

			try {
				this.items = await notifications.fetch();
				this.loaded = true;
				this.markAsReceived();
			}
			catch (error: any) {
				$flags.error(error?.message || 'Не удалось загрузить уведомления');
			}
		},

		async markAsRead(id: number) {
			const { $flags } = useNuxtApp();
			const notification = this.items.find(item => item.id === id);
			if (!notification || notificationIsRead(notification)) return;

			const previousReadAt = notification.readAt;
			const previousStatus = notification.status;
			notification.readAt = new Date().toISOString();
			notification.status = 'READ';

			try {
				await notifications.markAsRead({ notificationIds: [id] });
			}
			catch (error: any) {
				notification.readAt = previousReadAt;
				notification.status = previousStatus;
				$flags.error(error?.message || 'Не удалось отметить уведомление прочитанным');
			}
		},

		async markAllAsRead() {
			const { $flags } = useNuxtApp();
			const ids = this.items.filter(item => !notificationIsRead(item)).map(item => item.id);
			if (!ids.length) return;

			const readAt = new Date().toISOString();
			const previous = new Map(ids.map(id => {
				const item = this.items.find(notification => notification.id === id);
				return [id, { readAt: item?.readAt, status: item?.status }];
			}));

			this.items.forEach(item => {
				if (!ids.includes(item.id)) return;
				item.readAt = readAt;
				item.status = 'READ';
			});

			try {
				await notifications.markAsRead({ notificationIds: ids });
			}
			catch (error: any) {
				this.items.forEach(item => {
					const prev = previous.get(item.id);
					if (!prev) return;
					item.readAt = prev.readAt;
					item.status = prev.status || item.status;
				});
				$flags.error(error?.message || 'Не удалось отметить уведомления прочитанными');
			}
		},

		async markAsReceived() {
			const ids = this.items.filter(item => !item.receivedAt).map(item => item.id);
			if (!ids.length) return;

			const receivedAt = new Date().toISOString();
			this.items.forEach(item => {
				if (ids.includes(item.id)) item.receivedAt = receivedAt;
			});

			try {
				await notifications.markAsReceived({ notificationIds: ids });
			}
			catch {
				this.items.forEach(item => {
					if (ids.includes(item.id)) item.receivedAt = '';
				});
			}
		},

		connectSocket() {
			if (this.socket?.connected || this.socket?.active) return;

			this.socket = notifications.connectSocket({
				onOpen() {
					console.info('Сокет уведомлений подключен');
				},
				onMessage: notification => {
					if (!notification?.id) return;
					console.info('Получено уведомление из сокета:', notification);
					this.items = [
						notification,
						...this.items.filter(item => item.id !== notification.id),
					];
					this.markAsReceived();
				},
				onClose() {
					console.info('Сокет уведомлений закрыт');
				},
				onError() {
					console.warn('Не удалось подключиться к сокету уведомлений');
				},
			});

			if (!this.socket) {
				console.warn('Сокет уведомлений не создан');
			}
		},

		disconnectSocket() {
			this.socket?.close();
			this.socket = null;
		},
	}
});
