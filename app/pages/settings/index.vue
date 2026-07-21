<template>
	<section id="settings-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Настройки' }]"/>

		<header class="sp-header">
			<section class="sp-heading">
				<div class="sp-title">Настройки</div>
				<div class="sp-subtitle">Профиль пользователя, пароль и административные разделы</div>
			</section>

			<section class="sp-actions">
				<BaseButton variant="secondary" prependIcon="mdi-refresh" :loading="loading" @click="fetchProfile">Обновить</BaseButton>
				<BaseButton prependIcon="mdi-content-save-outline" :loading="saving" @click="saveProfile">Сохранить</BaseButton>
			</section>
		</header>

		<main class="page-blocks">
			<section class="sp-grid">
				<BaseIsland class="sp-profile" title="Профиль пользователя" prependIcon="mdi-account-cog-outline" data-aos="fade-up">
					<section class="sp-form">
						<BaseTextBox v-model="form.login" label="Логин" disabled/>
						<BaseTextBox v-model="form.name" label="ФИО"/>
						<BaseTextBox v-model="form.phone" label="Телефон" type="tel"/>
						<BaseTextBox :modelValue="userStore.prettyRole" label="Роль" disabled/>
					</section>
				</BaseIsland>

				<BaseIsland class="sp-password" title="Смена пароля" prependIcon="mdi-shield-lock-outline" data-aos="fade-up">
					<section class="sp-form">
						<BaseTextBox v-model="passwordForm.oldPassword" label="Текущий пароль" type="password"/>
						<BaseTextBox v-model="passwordForm.newPassword" label="Новый пароль" type="password"/>
						<BaseTextBox v-model="passwordForm.repeatPassword" label="Повторите пароль" type="password"/>
					</section>

					<section class="sp-password-actions">
						<BaseButton variant="secondary" prependIcon="mdi-lock-reset" :loading="passwordSaving" @click="changePassword">Изменить пароль</BaseButton>
					</section>
				</BaseIsland>
			</section>

			<BaseIsland v-if="userStore.userData?.role === 'ADMIN' || userStore.isPrivilegedUser" class="sp-admin" title="Администрирование" prependIcon="mdi-shield-crown-outline" data-aos="fade-up">
				<section class="sp-admin-list">
					<NuxtLink v-if="userStore.userData?.role === 'ADMIN'" to="/settings/users" class="sp-admin-link">
						<div class="sp-admin-icon">
							<BaseIcon name="mdi-account-key-outline" size="1.4em"/>
						</div>
						<div class="sp-admin-body">
							<div class="sp-admin-title">Пользователи и права</div>
							<div class="sp-admin-text">Создание пользователей, роли, доступы и учетные данные</div>
						</div>
						<BaseIcon name="mdi-chevron-right" size="1.4em"/>
					</NuxtLink>

					<NuxtLink v-if="userStore.isPrivilegedUser" to="/settings/complaints" class="sp-admin-link">
						<div class="sp-admin-icon">
							<BaseIcon name="mdi-account-multiple-check-outline" size="1.4em"/>
						</div>
						<div class="sp-admin-body">
							<div class="sp-admin-title">Ответственные по жалобам</div>
							<div class="sp-admin-text">Матрица исполнителей по филиалам и типам обращений</div>
						</div>
						<BaseIcon name="mdi-chevron-right" size="1.4em"/>
					</NuxtLink>
				</section>
			</BaseIsland>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import { portal, type UserPayload, type UserRoles } from '~/services/portal';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTROLLER', 'CALLCENTER', 'CALLCENTER_COMPLAINT_ASSIGNEE'],
	layout: 'authorized'
});

const userStore = useUserStore();
const { $flags } = useNuxtApp();
const loading = ref(false);
const saving = ref(false);
const passwordSaving = ref(false);
const profile = ref<UserPayload | null>(null);
const form = reactive({
	login: userStore.userData?.login || '',
	name: '',
	phone: '',
});
const passwordForm = reactive({
	oldPassword: '',
	newPassword: '',
	repeatPassword: '',
});

