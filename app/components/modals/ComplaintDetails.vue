<template>
	<div v-if="complaint" class="complaint-details">
		<main class="cd-content">
			<section class="cd-summary">
				<div class="cd-box">
					<div class="cd-label">Абонент</div>
					<div class="cd-value">{{ complaint.subscriberName || 'Не указан' }}</div>
					<div class="cd-hint">ЛС: {{ complaint.account || 'не указан' }}</div>
				</div>

				<div class="cd-box">
					<div class="cd-label">Телефон</div>
					<div class="cd-value">{{ complaint.contactNumber || 'Не указан' }}</div>
					<div class="cd-hint">{{ complaint.branchName || 'Филиал не указан' }}</div>
				</div>
			</section>

			<section class="cd-address">
				<BaseIcon class="cd-address-icon" name="mdi-map-marker-outline" size="20"/>
				<div class="cd-address-text">{{ addressText }}</div>
			</section>

			<section>
				<BaseTextBox v-model="complaint.subject" label="Тема обращения" disabled/>
				<BaseTextBox v-model="form.contactNumber" type="tel" prependIcon="mdi-phone-outline" label="Телефон" :disabled="!editMode"/>
			</section>

			<section>
				<BaseTextBox class="col-6" v-if="!editMode" v-model="form.urgencyLevel" label="Уровень срочности" disabled/>
				<BaseTabs class="col-6" v-else v-model="form.urgencyLevel" label="Уровень срочности" :items="urgencyTabs"/>

				<BaseTextBox class="col-6" v-if="!editMode" v-model="form.status" label="Статус" disabled/>
				<BaseTabs class="col-6" v-else v-model="form.status" label="Статус" :items="statusTabs"/>
			</section>

			<BaseMemo v-model="form.description" label="Описание жалобы" height="96px" resize="vertical" :disabled="!editMode"/>
			<BaseMemo v-model="answer" label="Ответ абоненту" height="120px" resize="vertical" placeholder="Введите текст ответа абоненту..."/>

			<InfoBox v-if="message.type" :type="message.type" :title="message.title" :message="message.text"/>
		</main>

		<footer class="cd-footer">
			<template v-if="editMode">
				<BaseButton prependIcon="mdi-content-save-outline" :disabled="loading" @click="saveComplaint()">
					{{ loading ? 'Сохранение...' : 'Сохранить' }}
				</BaseButton>
				<BaseButton prependIcon="mdi-close" :disabled="loading" variant="secondary" @click="cancelEdit">Отмена</BaseButton>
			</template>
			<template v-else>
				<BaseButton prependIcon="mdi-send" @click="sendAnswer">Отправить ответ</BaseButton>
				<BaseButton v-if="userStore.isPrivilegedUser" prependIcon="mdi-pencil-outline" variant="secondary" @click="startEdit">Редактировать</BaseButton>
			</template>
			<div class="cd-spacer"></div>
			<BaseButton v-if="userStore.isPrivilegedUser" prependIcon="mdi-delete-outline" :disabled="loading" variant="secondary" color="#dc2626" @click="deleteComplaint">
				{{ confirmDelete ? 'Подтвердить удаление' : 'Удалить' }}
			</BaseButton>
			<BaseButton prependIcon="mdi-close" :disabled="loading" variant="secondary" @click="close(false)">Закрыть</BaseButton>
			<BaseButton v-if="userStore.isPrivilegedUser" prependIcon="mdi-check-circle-outline" :disabled="loading || form.status === 'Закрыто'" color="#32bf69" @click="closeComplaint">
				Закрыть жалобу
			</BaseButton>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '../common/base/BaseButton.vue';
import BaseIcon from '../common/base/BaseIcon.vue';
import BaseMemo from '../common/base/BaseMemo.vue';
import BaseTabs from '../common/base/BaseTabs.vue';
import BaseTextBox from '../common/base/BaseTextBox.vue';
import InfoBox from '../common/InfoBox.vue';
import { complaints, type ComplaintsPayload, type ComplaintsPutBody } from '~/services/complaints';

const props = defineProps<{
	payload?: {
		complaint?: ComplaintsPayload;
	};
}>();

type MessageType = '' | 'error' | 'warning' | 'success' | 'info' | 'protect';

