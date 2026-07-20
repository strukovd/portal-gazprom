<template>
	<section id="settings-users-page">
		<BaseBreadcrumbs :breadcrumbs="[
			{ title: 'Главная', link: '/' },
			{ title: 'Настройки', link: '/settings' },
			{ title: 'Пользователи' },
		]"/>

		<header class="sup-header">
			<section class="sup-heading">
				<div class="sup-title">Управление пользователями</div>
				<div class="sup-subtitle">Права доступа, учетные данные и состояние пользователей системы</div>
			</section>

			<section class="sup-actions">
				<BaseButton variant="secondary" prependIcon="mdi-refresh" @click="resetUsers">Сбросить мок-данные</BaseButton>
				<BaseButton prependIcon="mdi-account-plus-outline" @click="startCreate">Новый пользователь</BaseButton>
			</section>
		</header>

		<main class="page-blocks">
			<!-- <section class="sup-summary">
				<article v-for="item of summary" :key="item.title" class="sup-summary-card">
					<div :class="['sup-summary-icon', item.color]">
						<BaseIcon :name="item.icon" size="1.35em"/>
					</div>
					<div class="sup-summary-body">
						<div class="sup-summary-value">{{ item.value }}</div>
						<div class="sup-summary-title">{{ item.title }}</div>
					</div>
				</article>
			</section> -->

			<BaseIsland class="sup-users" title="Пользователи" prependIcon="mdi-account-group-outline" data-aos="fade-up">
				<section class="sup-filters">
					<BaseTextBox v-model="search" label="Поиск" placeholder="ФИО, логин или филиал" prependIcon="mdi-magnify"/>
					<BaseTabs v-model="roleFilter" label="Роль" :items="roleFilterItems"/>
				</section>

				<BaseTable
					:columns="columns"
					:rows="filteredUsers"
					rowKey="id"
					@row:click="selectUser"
				>
					<template #cell.name="{ row }">
						<UserBadge :name="String(row.name)" :login="String(row.login)"/>
					</template>

					<template #cell.role="{ row }">
						<div class="sup-role">{{ roleName(String(row.role)) }}</div>
					</template>

					<template #cell.status="{ row }">
						<div :class="['status', row.status === 'active' ? 'status-green' : 'status-red']">
							{{ row.status === 'active' ? 'Активен' : 'Заблокирован' }}
						</div>
					</template>

					<template #cell.actions="{ row }">
						<button type="button" class="sup-row-action" title="Редактировать" @click.stop="selectUser(row)">
							<BaseIcon name="mdi-pencil-outline" size="1.25em"/>
						</button>
					</template>
				</BaseTable>
			</BaseIsland>
			<section class="sup-grid">

			</section>

			<BaseIsland class="sup-editor" :title="isCreateMode ? 'Новый пользователь' : 'Карточка пользователя'" prependIcon="mdi-account-edit-outline" data-aos="fade-up">
				<section v-if="!selectedUser && !isCreateMode" class="sup-empty">
					<BaseIcon name="mdi-account-arrow-left-outline" size="2em"/>
					<div class="sup-empty-title">Выберите пользователя</div>
					<div class="sup-empty-text">Карточка откроется здесь, без перехода на отдельную страницу.</div>
				</section>

				<section v-else class="sup-form">
					<section class="sup-form-grid">
						<BaseTextBox v-model="form.name" label="ФИО"/>
						<BaseTextBox v-model="form.login" label="Логин"/>
						<BaseTextBox v-model="form.email" label="Email" type="email"/>
						<BaseTextBox v-model="form.phone" label="Телефон" type="tel"/>
						<BaseTextBox v-model="form.branch" label="Филиал"/>
						<BaseTextBox v-model="form.password" :label="isCreateMode ? 'Пароль' : 'Новый пароль'" type="password" placeholder="Не менять"/>
					</section>

					<BaseTabs v-model="form.role" label="Роль пользователя" :items="roleItems"/>
					<BaseTabs v-model="form.status" label="Статус" :items="statusItems"/>

					<section class="sup-permissions">
						<div class="sup-section-title">Права доступа</div>
						<div class="sup-permissions-grid">
							<BaseCheckbox v-for="item of permissions" :key="item.key" v-model="form.permissions[item.key]" :label="item.title"/>
						</div>
					</section>

					<section class="sup-editor-actions">
						<BaseButton prependIcon="mdi-content-save-outline" @click="saveUser">{{ isCreateMode ? 'Создать' : 'Сохранить' }}</BaseButton>
						<BaseButton v-if="!isCreateMode" variant="secondary" prependIcon="mdi-lock-reset" @click="resetPassword">Сбросить пароль</BaseButton>
						<BaseButton v-if="!isCreateMode" variant="secondary" color="#dc2626" prependIcon="mdi-delete-outline" @click="deleteUser">Удалить</BaseButton>
					</section>
				</section>
			</BaseIsland>
			
			<BaseIsland class="sup-audit" title="Последние действия" prependIcon="mdi-history" data-aos="fade-up">
				<section class="sup-audit-list">
					<article v-for="item of auditItems" :key="item.text" class="sup-audit-item">
						<div class="sup-audit-icon">
							<BaseIcon :name="item.icon" size="1.2em"/>
						</div>
						<div class="sup-audit-body">
							<div class="sup-audit-text">{{ item.text }}</div>
							<div class="sup-audit-time">{{ item.time }}</div>
						</div>
					</article>
				</section>
			</BaseIsland>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseCheckbox from '~/components/common/base/BaseCheckbox.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTable from '~/components/common/base/BaseTable.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import UserBadge from '~/components/common/UserBadge.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN'],
	layout: 'authorized'
});

