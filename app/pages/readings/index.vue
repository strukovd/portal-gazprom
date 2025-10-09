<template>
	<section class="readings-page">
		<div class="readings-container">
			<h1>Показания</h1>
			<BaseTextBox v-model="search" autofocus @submit="fetchReadings" style="width:100%;" prepend-icon="mdi-magnify" button="Найти" placeholder="Поиск" />

			<div class="readings">
				<div class="reading" v-for="sub of subscribers" :key="String(sub.name).slice(0, 4)">
					<label>
						<div class="name">{{ sub.name }}</div>
						<div class="account"><span>{{ sub.account }}</span></div>
						<div class="address">{{ sub.address }}</div>
						<div class="reading-date"><span>Создан: </span><span class="date">{{ sub.created }}</span></div>

						<div style="margin:.6em 0 0 0; display:flex; align-items:center; gap:.6em;">
							<BaseTextBox
								@submit="(value: string)=>{ sendReading(sub, value) }"
								style="flex:auto 1 0;"
								prepend-icon="mdi-counter"
								button="Отправить"
								placeholder="Введите показание"
							/>
							<BaseButton v-if="!sub.accountInfo" @click="fetchAccount(sub)" prependIcon="mdi-text-box-search-outline">Подробнее</BaseButton>
						</div>

						<section v-if="sub.accountInfo" class="account-info">
							<div class="account-info-balance"><span>Баланс: </span><span>{{ sub.accountInfo.balance }}</span></div>
							<div class="account-info-district"><span>Район: </span><span>{{ sub.accountInfo.district }}</span></div>

							<div v-if="visibleMessage === 'success'" class="account-success-message" style="font-size:2em; color:forestgreen; display:flex; justify-content:center; align-items: center; gap:.2em; margin:.4em 0 0 0;"><span><BaseIcon name="mdi-checkbox-marked-circle" size="1.2em"/></span><span> Показания приняты</span></div>
							<div v-if="visibleMessage ===   'error'" class="account-error-message" style="font-size:2em; color:#c8290f; display:flex; justify-content:center; align-items: center; gap:.2em; margin:.4em 0 0 0;"><span><BaseIcon name="mdi-alert-decagram" size="1.2em"/></span><span> Ошибка при отправке</span></div>

							<table v-if="Array.isArray(sub.accountInfo?.readings) && sub.accountInfo.readings.length" class="readings-table">
								<thead>
									<tr>
										<th>Показание</th>
										<th>Потребление</th>
										<th>Дата</th>
										<th>Отправитель</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(reading, index) of sub.accountInfo.readings" :key="index">
										<td>{{ reading.reading }}</td>
										<td :style="{ color: reading.consumption > 0 ? 'green' : 'inherit' }">{{ reading.consumption }}</td>
										<td>{{ new Date(reading.created).toLocaleDateString('RU-ru') }}</td>
										<td>{{ reading.sender }}</td>
									</tr>
								</tbody>
							</table>
						</section>
					</label>
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
	roles: ['ADMIN', 'CALLCENTER'],
	layout: 'authorized'
});

type Reading = {
	name: string;
	account: string;
	address: string;
	created: string;
	accountInfo?: AccountInfo;
};

const { $api } = useNuxtApp();
import BaseButton from '~/components/common/BaseButton.vue';
import BaseIcon from '~/components/common/BaseIcon.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import type { AccountInfo } from '~/types/AccountInfo';
import type { FoundedUsers } from '~/types/FoundedUsers';


const search = ref('');
const loading = ref(false);
const subscribers = ref([]) as Ref<Reading[]>;
const visibleMessage = ref('') as Ref<string>;


async function fetchReadings() {
	loading.value = true;

	const queryParams = {} as Record<string, string | number>;
	if(search.value) queryParams.search = search.value;
	queryParams.limit = 10;

	if(search.value) queryParams.search = search.value;

	const data: FoundedUsers = await $api('v2/facility/find', {
		method: 'GET',
		query: queryParams,
	});

	if(true || data.success) {
		subscribers.value = data.data as any;
	}

	loading.value = false;
}

async function fetchAccount(reading: Reading) {
	const data: AccountInfo = await $api('v2/facility/account', {
		method: 'GET',
		query: { account: reading.account },
	});

	reading['accountInfo'] = data;
}

function sendReading(sub: Reading, reading: string) {
	$api('v1/portal/readings', {
		method: 'POST',
		body: {
			account: sub.account,
			reading
		},
	})
		.then((data) => {
			fetchAccount(sub);
			setTimeout(() => {
				visibleMessage.value = 'success';
			});
		})
		.catch((err: any) => {
			console.error(err);
			setTimeout(() => {
				visibleMessage.value = 'error';
			});
		})
		.finally(() => {
			setTimeout(() => {
				visibleMessage.value = '';
			}, 5000);
		})
}
</script>

<style lang="scss">
body:has(.readings-page) {
	background-color: #e0f2fe;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	color: #183d6d;
}

.readings-page {
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

				.name {
					font-size: 1.2em;
					font-weight: 600;
					margin-bottom: .4em;
				}
				.address {
					font-size: 14px;
					opacity: .6;
					margin:.4em 0;
				}

				.reading-date {
					font-size: 14px;
					opacity: .6;
					margin:.4em 0;

					.date {
						color: #7e0606;
						font-weight: 600;
					}
				}

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

					.readings-table {
						border-collapse: collapse;
						width: 100%;
						margin-top: .8em;

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