const { $flags } = useNuxtApp();
const userStore = useUserStore();
const answer = ref('');
const editMode = ref(false);
const loading = ref(false);
const confirmDelete = ref(false);
const complaint = computed(() => props.payload?.complaint || null);
const addressText = computed(() => 'Адрес абонента не указан');
const urgencyTabs = [
	{ key: 'Обычная', value: 'Обычная', icon: 'mdi-dots-circle' },
	{ key: 'Срочно', value: 'Срочно', icon: 'mdi-chevron-double-up' },
	{ key: 'Очень срочно', value: 'Очень срочно', icon: 'mdi-alert-octagon' },
];
const statusTabs = [
	{ key: 'Новая', value: 'Новая', icon: 'mdi-plus-circle-outline' },
	{ key: 'В работе', value: 'В работе', icon: 'mdi-clock-outline' },
	{ key: 'Просрочено', value: 'Просрочено', icon: 'mdi-alert-circle-outline' },
	{ key: 'Закрыто', value: 'Закрыто', icon: 'mdi-check-circle-outline' },
];
const form = reactive<ComplaintsPutBody>({
	urgencyLevel: 'Обычная',
	description: '',
	contactNumber: '',
	status: 'Новая',
	files: [],
});
const message = reactive({
	type: '' as MessageType,
	title: '',
	text: '',
});

watch(complaint, fillForm, { immediate: true });

function sendAnswer() {
	$flags.info('Отправка ответа пока не подключена к API');
}

async function saveComplaint(result: 'updated' | 'closed' = 'updated') {
	if (!complaint.value || loading.value) return false;
	message.type = '';

	if (!validate()) return false;

	loading.value = true;

	try {
		await complaints.update(complaint.value.id, {
			...form,
			description: form.description.trim(),
			contactNumber: form.contactNumber?.trim() || undefined,
		});

		$flags.success(result === 'closed' ? 'Жалоба закрыта' : 'Жалоба обновлена');
		close(result);
		return true;
	}
	catch (error: any) {
		showError(error, result === 'closed' ? 'Не удалось закрыть жалобу' : 'Не удалось сохранить жалобу');
		return false;
	}
	finally {
		loading.value = false;
	}
}

async function closeComplaint() {
	const previousStatus = form.status;
	form.status = 'Закрыто';
	const saved = await saveComplaint('closed');

	if (!saved) {
		form.status = previousStatus;
	}
}

async function deleteComplaint() {
	if (!complaint.value || loading.value) return;

	if (!confirmDelete.value) {
		confirmDelete.value = true;
		$flags.warn('Нажмите удаление еще раз, чтобы подтвердить действие');
		return;
	}

	loading.value = true;

	try {
		await complaints.delete(complaint.value.id);
		$flags.success('Жалоба удалена');
		close('deleted');
	}
	catch (error: any) {
		showError(error, 'Не удалось удалить жалобу');
	}
	finally {
		loading.value = false;
	}
}

function cancelEdit() {
	fillForm();
	editMode.value = false;
	confirmDelete.value = false;
	message.type = '';
}

function startEdit() {
	editMode.value = true;
	confirmDelete.value = false;
}

function fillForm() {
	if (!complaint.value) return;

	form.urgencyLevel = isUrgencyLevel(complaint.value.urgencyLevel) ? complaint.value.urgencyLevel : 'Обычная';
	form.description = complaint.value.description || '';
	form.contactNumber = complaint.value.contactNumber || '';
	form.status = complaint.value.status || 'Новая';
	form.files = [];
}

function validate() {
	if (!form.description.trim()) {
		message.type = 'warning';
		message.title = 'Заполните описание';
		message.text = 'Описание жалобы не должно быть пустым.';
		return false;
	}

	return true;
}

function isUrgencyLevel(value: string): value is ComplaintsPutBody['urgencyLevel'] {
	return ['Обычная', 'Срочно', 'Очень срочно'].includes(value);
}

function showError(error: any, title: string) {
	const data = error?.data || error?.response?._data;
	const text = data?.message || data?.error || data?.detail || error?.statusMessage || error?.message;

	message.type = 'error';
	message.title = title;
	message.text = Array.isArray(text) ? text.join('\n') : (text || 'Проверьте данные и попробуйте ещё раз.');
}

function close(result: boolean | 'updated' | 'deleted' | 'closed') {
	const appStore = useAppStore();
	const modal = appStore?.modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.complaint-details {
	width: min(720px, 82vw);

	.cd-content {
		display: grid;
		gap: 1em;
		padding-bottom: 1.2em;

		.cd-summary {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: .8em;

			.cd-box {
				padding: .9em 1em;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				background: #f8fafc;

				.cd-label {
					color: #64748b;
					font-size: .78rem;
				}

				.cd-value {
					margin-top: .25em;
					color: #111827;
					font-weight: 700;
				}

				.cd-hint {
					margin-top: .25em;
					color: #64748b;
					font-size: .82rem;
				}
			}
		}

		.cd-address {
			display: flex;
			align-items: center;
			gap: .5em;
			color: #475569;
			font-size: .9rem;

			.cd-address-icon {
				color: #2563ea;
			}
		}

	}

	.cd-footer {
		display: flex;
		justify-content: flex-end;
		gap: .5em;

		>.cd-spacer {
			flex-grow: 1;
		}
	}

	@media (max-width: 700px) {
		width: 100%;

		.cd-content {
			.cd-summary {
				grid-template-columns: 1fr;
			}
		}

		.cd-footer {
			display: grid;
		}
	}
}
</style>
