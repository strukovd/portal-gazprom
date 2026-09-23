<template>
	<section id="subscriber-mobile-page">
		<header class="sbm-header"><button class="sbm-back" @click="navigateTo(backLink)"><BaseIcon name="mdi-arrow-left"/></button><div><b>{{ subscriber?.fullName || 'Не указано' }}</b><span>Л/с {{ subscriber?.accountNo ?? subscriberId }}</span></div><em>{{ subscriber?.status || 'Не указано' }}</em></header>
		<div class="sbm-address"><BaseIcon name="mdi-map-marker-outline"/>{{ subscriber?.addressText || 'Не указано' }}</div>
		<main v-if="subscriber" class="sbm-content"><section class="sbm-cards"><BaseIsland><h2><BaseIcon name="mdi-gauge"/>Данные счётчика</h2><div class="sbm-grid"><div><span>Номер</span><b>{{ subscriber.meterSerial || 'Не указано' }}</b></div><div><span>Модель</span><b>{{ subscriber.meterModel || 'Не указано' }}</b></div><div><span>Мощность</span><b>Не указано</b></div><div><span>№ пломбы</span><b>Не указано</b></div></div></BaseIsland><BaseIsland><h2><BaseIcon name="mdi-wallet-outline"/>Финансы</h2><div class="sbm-grid"><div><span>Сальдо - Газ</span><b>{{ subscriber.debtGas ?? 'Не указано' }}</b></div><div><span>Сальдо - Пеня</span><b>{{ subscriber.penalty ?? 'Не указано' }}</b></div><div><span>Последняя оплата</span><b>{{ subscriber.lastPayment || 'Не указано' }}</b></div><div><span>Предыдущее</span><b>{{ subscriber.reading ?? 'Не указано' }} м³</b></div></div></BaseIsland></section><BaseIsland class="sbm-reading"><h2><BaseIcon name="mdi-gauge"/>Ввод текущего показания</h2><div class="sbm-previous"><span>Предыдущее</span><b>{{ subscriber.reading ?? 'Не указано' }} м³</b></div><BaseButton :disabled="subscriber.status !== 'Не передано'" prependIcon="mdi-pencil-outline" @click="openReading">Ввести показание</BaseButton></BaseIsland></main>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';

const route = useRoute();
const subscriberId = String(route.params.id);
const routeId = typeof route.query.route === 'string' ? route.query.route : '';
const sectorId = typeof route.query.sector === 'string' ? route.query.sector : '';
const store = useFieldworksStore();
const { $modal } = useNuxtApp();
const subscriber = computed(() => store.areasData?.areas.flatMap(area => area.routes).flatMap(item => item.streets).flatMap(item => item.subscribers).find(item => item.accountNo === subscriberId));
const backLink = computed(() => routeId ? { path: `/fieldworks/routes/${routeId}`, query: sectorId ? { sector: sectorId } : {} } : '/fieldworks/sectors');

onMounted(() => store.fetchAreas());
async function openReading() { if (subscriber.value && await $modal.show('FieldworkReading', { payload: { subscriber: subscriber.value } })) store.fetchAreas(true); }
</script>

<style lang="scss">
#subscriber-mobile-page { min-height:100dvh; background:#f8fafc;
	.sbm-header { display:flex; align-items:center; gap:.8em; padding:.8em 1em; background:#ffffff; border-bottom:1px solid #e5e7eb; }.sbm-header span { display:block; margin-top:.2em; color:#2563eb; font:.75rem ui-monospace,monospace; }.sbm-back { display:flex; padding:.55em; border:0; border-radius:50%; background:#f1f5f9; }.sbm-header em { margin-left:auto; padding:.4em .6em; color:#ea580c; background:#fff7ed; border-radius:1em; font-size:.7rem; font-style:normal; }.sbm-address { display:flex; align-items:center; gap:.4em; padding:.75em 1em; color:#64748b; background:#fff7ed; font-size:.8rem; }.sbm-content { display:grid; gap:1em; padding:1em; }.sbm-cards { display:grid; gap:1em; }.sbm-cards h2, .sbm-reading h2 { display:flex; align-items:center; gap:.5em; margin:0 0 1em; color:#0f172a; font-size:1rem; }.sbm-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1em; }.sbm-grid span { display:block; color:#94a3b8; font-size:.7rem; }.sbm-grid b { display:block; margin-top:.3em; font-size:.82rem; }.sbm-previous { display:flex; justify-content:space-between; margin-bottom:1em; padding:.9em; background:#f8fafc; border-radius:.8em; }.sbm-reading .base-button { width:100%; justify-content:center; }
}
</style>
