<template>
	<div class="reading-modal">
		<main class="content">
			<section class="summary">
				<!-- <div class="item">
					<div class="label">Лицевой счет</div>
					<div class="value">{{ payload?.account || 'Не указан' }}</div>
				</div> -->
				<div class="item">
					<div class="label">Предыдущие показания</div>
					<div class="value">{{ previousReadingText }}</div>
					<div v-if="payload?.previousReadingDate" class="hint">{{ formatDateTime(payload.previousReadingDate) }}</div>
				</div>
			</section>

			<section class="form">
				<BaseTextBox v-model="reading" autofocus label="Новое показание, м³" placeholder="Введите текущее показание" prependIcon="mdi-counter" @submit="sendReading"/>
				<div v-if="consumption !== null" class="consumption">
					Расход: <b>{{ consumption }} м³</b>
				</div>
			</section>

			<InfoBox v-if="message.type" :type="message.type" :title="message.title" :message="message.text"/>
		</main>

		<footer class="footer">
			<section>
				<h3>Предпросмотр результата</h3>
				<div class="preview">
					<section class="col-6">
						<div class="item">
							<div class="label">Расчет потребления</div>
							<div>{{ consumption }}</div>
						</div>
						<div class="item">
							<div class="label">Тариф</div>
							<div>{{ consumption }}</div>
						</div>
					</section>
					<section class="col-6">
						<div class="item">
							<div class="label">Расчет потребления</div>
							<div>{{ consumption }}</div>
						</div>
						<div class="item">
							<div class="label">Сумма потребления</div>
							<div>{{ consumption }}</div>
						</div>
					</section>
				</div>
			</section>
			<div class="buttons">
				<BaseButton prependIcon="mdi-check" :disabled="loading" @click="sendReading">{{ loading ? 'Отправка...' : 'Отправить' }}</BaseButton>
				<BaseButton prependIcon="mdi-close" :disabled="loading" @click="close()" variant="secondary">Закрыть</BaseButton>
			</div>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import { formatDateTime } from '~/utils/format';
import BaseButton from '../common/base/BaseButton.vue';
import BaseTextBox from '../common/base/BaseTextBox.vue';
import InfoBox from '../common/InfoBox.vue';

type MessageType = '' | 'info' | 'error' | 'warning' | 'protect' | 'success';
type Payload = {
	account?: string;
	previousReading?: number | null;
	previousReadingDate?: string | null;
}

const props = defineProps<{
	payload?: Payload
}>();

const { $fetchPortal, $flags } = useNuxtApp();
const accountStore = useAccountStore();
const reading = ref('');
const loading = ref(false);
const message = reactive({
	type: '' as MessageType,
	title: '',
	text: '',
});


const previousReadingText = computed(() => {
	return props.payload?.previousReading === null || props.payload?.previousReading === undefined
		? 'Не указаны'
		: `${props.payload.previousReading} м³`;
});

const readingNumber = computed(() => {
	if (!/^\d+$/.test(reading.value.trim())) return null;
	return Number(reading.value);
});

const consumption = computed(() => {
	if (readingNumber.value === null || props.payload?.previousReading === null || props.payload?.previousReading === undefined) return null;
	return readingNumber.value - props.payload.previousReading;
});


async function sendReading() {
	if (loading.value) return;

	message.type = '';

	if (!validate()) return;

	loading.value = true;

	try {
		await $fetchPortal('v1/portal/readings', {
			method: 'POST',
			body: {
				account: props.payload?.account,
				reading: readingNumber.value,
			}
		});

		// const res = await accountStore.fetchAccountData<{
		// 	consumption: number;
		// 	created: string;
		// 	id: number;
		// 	payAmount: number;
		// 	reading: number;
		// 	tariff: number;
		// }>({ force: true });
		showMsg('success', 'Показания приняты', '');
	}
	catch (error: any) {
		const data = error?.data || error?.response?._data;
		const text = data?.message || data?.error || data?.detail || error?.statusMessage || error?.message;

		showMsg(
			'error',
			'Не удалось отправить показания',
			Array.isArray(text) ? text.join('\n') : (text || 'Проверьте данные и попробуйте ещё раз.')
		);
	}
	finally {
		loading.value = false;
	}
}

function validate() {
	if (!props.payload?.account) {
		showMsg('error', 'Не указан лицевой счет', 'Закройте окно и попробуйте открыть приём показаний из карточки абонента.');
		return false;
	}

	if (!reading.value.trim()) {
		showMsg('error', 'Введите показание', 'Поле нового показания не должно быть пустым.');
		return false;
	}

	if (readingNumber.value === null) {
		showMsg('error', 'Показание должно быть числом', 'Используйте только целые числа без пробелов и символов.');
		return false;
	}

	if (readingNumber.value < 0) {
		showMsg('warning', 'Показание не может быть отрицательным', 'Введите значение счетчика больше или равное нулю.');
		return false;
	}

	if (consumption.value !== null && consumption.value < 0) {
		showMsg('warning', 'Показание меньше предыдущего', `Новое показание не может быть меньше ${props.payload?.previousReading} м³.`);
		return false;
	}

	return true;
}

function showMsg(type: MessageType, title: string, text: string) {
	message.type = type;
	message.title = title;
	message.text = text;
}

function close(result = false) {
	const appStore = useAppStore();
	const modal = appStore?.modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.reading-modal {
	min-width: 520px;

	.content {
		display: flex;
		flex-direction: column;
		gap: 1em;
		padding: 0 0 1.4em 0;

		.summary {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: .75em;

			.item {
				padding: .9em 1em;
				border: 1px solid #dbe5f7;
				border-radius: 8px;
				background: #f8fafc;

				.label {
					color: #64748b;
					font-size: .78rem;
				}

				.value {
					margin-top: .2em;
					color: #111827;
					font-size: 1.25rem;
					font-weight: 700;
				}

				.hint {
					margin-top: .2em;
					color: #64748b;
					font-size: .78rem;
				}
			}
		}

		.form {
			.consumption {
				margin-top: .5em;
				color: #2563ea;
				font-size: .9rem;
			}
		}
	}

	.footer {
		.buttons {
			display: flex;
			justify-content: flex-end;
			gap: .5em;
		}
	}
}
</style>
