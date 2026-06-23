<template>
	<div class="news-modal">
		<form class="form" @submit.prevent="sendForm">
			<div class="field">
				<label>Категория</label>
				<BaseTabs v-model="currentCategory" :items="categories"/>
			</div>

			<section>
				<BaseAutocomplete class="col-6" autoselect v-model="form.categoryType" :items="subCategories" label="Подкатегория"/>
				<BaseAutocomplete class="col-6" autoselect v-model="form.branch" :items="branches" label="Филиал"/>
			</section>

			<BaseTextBox v-model="form.title" autofocus prependIcon="mdi-format-title" label="Заголовок"/>

			<section>
				<BaseTextBox class="col-6" v-model="form.startDate" type="date" label="Дата начала"/>
				<BaseTextBox class="col-6" v-model="form.endDate" type="date" label="Дата окончания"/>
			</section>

			<div class="field">
				<label>Уровень важности</label>
				<BaseTabs v-model="form.urgencyLevel" :items="urgencyLevels"/>
			</div>

			<BaseMemo v-model="form.text" height="110px" resize="vertical" label="Основной текст" placeholder="Введите текст новости"/>
			<BaseMemo v-model="form.textForClient" height="90px" resize="vertical" label="Текст для озвучивания абоненту" placeholder="Введите текст для оператора"/>

			<InfoBox v-if="errorMessage" type="error" title="Не удалось создать новость" :message="errorMessage"/>

			<footer class="footer">
				<BaseButton prependIcon="mdi-check" :disabled="loading" @click="sendForm">
					{{ loading ? 'Создание...' : 'Создать новость' }}
				</BaseButton>
				<BaseButton prependIcon="mdi-close" variant="secondary" :disabled="loading" @click="close(false)">Отмена</BaseButton>
			</footer>
		</form>
	</div>
</template>

<script lang="ts" setup>
import type { NewsCreatePayload } from '~/types/CallGas';
import BaseAutocomplete from '../common/base/BaseAutocomplete.vue';
import BaseButton from '../common/base/BaseButton.vue';
import BaseMemo from '../common/base/BaseMemo.vue';
import BaseTabs from '../common/base/BaseTabs.vue';
import BaseTextBox from '../common/base/BaseTextBox.vue';
import InfoBox from '../common/InfoBox.vue';

const categories = [
	{ key: 'DISCONNECTION', value: 'Отключение газа', icon: 'mdi-fire-off', sub: [
		{ key: 'EMERGENCY', value: 'Аварийное' },
		{ key: 'PLANNED', value: 'Планово-ремонтные' },
	] },
	{ key: 'GASIFICATION', value: 'Газификация', icon: 'mdi-gas-burner', sub: [
		{ key: 'STANDARD', value: 'Стандартный' },
		{ key: 'OZP', value: 'Режим ОЗП' },
		{ key: 'HOLIDAY', value: 'Праздничный режим' },
	] },
	{ key: 'OFFICES', value: 'Офисы', icon: 'mdi-office-building', sub: [
		{ key: 'WHITE_DOTS', value: 'Белые пятна' },
		{ key: 'INVESTMENT_PROGRAM', value: 'Инвестпрограмма' },
	] },
	{ key: 'FAQ', value: 'FAQ', icon: 'mdi-help-circle', sub: [
		{ key: 'FAQ_ANY', value: 'Все' },
	] },
];
const branches = [
	{ key: 'BISHKEK', value: 'Бишкекгаз' },
	{ key: 'CHUI', value: 'Чуйгаз' },
	{ key: 'OSH', value: 'Ошгаз' },
	{ key: 'JALALABAD', value: 'Жалал-Абадгаз' },
];
const urgencyLevels = [
	{ key: 'NORMAL', value: 'Обычный', icon: 'mdi-dots-circle' },
	{ key: 'MIDDLE', value: 'Средний', icon: 'mdi-chevron-double-up' },
	{ key: 'HIGH', value: 'Высокий', icon: 'mdi-alert-octagon' },
];

const { $fetchCallGas, $flags } = useNuxtApp();
const currentCategory = ref('DISCONNECTION');
const subCategories = computed(() => categories.find(category => category.key === currentCategory.value)?.sub || []);
const loading = ref(false);
const errorMessage = ref('');
const form = reactive<NewsCreatePayload>({
	title: '',
	text: '',
	textForClient: '',
	categoryType: 'EMERGENCY',
	branch: 'BISHKEK',
	urgencyLevel: 'NORMAL',
	startDate: new Date().toISOString().slice(0, 10),
	endDate: '',
});

watch(currentCategory, () => {
	form.categoryType = (subCategories.value[0]?.key || '') as NewsCreatePayload['categoryType'];
});

async function sendForm() {
	if (loading.value) return;

	errorMessage.value = '';
	if (!form.title.trim() || !form.text.trim()) {
		errorMessage.value = 'Заполните заголовок и основной текст новости.';
		return;
	}
	if (form.endDate && form.endDate < form.startDate) {
		errorMessage.value = 'Дата окончания не может быть раньше даты начала.';
		return;
	}

	loading.value = true;
	try {
		await $fetchCallGas('/news', { method: 'POST', body: form });
		$flags.success('Новость создана');
		close(true);
	}
	catch (error: any) {
		const data = error?.data || error?.response?._data;
		const message = data?.message || data?.error || data?.detail || error?.message;
		errorMessage.value = Array.isArray(message) ? message.join('\n') : (message || 'Проверьте данные и попробуйте ещё раз.');
	}
	finally {
		loading.value = false;
	}
}

function close(result: boolean) {
	const modal = useAppStore().modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.news-modal {
	width: min(720px, 82vw);
	max-height: calc(90vh - 5em);
	overflow-y: auto;
	padding:0 .3em;

	.form {
		display: grid;
		gap: 1em;

		.field {
			display: grid;
			gap: .4em;

			> label {
				color: #4b5563;
				font-size: .82rem;
				font-weight: 700;
			}
		}

		.row {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1em;
		}

		.footer {
			display: flex;
			justify-content: flex-end;
			gap: .5em;
			padding-top: .4em;
		}
	}

	@media (max-width: 700px) {
		width: 100%;

		.form {
			.row {
				grid-template-columns: 1fr;
			}

			.footer {
				display: grid;
			}
		}
	}
}
</style>
