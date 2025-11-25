<template>
	<section class="create-issue-page">
		<section class="forms">
			<BaseTabs v-model="projectKey" autoselect :items="tabs"/>
			<form @submit.prevent="sendForm" v-if="projectKey === 'NGV4'">
				<h2><BaseIcon name="mdi-account-outline"/> Информация о владельце объекта</h2>
				<BaseTextBox name="surname" v-model="form['surname']" placeholder="Фамилия"/>
				<BaseTextBox name="name" v-model="form['name']" placeholder="Имя"/>
				<BaseTextBox name="lname" v-model="form['lname']" placeholder="Отчество"/>

				<h2><BaseIcon name="mdi-office-building-marker-outline"/> Информация об объекте газификации</h2>
				<BaseTextBox name="address" placeholder="Адрес"/>
				<BaseFilePicker v-model="form['scanOfHousePassport']" label="Скан. тех. паспорта на дом"/>
				<BaseAutocomplete multiple v-model="form['plannedGasUsingDevices']" :items="[{ key: 'плита', value: 'Плита' }, { key: 'колет', value: 'Колет' }, { key: 'газовая колонка', value: 'Газовая колонка' }]" placeholder="Планируемые газоиспользующие приборы"/>
				<BaseAutocomplete multiple v-model="form['gasConsumptionPattern']" :items="[{ key: 'отопление', value: 'Отопление' }, { key: 'горячее водоснабжение', value: 'Горячее водоснабжение' }, { key: 'pis', value: 'Пищеприготовление' }]" placeholder="Характер потребления газа"/>

				<h2><BaseIcon name="mdi-card-account-details-outline"/> Паспортные данные</h2>
				<BaseTextBox name="tin" v-model="form['inn']" placeholder="ИНН"/>
				{{ form['inn'] }}
				<BaseAutocomplete v-model="form['gender']" :items="[{ key: 'M', value: 'Мужской' }, { key: 'F', value: 'Женский' }]" placeholder="Пол"/>
				<BaseTextBox name="birthdate" v-model="form['birthDate']" type="date" placeholder="Дата рождения"/>
				<BaseTextBox name="passportNum" v-model="form['passportNum']" placeholder="Номер паспорта"/>
				<BaseTextBox name="issueDate" v-model="form['passportIssuedDate']" type="date" placeholder="Дата выдачи"/>
				<BaseTextBox name="issuedBy" v-model="form['passportIssuedBy']" placeholder="Орган выдачи"/>

				<h2><BaseIcon name="mdi-phone-outline"/> Контактные данные</h2>
				<BaseTextBox name="email" v-model="form['email']" placeholder="Электронный адрес"/>
				<BaseTextBox name="phone" v-model="form['contactNumber']" placeholder="Контактный номер"/>
				<BaseTextBox name="whatsapp" v-model="form['whatsappNumber']" placeholder="WhatsApp номер"/>

				<div><label><input v-model="form['agreement']" type="checkbox"> <span>Согласие на обработку персональных данных</span></label></div>
				<BaseButton @click="sendForm" prependIcon="mdi-content-save">Сохранить</BaseButton>
			</form>
			<form v-else-if="projectKey === 'PRV4'">
				<h2><BaseIcon name="mdi-account-outline"/> Информация о владельце объекта</h2>
				<BaseTextBox name="account" v-model="form['account']" placeholder="Лицевой счет"/>
				<BaseTextBox name="surname" v-model="form['surname']" placeholder="Фамилия"/>
				<BaseTextBox name="name" v-model="form['name']" placeholder="Имя"/>
				<BaseTextBox name="lname" v-model="form['lname']" placeholder="Отчество"/>

				<h2><BaseIcon name="mdi-office-building-marker-outline"/> Информация об объекте газификации</h2>
				<BaseFilePicker v-model="form['scanOfHousePassport']" label="Скан. тех. паспорта на дом"/>

				<h2><BaseIcon name="mdi-card-account-details-outline"/> Паспортные данные</h2>
				<BaseTextBox name="tin" v-model="form['inn']" placeholder="ИНН"/>
				<BaseAutocomplete v-model="form['gender']" :items="[{ key: 'M', value: 'Мужской' }, { key: 'F', value: 'Женский' }]" placeholder="Пол"/>
				<BaseTextBox name="birthdate" v-model="form['birthDate']" type="date" placeholder="Дата рождения"/>
				<BaseTextBox name="passportNum" v-model="form['passportNum']" placeholder="Номер паспорта"/>
				<BaseTextBox name="issueDate" v-model="form['passportIssuedDate']" type="date" placeholder="Дата выдачи"/>
				<BaseTextBox name="issuedBy" v-model="form['passportIssuedBy']" placeholder="Орган выдачи"/>

				<h2><BaseIcon name="mdi-phone-outline"/> Контактные данные</h2>
				<BaseTextBox name="email" v-model="form['email']" placeholder="Электронный адрес"/>
				<BaseTextBox name="phone" v-model="form['contactNumber']" placeholder="Контактный номер"/>
				<BaseTextBox name="whatsapp" v-model="form['whatsappNumber']" placeholder="WhatsApp номер"/>

				<div><label><input v-model="form['agreement']" type="checkbox"> <span>Согласие на обработку персональных данных</span></label></div>
				<div><label><input v-model="form['updateData']" type="checkbox"> <span>Обновить данные абонента</span></label></div>

				<BaseButton prependIcon="mdi-content-save">Сохранить</BaseButton>
			</form>

			<div v-if="errorMessage" class="error" style="margin-top:1em; color:red;">{{ errorMessage }}</div>
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
import BaseTabs from '~/components/common/BaseTabs.vue';
import BaseAutocomplete from '~/components/common/BaseAutocomplete.vue';
import BaseFilePicker from '~/components/common/BaseFilePicker.vue'
import type { Reactive } from 'vue';

const userStore = useUserStore();
const appStore = useAppStore();

const tabs = [
	{ key: 'NGV4', caption: 'Новая газифиция', icon: 'mdi-file-document-plus-outline' },
	{ key: 'PRV4', caption: 'Перемонтаж', icon: 'mdi-file-document-multiple-outline' }
];
const projectKey = ref('');
const form = reactive({}) as Reactive<Record<string, any>>;
const errorMessage = ref('');

async function sendForm() {
	const queryParams = {} as Record<string, string | number>;
	const token = userStore.token;
	if(!token) {
		console.error('No token');
		return;
	}

	const formData = new FormData();
	formData.append('key', projectKey.value);
	const fileFields = ['scanOfHousePassport'];
	const multiselectFields = ['plannedGasUsingDevices', 'gasConsumptionPattern'];
	Object.keys(form).forEach(fieldKey => {
		if(fileFields.includes(fieldKey) || multiselectFields.includes(fieldKey)) return;
		formData.append(fieldKey, form[fieldKey]);
	});

	multiselectFields.forEach(fieldKey => {
		String(form[fieldKey]).split(',').forEach(value => {
			formData.append(fieldKey, value);
		});
	});

	fileFields.forEach(fieldKey => {
		formData.append('files', form[fieldKey]);
	});



	// https://api.gazprom.kg/api/v1/applications
	$api('v1/applications', {
		query: queryParams,
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`
		},
		body: formData
	})
		.then((res: any) => {
			return res.json();
		})
		.then((data: any) => {
			console.log(data);
		})
		.catch(err => {
			errorMessage.value = err.data.message;
			console.error(err);
		});
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
