<template>
	<section class="readings-page">
		<div class="readings-container">
			<h1 style="text-align:center;">Абоненты</h1>
			<BaseTextBox v-model="search" autofocus @submit="fetchSubscribers" style="width:100%;" prepend-icon="mdi-magnify" button="Найти" placeholder="Поиск" />

			<div class="readings">
				<div class="reading" v-for="sub in subscriberIndex" :key="String(sub.name).slice(0, 4)">
					<div class="bold-title">{{ sub.name }}</div>
					<div class="account"><span>{{ sub.account }}</span></div>
					<div class="small-text">{{ sub.address }}</div>
					<div class="reading-date"><span>Создан: </span><span class="date">{{ sub.created }}</span></div>

					<div style="margin:1em 0; display:flex; align-items:center; gap:.6em;">
						<BaseTextBox
							@submit="(value: string)=>{ sendReading(sub, value) }"
							style="flex:auto 1 0;"
							prepend-icon="mdi-counter"
							button="Отправить"
							placeholder="Отправить показание"
						/>
						<BaseButton v-if="!sub.district" @click="fetchSubscriberDetails(sub)" prependIcon="mdi-text-box-search-outline">Подробнее</BaseButton>
					</div>

					<section v-if="sub.district" class="account-info">
						<section class="account-info-container">
							<div class="account-info-balance"><span class="small-text">Задолженность: </span><span class="amount">{{ sub.balance }}</span></div>
							<div class="account-info-district"><span class="small-text">Район: </span><span class="small-text">{{ sub.district }}</span></div>
						</section>

						<section class="message">
							<div v-if="visibleMessage.type === 'success'" class="account-success-message" style="font-size:2em; color:forestgreen; display:flex; justify-content:center; align-items: center; gap:.2em; margin:.4em 0 0 0;"><span><BaseIcon name="mdi-checkbox-marked-circle" size="1.2em"/></span><span> {{ visibleMessage.message }}</span></div>
							<div v-if="visibleMessage.type ===   'error'" class="account-error-message" style="font-size:2em; color:#c8290f; display:flex; justify-content:center; align-items: center; gap:.2em; margin:.4em 0 0 0;"><span><BaseIcon name="mdi-alert-decagram" size="1.2em"/></span><span> {{ visibleMessage.message || 'Ошибка при отправке' }}</span></div>
						</section>

						<section class="card-section" v-if="Array.isArray(sub?.readings) && sub.readings.length">
							<h2>История показаний</h2>
							<div class="table-wrapper">
								<table class="readings-table">
									<thead>
										<tr>
											<th>Показание</th>
											<th>Потребление</th>
											<th>Дата</th>
											<th>Отправитель</th>
											<th>...</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(reading, index) of sub.readings" :key="index">
											<td>{{ reading.reading }}</td>
											<td :style="{ color: reading.consumption > 0 ? 'green' : 'inherit' }">{{ reading.consumption }}</td>
											<td>{{ new Date(reading.created).toLocaleDateString('RU-ru') }}</td>
											<td>{{ reading.supplier.name }}</td>
											<td><BaseButton @click="deleteReading(sub, reading.id, $event)" prepend-icon="mdi-delete" :disabled="!isCurrentMonth(reading.created)" variant="secondary">Удалить</BaseButton></td>
										</tr>
									</tbody>
								</table>
							</div>
						</section>

						<section class="card-section" v-if="Array.isArray(sub?.payments) && sub.payments.length">
							<h2>История платежей</h2>
							<div class="table-wrapper">
								<table class="payments-table">
									<thead>
										<tr>
											<!-- <th>Транзакция</th> -->
											<th>Сумма</th>
											<th>Дата</th>
											<th>Услуга</th>
											<!-- <th>Отправитель</th> -->
										</tr>
									</thead>
									<tbody>
										<tr v-for="(payment, index) of sub.payments" :key="index">
											<!-- <td class="small-text">{{ payment.txnId }}</td> -->
											<td class="small-text amount">{{ payment.amount }}</td>
											<td class="small-text date">{{ new Date(payment.created).toLocaleDateString('RU-ru') }}</td>
											<td class="small-text">[{{ payment.service.id }}] {{ payment.service.name }}</td>
											<!-- <td class="small-text">{{ payment }}</td> -->
										</tr>
									</tbody>
								</table>
							</div>
						</section>

						<section class="card-section" v-if="Array.isArray(sub?.applications) && sub.applications.length">
							<h2>Заявки</h2>
							<div class="table-wrapper">
								<table class="issues-table">
									<thead>
										<tr>
											<th>Ключ</th>
											<th>Название</th>
											<th>Исполнитель</th>
											<th>Статус</th>
											<th>Дата</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(issue, index) of sub.applications" :key="index">
											<td class="small-text">{{ issue.issueKey }}</td>
											<td class="small-text">{{ issue.summary }}</td>
											<td class="small-text">{{ issue.assignee }}</td>
											<td class="small-text">{{ issue.status.name }}</td>
											<td class="small-text date">{{ new Date(issue.created).toLocaleDateString('RU-ru') }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</section>
					</section>
				</div>
			</div>
			<!-- <div v-if="search && !readingList.length && !loading">
				<BaseIcon name="mdi-magnify" size="1.2em" style="margin:0 .4em 0 0;"/>
				<span>Ничего не найдено</span>
			</div> -->
		</div>
	</section>
</template>

<script lang="ts" setup>
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER', 'CONTROLLER'],
	layout: 'authorized'
});


const { $api } = useNuxtApp();
import BaseButton from '~/components/common/BaseButton.vue';
import BaseIcon from '~/components/common/BaseIcon.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import type { SubscribersResponse, SubscriberDetails, Subscriber, SubscriberLite, PaymentsResponse } from '~/types/AccountsPage';


