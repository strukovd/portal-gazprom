<template>
	<section id="dashboard-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная' }]" />

		<!-- Статистика -->
		<section class="stats">
			<div class="stat-card" v-for="(item, index) of [
				{ value: 12, label: 'Открытых жалоб', icon: 'mdi-alert-circle', color: 'red', },
				{ value: '4:32', label: 'Среднее время обработки', icon: 'mdi-clock-outline', color: 'blue', },
				{ value: 87, label: 'Новые показания сегодня', icon: 'mdi-check-circle-outline', color: 'green', },
				{ value: 6, label: 'Новостей за день', icon: 'mdi-newspaper-variant-outline', color: 'yellow', },
			]" :key="index">
				<div :class="['icon', item.color]">
					<BaseIcon :name="item.icon" />
				</div>

				<strong>{{ item.value }}</strong>
				<span>{{ item.label }}</span>
			</div>
		</section>

		<!-- Жалобы -->
		<section>
			<BaseIsland title="Жалобы" prependIcon="mdi-format-list-bulleted">
				<div class="complaints">
					<div v-for="(item, index) of [
						{ number: 4821, branch: 'Филиал: Бишкекгаз', description: 'Тамара Ефимова - Нет газа 3 дня', status: 'Новая', statusClass: 'new', },
						{ number: 4815, branch: 'Филиал: Бишкекгаз', description: 'Ольга Дмитриевна - Нет квитанции', status: 'Просрочена', statusClass: 'expired', },
						{ number: 4813, branch: 'Филиал: Чуйгаз', description: 'Виктор Полянский - Долгое подключение', status: 'В работе', statusClass: 'work', },
					]" :key="index" class="complaint">
						<div>
							<strong>Жалоба #{{ item.number }}</strong>
							<a href="#">{{ item.branch }}</a>
							<span>{{ item.description }}</span>
						</div>

						<b :class="item.statusClass">{{ item.status }}</b>
					</div>
				</div>
			</BaseIsland>
		</section>

		<!-- Срочные отключения и изменения FAQ -->
		<section>
			<section class="col-8">
				<BaseIsland title="Срочные отключения газа" prependIcon="mdi-alert" class="urgent">
					<template #actions>
						<a href="#">Все новости</a>
					</template>

					<div class="outages">
						<div :class="['outage', item.type]" v-for="(item, index) of [
							{ title: 'Бишкекгаз: Ленинский район', text: 'ул. Гагарина, 12–48 · с 08:00 до 18:00', label: 'Аварийное', type: 'danger', },
							{ title: 'Чуйгаз: г.Токмок', text: 'пр. Мира, 1–26 · с 09:00 до 15:00', label: 'Плановое', type: 'warning', },
							{ title: 'Ошгаз: г.Кара-Суу', text: 'ул. Советская, 5–19 · с 10:00 до 14:00', label: 'Плановое', type: 'warning', },
						]" :key="index">
							<div>
								<strong>{{ item.title }}</strong>
								<span>{{ item.text }}</span>
							</div>

							<b>{{ item.label }}</b>
						</div>
					</div>
				</BaseIsland>
			</section>

			<section class="col-4">
				<BaseIsland title="Изменения FAQ" prependIcon="mdi-alert">
					<div class="faq-list">
						<div class="faq-item" v-for="(item, index) of [
							{ title: 'Обновлен тариф на апрель 2026 г.', time: '2 часа назад', },
							{ title: 'Новый раздел: подключение к газу', time: '5 часов назад', },
							{ title: 'Правила подачи жалоб обновлены', time: 'Вчера',},
						]" :key="index">
							<div>
								<strong>{{ item.title }}</strong>
								<span>{{ item.time }}</span>
							</div>
						</div>
					</div>
				</BaseIsland>
			</section>
		</section>

		<!-- Тарифы, режим работы, последние показания -->
		<section>
			<section class="col-4">
				<BaseIsland title="Актуальные тарифы" prependIcon="mdi-currency-usd">
					<div class="tariffs">
						<div v-for="(item, index) of [
							{ name: 'Население', value: '24,10 сом/м³', },
							{ name: 'Население (Майлы-Суу)', value: '24,10 сом/м³', },
							{ name: 'Юр. лица без налогов', value: '22,10 сом/м³', },
							{ name: 'Юр. лица с НДС-12% и НСП-8%', value: '24,10 сом/м³', },
						]" :key="index">
							<span>{{ item.name }}</span>
							<strong>{{ item.value }}</strong>
						</div>
					</div>
				</BaseIsland>
			</section>

			<section class="col-4">
				<BaseIsland title="Режим работы офисов" prependIcon="mdi-office-building">
					<div class="offices">
						<div v-for="(item, index) of [
							{ name: 'Бишкекгаз', work: '08:00 - 17:00', break: '12:00 - 13:00', },
							{ name: 'ЦОН ул. М.Горького 22', work: '08:00 - 17:00', break: '12:00 - 13:00', },
							{ name: 'ЦОН ул. Ю.Фучика', work: '08:00 - 17:00', break: '12:00 - 13:00', },
							{ name: 'ЦОН ул. Ахунбаева', work: '8:00 - 17:00', break: '12:00 - 13:00', },
						]" :key="index">
							<strong>{{ item.name }}</strong>

							<div>
								<span class="work">
									<BaseIcon name="mdi-clock-outline" />
									{{ item.work }}
								</span>

								<span class="break">
									<BaseIcon name="mdi-clock-remove-outline" />
									{{ item.break }}
								</span>
							</div>
						</div>
					</div>
				</BaseIsland>
			</section>

			<section class="col-4">
				<BaseIsland title="Последние показания" prependIcon="mdi-check-circle-outline">
					<template #actions>
						<a href="#">Все</a>
					</template>

					<div class="readings">
						<div v-for="(item, index) of [
							{ account: '010284750', name: 'Белоконьзавод Марина Соколова', value: '1247 м³', status: 'Принято', statusClass: 'accepted', },
							{ account: '100391842', name: 'Чуйгаз Андрей Коченков', value: '893 м³', status: 'Ожидание', statusClass: 'pending', },
							{ account: '010528194', name: 'Белоконьзавод Дмитрий Волков', value: '1105 м³', status: 'Ошибка', statusClass: 'error', },
						]" :key="index" class="reading">
							<div>
								<strong>Л/с {{ item.account }}</strong>
								<span>{{ item.name }}</span>
							</div>

							<b>{{ item.value }}</b>
							<em :class="item.statusClass">{{ item.status }}</em>
						</div>
					</div>
				</BaseIsland>
			</section>
		</section>

		<section>
			<BaseIsland title="Газифицированные населенные пункты" prependIcon="mdi-map-marker">
				<div class="villages">
					<div v-for="(item, index) of [
						{ name: 'ж/м Арча-Бешик', percent: 85, },
						{ name: 'ж/м Ак-Ордо', percent: 60, },
						{ name: 'ж/м Кок-Жар', percent: 30, },
						{ name: 'с. Кок-Жар', percent: 95, },
					]" :key="index" class="village">
						<span>{{ item.name }}</span>

						<div class="progress">
							<i :style="{ width: item.percent + '%' }"></i>
						</div>

						<b>{{ item.percent }}%</b>
					</div>
				</div>
			</BaseIsland>
		</section>

		<section>
			<BaseIsland title="Планируемые для газификации населенные пункты" prependIcon="mdi-map-marker-outline">
				<div class="villages">
					<div v-for="(item, index) of [
						{ name: 'ж/м Жаштык', percent: 85, },
						{ name: 'с. Пригородное', percent: 60, },
						{ name: 'ж/м Сон-кол', percent: 30, },
						{ name: 'с. Тынтык', percent: 95, },
					]" :key="index" class="village">
						<span>{{ item.name }}</span>

						<div class="progress">
							<i :style="{ width: item.percent + '%' }"></i>
						</div>

						<b>{{ item.percent }}%</b>
					</div>
				</div>
			</BaseIsland>
		</section>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'sidebar'
});
</script>

