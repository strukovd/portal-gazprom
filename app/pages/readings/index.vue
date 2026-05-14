<template>
	<section id="readings-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Показания счётчика' }]"/>
		<h2>Приём показаний</h2>

		<section class="" style="gap:.8em;">
			<section class="col-7">
				<BaseIsland title="Выбор абонента" prependIcon="mdi-account-box">

				</BaseIsland>
				<BaseIsland title="Данные счётчика и показания" prependIcon="mdi-counter">

				</BaseIsland>
				<BaseIsland title="Предпросмотр результата" prependIcon="mdi-eye-circle-outline">

				</BaseIsland>
			</section>
			<section class="col-5">
				<BaseIsland title="Статистика показаний" prependIcon="mdi-finance">

				</BaseIsland>
				<BaseIsland title="Проверка на ошибки" prependIcon="mdi-alert-circle-outline">

				</BaseIsland>
				<BaseIsland title="Журнал последних действий" prependIcon="mdi-history">

				</BaseIsland>
			</section>
		</section>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'sidebar'
});
</script>

<style lang="scss">
#readings-page {
	
}
</style>
