<template>
	<section id="dashboard-page">
		<!-- <header>
			<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная' }]" />
		</header> -->

		<main class="page-blocks">
			<!-- Статистика -->
			<section v-if="[`CALLCENTER`, `CONTROLLER`, `CALLCENTER_COMPLAINT_ASSIGNEE`].includes(userStore?.userData?.role ?? '')" class="statistics">
				<template
					v-for="(item, index) of [
						{ bg: '#ef4444', 	color: '#ef4444', 		icon: 'mdi-alert-circle',				value: stats.openComplaints,	title: 'Открытых жалоб' },
						{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-clock-outline',				value: stats.avgProcessingTime,	title: 'Среднее время обработки' },
						{ bg: '#16a34a', 	color: '#16a34a', 		icon: 'mdi-check-circle-outline',		value: stats.readings,		title: 'Новые показания сегодня' },
						{ bg: '#f3ac00', 	color: '#f3ac00', 		icon: 'mdi-newspaper-variant-outline',	value: stats.news,			title: 'Новостей за день' },
					]" :key="index">
					<BaseIsland data-aos="zoom-in" class="stat" :style="{ '--bg': item.bg, '--color': item.color }">
						<section class="icon">
							<div class="box">
								<BaseIcon :name="item.icon" :size="'1.5em'" :color="item.color"/>
							</div>
						</section>
						<section class="content">
							<div class="value">
								<template v-if="Number.isFinite(item.value)">
									<Incrementator :value="Number(item.value)" />
								</template>
								<template v-else>
									{{ item.value }}
								</template>
							</div>
							<div class="title">{{ item.title }}</div>
						</section>
					</BaseIsland>
				</template>
			</section>

			<!-- Жалобы -->
			<BaseIsland title="Жалобы" prependIcon="mdi-format-list-bulleted" data-aos="fade-up">
				<div class="complaints">
					<div v-if="complaintsLoading" class="empty-state">
						<BaseIcon name="mdi-loading" size="1.3em" />
						<div class="title">Загрузка жалоб...</div>
					</div>
					<div v-else-if="!pageData.complaints.length" class="empty-state">
						<BaseIcon name="mdi-alert-circle-outline" size="1.3em" />
						<div class="title">Нет жалоб</div>
					</div>
					<template v-else>
						<div v-for="item of pageData.complaints" :key="item.id" class="complaint" @click="showComplaint(item)">
							<div>
								<strong>Жалоба #{{ item.id }}</strong>
								<a>{{ item.branchName || 'Филиал не указан' }}</a>
								<span>{{ complaintDescription(item) }}</span>
							</div>

							<b :class="getComplaintStatusClass(item.status)">{{ item.status }}</b>
						</div>
					</template>
				</div>
			</BaseIsland>

			<!-- Срочные отключения и изменения FAQ -->
			<section>
				<section data-aos="fade-up" class="col-8">
					<BaseIsland title="Срочные отключения газа" prependIcon="mdi-alert-circle-outline" class="urgent">
						<div class="outages">
							<div :class="['outage', item.categoryType]" v-for="(item, index) of pageData.disconnections" :key="index">
								<div>
									<strong>{{ item.title }}</strong>
									<span>{{ item.text }}</span>
								</div>

								<!-- TODO: make label prettier -->
								<b>{{ item.categoryType }}</b>
							</div>
						</div>
					</BaseIsland>
				</section>

				<section class="col-4" data-aos="fade-up">
					<BaseIsland title="Изменения FAQ" prependIcon="mdi-help-rhombus-outline">
						<div class="faq-list">
							<div class="faq-item" v-for="(item, index) of pageData.faq" :key="index">
								<div>
									<strong>{{ item.title }}</strong>
									<span>{{ item.created }}</span>
								</div>
							</div>
						</div>
					</BaseIsland>
				</section>
			</section>

			<!-- Тарифы, режим работы, последние показания -->
			<section>
				<section class="col-4" data-aos="fade-up">
					<BaseIsland title="Актуальные тарифы" prependIcon="mdi-currency-usd">
						<div class="tariffs">
							<div v-for="(item, index) of dashboardTariffs" :key="index">
								<span>{{ item.title }}</span>
								<strong>{{ item.value }}</strong>
							</div>
						</div>
					</BaseIsland>
				</section>

				<section class="col-4" data-aos="fade-up">
					<BaseIsland title="Режим работы офисов" prependIcon="mdi-office-building">
						<BaseTabs v-model="currentBranchId" :items="[{ value: 'Бишкекгаз', key: 1 }, { value: 'Чуйгаз', key: 2 }, { value: 'Ошгаз', key: 3 }, { value: 'Жалалабатгаз', key: 4 }]" />
						<div class="offices">
							<div v-for="(item, index) of pageData.offices.filter((item) => item.branch === currentBranchId)" :key="index">
								<strong>{{ item.name }}</strong>
								<div>
									<span class="work">
										<BaseIcon name="mdi-clock-outline" />
										{{ item.workDays[currentDay]?.workTime.join(' - ') }}
									</span>

									<span class="break">
										<BaseIcon name="mdi-clock-remove-outline" />
										{{ item.workDays[currentDay]?.breakTime.join(' - ') }}
									</span>
								</div>
							</div>
						</div>
					</BaseIsland>
				</section>

				<section class="col-4" data-aos="fade-up">
					<BaseIsland title="Последние показания" prependIcon="mdi-check-circle-outline">
						<div v-if="pageData.readings?.length" class="readings">
							<div v-for="item of pageData.readings" :key="item.readingId" class="reading">
								<div class="facility">
									<NuxtLink class="account" :to="`/profile/${item.facility.account}`">{{ item.facility.account }}</NuxtLink>
									<span class="name">{{ item.facility.name }}</span>
								</div>
								<div class="value">{{ item.reading }}</div>
								<div class="status" :class="item.success ? 'accepted' : 'error'">{{ item.success ? 'Принято' : 'Ошибка' }}</div>
							</div>
						</div>
						<div v-else class="empty-state">
							<BaseIcon name="mdi-account-search-outline" size="1.3em" />
							<div class="title">Нет показаний</div>
						</div>
					</BaseIsland>
				</section>
			</section>

			<section class="no-api" data-aos="fade-up">
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

			<section class="no-api" data-aos="fade-up">
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
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import type { ReadingPayload } from '~/types/Portal';
import Incrementator from '~/components/common/Incrementator.vue';
import type { NewsPayload } from '~/types/CallGas';
import type { OfficesPayload } from '~/types/GapromAppService';
import { readings } from '~/services/readings';
import { news } from '~/services/news';
import { offices } from '~/services/offices';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import { complaints, type ComplaintsPayload, type CountsResponse } from '~/services/complaints';
const { $flags, $modal } = useNuxtApp();
const userStore = useUserStore();
const appStore = useAppStore();

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTROLLER', 'CALLCENTER', 'CALLCENTER_COMPLAINT_ASSIGNEE'],
	layout: 'default'
});