type UserStatus = 'active' | 'blocked';
type UserPermission = 'complaints' | 'accounts' | 'readings' | 'news' | 'settings' | 'users';
type UserRow = Record<string, unknown> & {
	id: number;
	name: string;
	login: string;
	email: string;
	phone: string;
	branch: string;
	role: string;
	status: UserStatus;
	permissions: Record<UserPermission, boolean>;
};

const { $flags } = useNuxtApp();
const search = ref('');
const roleFilter = ref('all');
const selectedId = ref<number | null>(1);
const isCreateMode = ref(false);

const defaultUsers: UserRow[] = [
	{
		id: 1,
		name: 'Айбек Осмонов',
		login: 'a.osmonov',
		email: 'a.osmonov@gazprom.kg',
		phone: '+996 555 110 220',
		branch: 'Бишкек',
		role: 'ADMIN',
		status: 'active',
		permissions: { complaints: true, accounts: true, readings: true, news: true, settings: true, users: true },
	},
	{
		id: 2,
		name: 'Елена Петрова',
		login: 'e.petrova',
		email: 'e.petrova@gazprom.kg',
		phone: '+996 555 330 440',
		branch: 'Чуй',
		role: 'CALLCENTER_MANAGER',
		status: 'active',
		permissions: { complaints: true, accounts: true, readings: true, news: true, settings: true, users: false },
	},
	{
		id: 3,
		name: 'Нурлан Садыков',
		login: 'n.sadykov',
		email: 'n.sadykov@gazprom.kg',
		phone: '+996 555 550 660',
		branch: 'Ош',
		role: 'CALLCENTER_COMPLAINT_ASSIGNEE',
		status: 'active',
		permissions: { complaints: true, accounts: true, readings: false, news: false, settings: false, users: false },
	},
	{
		id: 4,
		name: 'Мария Ким',
		login: 'm.kim',
		email: 'm.kim@gazprom.kg',
		phone: '+996 555 770 880',
		branch: 'Джалал-Абад',
		role: 'CONTROLLER',
		status: 'blocked',
		permissions: { complaints: false, accounts: true, readings: true, news: false, settings: false, users: false },
	},
];

const users = ref<UserRow[]>(structuredClone(defaultUsers));
const form = reactive<UserRow & { password: string }>({
	id: 0,
	name: '',
	login: '',
	email: '',
	phone: '',
	branch: '',
	role: 'CALLCENTER',
	status: 'active',
	password: '',
	permissions: { complaints: true, accounts: true, readings: false, news: false, settings: false, users: false },
});

