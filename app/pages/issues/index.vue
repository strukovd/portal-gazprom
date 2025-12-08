<template>
	<section class="issues-page">
		<div class="issues">
			<h1 style="margin:.4em 0;">Заявки сотрудника</h1>
			<BaseButton @click="navigateTo('/issues/create')" prependIcon="mdi-file-document-plus-outline" style="font-size:1.4em; flex-basis:auto; flex-grow:1; margin-bottom:.4em;">Добавить заявку</BaseButton>
			<BaseTextBox v-model="search" @submit="fetchIssues" style="width:100%;" prepend-icon="mdi-magnify" button="Найти" placeholder="Поиск" />
			<div v-if="errorMessage" class="error-message">
				<BaseIcon name="mdi-alert-decagram" size="1.2em" style="margin:0 .4em 0 0;"/>
				<span>{{ errorMessage }}</span>
			</div>

			<template v-if="loading">
				<BaseSkeleton v-for="i of 5" :key="i" height="7em" style="margin:.2em 0;"/>
			</template>
			<BasePageable v-else-if="appStore.issues.length" :page="1" :limit="linitIssues" :total="totalIssues" @change="fetchIssues">
				<div class="issue" v-for="(issue, index) of appStore.issues" :key="String(issue?.id ?? index)">
					<template v-if="issue"> <!-- В списке почему-то могут быть null элементы -->
						<div class="title">{{ issue.summary }}</div>
						<div class="flex-line">
							<div>
								<div class="issue-date"><span>Дата подачи: </span><span class="date">{{ issue.date }}</span></div>
								<div>{{ issue.issueKey }}</div>
							</div>

							<div :class="[`status`, issue.color]">{{ issue.issueStatus }}</div>
						</div>
						<hr style="border-width:0 0 1px 0; border-bottom:1px solid #f0f0f0; margin:1em 0;">
						<div class="actions" style="display:flex; align-items:flex-start; justify-content: space-between; gap:.4em;">
							<BaseButton @click="navigateTo(`/issues/construct-pass?issueKey=${issue.issueKey}`)" prependIcon="mdi-file-document-plus-outline">Добавить строй паспорт</BaseButton>
							<BaseButton v-if="issue?.payments" variant="secondary" @click="issue.showInvoices = !issue.showInvoices">
								<BaseIcon name="mdi-invoice-text-fast-outline" size="2em" style="margin:0 .4em 0 0;"/>
								<div>Счета на оплату</div>
							</BaseButton>
						</div>
						<div class="invoices" v-if="issue?.showInvoices && Array.isArray(issue?.payments) && issue.payments.length">
							<h2>Счета на оплату</h2>
							<table class="invoices-table">
								<tbody>
									<tr v-for="invoice of issue.payments">
										<td>
											<div class="invoice-service"><span>{{ invoice.service }}</span></div>
											<div class="invoice-created-by"><span>{{ invoice.createdBy ?? `Не указано` }}</span></div>
										</td>
										<td>
											<div class="invoice-date"><span class="date">{{ invoice.created ? new Date(invoice.created).toLocaleDateString('RU-ru') : `Не указано` }}</span></div>
											<div :class="[`invoice-status`, {payed: invoice.payed}]"><span>{{ invoice.payed ? 'Оплачен' : 'Не оплачен' }}</span></div>
											<div class="invoice-amount"><span>Сумма: </span><span class="amount-value">{{ invoice.amount }}</span></div>
										</td>
									</tr>
								</tbody>
							</table>
							<!-- <div class="invoice"
								style="display:flex; justify-content:space-between; background: rgb(235 241 255 / 1); border-radius:10px; margin:.6em 0px; padding:1em; line-height:1.4em; font-size:.9em;"
								v-for="(item, index) of [{ id: 207505, service: { name: `Выезд на замеры`, id: 613 }, created: `2023-01-25`, createdBy: `Кухаркина О.А.`, amount: 0, status: `Оплачен` }]" :key="index"
							>
								<div>
									<div class="invoice-service"><span>{{ item.service.name }}</span></div>
									<div class="invoice-date"><span class="date">{{ item.created }}</span></div>
								</div>
								<div>
									<div class="invoice-created-by"><span>Сотрудник: </span><span>{{ item.createdBy }}</span></div>
									<div class="invoice-status"><span style="background-color:forestgreen; color:whitesmoke; font-weight:600; padding:.2em .6em; border-radius:4px;">{{ item.status }}</span></div>
									<div class="invoice-amount"><span>Сумма: </span><span class="date">{{ item.amount }}</span></div>
								</div>
							</div> -->
						</div>
					</template>
				</div>
			</BasePageable>
			<div v-else-if="!appStore.issues.length">
				<BaseIcon name="mdi-magnify" size="1.2em" style="margin:0 .4em 0 0;"/>
				<span>Ничего не найдено</span>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'authorized'
});

