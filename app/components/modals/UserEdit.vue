<template>
	<div class="user-edit-modal">
		<section class="uem-form">
			<BaseTextBox v-model="form.login" label="Логин" :disabled="isEditMode"/>
			<BaseTextBox v-model="form.name" label="ФИО"/>
			<BaseTextBox v-model="form.phone" label="Телефон" type="tel"/>
			<BaseTextBox v-if="!isEditMode" v-model="form.password" label="Пароль" type="password"/>
		</section>

		<BaseAutocomplete autoselect v-model="form.role" :items="roleItems" label="Роль пользователя"/>
		<BaseTabs v-model="status" label="Статус" :items="statusItems"/>

		<section v-if="isEditMode" class="uem-password">
			<BaseTextBox v-model="newPassword" label="Новый пароль" type="password" placeholder="Введите новый пароль"/>
			<BaseButton variant="secondary" prependIcon="mdi-lock-reset" :loading="passwordLoading" @click="setPassword">Установить пароль</BaseButton>
		</section>

		<footer class="uem-footer">
			<BaseButton prependIcon="mdi-content-save-outline" :loading="loading" @click="saveUser">{{ isEditMode ? 'Сохранить' : 'Создать' }}</BaseButton>
			<BaseButton v-if="isEditMode" variant="secondary" color="#dc2626" prependIcon="mdi-delete-outline" :disabled="loading" @click="deleteUser">Удалить</BaseButton>
			<BaseButton variant="secondary" prependIcon="mdi-close" :disabled="loading" @click="close(false)">Закрыть</BaseButton>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import { portal, type UserBody, type UserPayload, type UserRoles } from '~/services/portal';
import BaseAutocomplete from '../common/base/BaseAutocomplete.vue';

const props = defineProps<{
	payload?: {
		user?: UserPayload;
	};
}>();

const { $flags } = useNuxtApp();
const loading = ref(false);
const passwordLoading = ref(false);
const newPassword = ref('');
const isEditMode = computed(() => Boolean(props.payload?.user?.id));
const status = ref(props.payload?.user?.isActive === false ? 'blocked' : 'active');
const form = reactive<UserBody>({
	login: props.payload?.user?.login || '',
	password: '',
	name: props.payload?.user?.name || '',
	phone: props.payload?.user?.phone || '',
	role: (props.payload?.user?.role as UserRoles) || 'CALLCENTER',
	isActive: true,
});

const roleItems = [
	{ key: 'ADMIN',							value: 'Администратор' },
	{ key: 'CALLCENTER_MANAGER',			value: 'Менеджер КЦ' },
	{ key: 'CALLCENTER',					value: 'Оператор КЦ' },
	{ key: 'CALLCENTER_COMPLAINT_ASSIGNEE',	value: 'Исполнитель жалоб' },
	{ key: 'CONTROLLER',					value: 'Контролер' },
	{ key: 'CONTRACTOR',					value: 'Подрядчик' },
];
const statusItems = [
	{ key: 'active', value: 'Активен' },
	{ key: 'blocked', value: 'Заблокирован' },
];

async function saveUser() {
	if (!form.login.trim() || !form.name.trim()) {
		$flags.warn('Укажите логин и ФИО пользователя');
		return;
	}
	if (!isEditMode.value && !form.password.trim()) {
		$flags.warn('Укажите пароль пользователя');
		return;
	}

	loading.value = true;
	try {
		if (isEditMode.value && props.payload?.user?.id) {
			await portal.updateUser(props.payload.user.id, {
				name: form.name,
				phone: form.phone,
				role: form.role,
				isActive: status.value === 'active',
			});
			$flags.success('Пользователь сохранен');
			close('updated');
			return;
		}

		await portal.createUser({
			...form,
			isActive: status.value === 'active',
		});
		$flags.success('Пользователь создан');
		close('created');
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось сохранить пользователя');
	}
	finally {
		loading.value = false;
	}
}

async function setPassword() {
	if (!props.payload?.user?.id) return;
	if (!newPassword.value.trim()) {
		$flags.warn('Введите новый пароль');
		return;
	}

	passwordLoading.value = true;
	try {
		await portal.setPassword(props.payload.user.id, { newPassword: newPassword.value });
		newPassword.value = '';
		$flags.success('Пароль обновлен');
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось обновить пароль');
	}
	finally {
		passwordLoading.value = false;
	}
}

async function deleteUser() {
	if (!props.payload?.user?.id) return;

	loading.value = true;
	try {
		await portal.deleteUser(props.payload.user.id);
		$flags.success('Пользователь удален');
		close('deleted');
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось удалить пользователя');
	}
	finally {
		loading.value = false;
	}
}

function close(result: false | 'created' | 'updated' | 'deleted') {
	const modal = useAppStore().modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.user-edit-modal {
	width: min(680px, 82vw);

	.uem-form {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: .9em;
		margin: 0 0 1em 0;
	}

	.uem-password {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: .8em;
		margin: 1em 0 0 0;
		padding: 1em;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: #f8fafc;
	}

	.uem-footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: .6em;
		margin: 1.2em 0 0 0;
	}

	@media (max-width: 700px) {
		.uem-form,
		.uem-password {
			grid-template-columns: 1fr;
		}
	}
}
</style>