const columns = [
	{ key: 'name', label: 'Пользователь' },
	{ key: 'role', label: 'Роль' },
	{ key: 'branch', label: 'Филиал' },
	{ key: 'status', label: 'Статус', width: '9em' },
	{ key: 'actions', label: '', width: '4em' },
];
const roleItems = [
	{ key: 'ADMIN', value: 'Администратор' },
	{ key: 'CALLCENTER_MANAGER', value: 'Менеджер КЦ' },
	{ key: 'CALLCENTER', value: 'Оператор КЦ' },
	{ key: 'CALLCENTER_COMPLAINT_ASSIGNEE', value: 'Исполнитель' },
	{ key: 'CONTROLLER', value: 'Контролер' },
	{ key: 'CONTRACTOR', value: 'Подрядчик' },
];
const roleFilterItems = [
	{ key: 'all', value: 'Все' },
	...roleItems,
];
const statusItems = [
	{ key: 'active', value: 'Активен' },
	{ key: 'blocked', value: 'Заблокирован' },
];
const permissions: Array<{ key: UserPermission; title: string }> = [
	{ key: 'complaints', title: 'Жалобы' },
	{ key: 'accounts', title: 'Карточки абонентов' },
	{ key: 'readings', title: 'Показания' },
	{ key: 'news', title: 'Новости' },
	{ key: 'settings', title: 'Настройки' },
	{ key: 'users', title: 'Пользователи' },
];
const auditItems = [
	{ icon: 'mdi-account-plus-outline', text: 'Создан пользователь n.sadykov', time: 'Сегодня, 10:42' },
	{ icon: 'mdi-shield-key-outline', text: 'Изменены права роли Менеджер КЦ', time: 'Вчера, 17:18' },
	{ icon: 'mdi-lock-reset', text: 'Выполнен сброс пароля пользователя m.kim', time: '12 июля, 09:05' },
];

const selectedUser = computed(() => users.value.find(user => user.id === selectedId.value) || null);
const filteredUsers = computed(() => {
	const query = search.value.trim().toLowerCase();
	return users.value.filter(user => {
		const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value;
		const matchesSearch = !query || [user.name, user.login, user.branch].some(value => value.toLowerCase().includes(query));
		return matchesRole && matchesSearch;
	});
});
const summary = computed(() => [
	{ title: 'Всего пользователей', value: users.value.length, icon: 'mdi-account-group-outline', color: 'blue' },
	{ title: 'Администраторы', value: users.value.filter(user => user.role === 'ADMIN').length, icon: 'mdi-shield-crown-outline', color: 'dark' },
	{ title: 'Активные', value: users.value.filter(user => user.status === 'active').length, icon: 'mdi-check-decagram-outline', color: 'green' },
	{ title: 'Заблокированные', value: users.value.filter(user => user.status === 'blocked').length, icon: 'mdi-lock-outline', color: 'red' },
]);

watch(selectedUser, user => {
	if (!user || isCreateMode.value) return;
	fillForm(user);
}, { immediate: true });

function roleName(role: string) {
	return roleItems.find(item => item.key === role)?.value || role;
}

function selectUser(row: Record<string, unknown>) {
	const id = Number(row.id);
	if (!id) return;

	isCreateMode.value = false;
	selectedId.value = id;
}

function startCreate() {
	isCreateMode.value = true;
	selectedId.value = null;
	fillForm({
		id: 0,
		name: '',
		login: '',
		email: '',
		phone: '',
		branch: '',
		role: 'CALLCENTER',
		status: 'active',
		permissions: { complaints: true, accounts: true, readings: false, news: false, settings: false, users: false },
	});
}

function saveUser() {
	if (!form.name.trim() || !form.login.trim()) {
		$flags.warn('Укажите ФИО и логин пользователя');
		return;
	}

	const payload: UserRow = {
		id: form.id,
		name: form.name,
		login: form.login,
		email: form.email,
		phone: form.phone,
		branch: form.branch,
		role: form.role,
		status: form.status,
		permissions: { ...form.permissions },
	};

	if (isCreateMode.value) {
		const id = Math.max(0, ...users.value.map(user => user.id)) + 1;
		users.value.unshift({ ...payload, id });
		selectedId.value = id;
		isCreateMode.value = false;
		$flags.success('Пользователь создан');
		return;
	}

	const index = users.value.findIndex(user => user.id === form.id);
	if (index < 0) return;

	users.value[index] = { ...users.value[index], ...payload };
	$flags.success('Пользователь сохранен');
}

function deleteUser() {
	if (!selectedUser.value) return;

	users.value = users.value.filter(user => user.id !== selectedUser.value?.id);
	selectedId.value = users.value[0]?.id || null;
	$flags.success('Пользователь удален');
}

function resetPassword() {
	if (!selectedUser.value) return;

	form.password = '';
	$flags.info(`Пароль пользователя ${selectedUser.value.login} будет сброшен после подключения API`);
}

function resetUsers() {
	users.value = structuredClone(defaultUsers);
	selectedId.value = users.value[0]?.id || null;
	isCreateMode.value = false;
	$flags.success('Мок-данные восстановлены');
}

function fillForm(user: Omit<UserRow, 'password'>) {
	Object.assign(form, {
		...user,
		password: '',
		permissions: { ...user.permissions },
	});
}
</script>

