<template>
	<section id="complaint-issue-list">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Жалобы' }]"/>

		<header style="display:flex; align-items:center; justify-content:space-between; gap:1em;">
			<section>
				<h2>Жалобы</h2>
				<span>Управление обращениями и жалобами абонентов</span>
			</section>
			<section>
				<BaseButton variant="primary" icon="mdi-plus" @click="$modal.show('ComplaintCreate', {title: 'das'})">Создать жалобу</BaseButton>
			</section>
		</header>

		<!-- Статистика -->
		<section class="stats no-api">
			<BaseIsland class="col-4 stat-island" v-for="(item, index) of [
				{ value: 12, label: 'Открытых жалоб', icon: 'mdi-alert-circle', color: 'red', },
				{ value: '4:32', label: 'Среднее время обработки', icon: 'mdi-clock-outline', color: 'blue', },
				{ value: 87, label: 'Новых (не отработанных)', icon: 'mdi-check-circle-outline', color: 'green', }
			]" :key="index">
				<section v-if="item.icon" :class="['icon-circle', item.color]">
					<BaseIcon :name="item.icon" size="1.6em"/>
				</section>
				<section>
					<div style="font-size:1.6em; font-weight:700;">{{ item.value }}</div>
					<div style="font-size:.8em; color: #6b728088;">{{ item.label }}</div>
				</section>
			</BaseIsland>
		</section>

		<BaseIsland class="filters" title="Фильтр и поиск" prependIcon="mdi-filter-variant">
			<BaseTextBox v-model="form.description" @submit="" @change="" placeholder="Поиск по ключу, теме, ФИО..."/>
			<BaseTabs class="filter-tabs no-api" v-model="form.status" :items="[
				{ caption: 'Все', key: '', badge: 12 },
				{ caption: 'Новые', key: 'open', badge: 5 },
				{ caption: 'В работе', key: 'in-progress', badge: 3 },
				{ caption: 'Просроченные', key: 'overdue', badge: 2 },
				{ caption: 'Закрытые', key: 'closed', badge: 10 },
			]"/>
		</BaseIsland>

		<BaseIsland class="list" title="Реестр жалоб" prependIcon="mdi-file-document-outline">
			<BaseTable
				:columns="[
					{ key: 'key', label: 'Key' },
					{ key: 'theme', label: 'Тема' },
					{ key: 'date', label: 'Дата' },
					{ key: 'status', label: 'Статус' },
					{ key: 'sla', label: 'SLA' },
					{ key: 'assignee', label: 'Исполнитель' },
				]"
				:rows="[
					{ key: `ЖЛ-04187`, theme: 'Некорректные начисления', date: '12.06.2025', status: 'В работе', sla: '3 дня', assignee: 'Иванов И.И.' },
					{ key: `ЖЛ-04188`, theme: 'Нет газа', date: '13.06.2025', status: 'Новое', sla: '1 день', assignee: 'Петров П.П.' },
				]"
			>
				<template #cell.key="{ value }">
					<NuxtLink :to="`/complaints/${value}`">
						<strong class="complaint-key">{{ value }}</strong>
					</NuxtLink>
				</template>

				<template #cell.status="{ value }">
					<span :class="['status-pill', value === 'Новое' ? 'status-pill--new' : 'status-pill--progress']">
						{{ value }}
					</span>
				</template>

				<template #cell.sla="{ value }">
					<span class="sla-pill">{{ value }}</span>
				</template>
			</BaseTable>
		</BaseIsland>
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
const { $fetchCallGas } = useNuxtApp(); 
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'sidebar'
});

const form = ref({
	account: '',
	subject: '',
	urgencyLevel: '',
	status: '',
	description: '',
});


async function fetchList() {
	$fetchCallGas(`/complaints`, {
		method: 'GET',
		query: {
			// account: '123456789',
			// subject: 'Некорректные начисления',
			// urgencyLevel: 'HIGH',
			// status: 'OPEN',
			// description: '',
			createdFrom: '2024-01-01',
			createdTo: '2027-12-31',
			page: 1,
			size: 10,
		},
	})
		.then((response) => {
			console.log('Список жалоб:', response);
		})
		.catch((error) => {
			console.error('Ошибка при получении списка жалоб:', error);
		});
}
</script>

<style lang="scss">
#complaint-issue-list {
	.stats {
		.stat-island {
			display: flex;
			align-items: center;
			gap:1em;
			/* margin:1em 0; */
			padding-top:1.8em;
			padding-bottom:1.8em;

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
		}
	}

	.filters {
		.filter-tabs {
			margin-top:.7em;
		}
	}

	.list {
		.complaint-key {
			color: #2563eb;
			text-decoration: underline;
			cursor: pointer;
		}
		.status-pill,
		.sla-pill {
			display: inline-flex;
			align-items: center;
			border-radius: 999px;
			padding: .25em .65em;
			font-size: .85em;
			font-weight: 700;
		}
		.status-pill {
			&--new {
				color: #166534;
				background: #dcfce7;
			}
	
			&--progress {
				color: #1d4ed8;
				background: #dbeafe;
			}
		}
		.sla-pill {
			color: #92400e;
			background: #fef3c7;
		}
	}


	/* Блок к которому еще не реализован API */
	.no-api {
		filter: grayscale(1) opacity(0.6);
		cursor: not-allowed !important;

		&::after {
			content: '🚫 Нет данных';
			display: inline-block;
			text-align: center;
			position: absolute;
			top: 0;
			right:48%;
			opacity:.8;
			padding: 1em;
			background: #f3f4f6;
			border: 1px solid #e5e7eb;
			border-radius: 6px;
			font-size: .8em;
			overflow: visible;
		}
	}
}
</style>