const { $api } = useNuxtApp();
import BaseButton from '~/components/common/BaseButton.vue';
import BaseIcon from '~/components/common/BaseIcon.vue';
import BasePageable from '~/components/common/BasePageable.vue';
import BaseSkeleton from '~/components/common/BaseSkeleton.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import type { IssueList } from '~/types/IssueList';

const userStore = useUserStore();
const appStore = useAppStore();
const search = ref('');
const loading = ref(false);
const totalIssues = ref(0) as Ref<number>;
const linitIssues = ref(50);
const errorMessage = ref('');
const colors = [`orange2`, `red`, `orange`, `orange3`, `salad`, `qiwi`, `salad2`, `salad3`, `turquoise`, `blue`, `purple`, `violet`, `violet2`, `pink`, `pink2`];



async function fetchIssues(page: number = 1) {
	loading.value = true;
	const queryParams = {} as Record<string, string | number>;
	queryParams.page = page;
	queryParams.size = linitIssues.value;
	const token = userStore.token;

	if(!token) {
		console.error('No token');
		return;
	}

	if(search.value) queryParams.search = search.value;

	$api<IssueList>('v1/portal/issues', {
		query: queryParams,
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		},
	})
		.then( (data: IssueList) => {
			if(data.success) {
				const issues = data.data;
				totalIssues.value = parseInt(data.pagination.total);

				const filteredIssues = issues.filter(Boolean); // Убираем null элементы
				filteredIssues.forEach((issue: any) => {
					if( !Boolean(issue) ) { console.log(`issue: ${issue}`); return; }
					const status = String(issue.issueStatus);
					const len = status.length;
					const hash = (status.charCodeAt(0) + status.charCodeAt(len - 1) + len) % colors.length;
					const color = colors[hash];
					issue.color = color;
				});
				appStore.issues = filteredIssues;
			}
		})
		.catch( (error: any) => {
			// const code = error.response?.status;
			const message = error.data?.message ?? error.response?.data?.message;
			errorMessage.value = message;
		})
		.finally(() => {
			loading.value = false;
		});
}

onBeforeMount(() => {
	fetchIssues();
});
</script>

<style lang="scss">
.issues-page {
	.issues {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: .6em;
		max-width:650px;
		margin:1em auto;

		.issue {
			background-color: #fff;
			position: relative;
			padding: .6em 1em;
			// max-width: 600px;
			border-radius: 6px;
			box-shadow: 0 0 5px rgba(0,0,0,.08);
			margin-bottom:.8em;

			.title {
				font-size: 1.2em;
				font-weight: 500;
				margin-bottom: .4em;
			}

			.issue-date {
				margin-bottom: .4em;
				font-size: 14px;
				opacity: .6;
			}

			.flex-line {
				display:flex;
				align-items:center;
				gap:1em;
				justify-content: space-between;
				align-items: center;

				// &>* {
				// 	flex:auto 1 1;
				// }
			}

			.status {
				// position: absolute;
				// top: 0;
				// right: 0;
				display: inline-block;
				padding:.4em .9em;
				font-size: 14px;
				border-radius:6px;
			}

			.invoices {
				margin:1em 0;
				>h2 {
					margin:0 0 .4em 0;
				}
				.invoices-table {
					width:100%;
					font-weight:.9em;

					tr {
						display:flex;
						justify-content:space-between;
						background:rgb(235 241 255 / 1);
						border-radius:10px;
						margin:.6em 0px;
						padding:1em;
						line-height:1.4em;
						font-size:.9em;

						td {
							line-height: 1.4em;

							&:last-child {
								text-align:right;
							}

							.invoice-service {
								font-size:1.2em;
								margin-bottom:.2em;
								font-weight:500;
							}
							.invoice-date {

							}
							.invoice-created-by {

							}
							.invoice-status {
								text-align:right;

								&>span {
									background-color: #f9ba1b;
									color: #57410b;
									font-weight:600;
									padding:.2em .6em;
									border-radius:4px;
								}
								&.payed>span {
									background-color:forestgreen;
									color:whitesmoke;
									font-weight:600;
									padding:.2em .6em;
									border-radius:4px;
								}
							}
							.invoice-amount {
								.amount-value {
									font-weight:600;
									color:forestgreen;
								}
							}
						}
					}
				}
			}
		}
	}

	.date {
		color: #7e0606;
		font-weight: 600;
	}
}
</style>
