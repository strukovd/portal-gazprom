<template>
	<section id="settings-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Настройки' }]"/>

		<header class="sp-header">
			<section class="sp-heading">
				<div class="sp-title">Настройки</div>
				<div class="sp-subtitle">Параметры рабочего места, уведомлений и обработки обращений</div>
			</section>

			<section class="sp-actions">
				<BaseButton variant="secondary" prependIcon="mdi-restore">Сбросить</BaseButton>
				<BaseButton prependIcon="mdi-content-save-outline">Сохранить</BaseButton>
			</section>
		</header>

		<main class="page-blocks">
			<section class="sp-grid">
				<BaseIsland class="sp-profile" title="Профиль оператора" prependIcon="mdi-account-cog-outline" data-aos="fade-up">
					<section class="sp-form">
						<BaseTextBox v-model="form.name" label="Имя пользователя"/>
						<BaseTextBox v-model="form.email" label="Email" type="email"/>
						<BaseTextBox v-model="form.phone" label="Телефон" type="tel"/>
						<BaseTabs v-model="form.interfaceSize" label="Размер интерфейса" :items="[
							{ key: 'compact', value: 'Компактный' },
							{ key: 'normal', value: 'Обычный' },
							{ key: 'large', value: 'Крупный' },
						]"/>
					</section>
				</BaseIsland>

				<BaseIsland class="sp-panel" title="Уведомления" prependIcon="mdi-bell-outline" data-aos="fade-up">
					<section class="sp-checks">
						<BaseCheckbox v-model="form.notifications.newComplaints" label="Новые жалобы"/>
						<BaseCheckbox v-model="form.notifications.overdueComplaints" label="Просроченные жалобы"/>
						<BaseCheckbox v-model="form.notifications.readings" label="Новые показания"/>
						<BaseCheckbox v-model="form.notifications.system" label="Системные сообщения"/>
					</section>

					<section class="sp-notice">
						<BaseIcon name="mdi-information-outline" size="1.3em"/>
						<div class="sp-notice-text">Уведомления пока сохраняются только в интерфейсе.</div>
					</section>
				</BaseIsland>
			</section>

			<section class="sp-grid">
				<BaseIsland class="sp-panel" title="Обработка обращений" prependIcon="mdi-format-list-checks" data-aos="fade-up">
					<section class="sp-form">
						<BaseTabs v-model="form.queueMode" label="Режим очереди" :items="[
							{ key: 'all', value: 'Все' },
							{ key: 'mine', value: 'Мои' },
							{ key: 'branch', value: 'Филиал' },
						]"/>
						<BaseTextBox v-model="form.defaultSla" label="SLA по умолчанию, дней" type="number"/>
						<BaseTextBox v-model="form.rowsPerPage" label="Строк в таблицах" type="number"/>
					</section>

					<section class="sp-checks">
						<BaseCheckbox v-model="form.autoOpenAccount" label="Открывать карточку абонента после выбора"/>
						<BaseCheckbox v-model="form.confirmDangerActions" label="Подтверждать удаление и закрытие"/>
					</section>
				</BaseIsland>

				<BaseIsland class="sp-panel" title="Безопасность" prependIcon="mdi-shield-lock-outline" data-aos="fade-up">
					<section class="sp-statuses">
						<div v-for="item of securityItems" :key="item.title" class="sp-status">
							<div :class="['sp-status-icon', item.color]">
								<BaseIcon :name="item.icon" size="1.25em"/>
							</div>
							<div class="sp-status-body">
								<div class="sp-status-title">{{ item.title }}</div>
								<div class="sp-status-text">{{ item.text }}</div>
							</div>
						</div>
					</section>
				</BaseIsland>
			</section>

			<BaseIsland class="sp-integrations" title="Интеграции" prependIcon="mdi-connection" data-aos="fade-up">
				<section class="sp-integrations-grid">
					<article v-for="item of integrations" :key="item.title" class="sp-integration">
						<div class="sp-integration-icon">
							<BaseIcon :name="item.icon" size="1.4em"/>
						</div>

						<div class="sp-integration-body">
							<div class="sp-integration-title">{{ item.title }}</div>
							<div class="sp-integration-text">{{ item.text }}</div>
						</div>

						<div :class="['status', item.enabled ? 'status-green' : 'status-red']">
							{{ item.enabled ? 'Активно' : 'Отключено' }}
						</div>
					</article>
				</section>
			</BaseIsland>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseCheckbox from '~/components/common/base/BaseCheckbox.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTROLLER', 'CALLCENTER'],
	layout: 'authorized'
});

