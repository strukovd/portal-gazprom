<template>
	<section class="create-issue-page">
		<section class="forms">
			<BaseTabs v-model="projectKey" autoselect :items="tabs"/>
			<section v-if="isCached" style="display:flex; justify-content:center; margin:1.4em;">
				<BaseButton prependIcon="mdi-file-document-alert-outline" @click="applyCache">Применить данные предыдущей заявки</BaseButton>
			</section>
			<form @submit.prevent="sendForm" v-if="projectKey === 'NGV4'">
				<h2><BaseIcon name="mdi-account-outline"/> Информация о владельце объекта</h2>
				<BaseTextBox name="surname" v-model="form['surname']" label="Фамилия"/>
				<BaseTextBox name="name" v-model="form['name']" label="Имя"/>
				<BaseTextBox name="lname" v-model="form['lname']" label="Отчество"/>

				<h2><BaseIcon name="mdi-office-building-marker-outline"/> Информация об объекте газификации</h2>
				<BaseTextBox v-model="form['addressOfGasification']" name="address" label="Адрес"/>
				<BaseFilePicker v-model="form['scanOfHousePassport']" label="Скан. тех. паспорта на дом"/>
				<BaseAutocomplete multiple v-model="form['plannedGasUsingDevices']" :items="[{ key: 'плита', value: 'Плита' }, { key: 'котел', value: 'Котел' }, { key: 'газовая колонка', value: 'Газовая колонка' }]" label="Планируемые газоиспользующие приборы"/>
				<BaseAutocomplete multiple v-model="form['gasConsumptionPattern']" :items="[{ key: 'отопление', value: 'Отопление' }, { key: 'горячее водоснабжение', value: 'Горячее водоснабжение' }, { key: 'пищеприготовление', value: 'Пищеприготовление' }]" label="Характер потребления газа"/>

				<h2><BaseIcon name="mdi-card-account-details-outline"/> Паспортные данные</h2>
				<BaseTextBox name="tin" mask="##############" v-model="form['inn']" label="ИНН"/>
				<BaseAutocomplete v-model="form['gender']" :items="[{ key: 'М', value: 'Мужской' }, { key: 'Ж', value: 'Женский' }]" label="Пол"/>
				<BaseTextBox name="birthdate" v-model="form['birthDate']" type="date" label="Дата рождения"/>
				<BaseTextBox name="passportNum" v-model="form['passportNum']" label="Номер паспорта"/>
				<BaseTextBox name="issueDate" v-model="form['passportIssuedDate']" type="date" label="Дата выдачи"/>
				<BaseTextBox name="issuedBy" v-model="form['passportIssuedBy']" label="Орган выдачи"/>
				<BaseFilePicker v-model="form['scanOfPassport']" multiple label="Скан. паспорта с лицевой и обратной стороны"/>
				<!-- <BaseFileMultiPicker v-model="form['scanOfPassport']" label="Скан. паспорта с лицевой и обратной стороны"/> -->

				<h2><BaseIcon name="mdi-phone-outline"/> Контактные данные</h2>
				<BaseTextBox name="email" v-model="form['email']" label="Электронный адрес"/>
				<BaseTextBox name="phone" mask="+996#########" v-model="form['contactNumber']" label="Контактный номер"/>
				<BaseTextBox name="whatsapp" mask="+996#########" v-model="form['whatsappNumber']" label="WhatsApp номер"/>

				<BaseFilePicker v-model="form['scanOfAgreement']" label="Скан. заявления о согласии на обработку ПД"/>
				<div><label><input v-model="form['agreement']" type="checkbox"> <span>Согласие на обработку персональных данных</span></label></div>
				<div style="display:flex; justify-content:center; margin-top:1.4em;">
					<BaseButton @click="sendForm" style="font-size:1.2em;" prependIcon="mdi-content-save">Сохранить</BaseButton>
				</div>
			</form>
			<form v-else-if="projectKey === 'PRV4'">
				<h2><BaseIcon name="mdi-account-outline"/> Информация о владельце объекта</h2>
				<BaseTextBox name="account" v-model="form['account']" label="Лицевой счет"/>
				<BaseTextBox name="surname" v-model="form['surname']" label="Фамилия"/>
				<BaseTextBox name="name" v-model="form['name']" label="Имя"/>
				<BaseTextBox name="lname" v-model="form['lname']" label="Отчество"/>

				<h2><BaseIcon name="mdi-office-building-marker-outline"/> Информация об объекте газификации</h2>
				<BaseFilePicker v-model="form['scanOfHousePassport']" label="Скан. тех. паспорта на дом"/>

				<h2><BaseIcon name="mdi-card-account-details-outline"/> Паспортные данные</h2>
				<BaseTextBox name="tin" v-model="form['inn']" label="ИНН"/>
				<BaseAutocomplete v-model="form['gender']" :items="[{ key: 'М', value: 'Мужской' }, { key: 'Ж', value: 'Женский' }]" label="Пол"/>
				<BaseTextBox name="birthdate" v-model="form['birthDate']" type="date" label="Дата рождения"/>
				<BaseTextBox name="passportNum" v-model="form['passportNum']" label="Номер паспорта"/>
				<BaseTextBox name="issueDate" v-model="form['passportIssuedDate']" type="date" label="Дата выдачи"/>
				<BaseTextBox name="issuedBy" v-model="form['passportIssuedBy']" label="Орган выдачи"/>
				<BaseFilePicker v-model="form['scanOfPassport']" multiple label="Скан. паспорта с лицевой и обратной стороны"/>
				<!-- <BaseFileMultiPicker v-model="form['scanOfPassport']" label="Скан. паспорта с лицевой и обратной стороны"/> -->

				<h2><BaseIcon name="mdi-phone-outline"/> Контактные данные</h2>
				<BaseTextBox name="email" v-model="form['email']" label="Электронный адрес"/>
				<BaseTextBox name="phone" mask="+996(###)### ###" v-model="form['contactNumber']" label="Контактный номер"/>
				<BaseTextBox name="whatsapp" mask="+996(###)### ###" v-model="form['whatsappNumber']" label="WhatsApp номер"/>

				<BaseFilePicker v-model="form['scanOfAgreement']" label="Скан. заявления о согласии на обработку ПД"/>
				<div><label><input v-model="form['agreement']" type="checkbox"> <span>Согласие на обработку персональных данных</span></label></div>
				<div><label><input v-model="form['updateData']" type="checkbox"> <span>Обновить данные абонента</span></label></div>

				<div style="display:flex; justify-content:center; margin-top:1.4em;">
					<BaseButton @click="sendForm" style="font-size:1.2em;" prependIcon="mdi-content-save">Сохранить</BaseButton>
				</div>
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
// import BaseFileMultiPicker from '~/components/common/BaseFileMultiPicker.vue';
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
const isCached = ref(false);

