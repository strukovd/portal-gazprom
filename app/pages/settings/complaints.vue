<template>
	<section id="settings-complaints-page">
		<BaseBreadcrumbs :breadcrumbs="[
			{ title: 'Главная', link: '/' },
			{ title: 'Настройки', link: '/settings' },
			{ title: 'Администрирование жалоб' },
		]"/>

		<header class="scp-header">
			<section class="scp-heading">
				<div class="scp-title">Администрирование жалоб</div>
				<div class="scp-subtitle">Ответственные исполнители по филиалам и типам обращений</div>
			</section>

			<section class="scp-actions">
				<BaseButton variant="secondary" prependIcon="mdi-refresh" :loading="loading" @click="fetchData">Обновить</BaseButton>
				<BaseButton prependIcon="mdi-content-save-outline" :loading="saving" :disabled="loading || !branches.length || hasEmptyCells" @click="saveMatrix">Сохранить</BaseButton>
			</section>
		</header>

		<main class="page-blocks">
			<BaseIsland class="scp-matrix" title="Матрица исполнителей" prependIcon="mdi-account-multiple-check-outline" data-aos="fade-up">
				<section v-if="hasEmptyCells && !loading" class="scp-validation">
					<BaseIcon name="mdi-alert-circle-outline" size="1.2em"/>
					<div class="scp-validation-text">Заполните все ячейки матрицы перед сохранением. Пустых ячеек: {{ emptyCells.length }}.</div>
				</section>

				<section v-if="loading" class="scp-state">
					<BaseIcon name="mdi-loading" size="1.4em"/>
					<div class="scp-state-text">Загрузка матрицы...</div>
				</section>

				<section v-else-if="error" class="scp-state scp-error">
					<BaseIcon name="mdi-alert-circle-outline" size="1.4em"/>
					<div class="scp-state-text">{{ error }}</div>
				</section>

				<section v-else-if="!branches.length" class="scp-state">
					<BaseIcon name="mdi-table-off" size="1.4em"/>
					<div class="scp-state-text">Матрица ответственности не заполнена</div>
				</section>

				<section v-else class="scp-table-wrapper">
					<table class="scp-table">
						<thead class="scp-thead">
							<tr class="scp-row">
								<th class="scp-cell scp-type-cell">Тип жалобы</th>
								<th v-for="branch of branches" :key="branch.branchKey" class="scp-cell scp-branch-cell">
									<div class="scp-branch-name">{{ branch.branchName }}</div>
									<div class="scp-branch-key">{{ branch.branchKey }}</div>
								</th>
							</tr>
						</thead>

						<tbody class="scp-tbody">
							<tr v-for="type of complaintTypes" :key="type" class="scp-row">
								<td class="scp-cell scp-type-cell">
									{{ complaints.resolveComplaintName(type) }}
								</td>
								<td v-for="branch of branches" :key="branch.branchKey" class="scp-cell">
									<div v-if="getResponsibles(branch.branchKey, type).length" class="scp-users">
										<UserBadge
											v-for="user of getResponsibles(branch.branchKey, type)"
											:key="user.id"
											:name="user.name"
											:login="user.login"
											removable
											@remove="removeAssignee(branch.branchKey, type, user.id)"
										/>
									</div>
									<div v-else class="scp-empty-cell">Не назначено</div>

									<BaseAutocomplete
										class="scp-assignee-search"
										:modelValue="selectedAssignees[cellKey(branch.branchKey, type)]"
										:items="availableAssignees(branch.branchKey, type)"
										:loading="assigneesLoading"
										fieldKey="id"
										fieldValue="name"
										placeholder="Добавить исполнителя"
										@change="addAssignee(branch.branchKey, type, $event)"
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</section>
			</BaseIsland>
		</main>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseAutocomplete from '~/components/common/base/BaseAutocomplete.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import UserBadge from '~/components/common/UserBadge.vue';
import { complaints, type AssigneePayload, type ResponsibilityMatrix } from '~/services/complaints';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER'],
	layout: 'authorized'
});

type ResponsibleUser = {
	id: number;
	login: string;
	name: string;
};
type MatrixRow = {
	branchKey: string;
	branchName: string;
};

const { $flags } = useNuxtApp();
const matrix = ref<ResponsibilityMatrix>({});
const assignees = ref<AssigneePayload[]>([]);
const selectedAssignees = reactive<Record<string, string | number | undefined>>({});
const loading = ref(true);
const assigneesLoading = ref(false);
const saving = ref(false);
const error = ref('');

const complaintTypes = computed(() => {
	const types = new Set<string>();
	Object.values(matrix.value).forEach(branch => {
		Object.keys(branch).forEach(type => types.add(type));
	});
	return [...types];
});
const branches = computed<MatrixRow[]>(() => {
	return Object.keys(matrix.value)
		.map(branchKey => ({
			branchKey,
			branchName: complaints.resolveBranchName(branchKey),
		}))
		.sort((a, b) => a.branchName.localeCompare(b.branchName));
});
const emptyCells = computed(() => {
	return complaintTypes.value.flatMap(type => {
		return branches.value
			.filter(branch => !getResponsibles(branch.branchKey, type).length)
			.map(branch => ({ branchKey: branch.branchKey, complaintType: type }));
	});
});
const hasEmptyCells = computed(() => emptyCells.value.length > 0);

onMounted(fetchData);