onMounted(fetchProfile);

async function fetchProfile() {
	if (!userStore.userData?.id) return;

	loading.value = true;
	try {
		const response = await portal.fetchUser({ id: userStore.userData.id });
		profile.value = response.data;
		form.login = response.data.login || userStore.userData.login || '';
		form.name = response.data.name || '';
		form.phone = response.data.phone || '';
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось загрузить профиль');
	}
	finally {
		loading.value = false;
	}
}

async function saveProfile() {
	if (!userStore.userData?.id) return;
	if (!form.name.trim()) {
		$flags.warn('Укажите ФИО пользователя');
		return;
	}

	saving.value = true;
	try {
		await portal.updateUser(userStore.userData.id, {
			name: form.name,
			phone: form.phone,
			role: (profile.value?.role || userStore.userData.role) as UserRoles,
			isActive: profile.value?.isActive ?? true,
		});
		$flags.success('Профиль сохранен');
		fetchProfile();
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось сохранить профиль');
	}
	finally {
		saving.value = false;
	}
}

async function changePassword() {
	if (!userStore.userData?.id) return;
	if (!passwordForm.oldPassword || !passwordForm.newPassword) {
		$flags.warn('Укажите текущий и новый пароль');
		return;
	}
	if (passwordForm.newPassword !== passwordForm.repeatPassword) {
		$flags.warn('Новый пароль и повтор не совпадают');
		return;
	}

	passwordSaving.value = true;
	try {
		await portal.changePassword(userStore.userData.id, {
			oldPassword: passwordForm.oldPassword,
			newPassword: passwordForm.newPassword,
		});
		passwordForm.oldPassword = '';
		passwordForm.newPassword = '';
		passwordForm.repeatPassword = '';
		$flags.success('Пароль изменен');
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось изменить пароль');
	}
	finally {
		passwordSaving.value = false;
	}
}
</script>

<style lang="scss">
#settings-page {
	.sp-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;
		margin: 0 0 1em 0;

		.sp-heading {
			display: grid;
			gap: .25em;

			.sp-title {
				color: #171717;
				font-size: 1.6em;
				font-weight: 800;
			}

			.sp-subtitle {
				color: #737373;
				font-size: .95em;
			}
		}

		.sp-actions {
			display: flex;
			gap: .6em;
		}
	}

	.page-blocks {
		display: grid;
		gap: 1em;

		.sp-grid {
			display: grid;
			grid-template-columns: minmax(0, 1.25fr) minmax(320px, .75fr);
			gap: 1em;
		}

		.sp-form {
			display: grid;
			gap: .9em;
		}

		.sp-password-actions {
			display: flex;
			justify-content: flex-end;
			margin: 1em 0 0 0;
		}

		.sp-admin {
			.sp-admin-list {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: .8em;

				.sp-admin-link {
					display: grid;
					grid-template-columns: auto minmax(0, 1fr) auto;
					align-items: center;
					gap: .8em;
					padding: 1em;
					border: 1px solid #e5e7eb;
					border-radius: 8px;
					background: #fff;
					transition: opacity 180ms ease 0s, transform 180ms ease 0s;

					&:hover {
						opacity: .86;
						transform: translateY(-1px);
					}

					.sp-admin-icon {
						display: grid;
						place-items: center;
						width: 2.6em;
						aspect-ratio: 1/1;
						border-radius: 8px;
						color: #2563eb;
						background: #eff6ff;
					}

					.sp-admin-body {
						display: grid;
						gap: .25em;
						min-width: 0;

						.sp-admin-title {
							color: #111827;
							font-weight: 800;
						}

						.sp-admin-text {
							color: #737373;
							font-size: .86em;
							line-height: 1.35;
						}
					}
				}
			}
		}
	}

	@media (max-width: 900px) {
		.sp-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.page-blocks {
			.sp-grid {
				grid-template-columns: 1fr;
			}

			.sp-admin {
				.sp-admin-list {
					grid-template-columns: 1fr;
				}
			}
		}
	}
}
</style>
