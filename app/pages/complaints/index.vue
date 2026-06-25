<template>
	<section id="complaint-issue-list">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Жалобы' }]"/>

		<header>
			<section class="title">
				<h2>Жалобы</h2>
				<span>Управление обращениями и жалобами абонентов</span>
			</section>
			<section class="actions">
				<BaseButton prependIcon="mdi-plus" @click="$modal.show('ComplaintCreate', { title: 'Регистрация жалобы' })">Создать жалобу</BaseButton>
			</section>
		</header>

		<main class="page-blocks">
			<!-- Статистика -->
			<section class="stats no-api">
				<BaseIsland class="col-4 stat" v-for="(item, index) of [
					{ value: 12, label: 'Открытых жалоб', icon: 'mdi-alert-circle', color: 'red', },
					{ value: '4:32', label: 'Среднее время обработки', icon: 'mdi-clock-outline', color: 'blue', },
					{ value: 87, label: 'Новых (не отработанных)', icon: 'mdi-check-circle-outline', color: 'green', }
				]" :key="index">
					<section v-if="item.icon" :class="['icon-circle', item.color]">
						<BaseIcon :name="item.icon" size="1.6em"/>
					</section>
					<section class="content">
						<div class="value">{{ item.value }}</div>
						<div class="label">{{ item.label }}</div>
					</section>
				</BaseIsland>
			</section>
	
			<BaseIsland class="filters" title="Фильтр и поиск" prependIcon="mdi-filter-variant">
				<BaseTextBox v-model="form.description" @submit="" @change="" placeholder="Поиск по ключу, теме, ФИО..."/>
				<BaseTabs class="filter-tabs no-api" v-model="form.status" :items="[
					{ value: 'Все', key: '', badge: 12 },
					{ value: 'Новые', key: 'open', badge: 5 },
					{ value: 'В работе', key: 'in-progress', badge: 3 },
					{ value: 'Просроченные', key: 'overdue', badge: 2 },
					{ value: 'Закрытые', key: 'closed', badge: 10 },
				]"/>
			</BaseIsland>
	
			<BaseIsland class="list" title="Реестр жалоб" prependIcon="mdi-file-document-outline">
				<BaseTable
					:columns="[
						{ key: 'id', label: 'ID' },
						{ key: 'subscriber', label: 'Абонент' },
						{ key: 'subject', label: 'Тема' },
						{ key: 'created', label: 'Дата' },
						{ key: 'status', label: 'Статус' },
						{ key: 'sla', label: 'SLA' },
						{ key: 'userName', label: 'Исполнитель' },
					]"
					:rows="pageData.complaints"
				>
					<template #cell.id="{ value }">
						<NuxtLink :to="`/complaints/${value}`">
							<strong class="key">{{ value }}</strong>
						</NuxtLink>
					</template>
					<template #cell.subscriber="{ value, row }">
						<div><b>{{ row.subscriberName }}</b></div>
						<div><span style="color:#6CA3F7; line-height:1.6em;">{{ row.account }}</span></div>
						<div><span style="color:#aaaabb;">{{ row.contactNumber }}</span></div>
					</template>
					<template #cell.subject="{ value, row }">
						<div><span style="line-height:1.6em;">{{ value }}</span></div>
						<div><span style="color:#aaaabb;">{{ row.branchName }}</span></div>
					</template>
					<template #cell.created="{ value, row }">
						<div>
							<span class="created" style="color:#374151; background:#f3f4f6;">
								<BaseIcon name="mdi-clock-outline" size="1.2em" style="margin-right:.3em; opacity:.8;"/>
								<span>{{ toLocaleDate(String(value)) }}</span>
							</span>
						</div>
					</template>
					<template #cell.status="{ value }">
						<span :class="['status', getStatusClass(value)]">
							{{ value }}
						</span>
					</template>
					<template #cell.sla="{ value }">
						<span class="sla">{{ value }} дн.</span>
					</template>
				</BaseTable>
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
import { complaints, type ComplaintsPayload } from '~/services/complaints';
import { toLocaleDate } from '~/utils/format';
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTRACTOR', 'CALLCENTER'],
	layout: 'authorized'
});

const form = ref({
	account: '',
	subject: '',
	urgencyLevel: '',
	status: '',
	description: '',
});
const pageData = reactive({
	complaints: [] as ComplaintsPayload[],
});


init();
async function init() {
	complaints.fetch({
		// createdDateFrom: '2026-06-24',
		// createdDateTo: '2026-06-31',
		page: 1,
		size: 10,
	})
		.then((res) => { if (res) pageData.complaints = res.data; })
		.catch((error) => {
			useNuxtApp().$flags.error(error, {
				title: `Ошибка при получении списка жалоб`
			})
			console.error('Ошибка при получении списка жалоб:', error);
		});
}

function getStatusClass(status: any) {
	switch (String(status)) {
		case 'Новая':
			return 'new';
		case 'В работе':
			return 'in-progress';
		case 'Просрочено':
			return 'overdue';
		case 'Закрыто':
			return 'closed';
		default:
			return '';
	}
}
</script>

<style lang="scss">
#complaint-issue-list {
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;

		.title {
			h2 {
				margin: 0 0 .2em 0;
			}

			span {
				color: #6b7280;
			}
		}
	}

	.page-blocks {
		margin: 1em 0;

		>section,
		>div {
			margin: 0 0 1em 0;
		}

		.stats {
			.stat {
				display: flex;
				align-items: center;
				gap: 1em;
				padding-top: 1.8em;
				padding-bottom: 1.8em;

				.icon-circle {
					display: grid;
					place-items: center;
					width: 3em;
					aspect-ratio: 1/1;
					border-radius: 50%;

					&.red {
						color: #ef4444;
						background: #fee2e2;
					}

					&.blue {
						color: #2563eb;
						background: #dbeafe;
					}

					&.green {
						color: #16a34a;
						background: #dcfce7;
					}

					&.yellow {
						color: #d97706;
						background: #fef3c7;
					}
				}

				.content {
					.value {
						font-size: 1.6em;
						font-weight: 700;
					}

					.label {
						color: #6b728088;
						font-size: .8em;
					}
				}
			}
		}

		.filters {
			.filter-tabs {
				margin-top: .7em;
			}
		}

		.list {
			.key {
				color: #2563eb;
				text-decoration: underline;
				cursor: pointer;
			}

			.status,
			.created {
				display: inline-flex;
				align-items: center;
				border-radius: 999px;
				padding: .25em .65em;
				font-size: .85em;
				font-weight: 700;
			}

			.status {
				&.new {
					color: #166534;
					background: #dcfce7;
				}
				&.in-progress {
					color: #1d4ed8;
					background: #dbeafe;
				}
				&.overdue {
					color: #d23438;
					background: #fdf3f2;
				}
				&.closed {
					color: #374151;
					background: #f3f4f6;
				}
			}

			.sla {
				color: #92400e;
				background: #fef3c7;
			}
		}
	}

	@media (max-width: 700px) {
		header {
			align-items: flex-start;
			flex-direction: column;
		}
	}
}
</style>
