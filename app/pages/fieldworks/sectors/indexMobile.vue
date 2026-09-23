<template>
	<section id="sectors-mobile-page">
		<header class="sm-header">
			<div class="sm-heading">
				<div class="sm-icon"><BaseIcon name="mdi-gauge" size="1.5em"/></div>
				<div>
					<h1 class="sm-title">Полевые работы</h1>
					<div class="sm-description">Сбор показаний приборов учета</div>
				</div>
			</div>
			<div class="sm-date">Не указано</div>
			<div class="sm-progress">
				<div class="sm-progress-head">
					<span>Общий прогресс дня</span>
					<b>{{ statistics.totalCollectedReadings }}/{{ statistics.totalSubscribers }}</b>
				</div>
				<BaseProgressBar :percent="statistics.totalCollectionPercentage" height=".65em" bgColor="#fff2" color="#fff"/>
				<div class="sm-progress-foot">
					<span>{{ statistics.totalCollectionPercentage }}% выполнено</span>
					<span>{{ statistics.totalRemainingReadings }} осталось</span>
				</div>
			</div>
		</header>

		<section class="sm-stats">
			<section class="sm-stats-center">
				<div class="sm-stats-item">
					<BaseIcon name="mdi-layers-triple-outline" fill="#7c3aed"/>
					<b class="sm-stats-count"><Incrementator :value="statistics.areaCount"/></b>
					<span class="sm-stats-label">Участков</span>
				</div>
				<div class="sm-stats-item">
					<BaseIcon name="mdi-transit-connection-variant" fill="#2563eb"/>
					<b class="sm-stats-count"><Incrementator :value="statistics.routeCount"/></b>
					<span class="sm-stats-label">Маршрутов</span>
				</div>
				<div class="sm-stats-item">
					<BaseIcon name="mdi-check-circle-outline" fill="#16a34a"/>
					<b class="sm-stats-count"><Incrementator :value="statistics.totalCollectedReadings"/></b>
					<span class="sm-stats-label">Собрано</span>
				</div>
			</section>
		</section>

		<main class="sm-content">
			<div class="sm-caption">Мои участки</div>
			<section class="sm-list">
				<BaseIsland v-for="area of areas" :key="area.areaCode" class="sm-area">
					<div class="sm-area-heading">
						<div>
							<BaseIcon name="mdi-layers-outline" color="#7c3aed"/>
							<b>Участок №{{ area.areaCode }}</b>
						</div>
						<span>{{ getAreaStatus(area) }}</span>
					</div>
					<div class="sm-area-district"><BaseIcon name="mdi-city-variant-outline"/>Не указано</div>
					<div class="sm-route-badges">
						<span v-for="route of area.routes" :key="route.routeCode" class="badge">{{ route.routeCode }}</span>
					</div>
					<div class="sm-area-progress">
						<BaseProgressBar :percent="percent(area.statistics.collectedReadings, area.statistics.collectedReadings + area.statistics.remainingReadings)" height=".45em"/>
						<b>{{ area.statistics.collectedReadings }}/{{ area.statistics.collectedReadings + area.statistics.remainingReadings }} ({{ percent(area.statistics.collectedReadings, area.statistics.collectedReadings + area.statistics.remainingReadings) }}%)</b>
					</div>
					<BaseButton prependIcon="mdi-transit-connection-variant" @click="navigateTo(`/fieldworks/sectors/${area.areaCode}`)">Маршруты участка</BaseButton>
				</BaseIsland>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import Incrementator from '~/components/common/Incrementator.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';
import type { ControllerArea } from '~/types/Portal';

const store = useFieldworksStore();
const areas = computed(() => store.areasData?.areas ?? []);
const statistics = computed(() => store.areasData?.statistics ?? { areaCount: 0, routeCount: 0, totalSubscribers: 0, totalCollectedReadings: 0, totalRemainingReadings: 0, totalCollectionPercentage: 0 });

onMounted(() => store.fetchAreas());

