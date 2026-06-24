<template>
	<section id="dashboard-page">
		<!-- <header>
			<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная' }]" />
		</header> -->

		<main class="page-blocks">
			<!-- Статистика -->
			<section class="statistics">
				<template
					v-for="(item, index) of [
						{ bg: '#ef4444', 	color: '#ef4444', 		icon: 'mdi-alert-circle',				value: '0',					title: 'Открытых жалоб' },
						{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-clock-outline',				value: '00:00',				title: 'Среднее время обработки' },
						{ bg: '#16a34a', 	color: '#16a34a', 		icon: 'mdi-check-circle-outline',		value: stats.readings,		title: 'Новые показания сегодня' },
						{ bg: '#f3ac00', 	color: '#f3ac00', 		icon: 'mdi-newspaper-variant-outline',	value: stats.news,			title: 'Новостей за день' },
					]" :key="index">
					<BaseIsland :class="['stat', {'no-api': [0,1].includes(index)}]" :style="{ '--bg': item.bg, '--color': item.color }">
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
			<section class="no-api">
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

				<section class="col-4">
					<BaseIsland title="Изменения FAQ" prependIcon="mdi-alert">
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
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import type { ReadingsResponse, ReadingPayload } from '~/types/Portal';
import Incrementator from '~/components/common/Incrementator.vue';
import type { NewsGetQuery, NewsPayload, NewsResponse } from '~/types/CallGas';
import type { OfficesPayload } from '~/types/GapromAppService';
const { $fetchPortal } = useNuxtApp();

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTRACTOR', 'CALLCENTER'],
	layout: 'authorized'
});


const pageData = reactive({
	readings: [] as ReadingPayload[],
	news: [] as NewsPayload[],
	faq: [] as NewsPayload[],
	disconnections: [] as NewsPayload[],
	offices: [] as OfficesPayload[]
});


const stats = computed(() => {
	return {
		readings: pageData.readings.length,
		news: pageData.news.length,
	};
});


onMounted(() => { init(); });
async function init() {
	const readingsRes = await fetchReadings();
	const newsRes = await fetchNews();
	const faqRes = await fetchNews({categoryFilter: 'FAQ'});
	const disconnectionsRes = await fetchNews({categoryFilter: 'DISCONNECTION', urgencyLevelFilter: ['MIDDLE', 'HIGH']});
	const officesRes = await fetchOffices();

	if (readingsRes) pageData.readings = readingsRes;
	if (newsRes) pageData.news = newsRes;
	if (faqRes) pageData.faq = faqRes;
	if (disconnectionsRes) pageData.disconnections = disconnectionsRes;
	if (officesRes) pageData.offices = officesRes;
}

async function fetchReadings(): Promise<ReadingPayload[] | void> {
	const todayISO = new Date().toLocaleDateString('fr-CA');
	return useNuxtApp().$fetchPortal<ReadingsResponse>(`/v1/portal/readings`, {
		method: 'GET',
		query: {
			success: true,
			date: todayISO,
			sortOrder: 'ASC'
		}
	})
		.then((resp) => {
			return resp.data;
		})
		.catch((error: any) => {
			console.error('Ошибка при загрузке показаний:', error);
		});
}

async function fetchNews(query: Partial<NewsGetQuery> = {}): Promise<NewsPayload[] | void> {
	return useNuxtApp().$fetchCallGas<NewsResponse>(`/news`, {
		method: 'GET',
		query
	})
		.then((resp) => {
			return resp.data;
		})
		.catch((error: any) => {
			console.error('Ошибка при загрузке новостей:', error);
		});
}

async function fetchOffices(query: Partial<any> = {}): Promise<OfficesPayload[] | void> {
	return useNuxtApp().$fetchApi<OfficesPayload[]>(`/v1/gazprom-app/content/offices`, {
		method: 'GET',
		query
	})
		.then((resp) => {
			return resp;
		})
		.catch((error: any) => {
			console.error('Ошибка при загрузке офисов:', error);
		});
}

async function fetchTariffs(query: Partial<any> = {}): Promise<any[] | void> {
	return useNuxtApp().$fetchApi<OfficesPayload>(`/v1/gazprom-app/content/tariff`, {
		method: 'GET',
		query
	})
		.then((resp) => {
			return resp;
		})
		.catch((error: any) => {
			console.error('Ошибка при загрузке офисов:', error);
		});
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
