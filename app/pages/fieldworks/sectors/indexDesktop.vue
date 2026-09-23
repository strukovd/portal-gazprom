<template>
	<section id="sectors-page">
		<main class="page-blocks">
			<template v-if="loading">
				<section class="sp-stats">
					<BaseIsland v-for="item of 4" :key="item" class="sp-stat sp-stat-skeleton">
						<BaseSkeleton width="3em" height="3em" borderRadius="50%"/>
						<div class="sp-stat-info">
							<BaseSkeleton width="2.2em" height="1.5em"/>
							<BaseSkeleton width="5em" height=".8em"/>
						</div>
					</BaseIsland>
				</section>

				<section class="sp-caption">
					<BaseSkeleton width="11em" height="1em"/>
				</section>

				<section class="sp-sectors">
					<BaseIsland v-for="item of 3" :key="item" class="sp-sector sp-sector-skeleton">
						<BaseSkeleton width="55%" height="1.4em"/>
						<BaseSkeleton width="35%" height=".8em"/>
						<BaseSkeleton height="5.4em"/>
						<BaseSkeleton height=".8em"/>
						<BaseSkeleton height="4.4em"/>
						<BaseSkeleton height="3.1em"/>
					</BaseIsland>
				</section>
			</template>

			<template v-else>
				<section class="sp-stats">
					<BaseIsland v-for="item of statsData" :key="item.id" class="sp-stat">
						<div :class="['sp-stat-icon', item.color]">
							<BaseIcon :name="item.icon" size="1.35em"/>
						</div>
						<div class="sp-stat-info">
							<div class="sp-stat-value"><Incrementator :value="item.value"/></div>
							<div class="sp-stat-title">{{ item.title }}</div>
						</div>
					</BaseIsland>
				</section>

				<section class="sp-caption">
					<span class="sp-caption-text">Участки</span>
					<span class="sp-caption-date">Не указано</span>
				</section>

				<section class="sp-sectors">
					<BaseIsland class="sp-sector" v-for="item of sectors" :key="item.areaCode">
						<header class="sp-sector-header">
							<div class="sp-sector-title">
								<div class="sp-title-line">
									<BaseIcon name="mdi-layers-outline" size="1.1em"/>
									<span class="sp-title-text">Участок №{{ item.areaCode }}</span>
								</div>
								<div class="sp-area-line">
									<BaseIcon name="mdi-city-variant-outline" size="1em"/>
									<span class="sp-area-text">Не указано</span>
								</div>
							</div>
							<div class="sp-badge">{{ getAreaStatus(item) }}</div>
						</header>

						<div class="sp-progress">
							<div class="sp-progress-header">
								<span class="sp-progress-title">Общий прогресс</span>
								<span class="sp-progress-count">{{ item.statistics.collectedReadings }}/{{ item.statistics.collectedReadings + item.statistics.remainingReadings }}</span>
							</div>
							<BaseProgressBar :percent="toPercent(item.statistics.collectedReadings, item.statistics.collectedReadings + item.statistics.remainingReadings)" height=".5em" color="#2563eb"/>
							<div class="sp-progress-percent">{{ toPercent(item.statistics.collectedReadings, item.statistics.collectedReadings + item.statistics.remainingReadings) }}%</div>
						</div>

						<div class="sp-routes">
							<span v-for="route of item.routes" :key="route.routeCode" class="sp-route">{{ route.routeCode }}</span>
						</div>

						<div class="sp-totals">
							<div class="sp-total routes">
								<div class="sp-total-value">{{ item.routes.length }}</div>
								<div class="sp-total-title">Маршрутов</div>
							</div>
							<div class="sp-total collected">
								<div class="sp-total-value">{{ item.statistics.collectedReadings }}</div>
								<div class="sp-total-title">Собрано</div>
							</div>
							<div class="sp-total missing">
								<div class="sp-total-value">{{ item.statistics.remainingReadings }}</div>
								<div class="sp-total-title">Не собрано</div>
							</div>
						</div>

						<BaseButton class="sp-route-button" prependIcon="mdi-transit-connection-variant" @click="openSector(item.areaCode)">Маршруты участка</BaseButton>
					</BaseIsland>
				</section>
			</template>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import BaseSkeleton from '~/components/common/base/BaseSkeleton.vue';
import Incrementator from '~/components/common/Incrementator.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';
import type { ControllerArea } from '~/types/Portal';

const loading = ref(true);
const sectors = ref<ControllerArea[]>([]);
const fieldworksStore = useFieldworksStore();

onMounted(async () => {
	loading.value = true;
	sectors.value = await fetchSectors();
	loading.value = false;
});

const statsData = computed(() => {
	const data = fieldworksStore.areasData?.statistics;

	return [
		{ id: 1, title: 'Участков', value: data?.areaCount ?? 0, icon: 'mdi-layers-triple-outline', color: 'violet' },
		{ id: 2, title: 'Маршрутов', value: data?.routeCount ?? 0, icon: 'mdi-transit-connection-variant', color: 'blue' },
		{ id: 3, title: 'Собрано', value: data?.totalCollectedReadings ?? 0, icon: 'mdi-check-circle-outline', color: 'green' },
		{ id: 4, title: 'Не собрано', value: data?.totalRemainingReadings ?? 0, icon: 'mdi-clock-outline', color: 'orange' },
	];
});

function openSector(id: string) {
	navigateTo(`/fieldworks/sectors/${id}`);
}

function toPercent(progress = 0, total = 0) {
	if (!total) return 0;
	const percent = (progress / total) * 100;
	return Math.min(Math.max(Math.round(percent), 0), 100);
}

