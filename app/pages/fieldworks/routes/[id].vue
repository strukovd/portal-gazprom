<template>
	<section id="route-page">
		<main class="page-blocks">
			<section class="rp-heading">
				<h1 class="rp-title">Полевые работы</h1>
				<p class="rp-description">Управление задачами и сбор показаний приборов учета</p>
			</section>

			<BaseTabs :model-value="2" :items="[{ key: 1, value: 'Задачи на сегодня', icon: 'mdi-calendar-today' }, { key: 2, value: 'Отправка показаний', icon: 'mdi-gauge', badge: 38, }]"/>
			<BaseBreadcrumbs :breadcrumbs="breadcrumbs"/>

			<template v-if="curRoute">
				<BaseIsland class="rp-summary">
				<div class="rp-summary-icon"><BaseIcon name="mdi-transit-connection-variant" size="1.65em"/></div>
				<div class="rp-summary-item rp-summary-route">
					<div class="rp-summary-label">Маршрут</div>
					<div class="rp-summary-value rp-route-id">{{ routeId }}</div>
				</div>
			<div class="rp-summary-item">
				<div class="rp-summary-label">Дата</div>
				<div class="rp-summary-value">Не указано</div>
			</div>
				<div class="rp-summary-item">
					<div class="rp-summary-label">Исполнитель</div>
				<div class="rp-summary-value"><BaseIcon name="mdi-account-outline" size="1em"/>Не указано</div>
				</div>
				<div class="rp-summary-item">
					<div class="rp-summary-label">Абонентов</div>
				<div class="rp-summary-value">{{ curRoute.statistics.subscriberCount }}</div>
				</div>
				<div class="rp-spacer"></div>
				<div class="rp-summary-item">
					<div class="rp-summary-label">Прогресс</div>
				<div class="rp-summary-value">{{ curRoute.statistics.collectedReadings }}/{{ curRoute.statistics.subscriberCount }} ({{ toPercent(curRoute.statistics.collectedReadings, curRoute.statistics.subscriberCount) }}%)</div>
				<BaseProgressBar class="rp-progress-line" :percent="toPercent(curRoute.statistics.collectedReadings, curRoute.statistics.subscriberCount)" height=".55em" color="#2563eb"/>
				</div>
				</BaseIsland>

				<section class="rp-stats">
				<BaseIsland v-for="item of statsData" :key="item.title" class="rp-stat">
					<div :class="['rp-stat-icon', item.color]"><BaseIcon :name="item.icon" size="1.4em"/></div>
					<div class="rp-stat-info"><div class="rp-stat-value">{{ item.value }}<template v-if="item.unit"> {{ item.unit }}<span v-if="item.exponent" class="rp-stat-unit">{{ item.exponent }}</span></template></div><div class="rp-stat-title">{{ item.title }}</div></div>
				</BaseIsland>
				</section>

				<InfoBox
				type="info"
				title="Ввод показаний"
				message="Метод 1: нажмите на лицевой счет, чтобы открыть карточку абонента и ввести показание там. Метод 2: нажмите «Ввести» в столбце Показ. для быстрого ввода без перехода."
				/>

				<BaseIsland class="rp-filter">
				<BaseTabs v-model="filter" :items="[
					...readingFilters,
				]"/>
				<div class="rp-filter-controls">
					<BaseTextBox v-model="search" prependIcon="mdi-magnify" placeholder="Поиск по абоненту, Л/с, адресу, модели, № счётчика..."/>
					<BaseAutocomplete v-model="model" :items="[
						{ key: 'all', value: 'Все' },
						{ key: 'mechanical', value: 'Механические' },
						{ key: 'smart', value: 'Умные' },
					]" emitValue placeholder="Все"/>
				</div>
				</BaseIsland>

				<template v-for="street of curRoute.streets" :key="street.street">
				<BaseIsland class="rp-street">
					<header class="rp-street-header" @click="toggleStreet(street.street)">
						<div class="rp-street-title"><BaseIcon name="mdi-map-marker-outline" size="1.2em"/>{{ street.street }}</div>
						<div class="rp-street-count">{{ street.subscribers.length }} в выборке, всего: {{ street.subscribers.length }}</div>
						<div class="rp-street-stats">
							<span class="rp-street-stat green" title="Собрано показаний"><BaseIcon name="mdi-check-circle-outline" size="1em"/>{{ street.subscribers.filter(subscriber => subscriber.status !== 'Не передано').length }}</span>
							<span class="rp-street-stat blue" title="Сумма разностей потребления"><BaseIcon name="mdi-fire" size="1em"/>Не указано</span>
							<span class="rp-street-stat orange" title="Не собрано показаний"><BaseIcon name="mdi-clock-outline" size="1em"/>{{ street.subscribers.filter(subscriber => subscriber.status === 'Не передано').length }}</span>
						</div>
						<button class="rp-street-toggle" type="button" :aria-expanded="!collapsedStreets[street.street]">
							<BaseIcon :name="collapsedStreets[street.street] ? 'mdi-chevron-down' : 'mdi-chevron-up'" size="1.2em"/>
						</button>
					</header>
					<BaseTable v-if="!collapsedStreets[street.street]" class="rp-street-table" :columns="subscriberColumns" :rows="street.subscribers" rowKey="accountNo">
						<template #cell.subscriberId="{ index }">{{ index + 1 }}</template>
						<template #cell.accountNo="{ row }">
							<div class="rp-account">
								<NuxtLink class="rp-account-link" :to="{ path: `/fieldworks/subscribers/${row.accountNo}`, query: { route: routeId, sector: sectorId } }">{{ row.accountNo }}</NuxtLink>
								<span v-if="row.status === 'Передано абонентом'" class="rp-account-badge">Абонент</span>
							</div>
						</template>
						<template #cell.status="{ row }">
							<BaseTextBox
								v-if="editingReading === row"
								v-model="readingValue"
								class="rp-reading-input"
								type="number"
								autofocus
								button="OK"
								@submit="saveReading"
							/>
							<div v-else-if="row.status === 'Передано абонентом'" class="rp-reading-button subscriber">
								<BaseIcon name="mdi-shield-check-outline" size="1em"/>
								{{ row.reading ?? 'Не указано' }}
								<span class="rp-reading-note">абон.</span>
							</div>
							<BaseButton v-else-if="row.status !== 'Не передано'" class="rp-reading-button controller" variant="light" prependIcon="mdi-check-circle-outline" @click="startReading(row)">
								{{ row.reading ?? 'Не указано' }}
							</BaseButton>
							<BaseButton v-else class="rp-reading-button empty" variant="secondary" prependIcon="mdi-pencil-outline" @click="startReading(row)">
								Ввести
							</BaseButton>
						</template>
						<template #cell.houseNo="{ row }">{{ row.houseNo || row.house || 'Не указано' }}</template>
						<template #cell.reading="{ row }">{{ row.reading ?? 'Не указано' }}</template>
						<template #cell.sign>Не указано</template>
						<template #cell.power>Не указано</template>
						<template #cell.sealNumber>Не указано</template>
						<template #cell.difference>Не указано</template>
						<template #cell.phone>Не указано</template>
						<template #cell.lastPayment="{ row }">{{ toLocaleDate(row.lastPayment as string) || 'Не указано' }}</template>
						<template #cell.penalty="{ row }">{{ row.penalty ?? 'Не указано' }}</template>
						<template #cell.debtGas="{ row }">
							<span :class="['rp-debt', getDebtClass(row.debtGas)]">{{ row.debtGas ?? 'Не указано' }}</span>
						</template>
					</BaseTable>
				</BaseIsland>
				</template>
			</template>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseAutocomplete from '~/components/common/base/BaseAutocomplete.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import BaseTable from '~/components/common/base/BaseTable.vue';
