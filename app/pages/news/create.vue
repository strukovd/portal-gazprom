<template>
	<section id="create-news-page">

		<section class="row-form col-8">
			<BaseIsland title="Форма создания новости" prepend-icon="mdi-newspaper-plus">
				<form class="form" @keyup.enter="sendForm" @submit.prevent="sendForm">
					<BaseTabs autoselect v-model="form.category" :items="[
						{ caption: 'Отлючение газа', key: 'gas-off', icon: 'mdi-fire' },
						{ caption: 'Газификация', key: 'gasification', icon: 'mdi-gas-cylinder' },
					]"/>

					<BaseTextBox v-model="form.title" label="Заголовок"/>
					<BaseTextBox v-model="form.coverage" label="Территориальный охват"/>
					<section>
						<BaseTextBox class="col-6" v-model="form.startDate" type="date" label="Дата начала"/>
						<BaseTextBox class="col-6" v-model="form.endDate" type="date" label="Дата окончания"/>
					</section>
					<BaseTextBox v-model="form.importance" label="Уровень важности"/>
					<BaseTextBox v-model="form.mainText" label="Основной текст"/>
					<BaseTextBox v-model="form.text" label="Текст для озвучивания абоненту"/>

					<BaseButton type="submit" color="primary">Создать</BaseButton>
				</form>
			</BaseIsland>
		</section>


	</section>
</template>

<script lang="ts" setup>
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import BaseAutocomplete from '~/components/common/base/BaseAutocomplete.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';

const form = reactive({}) as Record<string, string | number>;
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR', 'CALLCENTER'],
	layout: 'authorized'
});


const sendForm = () => {

}
</script>

<style lang="scss">
#create-news-page {

}
</style>