async function fetchData() {
	loading.value = true;
	assigneesLoading.value = true;
	error.value = '';

	try {
		const [matrixResponse, assigneesResponse] = await Promise.all([
			complaints.fetchResponsibilityMatrix(),
			complaints.fetchAssignees(),
		]);
		matrix.value = matrixResponse;
		assignees.value = assigneesResponse;
	}
	catch (err: any) {
		error.value = err?.data?.message || err?.response?._data?.message || err?.message || 'Не удалось загрузить матрицу ответственности.';
		$flags.error(error.value, { title: 'Ошибка настроек жалоб' });
	}
	finally {
		loading.value = false;
		assigneesLoading.value = false;
	}
}

async function saveMatrix() {
	if (saving.value) return;
	if (hasEmptyCells.value) {
		$flags.warn('Заполните все ячейки матрицы перед сохранением');
		return;
	}

	saving.value = true;

	try {
		matrix.value = await complaints.updateResponsibilityMatrix(matrix.value);
		$flags.success('Матрица ответственности сохранена');
	}
	catch (err: any) {
		const text = err?.data?.message || err?.response?._data?.message || err?.message || 'Не удалось сохранить матрицу ответственности.';
		$flags.error(text, { title: 'Ошибка настроек жалоб' });
	}
	finally {
		saving.value = false;
	}
}

function getResponsibles(branchKey: string, complaintType: string): ResponsibleUser[] {
	return matrix.value[branchKey]?.[complaintType] || [];
}

function availableAssignees(branchKey: string, complaintType: string) {
	const selectedIds = new Set(getResponsibles(branchKey, complaintType).map(user => user.id));
	return assignees.value.filter(user => !selectedIds.has(user.id));
}

function addAssignee(branchKey: string, complaintType: string, assigneeId: string | number | undefined) {
	if (!assigneeId) return;

	const assignee = assignees.value.find(user => String(user.id) === String(assigneeId));
	if (!assignee) return;

	let branch = matrix.value[branchKey];
	if (!branch) {
		branch = {};
		matrix.value[branchKey] = branch;
	}
	if (!branch[complaintType]) branch[complaintType] = [];
	if (branch[complaintType].some(user => user.id === assignee.id)) return;

	branch[complaintType].push({
		id: assignee.id,
		login: assignee.login,
		name: assignee.name,
	});
	selectedAssignees[cellKey(branchKey, complaintType)] = undefined;
}

function removeAssignee(branchKey: string, complaintType: string, assigneeId: number) {
	const branch = matrix.value[branchKey];
	const cell = branch?.[complaintType];
	if (!cell) return;

	branch[complaintType] = cell.filter(user => user.id !== assigneeId);
}

function cellKey(branchKey: string, complaintType: string) {
	return `${branchKey}:${complaintType}`;
}
</script>

<style lang="scss">
#settings-complaints-page {
	.scp-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;
		margin: 0 0 1em 0;

		.scp-heading {
			display: grid;
			gap: .25em;

			.scp-title {
				color: #171717;
				font-size: 1.6em;
				font-weight: 800;
			}

			.scp-subtitle {
				color: #737373;
				font-size: .95em;
			}
		}

		.scp-actions {
			display: flex;
			gap: .6em;
		}
	}

	.page-blocks {
		.scp-matrix {
			.scp-validation {
				display: flex;
				align-items: center;
				gap: .55em;
				margin: 0 0 1em 0;
				padding: .85em 1em;
				border: 1px solid #fed7aa;
				border-radius: 8px;
				color: #c2410c;
				background: #fff7ed;

				.scp-validation-text {
					font-size: .9em;
					font-weight: 700;
				}
			}

			.scp-state {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: .6em;
				min-height: 12em;
				color: #737373;

				.scp-state-text {
					font-weight: 700;
				}

				&.scp-error {
					color: #dc2626;
				}
			}

			.scp-table-wrapper {
				width: 100%;
				overflow-x: auto;

				.scp-table {
					width: 100%;
					min-width: 980px;
					border-collapse: separate;
					border-spacing: 0;
					font-size: .9em;

					.scp-thead {
						.scp-row {
							.scp-cell {
								position: sticky;
								top: 0;
								z-index: 1;
								color: #525252;
								background: #f8fafc;
								font-weight: 800;
							}
						}
					}

					.scp-tbody {
						.scp-row {
							&:hover {
								.scp-cell {
									background: #fcfcfd;
								}
							}
						}
					}

					.scp-row {
						.scp-cell {
							min-width: 13em;
							padding: .85em;
							border-right: 1px solid #f1f5f9;
							border-bottom: 1px solid #f1f5f9;
							vertical-align: top;
							background: #fff;

							&:last-child {
								border-right: 0;
							}

							&.scp-type-cell {
								position: sticky;
								left: 0;
								z-index: 2;
								min-width: 18em;
								line-height: 1.3;
								white-space: normal;
								background: #fff;
								box-shadow: 1px 0 0 #f1f5f9;
							}

							&.scp-branch-cell {
								min-width: 13em;
							}

							.scp-branch-name {
								color: #111827;
								font-weight: 800;
							}

							.scp-branch-key {
								margin: .2em 0 0 0;
								color: #a3a3a3;
								font-size: .78em;
								font-weight: 700;
							}

							.scp-users {
								display: grid;
								gap: .45em;
							}

							.scp-empty-cell {
								color: #a3a3a3;
								font-size: .86em;
								font-weight: 700;
							}

							.scp-assignee-search {
								margin: .55em 0 0 0;

								.input-container {
									font-size: .86em;
									padding: .05em .3em .05em .45em;
								}

								.dropdown {
									min-width: 16em;
								}
							}
						}
					}
				}
			}
		}
	}

	@media (max-width: 700px) {
		.scp-header {
			align-items: flex-start;
			flex-direction: column;
		}
	}
}
</style>