function getAreaStatus(area: ControllerArea) {
	const { collectedReadings, remainingReadings } = area.statistics;
	if (!collectedReadings) return 'Новый';
	if (!remainingReadings) return 'Выполнено';
	return 'В работе';
}

async function fetchSectors(): Promise<ControllerArea[]> {
	const data = await fieldworksStore.fetchAreas();
	return data?.areas ?? [];
}
</script>

<style lang="scss">
#sectors-page {
	.page-blocks {
		display: grid;
		gap: 1.4em;
		margin: 1em 0;
	}

	.sp-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1em;

		.sp-stat {
			display: flex;
			align-items: center;
			gap: 1em;
			min-height: 5em;
			overflow: hidden;
			border-color: #dbe3ee;
			box-shadow: 0 5px 14px rgba(15, 23, 42, .08);

			.sp-stat-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 3em;
				height: 3em;
				border-radius: 50%;

				&.violet {
					color: #9333ea;
					background: #f3e8ff;
				}

				&.blue {
					color: #2563eb;
					background: #dbeafe;
				}

				&.green {
					color: #16a34a;
					background: #dcfce7;
				}

				&.orange {
					color: #f97316;
					background: #ffedd5;
				}
			}

			.sp-stat-info {
				.sp-stat-value {
					color: #020617;
					font-size: 1.55rem;
					font-weight: 900;
					line-height: 1;
				}

				.sp-stat-title {
					margin-top: .45em;
					color: #475569;
					font-size: .82rem;
					font-weight: 600;
				}
			}

			&.sp-stat-skeleton {
				.sp-stat-info {
					display: grid;
					gap: .45em;
				}
			}
		}
	}

	.sp-caption {
		display: flex;
		align-items: center;
		gap: .45em;
		color: #94a3b8;
		font-size: .88rem;
		font-weight: 900;
		letter-spacing: .04em;
		text-transform: uppercase;

		.sp-caption-date {
			color: #64748b;
		}
	}

	.sp-sectors {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1em;

		.sp-sector {
			display: grid;
			gap: 1.15em;
			overflow: hidden;
			border-color: #dbe3ee;
			border-top: 6px solid #cbd5e1;
			box-shadow: 0 6px 18px rgba(15, 23, 42, .08);

			&.active {
				border-top-color: #2563eb;
			}

			.sp-sector-header {
				display: flex;
				justify-content: space-between;
				gap: 1em;

				.sp-sector-title {
					min-width: 0;

					.sp-title-line {
						display: flex;
						align-items: center;
						gap: .35em;
						color: #2563eb;

						.sp-title-text {
							color: #020617;
							font-size: 1.2rem;
							font-weight: 900;
						}
					}

					.sp-area-line {
						display: flex;
						align-items: center;
						gap: .35em;
						margin-top: .45em;
						color: #94a3b8;
						font-size: .82rem;
						font-weight: 700;
					}
				}

				.sp-badge {
					align-self: flex-start;
					padding: .45em .75em;
					border-radius: 999px;
					font-size: .78rem;
					font-weight: 800;
					white-space: nowrap;

					&.work {
						color: #2563eb;
						background: #dbeafe;
					}

					&.new {
						color: #64748b;
						background: #f1f5f9;
					}
				}
			}

			.sp-assignees {
				display: grid;
				gap: .55em;
				min-height: 5.4em;
				padding: .9em;
				background: #f8fafc;
				border-radius: 14px;

				.sp-assignee {
					display: flex;
					align-items: center;
					gap: .65em;
					min-width: 0;

					.sp-assignee-name {
						overflow: hidden;
						color: #0f172a;
						font-size: .9rem;
						font-weight: 700;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}

			.sp-progress {
				.sp-progress-header {
					display: flex;
					justify-content: space-between;
					gap: 1em;
					color: #475569;
					font-size: .82rem;
					font-weight: 700;

					.sp-progress-count {
						color: #020617;
						font-weight: 900;
					}
				}

				.animated-progress-line {
					margin-top: .65em;
				}

				.sp-progress-percent {
					margin-top: .35em;
					color: #94a3b8;
					font-size: .78rem;
					font-weight: 700;
					text-align: right;
				}
			}

			.sp-routes {
				display: flex;
				flex-wrap: wrap;
				gap: .45em;

				.sp-route {
					padding: .45em .75em;
					color: #64748b;
					background: #f1f5f9;
					border-radius: 10px;
					font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
					font-size: .82rem;
					font-weight: 900;

					&.active {
						color: #2563eb;
						background: #dbeafe;
					}

					&.success {
						color: #16a34a;
						background: #dcfce7;
					}
				}
			}

			.sp-totals {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: .7em;

				.sp-total {
					padding: .8em .6em;
					border-radius: 14px;
					text-align: center;

					.sp-total-value {
						color: #020617;
						font-size: 1.05rem;
						font-weight: 900;
					}

					.sp-total-title {
						margin-top: .35em;
						font-size: .72rem;
						font-weight: 700;
					}

					&.routes {
						background: #f8fafc;

						.sp-total-title {
							color: #64748b;
						}
					}

					&.collected {
						background: #ecfdf5;

						.sp-total-value,
						.sp-total-title {
							color: #16a34a;
						}
					}

					&.missing {
						background: #fff7ed;

						.sp-total-value,
						.sp-total-title {
							color: #ea580c;
						}
					}
				}
			}

			.sp-route-button {
				justify-content: center;
				width: 100%;
				min-height: 3.1em;
				font-size: 1rem;
				border-radius: 12px;
			}

			&.sp-sector-skeleton {
				grid-template-rows: auto auto 5.4em auto 4.4em 3.1em;
			}
		}
	}
}
</style>