const search = ref('');
const loading = ref(false);

const subscriberIndex = reactive<{ [key: string]: Subscriber }>({});
const visibleMessage = reactive<{ type: '' | 'success' | 'error', message: string }>({ type: '', message: '' });


async function fetchSubscribers() {
	loading.value = true;

	const queryParams = {} as Record<string, string | number>;
	if(search.value) queryParams.search = search.value;
	queryParams.limit = 10;

	if(search.value) queryParams.search = search.value;

	const data: SubscribersResponse = await $api('v1/portal/abonents', {
		method: 'GET',
		query: queryParams,
	});

	if(true || data.success) {
		for (const key in subscriberIndex) {
			delete subscriberIndex[key];
		}

		for (const sub of data.data) {
			subscriberIndex[sub.account] = sub;
		}
	}

	loading.value = false;
}

async function fetchSubscriberDetails(sub: SubscriberLite) {
	const details: SubscriberDetails = await $api('v2/facility/account', {
		method: 'GET',
		query: { account: sub.account },
	});

	const paymentsResponse: PaymentsResponse = await $api('v1/payments/history', {
		method: 'GET',
		query: { account: sub.account },
		headers: []
	});

	const payments = paymentsResponse.data;
	const account = sub.account;
	const pSub = subscriberIndex[account]!;
	subscriberIndex[account] = { ...details, ...pSub, payments };
}

function sendReading(sub: SubscriberLite, reading: string) {
	$api('v1/portal/readings', {
		method: 'POST',
		body: {
			account: sub.account,
			reading
		},
	})
		.then((data) => {
			fetchSubscriberDetails(sub);
			setTimeout(() => {
				visibleMessage.type = 'success';
				visibleMessage.message = 'Показание принято';
			});
		})
		.catch((err: any) => {
			console.error(err);
			setTimeout(() => {
				visibleMessage.type = 'error';
				visibleMessage.message = err.data.message;
			});
		})
		.finally(() => {
			setTimeout(() => {
				visibleMessage.type = '';
			}, 10000);
		})
}

const isCurrentMonth = (date: string) => {
	const readingDate = new Date(date);
	const currentDate = new Date();
	return readingDate.getMonth() === currentDate.getMonth();
}

const hasDaysPassed = (date: string, days = 30) => {
	const readingDate = new Date(date);
	const currentDate = new Date();
	readingDate.setDate(readingDate.getDate() + days);
	return readingDate < currentDate;
}

function deleteReading(sub: SubscriberLite, readingId: number, event: Event) {
	if (!confirm('Вы уверены, что хотите удалить показание?')) return;

	const tr = event.target as HTMLTableRowElement;
	tr?.closest('tr')?.remove();

	$api('v1/portal/readings', {
		method: 'DELETE',
		body: {
			account: sub.account,
			id: readingId
		},
	})
		.then((data) => {
			fetchSubscriberDetails(sub);
			setTimeout(() => {
				visibleMessage.type = 'success';
				visibleMessage.message = 'Показание удалено';
			});
		})
		.catch((err: any) => {
			console.error(err);
			setTimeout(() => {
				visibleMessage.type = 'error';
				visibleMessage.message = err.data.message;
			});
		})
		.finally(() => {
			setTimeout(() => {
				visibleMessage.type = '';
			}, 10000);
		});
}
</script>

<style lang="scss">
.readings-page {
	.card-section {
		background: #ebf1ff;
		padding: 1em;
		border-radius: 10px;
		margin: 1em 0;

		h2 {
			margin-top:0;
		}
	}
	.bold-title {
		font-size: 1.2em;
		font-weight: 600;
		margin-bottom: .4em;
	}
	.small-text {
		font-size: 14px;
		opacity: .6;
		margin:.4em 0;
	}
	.reading-date {
		font-size: 14px;
		opacity: .6;
		margin:.4em 0;
	}
	.date {
		color: #7e0606;
		font-weight: 600;
	}

	.amount {
		color: #0c6b2b;
		font-weight: 600;
	}

	.table-wrapper {
		max-height: 500px;
		overflow: auto;

		table {
			// width: 100%;
			// border-collapse: collapse;

			th, td {
				padding:.1em .6em;
				border: 1px solid rgba(224, 226, 231, .569);
    			// padding: .4em .6em;
				// border:1px solid #c9d9ff55;
			}
		}
	}

	.readings-container {
		max-width:650px;
		margin:1em auto;

		.readings {
			padding: .6em 0;

			.reading {
				background-color: #fff;
				position: relative;
				margin:.8em 0;
				padding: .6em 1em;
				// max-width: 600px;
				border-radius: 6px;
				box-shadow: 0 6px 40px rgba(0,0,0,.05);
				// box-shadow: 0 0 8px 0px #0079C1aa;
				transition:all 500ms ease 0s;


				// .status {
				// 	// position: absolute;
				// 	// top: 0;
				// 	// right: 0;
				// 	display: inline-block;
				// 	background-color: #0079C1;
				// 	color: #fff;
				// 	padding:.4em .9em;
				// 	font-size: 14px;
				// 	border-radius:6px;
				// }

				.account-info {
					margin:.4em 0;

					.readings-table, .payments-table {
						border-collapse: collapse;
						width: 100%;
						margin-top: .8em;
						text-align: center;

						thead {
							tr {
								th {
									border:1px solid #e0e2e791;
									padding:.4em .6em;

									&:first-child {
										border-radius: 6px 0 0 6px;
									}
								}
							}
						}

						tbody {
							tr {
								td {
									border:1px solid #e0e2e791;
									padding:.4em .6em;
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>
