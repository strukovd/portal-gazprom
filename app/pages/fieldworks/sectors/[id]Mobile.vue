<template>
	<section id="sector-mobile-page">
		<header class="ss-header"><button class="ss-back" @click="navigateTo('/fieldworks/sectors')"><BaseIcon name="mdi-arrow-left"/></button><div><b>Участок №{{ area?.areaCode ?? sectorId }}</b><span>Не указано</span></div><div class="ss-total"><b>{{ collected }}/{{ total }}</b><span>собрано</span></div></header>
		<div class="ss-progress"><BaseProgressBar :percent="percent" height=".45em"/><span>{{ percent }}%</span></div>
		<main class="ss-content"><div class="ss-caption">Маршруты участка</div><section class="ss-list"><BaseIsland v-for="route of area?.routes" :key="route.routeCode" class="ss-route" @click="openRoute(route.routeCode)"><div class="ss-route-heading"><div class="ss-route-icon"><BaseIcon name="mdi-transit-connection-variant"/></div><div><b>{{ route.routeCode }}</b><span>Не указано</span></div><em>{{ route.statistics.collectedReadings ? 'В работе' : 'Новый' }}</em></div><div class="ss-assignee">Не указано</div><div class="ss-meta"><span><BaseIcon name="mdi-account-group-outline"/>{{ route.statistics.subscriberCount }} аб.</span><span><BaseIcon name="mdi-map-marker-outline"/>{{ route.statistics.streetCount }} улиц</span><span><BaseIcon name="mdi-check-circle-outline"/>{{ route.statistics.collectedReadings }}/{{ route.statistics.subscriberCount }}</span></div><div class="ss-streets"><div v-for="street of route.streets" :key="street.street"><span>{{ street.street }}</span><span>{{ street.subscribers.length }} аб.</span></div></div><BaseProgressBar :percent="route.statistics.subscriberCount ? Math.round(route.statistics.collectedReadings / route.statistics.subscriberCount * 100) : 0" height=".4em"/></BaseIsland></section></main>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';

const route = useRoute();
const sectorId = String(route.params.id);
const store = useFieldworksStore();
const area = computed(() => store.areasData?.areas.find(item => item.areaCode === sectorId));
const collected = computed(() => area.value?.statistics.collectedReadings ?? 0);
const total = computed(() => collected.value + (area.value?.statistics.remainingReadings ?? 0));
const percent = computed(() => total.value ? Math.round(collected.value / total.value * 100) : 0);

onMounted(() => store.fetchAreas());

function openRoute(id: string) {
	navigateTo({ path: `/fieldworks/routes/${id}`, query: { sector: sectorId } });
}
</script>

<style lang="scss">
#sector-mobile-page { min-height: 100dvh; background: #f8fafc;
	.ss-header { display: flex; align-items: center; gap: .8em; padding: .8em 1em; background: #ffffff; border-bottom: 1px solid #e5e7eb; }.ss-header span { display: block; margin-top: .2em; color: #94a3b8; font-size: .72rem; }.ss-back { display: flex; padding: .55em; border: 0; border-radius: 50%; color: #475569; background: #f1f5f9; }.ss-total { margin-left: auto; text-align: right; color: #2563eb; }.ss-progress { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: .7em; padding: .65em 1em; background: #ffffff; font-size: .75rem; font-weight: 800; }
	.ss-content { padding: 1.2em 1em; }.ss-caption { margin-bottom: .8em; color: #94a3b8; font-size: .75rem; font-weight: 800; text-transform: uppercase; }.ss-list { display: grid; gap: .8em; }.ss-route { border: 1px solid #dbeafe; }.ss-route-heading { display: flex; align-items: center; gap: .7em; }.ss-route-heading b { display: block; color: #2563eb; font: 900 1.2rem ui-monospace, monospace; }.ss-route-heading span { color: #94a3b8; font-size: .75rem; }.ss-route-heading em { margin-left: auto; padding: .4em .7em; color: #2563eb; background: #eff6ff; border-radius: 1em; font-size: .72rem; font-style: normal; }.ss-route-icon { display: flex; align-items: center; justify-content: center; width: 2.8em; height: 2.8em; color: #ffffff; background: #2563eb; border-radius: .8em; }.ss-assignee { margin: .9em 0; padding: .75em; border-radius: .7em; background: #f8fafc; font-size: .8rem; }.ss-meta { display: flex; flex-wrap: wrap; gap: .6em; color: #475569; font-size: .78rem; }.ss-meta span { display: inline-flex; align-items: center; gap: .25em; }.ss-streets { margin: .85em 0; color: #64748b; font-size: .78rem; }.ss-streets div { display: flex; justify-content: space-between; gap: 1em; }.ss-streets div + div { margin-top: .35em; }
}
</style>