onMounted(() => {
	if( localStorage.getItem('form') ) {
		isCached.value = true;
	}
});

function applyCache() {
	const cachedFormString = localStorage.getItem('form');
	if( !cachedFormString ) return;

	const cachedForm = JSON.parse(cachedFormString) as Record<string, any>;
	Object.keys(cachedForm).forEach(key => {
		form[key] = cachedForm[key];

	});
};

async function sendForm() {
	localStorage.setItem('form', JSON.stringify(form));

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
	const dateFields = ['birthDate', 'passportIssuedDate'];
	Object.keys(form).forEach(fieldKey => {
		if(fileFields.includes(fieldKey) || multiselectFields.includes(fieldKey) || dateFields.includes(fieldKey)) return;
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

	dateFields.forEach(fieldKey => {
		formData.append(fieldKey, String(form[fieldKey]).replace(/(\d{4})\-(\d{2})\-(\d{2})/g, '$3-$2-$1') );
	});

	try {
		errorMessage.value = '';
		const data = await $api('v1/applications', {
			query: queryParams,
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: formData
		});
		console.log(data);
	} catch (err: any) {
		const msg = err?.data?.message || err?.message || 'Не удалось отправить заявку';
		errorMessage.value = msg;
		console.error(err);
	}


	// $api('v1/applications', {
	// 	query: queryParams,
	// 	method: 'POST',
	// 	headers: {
	// 		Authorization: `Bearer ${token}`
	// 	},
	// 	body: formData
	// })
	// 	.then(async (res: any) => {
	// 		// Явно обрабатываем не-OK статусы, чтобы в catch приходил осмысленный объект
	// 		if(!res.ok) {
	// 			const payload = await res.json().catch(() => null);
	// 			throw { status: res.status, data: payload };
	// 		}
	// 		return res.json();
	// 	})
	// 	.then((data: any) => {
	// 		console.log(data);
	// 	})
	// 	.catch(err => {
	// 		const msg = err?.data?.message || err?.message || 'Не удалось отправить заявку';
	// 		errorMessage.value = msg;
	// 		console.error(err);
	// 	});

	navigateTo('/issues');
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

			.caption {
				// font-size:1em;
				opacity:.6;
				font-weight:400;
			}
		}
	}
}
</style>
