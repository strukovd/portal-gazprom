<template>
	<section id="complaint-issue-list">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Жалобы' }]"/>

		<header>
			<section class="title">
				<h2>Жалобы</h2>
				<span>Управление обращениями и жалобами абонентов</span>
			</section>
			<section class="actions">
				<BaseButton prependIcon="mdi-plus" @click="showCreateModal">Создать жалобу</BaseButton>
			</section>
		</header>

		<main class="page-blocks">
			<BaseIsland class="filters" title="Фильтр и поиск" prependIcon="mdi-filter-variant" data-aos="zoom-in">
				<div>
					<BaseTextBox v-model="form.search" placeholder="Поиск по лицевому счету, теме или ФИО..." button="Найти" @submit="init"/>
					<DatePicker v-model="form.period" placeholder="Период создания"/>
				</div>
				<BaseTabs class="filter-tabs" v-model="form.status" :items="[
					{ value: 'Все', key: '' },
					{ value: 'Новые', key: 'Новая' },
					{ value: 'В работе', key: 'В работе' },
					{ value: 'Просроченные', key: 'Просрочено' },
					{ value: 'Закрытые', key: 'Закрыто' },
				]"/>
			</BaseIsland>

			<!-- TODO: на беке лучше давать роли в виде массива, что бы не вести вереницу if-else -->
			<!-- Статистика -->
			<template v-if="[`ADMIN`, `CALLCENTER_MANAGER`].includes(userStore?.userData?.role ?? '')">
				<section class="stats" v-if="pageData.stats?.all">
					<BaseIsland class="stat-tile" data-aos="zoom-in" v-for="(item, index) of [
						{ value: pageData.stats?.all.total, label: 'Всего', icon: 'mdi-star-circle-outline', color: 'dark', },
						{ value: pageData.stats?.all.new, label: 'Открытых', icon: 'mdi-plus-circle-outline', color: 'blue', },
						{ value: pageData.stats?.all.expired, label: 'Просрочено', icon: 'mdi-close-circle-outline', color: 'red', },
						{ value: pageData.stats?.all.inProgress, label: 'В работе', icon: 'mdi-clock-outline', color: 'yellow', },
						{ value: pageData.stats?.all.closed, label: 'Закрыто', icon: 'mdi-check-circle-outline', color: 'green', },
					]" :key="index">
						<section v-if="item.icon" :class="['icon-circle', item.color]">
							<BaseIcon :name="item.icon" size="1.6em"/>
						</section>
						<section class="content">
							<div class="value">
								<Incrementator v-if="Number.isFinite(item.value)" :value="Number(item.value)"/>
								<span v-else>{{ item.value }}</span>
							</div>
							<div class="label">{{ item.label }}</div>
						</section>
					</BaseIsland>
				</section>

				<section class="branch-stats" v-if="Object.keys(pageData.stats).length">
					<BaseIsland class="col-3 md-col-6 sm-col-12 stat" data-aos="zoom-in" v-for="branch of [
						{  key: 'bishkek',		name: 'Бишкек',			color: '#267bf9' },
						{  key: 'chui',			name: 'Чуй',			color: '#01ca4f' },
						{  key: 'osh',			name: 'Ош',				color: '#fc6b05' },
						{  key: 'jalalabad',	name: 'Джалал-Абад',	color: '#ac45f9' },
					]" :key="branch.key">
						<header style="margin-bottom:1em;">
							<b><span class="circle" :style="{ color: branch.color, marginRight: '.3em' }">⏺</span> {{ branch.name }}</b>
							<div style="font-size:.85em; background:#f3f4f6; color:#8d9099; padding:.2em .6em; border-radius:15px;">Всего: {{ pageData.stats[branch.key].total }}</div>
						</header>
						<main>
							<div class="col-6" v-for="field of [
								{ name: 'new', label: 'Новые' },
								{ name: 'expired', label: 'Просроченные' },
								{ name: 'inProgress', label: 'В работе' },
								{ name: 'closed', label: 'Закрытые' }
							]" :key="field.name">
								<h2>{{ pageData.stats[branch.key][field.name] }}</h2>
								<div style="color:#6b728088; font-size:.7em;">{{ field.label }}</div>
							</div>
						</main>
					</BaseIsland>
				</section>

				<BaseIsland v-if="itemsByType.subjects.length" class="stats-by-types" title="Распределение по темам" prependIcon="mdi-format-list-bulleted-type" data-aos="zoom-in">
					<div class="item" v-for="subject of itemsByType.subjects" :key="subject.subject">
						<div class="subject">
							<span>{{ subject.subject }}</span>
						</div>
						<div class="chart">
							<BaseProgressBar :percent="subject.percent"/>
							<div class="count">{{ subject.count }}</div>
						</div>
					</div>
				</BaseIsland>
			</template>
			<template v-else-if="[`CALLCENTER`].includes(userStore?.userData?.role ?? '')">
				<section class="stats" v-if="pageData?.counts">
					<BaseIsland class="stat-tile" data-aos="zoom-in" v-for="(item, index) of [
						{ value: pageData.counts.inProgress, label: 'Открытых жалоб', icon: 'mdi-alert-circle-outline', color: 'red', },
						{ value: pageData.counts.avgProcessingTime, label: 'Среднее время обработки', icon: 'mdi-clock-outline', color: 'blue', },
						{ value: pageData.counts.new, label: 'Новых (не отработанных)', icon: 'mdi-check-circle-outline', color: 'green', }
					]" :key="index">
						<section v-if="item.icon" :class="['icon-circle', item.color]">
							<BaseIcon :name="item.icon" size="1.6em"/>
						</section>
						<section class="content">
							<div class="value">
								<Incrementator v-if="Number.isFinite(item.value)" :value="Number(item.value)"/>
								<span v-else>{{ item.value }}</span>
							</div>
							<div class="label">{{ item.label }}</div>
						</section>
					</BaseIsland>
				</section>
			</template>

			<BaseIsland class="list" title="Реестр жалоб" prependIcon="mdi-file-document-outline" data-aos="fade-up">
				<BaseTable
					:columns="[
						{ key: 'id', label: 'ID' },
						{ key: 'subscriber', label: 'Абонент' },
						{ key: 'subject', label: 'Тема' },
						{ key: 'created', label: 'Дата' },
						{ key: 'status', label: 'Статус' },
						{ key: 'sla', label: 'SLA' },
						{ key: 'userName', label: 'Исполнитель' },
					]"
					:rows="pageData.complaints"
					:loading="loading"
				>
					<template #cell.id="{ value }">
						<!-- <NuxtLink :to="`/complaints/${value}`"> -->
							<strong class="key">{{ value }}</strong>
						<!-- </NuxtLink> -->
					</template>
					<template #cell.subscriber="{ value, row }">
						<div><b>{{ row.subscriberName }}</b></div>
						<div><span style="color:#6CA3F7; line-height:1.6em;">{{ row.account }}</span></div>
						<div><span style="color:#aaaabb;">{{ row.contactNumber }}</span></div>
					</template>
					<template #cell.subject="{ value, row }">
						<div><span style="line-height:1.6em;">{{ value }}</span></div>
						<div><span style="color:#aaaabb;">{{ row.branchName }}</span></div>
					</template>
					<template #cell.created="{ value, row }">
						<div>
							<span class="created" style="color:#374151; background:#f3f4f6;">
								<BaseIcon name="mdi-clock-outline" size="1.2em" style="margin-right:.3em; opacity:.8;"/>
								<span>{{ toLocaleDate(String(value)) }}</span>
							</span>
						</div>
					</template>
					<template #cell.status="{ value }">
						<span :class="['status', getStatusClass(value)]">
							{{ value }}
						</span>
					</template>
					<template #cell.sla="{ value }">
						<span class="sla">{{ value }} дн.</span>
					</template>
				</BaseTable>
			</BaseIsland>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import DatePicker from '~/components/common/base/DatePicker.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTable from '~/components/common/base/BaseTable.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import Incrementator from '~/components/common/Incrementator.vue';