import InfoBox from '~/components/common/InfoBox.vue';
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';
import type { ControllerRoute } from '~/types/Portal';
import { toLocaleDate } from '~/utils/format';

const route = useRoute();
const routeId = computed(() => route.params.id);
const sectorId = computed(() => typeof route.query.sector === 'string' ? route.query.sector : '');
const breadcrumbs = computed(() => sectorId.value
	? [
		{ title: 'Участки', link: '/fieldworks/sectors' },
		{ title: `Участок №${sectorId.value}`, link: `/fieldworks/sectors/${sectorId.value}` },
		{ title: `Маршрут ${routeId.value}`, disabled: true },
	]
	: [
		{ title: 'Маршруты', link: '/fieldworks/routes' },
		{ title: `Маршрут ${routeId.value}`, disabled: true },
	]
);
const filter = ref('all');
const search = ref('');
const model = ref('all');

const subscriberColumns = [
	{ key: 'subscriberId', label: '№', width: '3em' },
	{ key: 'accountNo', label: 'Лицевой счёт', width: '9em' },
	{ key: 'houseNo', label: 'Дом', width: '4em' },
	{ key: 'sign', label: 'Зн.', width: '3em' },
	{ key: 'meterSerial', label: 'Номер счётчика', width: '8em' },
	{ key: 'power', label: 'Мощ-ть', width: '5em' },
	{ key: 'meterModel', label: 'Модель', width: '8em' },
	{ key: 'sealNumber', label: '№ пломбы', width: '7em' },
	{ key: 'reading', label: 'Пред.пок.', width: '6em' },
	{ key: 'status', label: 'Показ. (метод 2)', width: '10em' },
	{ key: 'difference', label: 'Раз.', width: '5em' },
	{ key: 'fullName', label: 'Ф.И.О.', width: '14em' },
	{ key: 'lastPayment', label: 'Посл.опл.', width: '7em' },
	{ key: 'debtGas', label: 'Деб. Газ', width: '7em' },
	{ key: 'penalty', label: 'Деб. Пеня', width: '7em' },
	{ key: 'phone', label: 'Телефон', width: '9em' },
];