function percent(collected: number, total: number) {
	return total ? Math.round(collected / total * 100) : 0;
}

function getAreaStatus(area: ControllerArea) {
	if (!area.statistics.collectedReadings) return 'Новый';
	return area.statistics.remainingReadings ? 'В работе' : 'Выполнено';
}
</script>

<style lang="scss">
#sectors-mobile-page {
	min-height: 100dvh;
	background: #f8fafc;

	.sm-header {
		position: relative;
		padding: 1.7em 1em 3.5em;
		color: #ffffff;
		background: #1d4ed8;

		.sm-heading {
			display: flex;
			align-items: center;
			gap: .8em;

			.sm-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 2.7em;
				height: 2.7em;
				border-radius: .8em;
				background: rgba(255, 255, 255, .16);
			}

			.sm-title {
				margin: 0;
				font-size: 1.25rem;
			}

			.sm-description {
				margin-top: .15em;
				font-size: .8rem;
				opacity: .82;
			}
		}

		.sm-date {
			position: absolute;
			top: 2em;
			right: 1em;
			font-size: .72rem;
			text-align: right;
		}

		.sm-progress {
			margin-top: 1.6em;
			padding: 1em;
			border-radius: 1em;
			background: rgba(255, 255, 255, .12);

			.sm-progress-head,
			.sm-progress-foot {
				display: flex;
				justify-content: space-between;
				gap: .5em;
				margin-bottom:.6em;
			}

			.sm-progress-head {
				font-size: .9rem;
			}

			.sm-progress-foot {
				margin-top: .7em;
				font-size: .75rem;
				opacity: .8;
			}
		}
	}

	.sm-stats {
		// margin:0 auto;
		display:flex;
		justify-content: center;
		gap:.6em;
		position: relative;

		.sm-stats-center {
			display: inline-grid;
			grid-template-columns: repeat(3, 1fr);
			gap:.6em;
			box-shadow: 0 8px 20px rgba(15, 23, 42, .12);
			border-radius: 1em;
			overflow: hidden;
			z-index:9999;
			background: #ffffff;
			position: relative;
			top: -1em;

			.sm-stats-item {
				display: grid;
				justify-items: center;
				gap: .35em;
				padding: 1em 2em;

				.sm-stats-count {
					font-size: 1.12rem;
				}
				.sm-stats-label {
					color: #94a3b8;
					font-size: .7rem;
				}
				&+.sm-stats-item {
					border-left: 1px solid #eef2f7;
				}
			}
		}
	}

	.sm-content {
		padding:0 1em 1.5em;

		.sm-caption {
			margin-bottom:1em;
			color: #94a3b8;
			font-size: .75rem;
			font-weight: 800;
			text-transform: uppercase;
		}

		.sm-list {
			display: grid;
			gap: 1em;
			overflow:hidden;

			.sm-area {
				border-top: 4px solid #2563eb;

				.sm-area-heading {
					display: flex;
					justify-content: space-between;
					gap: .5em;

					div {
						display: flex;
						align-items: center;
						gap: .45em;
	
						span {
							padding: .35em .6em;
							color: #2563eb;
							background: #eff6ff;
							border-radius: 1em;
							font-size: .7rem;
						}
					}
				}

				.sm-area-district {
					display: flex;
					align-items: center;
					gap: .35em;
					margin-top: .45em;
					color: #94a3b8;
					font-size: .8rem;
				}

				.sm-route-badges {
					display: flex;
					flex-wrap: wrap;
					gap: .45em;
					margin: 1em 0;
					
					.badge {
						padding: .35em .6em;
						color: #2563eb;
						background: #eff6ff;
						border-radius: .6em;
						font: 700 .72rem ui-monospace, monospace;
					}
				}

				.sm-area-progress {
					display: grid;
					grid-template-columns: 1fr auto;
					align-items: center;
					gap: .7em;
					margin-bottom: 1em;
					b {
						font-size: .72rem;
					}
				}

				.base-button {
					width: 100%;
					justify-content: center;
				}
			}
		}
	}
}
</style>