import { complaints, type ComplaintsPayload, type ComplaintsQuery, type ComplaintsStatsQuery, type CountsResponse, type StatsResponse } from '~/services/complaints';
import { toLocaleDate } from '~/utils/format';
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTROLLER', 'CALLCENTER'],
	layout: 'authorized'
});
const userStore = useUserStore();
const { $flags, $modal } = useNuxtApp();

const form = reactive({
	search: '',
	status: '' as '' | ComplaintsQuery['status'],
	period: null as Date[] | null,
});
const pageData = reactive({
	complaints: [] as ComplaintsPayload[],
	stats: {} as StatsResponse,
	counts: {} as CountsResponse
});
const loading = ref(false);

watch(() => form.status, init);
watch(() => form.period, onCreatedDatesChanged);


init();
async function init() {
	const userRole = userStore?.userData?.role;
	fetchList();

	switch(userRole) {
		case `ADMIN`:
		case `CALLCENTER_MANAGER`:
			fetchStats();
			break;
		case `CALLCENTER`:
			fetchCounts();
			break;
	}
}


async function fetchList(): Promise<ComplaintsPayload[] | void> {
	loading.value = true;
	const query: Partial<ComplaintsQuery> = {};
	if( form.status ) query['status'] = form.status;
	if( form.search ) query['description'] = form.search;
	if( Array.isArray(form.period) && form.period.length === 2 ) {
		query.createdDateFrom = toISODate(form.period[0]!);
		query.createdDateTo = toISODate(form.period[1]!);
	}
	query['page'] = 1;
	query['size'] = 10;

	complaints.fetch(query)
		.then(res => {
			const items = res?.data || [];
			pageData.complaints = items;
		})
		.finally(() => {
			loading.value = false;
		});
}

async function fetchStats(): Promise<void> {
	const query: Partial<ComplaintsStatsQuery> = {};
	if( Array.isArray(form.period) && form.period.length === 2 ) {
		query.createdDateFrom = toISODate(form.period[0]!);
		query.createdDateTo = toISODate(form.period[1]!);
	}

	complaints.fetchStats(query)
		.then(res => {
			pageData.stats = res;
		});
}

