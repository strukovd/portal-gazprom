<template>
	<section class="dashboard-page">
		<!-- <h2>Панель управления</h2>
		<h6>Актуальная информация для озвучивания абонентам при обращении</h6> -->
		<section class="quickSearch">

		</section>
		<section class="statistics" style="display:flex; gap:1em; flex-wrap:wrap; margin-top:1em;">
			<template v-for="(item, index) of [
				{ color: '#ee4444', icon: 'mdi-alert-circle-outline', value: '12', title: 'Открытых жалоб' },
				{ color: '#2563ea', icon: 'mdi-timer-outline', value: '4:32', title: 'Среднее время обработки' },
				{ color: '#17a34a', icon: 'mdi-counter', value: '87', title: 'Новые показания сегодня' },
				{ color: '#d87706', icon: 'mdi-newspaper', value: '6', title: 'Новостей за день' },
			]" :key="index">
				<div class="stat island" :style="{ '--color': item.color }" style="flex:1 1 auto; display:flex; flex-direction:column; align-items:center; gap:.5em; padding:1em; background:#fff; border:1px solid #e5e5e5; border-radius:8px; width:150px;">
					<div class="stat-icon" style="padding:1em; border-radius:50%; background-color:color-mix(in srgb, var(--color) 8%, #fff);"><BaseIcon :name="item.icon" size="24" style="color:var(--color);"/></div>
					<div class="stat-value" style="color:#171717; font-size:1.9em; font-weight:700;">{{ item.value }}</div>
					<div class="stat-title" style="color:#737373; font-size:.94rem; text-align: center;">{{ item.title }}</div>
				</div>
			</template>
		</section>
		<section>
			<BaseIsland title="Жалобы" prependIcon="mdi-alert-circle-outline">
				<div class="jl-issue">
					<div>Жалоба #12345</div>
					<div>Филиал: Бишкекгаз</div>
					<div class="issue-title">Проблема с показаниями</div>
					<div class="issue-description">Абонент жалуется на некорректные показания, которые отображаются в личном кабинете. Он утверждает, что его счетчик показывает другое значение, чем то, что указано в системе.</div>
				</div>
			</BaseIsland>
		</section>
		<section style="display:grid; gap:1em; flex-wrap:wrap;">
			<BaseIsland title="Срочные отключения газа" prependIcon="mdi-alert-octagon-outline" style="flex:1 1 300px;">
				<div class="jl-issue">
					<div>Отключение #12345</div>
					<div>Филиал: Бишкекгаз</div>
					<div class="issue-title">Плановое отключение</div>
					<div class="issue-description">Плановое отключение газа в связи с техническим обслуживанием. Ожидаемое время восстановления: 3 часа.</div>
				</div>
			</BaseIsland>
			<BaseIsland title="Изменения FAQ" prependIcon="mdi-help-circle-outline" style="flex:1 1 300px;">
				<div class="jl-issue">
					<div>Отключение #12345</div>
					<div>Филиал: Бишкекгаз</div>
					<div class="issue-title">Плановое отключение</div>
					<div class="issue-description">Плановое отключение газа в связи с техническим обслуживанием. Ожидаемое время восстановления: 3 часа.</div>
				</div>
			</BaseIsland>
		</section>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';

definePageMeta({
	// auth: true,
	// roles: ['ADMIN', 'MANAGER'],
	layout: 'sidebar'
});

const pages = [
	{
		title: 'Список заявок',
		description: 'Используется подрядчиками, для создания заявок и загрузки документов',
		link: '/issues',
		image: '/img/issues.webp'
	},
	{
		title: 'Абоненты',
		description: 'Используется опреторами, для просмотра сводений о абонентах и загрузки показаний',
		link: '/readings',
		image: '/img/readings.webp'
	}
];
</script>

<style lang="scss">
.dashboard-page {

}
</style>