const currentBranchId = ref(1);
const currentDay = (new Date().getDay() + 6) % 7;
const pageData = reactive({
	readings: [] as ReadingPayload[],
	news: [] as NewsPayload[],
	faq: [] as NewsPayload[],
	disconnections: [] as NewsPayload[],
	offices: [] as OfficesPayload[],
	complaints: [] as ComplaintsPayload[],
	complaintCounts: null as CountsResponse | null,
});
const complaintsLoading = ref(false);


const stats = computed(() => {
	return {
		openComplaints: (pageData.complaintCounts?.new || 0)
			+ (pageData.complaintCounts?.inProgress || 0)
			+ (pageData.complaintCounts?.expired || 0),
		avgProcessingTime: pageData.complaintCounts?.avgProcessingTime || 0,
		readings: pageData.readings.length,
		news: pageData.news.length,
	};
});

const ulValueWithTaxes = computed(() => {
	if (!appStore.tariffs) return null;

	return Math.round((appStore.tariffs.ulValue + appStore.tariffs.ulNds + appStore.tariffs.ulNsp) * 100) / 100;
});

const dashboardTariffs = computed(() => [
	{ title: 'Население', value: appStore.tariffs ? `${appStore.tariffs.fizValue} сом/м³` : '-' },
	{ title: 'Население (Майлы-Суу)', value: appStore.tariffs ? `${appStore.tariffs.fizValue} сом/м³` : '-' },
	{ title: 'Юр. лица без налогов', value: appStore.tariffs ? `${appStore.tariffs.ulValue} сом/м³` : '-' },
	{ title: 'Юр. лица с НДС-12% и НСП-8%', value: ulValueWithTaxes.value !== null ? `${ulValueWithTaxes.value} сом/м³` : '-' },
]);


onMounted(() => { init(); });
async function init() {
	readings.fetchToday()
		.then((res) => { if (res) pageData.readings = res; })
	news.fetch()
		.then((res) => { if (res) pageData.news = res; })
	news.fetch({categoryFilter: 'FAQ'})
		.then((res) => { if (res) pageData.faq = res; })
	news.fetch({categoryFilter: 'DISCONNECTION', urgencyLevelFilter: ['MIDDLE', 'HIGH']})
		.then((res) => { if (res) pageData.disconnections = res; })
	offices.fetch()
		.then((res) => { if (res) pageData.offices = res; })
	appStore.ensureTariffs();

	complaintsLoading.value = true;
	complaints.fetch({ page: 1, size: 3 })
		.then((res) => { pageData.complaints = res?.data || []; })
		.catch((error: any) => {
			const text = error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось загрузить жалобы.';
			$flags.error(text, { title: 'Ошибка загрузки жалоб' });
		})
		.finally(() => {
			complaintsLoading.value = false;
		})
	// Только если опретор или контролёр
	if( [`CALLCENTER`, `CONTROLLER`, `CALLCENTER_COMPLAINT_ASSIGNEE`].includes(userStore?.userData?.role ?? '') ) {
		complaints.fetchCounts()
			.then((res) => { pageData.complaintCounts = res; })
			.catch((error: any) => {
				const text = error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось загрузить статистику жалоб.';
				$flags.error(text, { title: 'Ошибка статистики жалоб' });
			})
	}
}