async function fetchCounts(): Promise<void> {
	complaints.fetchCounts()
		.then(res => {
			pageData.counts = res;
		});
}

function onCreatedDatesChanged() {
	if( !form.period || form.period.length === 0 || form.period.every(date => !date) ) {
		init();
		return;
	}

	if( Array.isArray(form.period)
		&& form.period[0] instanceof Date
		&& form.period[1] instanceof Date
	) init();
}

// function isCompleteDateRange(dates: Date[] | null): dates is [Date, Date] {
// 	return Array.isArray(dates)
// 		&& dates[0] instanceof Date
// 		&& dates[1] instanceof Date;
// }

// function getDateFilters() {
// 	const query: Partial<ComplaintsStatsQuery> = {};
// 	if( !Array.isArray(form.period) ) return query;

// 	const [dateFrom, dateTo] = form.period;
// 	if( dateFrom ) query.createdDateFrom = toISODate(dateFrom);
// 	if( dateTo ) query.createdDateTo = toISODate(dateTo);

// 	return query;
// }

async function showCreateModal() {
	const created = await $modal.show('ComplaintCreate', { title: 'Регистрация жалобы', nonCloseable: true });
	if (created) init();
}

function getStatusClass(status: any) {
	switch (String(status)) {
		case 'Новая':
			return 'new';
		case 'В работе':
			return 'in-progress';
		case 'Просрочено':
			return 'overdue';
		case 'Закрыто':
			return 'closed';
		default:
			return '';
	}
}

const itemsByType = computed(() => {
	if( pageData.stats?.all && Array.isArray(pageData.stats.all.subjects) ) {
		const subjects = pageData.stats.all.subjects;
		const maxCount = subjects.reduce((max, s) => s.count > max ? s.count : max, 0);
		return {
			maxCount,
			subjects: subjects
				.map(subject => ({
					...subject,
					percent: maxCount && subject.count ? Math.max((subject.count / maxCount) * 100, 3) : 0
				}))
				.sort((a, b) => b.count - a.count)
		};
	}
	return {
		maxCount: 0,
		subjects: []
	};
});
</script>

<style lang="scss">
#complaint-issue-list {
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;

		.title {
			h2 {
				margin: 0 0 .2em 0;
			}

			span {
				color: #6b7280;
			}
		}
	}

	.page-blocks {
		margin: 1em 0;

		>section,
		>div {
			margin: 0 0 1em 0;
		}

		.stats {
			display: flex;
			flex-wrap: wrap;
			gap: .8em;

			.stat-tile {
				flex: auto 1 1;
				display: flex;
				align-items: center;
				gap: 1em;
				padding-top: 1.8em;
				padding-bottom: 1.8em;

				.icon-circle {
					display: grid;
					place-items: center;
					width: 3em;
					aspect-ratio: 1/1;
					border-radius: 50%;
					&.dark {
						color: #374151; // #545b64
						background: #f3f4f6;
					}
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

				.content {
					.value {
						font-size: 1.6em;
						font-weight: 700;
					}

					.label {
						color: #6b728088;
						font-size: .8em;
					}
				}
			}
		}

		.filters {
			>div, >.filter-tabs {
				margin-top: .7em;
			}
		}

		.stats-by-types {
			.item {
				display: grid;
				grid-template-columns: minmax(14em, 1fr) minmax(18em, 2fr);
				align-items: center;
				gap: 1.2em;
				padding: .8em 0;
				border-bottom: 1px solid #f3f4f6;

				&:last-child {
					border-bottom: 0;
					padding-bottom: 0;
				}

				&:first-of-type {
					padding-top: 0;
				}

				.subject {
					min-width: 0;

					span {
						display: block;
						color: #374151;
						font-size: .92em;
						font-weight: 600;
						line-height: 1.35;
					}
				}

				.chart {
					display: grid;
					grid-template-columns: 1fr 3em;
					align-items: center;
					gap: .8em;

					.count {
						color: #172b4d;
						font-size: .9em;
						font-weight: 700;
						text-align: right;
					}
				}
			}
		}

		.list {
			.key {
				color: #2563eb;
				text-decoration: underline;
				cursor: pointer;
			}

			.status,
			.created {
				display: inline-flex;
				align-items: center;
				border-radius: 999px;
				padding: .25em .65em;
				font-size: .85em;
				font-weight: 700;
			}

			.status {
				&.new {
					color: #166534;
					background: #dcfce7;
				}
				&.in-progress {
					color: #1d4ed8;
					background: #dbeafe;
				}
				&.overdue {
					color: #d23438;
					background: #fdf3f2;
				}
				&.closed {
					color: #374151;
					background: #f3f4f6;
				}
			}

			.sla {
				color: #92400e;
				background: #fef3c7;
			}
		}
	}

	@media (max-width: 700px) {
		header {
			align-items: flex-start;
			flex-direction: column;
		}

		.page-blocks {
			.stats-by-types {
				.item {
					grid-template-columns: 1fr;
					gap: .5em;

					.chart {
						grid-template-columns: 1fr auto;
					}
				}
			}
		}
	}
}
</style>
