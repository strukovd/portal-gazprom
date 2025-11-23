<template>
	<section class="create-issue-page">
		<section class="forms">
			<BaseTabs v-model="projectKey" autoselect :items="tabs"/>
			<form v-if="projectKey === 'NGV4'">
				<h2><BaseIcon name="mdi-account-outline"/> Информация о владельце объекта</h2>
				<BaseTextBox placeholder="Фамилия"/>
				<BaseTextBox placeholder="Имя"/>
				<BaseTextBox placeholder="Отчество"/>

				<h2><BaseIcon name="mdi-card-account-details-outline"/> Паспортные данные</h2>
				<BaseTextBox placeholder="ИНН"/>
				<BaseAutocomplete :items="[{ key: 'male', value: 'Мужской' }, { key: 'female', value: 'Женский' }]" placeholder="Пол"/>
				<BaseTextBox type="date" placeholder="Дата рождения"/>
				<BaseTextBox placeholder="Номер паспорта"/>
				<BaseTextBox type="date" placeholder="Дата выдачи"/>
				<BaseTextBox placeholder="Орган выдачи"/>
				<!-- Скан. паспорта -->

				<h2><BaseIcon name="mdi-phone-outline"/> Контактные данные</h2>
				<BaseTextBox placeholder="Электронный адрес"/>
				<BaseTextBox placeholder="Контактный номер"/>
				<BaseTextBox placeholder="WhatsApp номер"/>

				<h2><BaseIcon name="mdi-office-building-marker-outline"/> Информация об объекте газификации</h2>
				<BaseTextBox placeholder="Адрес"/>
				<!-- <BaseTextBox placeholder="Скан. тех. паспорта на дом"/> -->
				<BaseAutocomplete :items="[{ key: '', value: 'Плита' }, { key: '', value: 'Колет' }, { key: '', value: 'Газовая колонка' }]" placeholder="Планируемые газоиспользующие приборы"/>
				<BaseAutocomplete :items="[{ key: '', value: 'Отопление' }, { key: '', value: 'Горячее водоснабжение' }, { key: '', value: 'Пищеприготовление' }]" placeholder="Характер потребления газа"/>
				<div><label><input type="checkbox"> <span>Согласие на обработку персональных данных</span></label></div>

				<BaseButton prependIcon="mdi-content-save">Сохранить</BaseButton>
			</form>
			<form v-else-if="projectKey === 'PRV4'">
				<h2><BaseIcon name="mdi-account-outline"/> Информация о владельце объекта</h2>
				<BaseTextBox placeholder="Лицевой счет"/>
				<BaseTextBox placeholder="Фамилия"/>
				<BaseTextBox placeholder="Имя"/>
				<BaseTextBox placeholder="Отчество"/>

				<h2><BaseIcon name="mdi-card-account-details-outline"/> Паспортные данные</h2>
				<BaseTextBox placeholder="ИНН"/>
				<BaseAutocomplete :items="[{ key: 'male', value: 'Мужской' }, { key: 'female', value: 'Женский' }]" placeholder="Пол"/>
				<BaseTextBox type="date" placeholder="Дата рождения"/>
				<BaseTextBox placeholder="Номер паспорта"/>
				<BaseTextBox type="date" placeholder="Дата выдачи"/>
				<BaseTextBox placeholder="Орган выдачи"/>
				<!-- Скан. паспорта -->

				<h2><BaseIcon name="mdi-phone-outline"/> Контактные данные</h2>
				<BaseTextBox placeholder="Электронный адрес"/>
				<BaseTextBox placeholder="Контактный номер"/>
				<BaseTextBox placeholder="WhatsApp номер"/>

				<h2><BaseIcon name="mdi-office-building-marker-outline"/> Информация об объекте газификации</h2>
				<!-- <BaseTextBox placeholder="Скан. тех. паспорта на дом"/> -->

				<div><label><input type="checkbox"> <span>Согласие на обработку персональных данных</span></label></div>
				<div><label><input type="checkbox"> <span>Обновить данные абонента</span></label></div>

				<BaseButton prependIcon="mdi-content-save">Сохранить</BaseButton>
			</form>
		</section>
	</section>
</template>

<script lang="ts" setup>
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'authorized'
});

const { $api } = useNuxtApp();
import BaseButton from '~/components/common/BaseButton.vue';
import BaseIcon from '~/components/common/BaseIcon.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import type { IssueList } from '~/types/IssueList';
import BaseTabs from '~/components/common/BaseTabs.vue';
import BaseAutocomplete from '~/components/common/BaseAutocomplete.vue';

const userStore = useUserStore();
const appStore = useAppStore();

const tabs = [
	{ key: 'NGV4', caption: 'Новая газифиция', icon: 'mdi-file-document-plus-outline' },
	{ key: 'PRV4', caption: 'Перемонтаж', icon: 'mdi-file-document-multiple-outline' }
];
const projectKey = ref('');


async function fetchIssues() {
	const queryParams = {} as Record<string, string | number>;
	queryParams.page = 1;
	queryParams.size = 10;
	const token = userStore.token;

	if(!token) {
		console.error('No token');
		return;
	}

	if(search.value) queryParams.search = search.value;

	const data: IssueList = await $api('v1/portal/notes', {
		query: queryParams,
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		},
	});

	if(data.success) {
		const issues = data.data;
		const colors = [ '#0079C1', '#14cf34', '#e3ce31', ];

		issues.forEach((issue: any) => {
			const color = colors[Math.floor(Math.random() * colors.length)];
			issue.color = color;
		});

		appStore.issues = issues;
	}
}

</script>

<style lang="scss">
.create-issue-page {
	.forms {
		max-width: 800px;
		margin:2em auto;

		form {
			background-color: #fff;
			position: relative;
			padding: 3em 2em;
			border-radius: 6px;
			box-shadow: 0 6px 40px rgba(0,0,0,.05);

			>[class^="base-"] {
				margin-bottom:.8em;
			}
		}
	}
}
</style>