function complaintDescription(item: ComplaintsPayload) {
	return `${item.subscriberName || 'Абонент'} - ${item.subject || item.description || 'Без темы'}`;
}

async function showComplaint(item: ComplaintsPayload) {
	const result = await $modal.show('ComplaintDetails', {
		title: `Жалоба #${item.id}`,
		payload: {
			complaint: item,
		}
	});

	// if (result) init();
}

function getComplaintStatusClass(status: string) {
	switch (status) {
		case 'Новая':
			return 'new';
		case 'Просрочено':
			return 'expired';
		case 'В работе':
			return 'work';
		case 'Закрыто':
			return 'closed';
		default:
			return '';
	}
}
</script>

<style lang="scss">
#dashboard-page {
	.page-blocks {
		margin: 1em 0;

		>section,
		>div {
			margin: 0 0 1em 0;
		}

		.statistics {
			display: flex;
			flex-wrap: wrap;
			gap: 1em;
			margin-top: 1em;

			.stat {
				display: flex;
				flex: 1 1 200px;
				flex-direction: column;
				flex-wrap: nowrap;
				align-items: center;
				gap: .6em;

				.icon {
					.box {
						padding: 1em;
						border-radius: 12px;
						color: var(--color);
						background-color: color-mix(in srgb, var(--bg) 8%, #fff);
					}
				}

				.content {
					text-align: center;

					.value {
						font-size: 1.6em;
						font-weight: 700;
						line-height: 1.4em;
					}

					.title {
						color: #737373;
						font-size: .9em;
					}
				}
			}
		}

		.complaints {
			display: grid;
			gap: 10px;

			.complaint {
				display: grid;
				grid-template-columns: minmax(0, 1fr) auto;
				align-items: center;
				gap: 16px;
				padding: 12px 14px;
				border-radius: 8px;
				background: #fff;
				cursor: pointer;
				transition: background-color 200ms ease 0s;

				&:hover {
					background: #f8fafc;
				}

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

					&.closed {
						color: #16a34a;
					}
				}
			}
		}

		.outages {
			display: grid;
			gap: 10px;

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

				&.EMERGENCY {
					border-color: #fecaca;
					background: #fff1f2;

					b {
						color: #dc2626;
					}
				}

				&.PLANNED {
					border-color: #fde68a;
					background: #fffbeb;

					b {
						color: #c2410c;
					}
				}
			}
		}

		.faq-list {
			display: grid;
			gap: 20px;
			padding: 8px 0;

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
			margin-top: 1em;

			>div {
				display: grid;
				grid-template-columns: 1fr auto;
				align-items: center;
				gap: 10px;

				>div {
					display: flex;
					gap: 10px;
					font-size: 11px;
					white-space: nowrap;
				}
			}

			strong {
				font-size: 13px;
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
			display: flex;
			flex-direction: column;
			gap: .8em;

			.reading {
				display: grid;
				grid-template-columns: minmax(0, 1fr) auto auto;
				align-items: center;
				gap: 10px;
				font-size: .9em;

				.facility {
					display: grid;
					gap: 3px;
					min-width: 0;

					>.account {
						overflow: hidden;
						color: #2563eb;
						font-size: .9em;
						text-overflow: ellipsis;
						white-space: nowrap;
						cursor: pointer;

						&:hover {
							color: #1d4ed8;
							text-decoration: underline;
						}
					}

					>.name {
						overflow: hidden;
						color: #6b7280;
						font-size: .8em;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				>.value {
					font-size: .9em;
					white-space: nowrap;
				}

				>.status {
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
		}

		.empty-state {
			display: flex;
			align-items: center;
			justify-self: center;
			gap: .4em;
			padding: 1em 0;
			opacity: .5;
		}

		.villages {
			display: grid;
			gap: 12px;
			max-width: 340px;
			padding: 6px 0;

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

				&:nth-child(2) {
					.progress {
						i {
							background: #f59e0b;
						}
					}
				}

				&:nth-child(3) {
					.progress {
						i {
							background: #2563eb;
						}
					}
				}
			}
		}

		a {
			color: #2563eb;
			font-size: 12px;
			font-weight: 700;
			text-decoration: none;
		}

		@media (max-width: 1100px) {
			.statistics {
				.stat {
					flex-basis: calc(50% - .5em);
				}
			}

			.col-8,
			.col-4 {
				grid-column: span 12;
			}
		}

		@media (max-width: 768px) {
			.statistics {
				.stat {
					flex-basis: 100%;
				}
			}

			.complaints {
				.complaint {
					grid-template-columns: 1fr;
					align-items: start;
				}
			}

			.outages {
				.outage {
					grid-template-columns: 1fr;
					align-items: start;
				}
			}

			.offices {
				>div {
					grid-template-columns: 1fr;

					>div {
						flex-wrap: wrap;
					}
				}
			}

			.readings {
				.reading {
					grid-template-columns: 1fr;
					align-items: start;
				}
			}

			.villages {
				max-width: none;

				.village {
					grid-template-columns: 1fr;
					gap: 6px;
				}
			}
		}
	}
}
</style>
