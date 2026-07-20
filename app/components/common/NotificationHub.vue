<template>
	<section class="notifications-dropdown">
		<header class="nd-header">
			<div class="nd-title">Уведомления</div>
			<button type="button" class="nd-action" @click="notificationStore.markAllAsRead">Прочитать все</button>
		</header>

		<main class="nd-list">
			<article
				v-for="item of notificationStore.items"
				:key="item.id"
				:class="['nd-item', { unread: !notificationStore.isRead(item) }]"
				@click="notificationStore.markAsRead(item.id)"
			>
				<div :class="['nd-icon', notificationColor(item)]">
					<BaseIcon :name="notificationIcon(item)" size="1.15em"/>
				</div>
				<div class="nd-body">
					<div class="nd-item-title">{{ item.title }}</div>
					<div class="nd-text">{{ notificationText(item) }}</div>
					<div class="nd-time">{{ notificationTime(item) }}</div>
				</div>
			</article>
			<div v-if="!notificationStore.items.length" class="nd-empty">Уведомлений нет</div>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import type { NotificationsPayload } from '~/services/notifications';

const notificationStore = useNotificationStore();

function notificationText(notification: NotificationsPayload) {
	return notification.comment || notification.data?.subject || 'Без описания';
}

function notificationTime(notification: NotificationsPayload) {
	const value = notification.createdAt || notification.receivedAt;
	return value ? new Date(value).toLocaleString('ru-RU') : 'Дата не указана';
}

function notificationIcon(notification: NotificationsPayload) {
	switch (notification.moduleType) {
		case 'COMPLAINTS':
		case 'COMPLAINT':
			return 'mdi-alert-circle-outline';
		default:
			return 'mdi-bell-outline';
	}
}

function notificationColor(notification: NotificationsPayload) {
	switch (notification.notificationType || notification.type) {
		case 'ERROR':
			return 'red';
		case 'SUCCESS':
			return 'green';
		case 'COMPLAINT_ASSIGNED':
			return 'blue';
		default:
			return ['COMPLAINT', 'COMPLAINTS'].includes(notification.moduleType) ? 'blue' : 'grey';
	}
}
</script>

<style lang="scss">
.notifications-dropdown {
	position: absolute;
	top: calc(100% + .75em);
	right: 0;
	width: min(360px, calc(100vw - 2em));
	z-index: 30;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	background: #fff;
	box-shadow: 0 18px 40px rgba(15, 23, 42, .16);

	.nd-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;
		padding: .9em 1em;
		border-bottom: 1px solid #f3f4f6;

		.nd-title {
			color: #111827;
			font-weight: 800;
		}

		.nd-action {
			padding: 0;
			color: #2563ea;
			background: transparent;
			border: 0;
			font-size: .82em;
			font-weight: 700;
			cursor: pointer;

			&:hover {
				opacity: .75;
			}
		}
	}

	.nd-list {
		display: grid;
		max-height: 360px;
		overflow-y: auto;

		.nd-item {
			display: flex;
			gap: .75em;
			padding: .9em 1em;
			border-bottom: 1px solid #f3f4f6;
			cursor: pointer;
			transition: background 180ms ease 0s;

			&:last-child {
				border-bottom: 0;
			}

			&:hover {
				background: #f8fafc;
			}

			&.unread {
				background: #eff6ff;

				&:hover {
					background: #eaf2ff;
				}
			}

			.nd-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 0 0 2.25em;
				width: 2.25em;
				aspect-ratio: 1/1;
				border-radius: 8px;

				&.red {
					color: #dc2626;
					background: #fee2e2;
				}

				&.blue {
					color: #2563eb;
					background: #dbeafe;
				}

				&.green {
					color: #16a34a;
					background: #dcfce7;
				}

				&.grey {
					color: #374151;
					background: #f3f4f6;
				}
			}

			.nd-body {
				display: grid;
				gap: .25em;
				min-width: 0;

				.nd-item-title {
					color: #111827;
					font-weight: 800;
				}

				.nd-text {
					color: #525252;
					font-size: .88em;
					line-height: 1.35;
				}

				.nd-time {
					color: #a3a3a3;
					font-size: .78em;
					font-weight: 700;
				}
			}
		}

		.nd-empty {
			padding: 2em 1em;
			color: #737373;
			font-size: .9em;
			font-weight: 700;
			text-align: center;
		}
	}
}
</style>