<style lang="scss">
#dashboard-page {
	>.base-breadcrumbs {
		grid-column: 1 / -1;
	}

	.stats {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;

		.stat-card {
			display: grid;
			justify-items: center;
			gap: 6px;
			padding: 22px 16px;
			border: 1px solid #e5e7eb;
			border-radius: 12px;
			background: #fff;
	
			.icon {
				display: grid;
				place-items: center;
				width: 36px;
				height: 36px;
				border-radius: 50%;
	
				&.red {
					color: #ef4444;
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
	
				&.yellow {
					color: #d97706;
					background: #fef3c7;
				}
			}
	
			strong {
				font-size: 24px;
				line-height: 1;
			}
	
			span {
				color: #6b7280;
				font-size: 12px;
			}
		}
	}


	:deep(.base-island) {
		height: 100%;
	}

	.complaints {
		display: grid;
		gap: 10px;
	}

	.complaint {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 16px;
		padding: 12px 14px;
		border-radius: 8px;
		background: #fff;

		div {
			display: grid;
			gap: 3px;
			min-width: 0;
		}

		strong {
			font-size: 14px;
		}

		a {
			color: #2563eb;
			font-size: 12px;
			font-weight: 600;
			text-decoration: none;
		}

		span {
			color: #6b7280;
			font-size: 12px;
		}

		b {
			font-size: 12px;

			&.new {
				color: #2563eb;
			}

			&.expired {
				color: #dc2626;
			}

			&.work {
				color: #d97706;
			}
		}
	}

	.urgent {
		:deep(.base-island__content) {
			display: grid;
			gap: 10px;
		}
	}

	.outages {
		display: grid;
		gap: 10px;
	}

	.outage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 16px;
		padding: 14px 16px;
		border: 1px solid;
		border-radius: 8px;

		div {
			display: grid;
			gap: 5px;
		}

		strong {
			font-size: 14px;
		}

		span {
			color: #6b7280;
			font-size: 12px;
		}

		b {
			font-size: 12px;
		}

		&.danger {
			border-color: #fecaca;
			background: #fff1f2;

			b {
				color: #dc2626;
			}
		}

		&.warning {
			border-color: #fde68a;
			background: #fffbeb;

			b {
				color: #c2410c;
			}
		}
	}

	.faq-list {
		display: grid;
		gap: 20px;
		padding: 8px 0;
	}

	.faq-item {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 10px;

		i {
			width: 8px;
			height: 8px;
			margin-top: 5px;
			border-radius: 50%;
			background: #22c55e;
		}

		div {
			display: grid;
			gap: 5px;
		}

		strong {
			font-size: 12px;
			font-weight: 600;
		}

		span {
			color: #9ca3af;
			font-size: 11px;
		}
	}

	.tariffs {
		display: grid;
		gap: 12px;

		div {
			display: flex;
			justify-content: space-between;
			gap: 16px;
		}

		span {
			color: #374151;
			font-size: 13px;
		}

		strong {
			font-size: 13px;
			white-space: nowrap;
		}
	}

	.offices {
		display: grid;
		gap: 8px;

		>div {
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 10px;
			align-items: center;
		}

		strong {
			font-size: 13px;
		}

		div div {
			display: flex;
			gap: 10px;
			font-size: 11px;
			white-space: nowrap;
		}

		span {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.work {
			color: #16a34a;
		}

		.break {
			color: #ef4444;
		}
	}

	.readings {
		display: grid;
		gap: 10px;
	}

	.reading {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		align-items: center;
		gap: 10px;

		div {
			display: grid;
			gap: 3px;
			min-width: 0;
		}

		strong {
			font-size: 12px;
		}

		span {
			overflow: hidden;
			color: #6b7280;
			font-size: 10px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		b {
			font-size: 12px;
			white-space: nowrap;
		}

		em {
			font-size: 11px;
			font-style: normal;
			font-weight: 700;

			&.accepted {
				color: #16a34a;
			}

			&.pending {
				color: #d97706;
			}

			&.error {
				color: #dc2626;
			}
		}
	}

	.villages {
		display: grid;
		gap: 12px;
		max-width: 340px;
		padding: 6px 0;
	}

	.village {
		display: grid;
		grid-template-columns: 140px 1fr 40px;
		align-items: center;
		gap: 12px;

		span {
			font-size: 13px;
		}

		b {
			color: #6b7280;
			font-size: 11px;
			font-weight: 500;
		}

		.progress {
			height: 8px;
			overflow: hidden;
			border-radius: 999px;
			background: #e5e7eb;

			i {
				display: block;
				height: 100%;
				border-radius: inherit;
				background: #22c55e;
			}
		}

		&:nth-child(2) .progress i {
			background: #f59e0b;
		}

		&:nth-child(3) .progress i {
			background: #2563eb;
		}
	}

	a {
		color: #2563eb;
		font-size: 12px;
		font-weight: 700;
		text-decoration: none;
	}

	@media (max-width: 1100px) {
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.col-8,
		.col-4 {
			grid-column: span 12;
		}
	}

	@media (max-width: 768px) {
		.stats {
			grid-template-columns: 1fr;
		}

		.complaint,
		.outage,
		.reading {
			grid-template-columns: 1fr;
			align-items: start;
		}

		.offices {
			>div {
				grid-template-columns: 1fr;
			}

			div div {
				flex-wrap: wrap;
			}
		}

		.villages {
			max-width: none;
		}

		.village {
			grid-template-columns: 1fr;
			gap: 6px;
		}
	}
}
</style>
