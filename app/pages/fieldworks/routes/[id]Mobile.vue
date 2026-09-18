<template>
	<section id="route-mobile-page">
		<header class="rm-header">
			<button class="rm-back" @click="navigateTo(backLink)"><BaseIcon name="mdi-arrow-left"/></button>
			<div class="rm-title">
				<b>Маршрут {{ currentRoute?.routeCode ?? routeId }}</b>
				<span>Не указано</span>
			</div>
			<div class="rm-total"><b>{{ collected }}/{{ subscribers }}</b><span>собрано</span></div>
		</header>
		<div class="rm-progress"><BaseProgressBar :percent="progress" height=".4em"/><span>{{ progress }}%</span></div>

		<main class="rm-content">
			<BaseTextBox v-model="search" prependIcon="mdi-magnify" placeholder="Поиск по ФИО, Л/с, дому..."/>
			<BaseTabs v-model="filter" :items="filters"/>
			<section v-for="street of filteredStreets" :key="street.street" class="rm-street">
				<div class="rm-street-title">
					<BaseIcon name="mdi-map-marker-outline"/>
					<span>{{ street.street }}</span>
					<span class="rm-count">({{ street.subscribers.length }})</span>
				</div>
				<div class="rm-cards">
					<BaseIsland v-for="subscriber of street.subscribers" :key="subscriber.accountNo" class="rm-card">
						<div class="rm-card-head">
							<div>
								<b class="rm-name">{{ subscriber.fullName || 'Не указано' }}</b>
								<span class="rm-account">Л/с {{ subscriber.accountNo }}</span>
							</div>
							<em class="rm-status">{{ subscriber.status }}</em>
						</div>
						<div class="rm-model">{{ subscriber.meterModel || 'Не указано' }}</div>
						<div class="rm-card-bottom">
							<span>Пред.: <b>{{ subscriber.reading ?? 'Не указано' }} м³</b></span>
							<div class="rm-actions">
								<BaseButton variant="light" prependIcon="mdi-account-outline" @click="openSubscriber(subscriber.accountNo)">Карточка</BaseButton>
								<BaseButton v-if="subscriber.status === 'Не передано'" prependIcon="mdi-pencil-outline" @click="openReading(subscriber)">Ввести</BaseButton>
							</div>
						</div>
					</BaseIsland>
				</div>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';
import type { ControllerSubscriber } from '~/types/Portal';

const route = useRoute();
const routeId = String(route.params.id);
const sectorId = typeof route.query.sector === 'string' ? route.query.sector : '';
const store = useFieldworksStore();
const { $modal } = useNuxtApp();
const search = ref('');
const filter = ref('all');
const currentRoute = computed(() => store.areasData?.areas.flatMap(area => area.routes).find(item => item.routeCode === routeId));
const subscribers = computed(() => currentRoute.value?.statistics.subscriberCount ?? 0);
const collected = computed(() => currentRoute.value?.statistics.collectedReadings ?? 0);
const progress = computed(() => subscribers.value ? Math.round(collected.value / subscribers.value * 100) : 0);
const filters = computed(() => [
	{ key: 'all', value: 'Все', badge: subscribers.value },
	{ key: 'missing', value: 'Не собрано', badge: subscribers.value - collected.value },
	{ key: 'collected', value: 'Собрано', badge: collected.value },
]);
const filteredStreets = computed(() => currentRoute.value?.streets.map(street => ({
	...street,
	subscribers: street.subscribers.filter(subscriber => {
		const text = `${subscriber.fullName} ${subscriber.accountNo} ${subscriber.addressText}`.toLowerCase();
		const matchesSearch = !search.value || text.includes(search.value.toLowerCase());
		const matchesFilter = filter.value === 'all' || (filter.value === 'missing'
			? subscriber.status === 'Не передано'
			: subscriber.status !== 'Не передано');
		return matchesSearch && matchesFilter;
	}),
})).filter(street => street.subscribers.length) ?? []);
const backLink = computed(() => sectorId ? `/fieldworks/sectors/${sectorId}` : '/fieldworks/sectors');

onMounted(() => store.fetchAreas());

function openSubscriber(account: string) {
	navigateTo({ path: `/fieldworks/subscribers/${account}`, query: { route: routeId, sector: sectorId } });
}

async function openReading(subscriber: ControllerSubscriber) {
	if (await $modal.show('FieldworkReading', { payload: { subscriber } })) store.fetchAreas(true);
}
</script>

<style lang="scss">
#route-mobile-page {
	min-height: 100dvh;
	background: #f8fafc;

	.rm-header {
		display: flex;
		align-items: center;
		gap: .8em;
		padding: .8em 1em;
		background: #ffffff;
		border-bottom: 1px solid #e5e7eb;

		.rm-back {
			display: flex;
			padding: .55em;
			color: #475569;
			background: #f1f5f9;
			border: 0;
			border-radius: 50%;
		}

		.rm-title {
			span {
				display: block;
				margin-top: .2em;
				color: #94a3b8;
				font-size: .72rem;
			}
		}

		.rm-total {
			margin-left: auto;
			color: #2563eb;
			text-align: right;

			span {
				display: block;
				margin-top: .2em;
				font-size: .72rem;
			}
		}
	}

	.rm-progress {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: .7em;
		padding: .65em 1em;
		font-size: .75rem;
		font-weight: 800;
		background: #ffffff;
	}

	.rm-content {
		display: grid;
		gap: .7em;
		padding: 1em;

		.rm-street {
			margin-top: .7em;

			.rm-street-title {
				display: flex;
				align-items: center;
				gap: .35em;
				margin-bottom: .7em;
				color: #1e3a8a;
				font-size: .85rem;
				font-weight: 800;

				.rm-count {
					color: #94a3b8;
				}
			}

			.rm-cards {
				display: grid;
				gap: .7em;

				.rm-card {
					.rm-card-head {
						display: flex;
						justify-content: space-between;
						gap: .5em;

						.rm-name, .rm-account {
							display: block;
						}

						.rm-name {
							color: #0f172a;
						}

						.rm-account {
							margin-top: .25em;
							color: #2563eb;
							font: 700 .75rem ui-monospace, monospace;
						}

						.rm-status {
							height: max-content;
							padding: .4em .6em;
							color: #ea580c;
							font-size: .7rem;
							font-style: normal;
							background: #fff7ed;
							border-radius: 1em;
						}
					}

					.rm-model {
						margin: .7em 0;
						color: #94a3b8;
						font-size: .78rem;
					}

					.rm-card-bottom {
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: .5em;
						color: #64748b;
						font-size: .78rem;

						.rm-actions {
							display: flex;
							gap: .4em;

							.base-button {
								padding: .45em .6em;
								font-size: .75rem;
							}
						}
					}
				}
			}
		}
	}
}
</style>