const userStore = useUserStore();
const form = reactive({
	name: userStore.userData?.userName || 'Оператор',
	email: 'operator@gazprom.kg',
	phone: '+996 555 000 000',
	interfaceSize: 'normal',
	queueMode: 'all',
	defaultSla: 3,
	rowsPerPage: 10,
	autoOpenAccount: true,
	confirmDangerActions: true,
	notifications: {
		newComplaints: true,
		overdueComplaints: true,
		readings: false,
		system: true,
	},
});

const securityItems = [
	{ title: 'Роль', text: userStore.prettyRole || 'Не указана', icon: 'mdi-account-key-outline', color: 'blue' },
	{ title: 'Сессия', text: 'Активна, вход выполнен сегодня', icon: 'mdi-check-decagram-outline', color: 'green' },
	{ title: 'Доступ', text: 'Права наследуются от роли пользователя', icon: 'mdi-lock-check-outline', color: 'dark' },
];

const integrations = [
	{ title: 'CallGas API', text: 'Жалобы, таймлайн и статистика обращений', icon: 'mdi-phone-in-talk-outline', enabled: true },
	{ title: 'Портал абонента', text: 'Карточки абонентов, заявки и показания', icon: 'mdi-account-box-outline', enabled: true },
	{ title: 'Сервис уведомлений', text: 'SMS и email-рассылки абонентам', icon: 'mdi-message-processing-outline', enabled: false },
];
</script>

<style lang="scss">
#settings-page {
	.sp-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;
		margin: 0 0 1em 0;

		.sp-heading {
			display: grid;
			gap: .25em;

			.sp-title {
				color: #171717;
				font-size: 1.6em;
				font-weight: 800;
			}

			.sp-subtitle {
				color: #737373;
				font-size: .95em;
			}
		}

		.sp-actions {
			display: flex;
			gap: .6em;
		}
	}

	.page-blocks {
		display: grid;
		gap: 1em;

		.sp-grid {
			display: grid;
			grid-template-columns: minmax(0, 1.25fr) minmax(320px, .75fr);
			gap: 1em;
		}

		.sp-form {
			display: grid;
			gap: .9em;
		}

		.sp-checks {
			display: grid;
			gap: .8em;
		}

		.sp-notice {
			display: flex;
			align-items: center;
			gap: .6em;
			margin: 1em 0 0 0;
			padding: .85em 1em;
			border-radius: 8px;
			color: #2563ea;
			background: #eff6ff;

			.sp-notice-text {
				color: #334155;
				font-size: .9em;
			}
		}

		.sp-statuses {
			display: grid;
			gap: .85em;

			.sp-status {
				display: flex;
				align-items: center;
				gap: .8em;
				padding: .85em;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				background: #fff;

				.sp-status-icon {
					display: grid;
					place-items: center;
					flex: 0 0 2.4em;
					width: 2.4em;
					aspect-ratio: 1/1;
					border-radius: 8px;

					&.blue {
						color: #2563eb;
						background: #dbeafe;
					}

					&.green {
						color: #16a34a;
						background: #dcfce7;
					}

					&.dark {
						color: #374151;
						background: #f3f4f6;
					}
				}

				.sp-status-body {
					display: grid;
					gap: .2em;

					.sp-status-title {
						color: #111827;
						font-weight: 700;
					}

					.sp-status-text {
						color: #737373;
						font-size: .88em;
					}
				}
			}
		}

		.sp-integrations {
			.sp-integrations-grid {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: .8em;

				.sp-integration {
					display: grid;
					grid-template-columns: auto minmax(0, 1fr) auto;
					align-items: center;
					gap: .8em;
					padding: 1em;
					border: 1px solid #e5e7eb;
					border-radius: 8px;
					background: #fff;

					.sp-integration-icon {
						display: grid;
						place-items: center;
						width: 2.6em;
						aspect-ratio: 1/1;
						border-radius: 8px;
						color: #2563eb;
						background: #eff6ff;
					}

					.sp-integration-body {
						display: grid;
						gap: .25em;
						min-width: 0;

						.sp-integration-title {
							color: #111827;
							font-weight: 800;
						}

						.sp-integration-text {
							color: #737373;
							font-size: .86em;
							line-height: 1.35;
						}
					}
				}
			}
		}
	}

	@media (max-width: 900px) {
		.sp-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.page-blocks {
			.sp-grid {
				grid-template-columns: 1fr;
			}

			.sp-integrations {
				.sp-integrations-grid {
					grid-template-columns: 1fr;
				}
			}
		}
	}
}
</style>