const loading = ref(true);
const curRoute = ref<ControllerRoute | null>(null);
const fieldworksStore = useFieldworksStore();
const editingReading = ref<Record<string, unknown> | null>(null);
const readingValue = ref<string | number>('');
const collapsedStreets = ref<Record<string, boolean>>({});

const statsData = computed(() => [
	{ title: 'В выборке', value: curRoute.value?.statistics.subscriberCount ?? 0, icon: 'mdi-account-group-outline', color: 'gray' },
	{ title: 'Собрано', value: curRoute.value?.statistics.collectedReadings ?? 0, icon: 'mdi-check-circle-outline', color: 'green' },
	{ title: 'Расход газа', value: 'Не указано', icon: 'mdi-fire', color: 'blue' },
	{ title: 'Не собрано', value: (curRoute.value?.statistics.subscriberCount ?? 0) - (curRoute.value?.statistics.collectedReadings ?? 0), icon: 'mdi-clock-outline', color: 'orange' },
]);

const readingFilters = computed(() => [
	{ key: 'all', value: 'Все', badge: curRoute.value?.statistics.subscriberCount ?? 0 },
	{ key: 'collected', value: 'Собрано', badge: curRoute.value?.statistics.collectedReadings ?? 0 },
	{ key: 'missing', value: 'Не собрано', badge: (curRoute.value?.statistics.subscriberCount ?? 0) - (curRoute.value?.statistics.collectedReadings ?? 0) },
]);

onMounted(async () => {
	loading.value = true;
	curRoute.value = await fetchRoute();
	loading.value = false;
});

function toPercent(collected = 0, total = 0) {
	if (!total) return 0;
	return Math.min(Math.max(Math.round((collected / total) * 100), 0), 100);
}

function startReading(subscriber: Record<string, unknown>) {
	editingReading.value = subscriber;
	readingValue.value = typeof subscriber.reading === 'number' ? subscriber.reading : '';
}

function saveReading() {
	if (!String(readingValue.value).trim()) return;
	editingReading.value = null;
}

function toggleStreet(street: string) {
	collapsedStreets.value[street] = !collapsedStreets.value[street];
}

function getDebtClass(debt: unknown) {
	if (typeof debt !== 'number') return '';
	return debt < 0 ? 'positive' : debt > 0 ? 'overdue' : '';
}

async function fetchRoute(): Promise<ControllerRoute | null> {
	const data = await fieldworksStore.fetchAreas();
	return data?.areas
		.flatMap(area => area.routes)
		.find(item => item.routeCode === String(routeId.value)) ?? null;
}
</script>

