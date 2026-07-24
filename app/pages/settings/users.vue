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
				<div class="sup-subtitle">Роли, состояние учетных записей и администрирование паролей</div>
			</section>

			<section class="sup-actions">
				<BaseButton variant="secondary" prependIcon="mdi-refresh" :loading="loading" @click="fetchUsers">Обновить</BaseButton>
				<BaseButton prependIcon="mdi-account-plus-outline" @click="showUserModal()">Новый пользователь</BaseButton>
			</section>
		</header>

		<main class="page-blocks">
			<BaseIsland class="sup-users" title="Пользователи" prependIcon="mdi-account-group-outline" data-aos="fade-up">
				<section class="sup-filters">
					<section>
						<BaseTextBox class="col-6" v-model="search" label="Поиск" placeholder="ФИО, логин или телефон" prependIcon="mdi-magnify"/>
						<BaseTabs class="col-6" v-model="statusFilter" label="Статус" :items="statusFilterItems"/>
					</section>
					<section>
						<BaseTabs v-model="roleFilter" label="Роль" :items="roleFilterItems"/>
					</section>
				</section>

				<BaseTable
					:columns="columns"
					:rows="filteredUsers"
					:loading="loading"
					rowKey="id"
					@row:click="showUserModal"
				>
					<template #cell.name="{ row }">
						<UserBadge style="width:fit-content;" :name="String(row.name || row.login)" :login="String(row.login)" prependIcon="mdi-account-outline"/>
					</template>

					<template #cell.phone="{ value }">
						<span class="sup-muted">{{ value || 'Не указан' }}</span>
					</template>

					<template #cell.role="{ value }">
						<div class="sup-role">{{ roleName(String(value)) }}</div>
					</template>

					<template #cell.isActive="{ value }">
						<div :class="['status', value ? 'status-green' : 'status-red']" style="width:fit-content;">
							{{ value ? 'Активен' : 'Заблокирован' }}
						</div>
					</template>

					<template #cell.actions="{ row }">
						<button type="button" class="sup-row-action" title="Редактировать" @click.stop="showUserModal(row)">
							<BaseIcon name="mdi-pencil-outline" size="1.25em"/>
						</button>
					</template>
				</BaseTable>

				<section class="sup-table-footer">
					<div class="sup-total">Всего: {{ pagination.total }}</div>
					<div class="sup-pages">Страница {{ pagination.page }} из {{ pagination.totalPages || 1 }}</div>
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
import BaseTable from '~/components/common/base/BaseTable.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import UserBadge from '~/components/common/UserBadge.vue';
import { portal, type UserPayload, type UserRoles } from '~/services/portal';

definePageMeta({
	auth: true,
	roles: ['ADMIN'],
	layout: 'default'
});

const { $flags, $modal } = useNuxtApp();
type UserRow = UserPayload & Record<string, unknown>;

const users = ref<UserRow[]>([]);
const loading = ref(false);
const search = ref('');
const roleFilter = ref<UserRoles | 'all'>('all');
const statusFilter = ref<'all' | 'active' | 'blocked'>('all');
const pagination = reactive({
	page: 1,
	size: 100,
	total: 0,
	totalPages: 1,
});

const columns = [
	{ key: 'name', label: 'Пользователь' },
	{ key: 'phone', label: 'Телефон' },
	{ key: 'role', label: 'Роль' },
	{ key: 'isActive', label: 'Статус', width: '9em' },
	{ key: 'actions', label: '', width: '4em' },
];
const roleItems: Array<{ key: UserRoles; value: string }> = [
	{ key: 'ADMIN', value: 'Администратор' },
	{ key: 'CALLCENTER_MANAGER', value: 'Менеджер КЦ' },
	{ key: 'CALLCENTER', value: 'Оператор КЦ' },
	{ key: 'CALLCENTER_COMPLAINT_ASSIGNEE', value: 'Исполнитель жалоб' },
	{ key: 'CONTROLLER', value: 'Контролер' },
	{ key: 'CONTRACTOR', value: 'Подрядчик' },
];
const roleFilterItems = [
	{ key: 'all', value: 'Все' },
	...roleItems,
];
const statusFilterItems = [
	{ key: 'all', value: 'Все' },
	{ key: 'active', value: 'Активные' },
	{ key: 'blocked', value: 'Заблокированные' },
];
const filteredUsers = computed(() => {
	const query = search.value.trim().toLowerCase();
	return users.value.filter(user => {
		const matchesSearch = !query || [user.name, user.login, user.phone].some(value => String(value || '').toLowerCase().includes(query));
		return matchesSearch;
	});
});

watch([roleFilter, statusFilter], () => {
	pagination.page = 1;
	fetchUsers();
});

onMounted(fetchUsers);

async function fetchUsers() {
	loading.value = true;

	try {
		const response = await portal.fetchUserList({
			page: pagination.page,
			size: pagination.size,
			...(roleFilter.value !== 'all' ? { role: roleFilter.value } : {}),
			...(statusFilter.value !== 'all' ? { isActive: statusFilter.value === 'active' } : {}),
		});

		users.value = (response.data || []) as UserRow[];
		pagination.page = response.pagination?.page || pagination.page;
		pagination.size = response.pagination?.size || pagination.size;
		pagination.total = response.pagination?.total || users.value.length;
		pagination.totalPages = response.pagination?.totalPages || 1;
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось загрузить пользователей');
	}
	finally {
		loading.value = false;
	}
}

async function showUserModal(row?: UserRow | Record<string, unknown>) {
	const user = row?.id ? row as UserPayload : undefined;
	const result = await $modal.show('UserEdit', {
		title: user ? `Пользователь ${user.login}` : 'Новый пользователь',
		payload: {
			user,
		},
	});

	if (result) fetchUsers();
}

function roleName(role: string) {
	return roleItems.find(item => item.key === role)?.value || role;
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

		.sup-users {
			.sup-filters {
				margin-bottom:1em;
			}

			.base-table-row {
				cursor: pointer;

				&:hover {
					background: #f8fafc;
				}
			}

			.sup-muted {
				color: #737373;
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

			.sup-table-footer {
				display: flex;
				justify-content: space-between;
				gap: 1em;
				margin: 1em 0 0 0;
				color: #737373;
				font-size: .9em;
				font-weight: 700;
			}
		}
	}

	@media (max-width: 1000px) {
		.page-blocks {
			.sup-users {
				// .sup-filters {
				// 	grid-template-columns: 1fr;
				// }
			}
		}
	}

	@media (max-width: 720px) {
		.sup-header {
			align-items: flex-start;
			flex-direction: column;
		}
	}
}
</style>