<style lang="scss">
#settings-users-page {
	.sup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;
		margin: 0 0 1em 0;

		.sup-heading {
			display: grid;
			gap: .25em;

			.sup-title {
				color: #171717;
				font-size: 1.6em;
				font-weight: 800;
			}

			.sup-subtitle {
				color: #737373;
				font-size: .95em;
			}
		}

		.sup-actions {
			display: flex;
			gap: .6em;
		}
	}

	.page-blocks {
		display: grid;
		gap: 1em;

		.sup-summary {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: .8em;

			.sup-summary-card {
				display: flex;
				align-items: center;
				gap: .8em;
				padding: 1em;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				background: #fff;

				.sup-summary-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					flex: 0 0 2.6em;
					width: 2.6em;
					aspect-ratio: 1/1;
					border-radius: 8px;

					&.blue {
						color: #2563eb;
						background: #dbeafe;
					}

					&.green {
						color: #16a34a;
						background: #dcfce7;
					}

					&.red {
						color: #dc2626;
						background: #fee2e2;
					}

					&.dark {
						color: #374151;
						background: #f3f4f6;
					}
				}

				.sup-summary-body {
					display: grid;
					gap: .15em;

					.sup-summary-value {
						color: #111827;
						font-size: 1.35em;
						font-weight: 800;
					}

					.sup-summary-title {
						color: #737373;
						font-size: .86em;
					}
				}
			}
		}

		.sup-users {
			.sup-filters {
				display: grid;
				grid-template-columns: minmax(260px, .8fr) minmax(0, 1.2fr);
				gap: 1em;
				margin: 0 0 1em 0;
			}

			.base-table-row {
				cursor: pointer;

				&:hover {
					background: #f8fafc;
				}
			}

			.sup-role {
				color: #111827;
				font-weight: 700;
			}

			.sup-row-action {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 2.1em;
				aspect-ratio: 1/1;
				color: #2563eb;
				background: #eff6ff;
				border: 1px solid #dbeafe;
				border-radius: 7px;
				cursor: pointer;

				&:hover {
					opacity: .8;
				}
			}
		}

		.sup-editor {
			.sup-empty {
				display: grid;
				justify-items: center;
				gap: .35em;
				padding: 2em 1em;
				color: #737373;
				text-align: center;

				.sup-empty-title {
					color: #111827;
					font-weight: 800;
				}

				.sup-empty-text {
					max-width: 24em;
					font-size: .9em;
					line-height: 1.4;
				}
			}

			.sup-form {
				display: grid;
				gap: 1em;

				.sup-form-grid {
					display: grid;
					grid-template-columns: repeat(2, minmax(0, 1fr));
					gap: .9em;
				}

				.sup-permissions {
					display: grid;
					gap: .75em;

					.sup-section-title {
						color: #111827;
						font-weight: 800;
					}

					.sup-permissions-grid {
						display: grid;
						grid-template-columns: repeat(2, minmax(0, 1fr));
						gap: .75em;
					}
				}

				.sup-editor-actions {
					display: flex;
					flex-wrap: wrap;
					gap: .6em;
				}
			}
		}

		.sup-audit {
			.sup-audit-list {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: .8em;

				.sup-audit-item {
					display: flex;
					align-items: center;
					gap: .75em;
					padding: .9em;
					border: 1px solid #e5e7eb;
					border-radius: 8px;
					background: #fff;

					.sup-audit-icon {
						display: flex;
						align-items: center;
						justify-content: center;
						flex: 0 0 2.4em;
						width: 2.4em;
						aspect-ratio: 1/1;
						color: #2563eb;
						background: #eff6ff;
						border-radius: 8px;
					}

					.sup-audit-body {
						display: grid;
						gap: .2em;
						min-width: 0;

						.sup-audit-text {
							color: #111827;
							font-weight: 700;
						}

						.sup-audit-time {
							color: #737373;
							font-size: .84em;
						}
					}
				}
			}
		}
	}

	@media (max-width: 1100px) {
		.page-blocks {
			.sup-summary {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}

			.sup-audit {
				.sup-audit-list {
					grid-template-columns: 1fr;
				}
			}
		}
	}

	@media (max-width: 720px) {
		.sup-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.page-blocks {
			.sup-summary {
				grid-template-columns: 1fr;
			}

			.sup-users {
				.sup-filters {
					grid-template-columns: 1fr;
				}
			}

			.sup-editor {
				.sup-form {
					.sup-form-grid {
						grid-template-columns: 1fr;
					}

					.sup-permissions {
						.sup-permissions-grid {
							grid-template-columns: 1fr;
						}
					}
				}
			}
		}
	}
}
</style>