<style lang="scss">
#route-page {
	.page-blocks {
		display: grid;
		gap: 1.35em;
		margin: 1em 0;
	}

	.rp-heading {
		.rp-title {
			margin: 0;
			color: #020617;
			font-size: 1.8rem;
			font-weight: 900;
		}

		.rp-description {
			margin: .35em 0 0;
			color: #475569;
			font-size: 1rem;
		}
	}

	.rp-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2em;

		.rp-summary-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 2.6em;
			height: 2.6em;
			aspect-ratio: 1 / 1;
			color: #ffffff;
			background: #2563eb;
			border-radius: .7em;
		}

		.rp-summary-item {
			padding-left: 1.4em;
			border-left: 1px solid #dbe3ee;

			&.rp-summary-route {
				padding-left: 0;
				border-left: 0;
			}

			&:last-child {
				padding-left: 0;
				border-left: 0;
			}
		}

		.rp-summary-label {
			color: #94a3b8;
			font-size: .68rem;
			letter-spacing: .04em;
			text-transform: uppercase;
		}

		.rp-summary-value {
			display: flex;
			align-items: center;
			gap: .35em;
			margin-top: .35em;
			color: #0f172a;
			font-size: .95rem;
			font-weight: 800;

			&.rp-route-id {
				color: #2563eb;
				font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
				font-size: 1.2rem;
			}
		}

		.rp-spacer {
			flex: 1 1 auto;
		}

		.rp-progress-line {
			width: 6em;
			margin-top: .45em;
		}
	}

	.rp-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1em;

		.rp-stat {
			display: flex;
			align-items: center;
			gap: 1em;
			min-height: 4.8em;

			.rp-stat-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 2.5em;
				height: 2.5em;
				border-radius: 50%;

				&.gray {
					color: #475569;
					background: #f1f5f9;
				}

				&.green {
					color: #16a34a;
					background: #dcfce7;
				}

				&.blue {
					color: #2563eb;
					background: #dbeafe;
				}

				&.orange {
					color: #f97316;
					background: #ffedd5;
				}
			}

			.rp-stat-value {
				color: #020617;
				font-size: 1.35rem;
				font-weight: 900;

				.rp-stat-unit {
					vertical-align: super;
					font-size: .6em;
				}
			}

			.rp-stat-title {
				margin-top: .25em;
				color: #64748b;
				font-size: .76rem;
				font-weight: 700;
			}
		}
	}

	.rp-filter {
		.rp-filter-controls {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 11em;
			gap: .8em;
		}
	}

	.rp-street {
		padding: 0;

		.rp-street-header {
			display: flex;
			align-items: center;
			gap: .8em;
			padding: .85em 1.2em;
			cursor: pointer;
			

			.rp-street-title {
				display: flex;
				align-items: center;
				gap: .45em;
				color: #0f172a;
				font-size: 1rem;
				font-weight: 900;
			}

			.rp-street-count {
				color: #94a3b8;
				font-size: .78rem;
				// font-weight: 700;
			}

			.rp-street-stats {
				display: flex;
				align-items: center;
				gap: .5em;
				margin-left: auto;

				.rp-street-stat {
					display: inline-flex;
					align-items: center;
					gap: .3em;
					padding: .45em .7em;
					border-radius: 999px;
					font-size: .76rem;
					font-weight: 800;

					&.green {
						color: #16a34a;
						background: #ecfdf5;
					}

					&.blue {
						color: #2563eb;
						background: #eff6ff;
					}

					&.orange {
						color: #ea580c;
						background: #fff7ed;
					}
				}
			}

			.rp-street-toggle {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				padding: .25em;
				border: 0;
				color: #94a3b8;
				background: transparent;
				cursor: pointer;

				&:hover {
					color: #2563eb;
				}
			}
		}

		.rp-street-table {
			.base-table {
				min-width: 120em;
				font-size: .78rem;

				.base-table__cell {
					padding: .7em .8em;
					border-right: 1px solid #eef2f7;

					&--head {
						color: #ffffff;
						background: #2563eb;
						border-color: rgba(255, 255, 255, .16);
						font-size: .92em;
					}
				}

				.base-table-row {
					&:has(.rp-account-badge) {
						background: #f7f4ff;
					}

					&:hover {
						background: #f8fbff;
					}

					&:has(.rp-account-badge):hover {
						background: #f1ecff;
					}
				}
			}

			.rp-account {
				display: flex;
				align-items: center;
				gap: .45em;

				.rp-account-link {
					color: #2563eb;
					font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
					font-size: 1.1em;
					font-weight: 900;
					text-decoration: none;

					&:hover {
						text-decoration: underline;
					}
				}

				.rp-account-badge {
					padding: .25em .55em;
					border: 1px solid #ddd6fe;
					border-radius: 1em;
					color: #7c3aed;
					background: #f5f3ff;
					font-size: .78em;
					font-weight: 800;
				}
			}

			.rp-reading-button {
				display: inline-flex;
				align-items: center;
				gap: .35em;
				justify-content: center;
				width: 100%;
				min-width: 7em;
				padding: .45em .65em;
				font-size: .9em;
				font-weight: 800;

				&.empty {
					border-color: #cbd5e1;
					border-style: dashed;
					color: #64748b;
					background: #ffffff;
				}

				&.controller {
					color: #2563eb;
					background: #eff6ff;
					border-color: #bfdbfe;
				}

				&.subscriber {
					border: 1px solid #ddd6fe;
					border-radius: 7px;
					color: #7c3aed;
					background: #f5f3ff;
				}

				.rp-reading-note {
					font-size: .78em;
					font-weight: 700;
					opacity: .7;
				}
			}

			.rp-reading-input {
				width: 100%;
				min-width: 7em;

				.text-box-area {
					padding: 0 .25em;

					.base-button {
						padding: .35em .55em;
					}
				}
			}

			.rp-difference {
				display: inline-flex;
				align-items: center;
				gap: .25em;
				color: #94a3b8;
				font-weight: 700;

				&.hot {
					color: #2563eb;
				}
			}

			.rp-debt {
				color: #334155;
				font-weight: 800;

				&.positive {
					color: #16a34a;
				}

				&.overdue {
					color: #ea580c;
				}
			}
		}
	}
}
</style>
