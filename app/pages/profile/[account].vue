<template>
	<section id="profile-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Карточка абонента' }]"/>

		<BaseIsland v-if="accountStore.loading && !accountData" style="margin-top:1em;">
			Загрузка данных абонента...
		</BaseIsland>

		<BaseIsland v-else-if="accountStore.error && !accountData" style="margin-top:1em;">
			Не удалось загрузить данные абонента.
		</BaseIsland>

		<template v-else-if="accountData">
		<section style="display:flex; gap:1em; align-items:center; margin-top:1em;">
			<Avatar size="80px" :name="accountData.name || '?'"/>
			<div>
				<h2 style="margin:0; color:#171717;">{{ accountData.name || 'Абонент' }}</h2>
				<div style="color:#737373;">
					<span>Лицевой счет: </span>
					<span>{{ accountData.account }}</span>
					<span style="padding:0 .3em; user-select:none;">·</span>
					<span style="color:#157f3d; font-weight:700;">{{ 'Подключен' }}</span>
				</div>
			</div>

			<div style="margin-left:auto;"></div>

			<BaseButton @click="showCreateReading" variant="primary">Принять показания</BaseButton>
			<BaseButton variant="outlined">Новая жалоба</BaseButton>
		</section>

		<section class="statistics no-api" style="display:flex; gap:1em; flex-wrap:wrap; margin-top:1em;">
			<template
				v-for="(item, index) of [
					{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-lightning-bolt',			value: 'Плановое 18.01 - ул. Ленина',		title: 'Отключение в районе' },
					{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-currency-usd',			value: 'Не указан',						title: 'Текущий тариф' },
					{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-calculator-variant',		value: 'Перерасчёт при смене счетчика',		title: 'Обновления FAQ' },
					{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-alert-box',				value: '1 жалоба в обработке',				title: 'Открытые жалобы' },
				]" :key="index">
				<BaseIsland
					style="display:flex; gap:1em; align-items:center; flex:1 1 200px; flex-wrap:nowrap;"
					:style="{ '--bg': item.bg, '--color': item.color }"
				>
					<section>
						<div style="padding:1em; border-radius:12px; color: var(--color); background-color:color-mix(in srgb, var(--bg) 8%, #fff);">
							<BaseIcon :name="item.icon" :size="'1.5em'" :color="item.color"/>
						</div>
					</section>
					<section>
						<div style="color:#737373;">{{ item.title }}</div>
						<div style="font-size:1.1em; font-weight:700;">{{ item.value }}</div>
					</section>
				</BaseIsland>
			</template>
		</section>

		<section style="margin-top:1em;">
			<BaseIsland title="Контактная информация" prependIcon="mdi-card-account-details" class="col-4">
				 <table class="contact-info-table">
					<tbody>
						<tr>
							<td>ФИО</td>
							<td>{{ accountData.name || 'Не указано' }}</td>
						</tr>
						<tr>
							<td>Лицевой счет</td>
							<td>
								<div style="display:inline-flex; gap:.4em; align-items:center; cursor:pointer;">
									{{ accountData.account }}
									<BaseIcon @click="copy(accountData.account)" name="mdi-content-copy" style="color:#737373"/>
								</div>
							</td>
						</tr>
						<tr>
							<td>Адрес</td>
							<td>{{ accountData.address || 'Не указан' }}</td>
						</tr>
						<tr>
							<td>Статус</td>
							<td style="color:#157f3d; font-weight:700;">{{ 'Подключён' }}</td>
						</tr>
						<tr>
							<td>Телефон</td>
							<td>Не указан</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>Не указан</td>
						</tr>
						<tr>
							<td>Счетчик</td>
							<td>Не указан</td>
						</tr>
						<tr>
							<td>Тип</td>
							<td>{{ accountStore.prettyType }}</td>
						</tr>

						<template v-if="accountData.ul">
							<tr>
								<td colspan="2" style="font-weight:700;">
									<BaseIcon name="mdi-information" style="color:#2563ea; margin-right:.4em;"/>
									<span>Сведения о дороговоре</span>
								</td>
							</tr>
							<tr>
								<td>Номер</td>
								<td>{{ accountData.ul.agreementNumber ?? 'Не указан' }}</td>
							</tr>
							<tr>
								<td>Дата заключения</td>
								<td>{{ accountData.ul.agreementDate ?? `Не указана` }}</td>
							</tr>
							<tr>
								<td>Тип деятельности</td>
								<td>{{ accountData.ul.typeOfActivity ?? `Не указана` }}</td>
							</tr>
							<tr>
								<td>Статус</td>
								<td>Действителен</td>
							</tr>
						</template>
					</tbody>
				 </table>
			</BaseIsland>
			<BaseIsland title="Финансовые данные" prependIcon="mdi-wallet-bifold" class="col-4">
				<section style="display:flex; gap:1em; flex-wrap:wrap;">
					<div :class="[`tile`, { red: accountData.balance < 0 }]">
						<div style="font-size:.9em;">Текущий баланс</div>
						<div style="font-size:1.4em; font-weight:700; line-height:1.6em;">{{ accountData.balance ?? '0.00' }} сом</div>
						<!-- <div style="font-size:.9em;">{{ accountData.balance > 0 ? `Долг` : `Предоплата` }}</div> -->
					</div>
					<div :class="[`tile`, { red: !accountData.bill, clickable: accountData.bill }]" @click="showBillDetails">
						<div style="font-size:1.4em; font-weight:700; line-height:1.6em;">Квитанция</div>
						<div v-if="accountData.bill" style="font-size:.9em;">за {{ billMonthText }}</div>
						<div v-else style="font-size:.9em;">нету</div>
					</div>
				</section>
				<section v-if="Array.isArray(accountData?.payments)">
					<div style="font-weight:700; margin-top:1em;">Последние оплаты</div>
					<div v-if="!accountData.payments.length" style="font-weight:700; margin:2em 0 0 0; text-align:center; color:#737373; font-size:.9em;">Нет данных</div>
					<section v-else style="max-height:350px; overflow:auto;">
						<div v-for="(payment, index) of accountData.payments" :key="index" style="display:flex; gap:.5em; margin-top:.5em; background:#fafafa; padding:1em; border-radius:12px;">
							<div style="flex:33% 1 1; text-align:center;">
								<div style="font-weight:700; color:forestgreen;">{{ payment.amount }}</div>
								<div style="font-size:.9em; color:#737373;">{{ toLocaleDate(payment.created) }}</div>
							</div>
							<div style="flex:33% 1 1; padding:0 1em; font-size:.8em; text-align:center; border-width:0 1px 0 1px; border-style:solid; border-color:#e5e5e5;">
								<div :style="{color: payment.service.id === 2 ? '#659df2' : '#fe9f4d'}">{{ payment.service.name }}</div>
							</div>
							<div style="flex:33% 1 1; text-align:center; font-size:.9em; color:#525252;">{{ payment.supplier.name ?? 'Не указано' }}</div>
						</div>
					</section>
				</section>
			</BaseIsland>
			<BaseIsland title="Таймлайн взаимодействий" prependIcon="mdi-history" class="col-4 no-api">
				<section style="display:flex; flex-direction:column; gap:.5em;">
					<div v-for="(item, index) of [
						{ date: '18.01.2024, 10:42', title: 'Плановое отключение в связи с техническим обслуживанием', description: 'Ожидаемое время восстановления: 3 часа.' },
						{ date: '15.01.2024, 14:20', title: 'Оплата квитанции за март', description: 'Ожидаемое время восстановления: 3 часа.' },
						{ date: '10.01.2024, 09:15', title: 'Получение показаний счетчика', description: 'Ожидаемое время восстановления: 3 часа.' },
					]" :key="index" style="display:flex; gap:1em;">
						<aside style="position:relative; top:0; bottom:0;">
							<div style="position:absolute; top:0; bottom:-.5em; width:.5em; border-radius:3px; background-color:#e5e5e5;"></div>
							<div style="position:absolute; top:0; bottom:0; margin-left:-.1em; width:.7em; height:.7em; border-radius:50%; background-color:#2563ea;"></div>
						</aside>
						<div style="padding-bottom:.2em;">
							<div style="color:#a3a3a3; font-size:.9em;">{{ item.date }}</div>
							<div style="color:#171717; font-weight:700;">{{ item.title }}</div>
							<div style="color:#737373; font-size:.9em;">{{ item.description }}</div>
							<a v-if="Math.random() > 0.5" href="#">Открыть жалобу →</a>
						</div>
					</div>
				</section>

			</BaseIsland>
		</section>

		<section style="margin-top:1em;">
			<BaseIsland v-if="accountData?.readings" title="История показаний" prependIcon="mdi-clipboard-list-outline" class="col-6">
				<section style="display:flex; flex-direction:column; gap:.5em;">
					<div style="font-size:.9em; display:flex; gap:.6em;">
						<div style="color:#737373;">Расчётный период:</div>
						<div style="color:#171717; font-weight:700;">Январь 2024</div>
					</div>

					<BaseTable :columns="[
						{ label: 'Дата', key: 'created' },
						{ label: 'Показание, м³', key: 'reading' },
						{ label: 'Расход', key: 'consumption' },
						{ label: 'Источник', key: 'supplier.name' },
						{ label: 'Статус', key: 'status' },
					]" :rows="accountData?.readings">
						<template #cell.created="{ row, column }">{{ toLocaleDate( String(row[column.key]) ) }}</template>
						<template #cell.status="{ row, column }">
							<div v-if="column.key === 'status'" :style="{ color: row?.status === 'Аномалия' ? '#ee4444' : '#17a34a', fontWeight: '700' }">
								{{ row.status }}
							</div>
							<div v-else>
								{{ row[column.key] }}
							</div>
						</template>
					</BaseTable>
					<InfoBox type="warning" title="Внимание" message="Расход за январь (2 348 м³) превышает среднее значение на 162%. Необходимо проверить показания"/>
				</section>
			</BaseIsland>
			<BaseIsland title="Анализ потребления" prependIcon="mdi-chart-line" class="col-6 no-api">
				<section class="consumption-analytics">
					<VChart :option="dualLineChartOption" class="chart-small"/>
				</section>
			</BaseIsland>
		</section>
		</template>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTable from '~/components/common/base/BaseTable.vue';
import InfoBox from '~/components/common/InfoBox.vue';
import { formatMonth, toLocaleDate } from '~/utils/format';
const route = useRoute();
const { $modal } = useNuxtApp();
const accountStore = useAccountStore();
const accountData = computed(() => accountStore.accountData);
const billMonthText = computed(() => {
	const bill = accountData.value?.bill;
	return bill ? (formatMonth(bill.accrualMonth) || bill.accrualMonth || 'период не указан') : '';
});

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CALLCENTER', 'CONTRACTOR'],
	layout: 'authorized'
});

const chartMonths = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const monthlyConsumption = [2600, 2400, 2100, 1840, 1380, 920, 760, 720, 930, 1480, 1980, 2360];
const monthlyTemperature = [-6, -2, 5, 11, 17, 23, 27, 26, 19, 11, 4, -1];
const dualLineChartOption = {
	tooltip: {
		trigger: 'axis',
		backgroundColor: '#171717',
		borderWidth: 0,
		textStyle: { color: '#ffffff' }
	},
	legend: {
		top: 8,
		textStyle: { color: '#525252' },
		data: ['Расход', 'Температура']
	},
	grid: {
		left: 18,
		right: 18,
		top: 48,
		bottom: 24,
		containLabel: true
	},
	xAxis: {
		...{
			type: 'category',
			boundaryGap: true,
			data: chartMonths,
			axisTick: { show: false },
			axisLine: { lineStyle: { color: '#d4d4d4' } },
			axisLabel: { color: '#737373' }
		},
		boundaryGap: false
	},
	yAxis: [
		{
			type: 'value',
			axisLabel: { color: '#737373' },
			splitLine: { lineStyle: { color: '#eef2ff' } }
		},
		{
			type: 'value',
			axisLabel: { color: '#737373', formatter: '{value}°' },
			splitLine: { show: false }
		}
	],
	series: [
		{
			name: 'Расход',
			type: 'line',
			data: monthlyConsumption,
			smooth: true,
			symbol: 'none',
			lineStyle: { width: 4, color: '#2563ea' },
			areaStyle: {
				color: 'rgba(37, 99, 234, 0.10)'
			}
		},
		{
			name: 'Температура',
			type: 'line',
			yAxisIndex: 1,
			data: monthlyTemperature,
			smooth: true,
			symbolSize: 7,
			lineStyle: { width: 3, color: '#f97316', type: 'dashed' },
			itemStyle: { color: '#f97316' }
		}
	]
};

onMounted(() => {
	checkAccountParam();
});

watch(() => route.params.account, () => {
	checkAccountParam();
});


const copy = async (text: string) => {
	if (navigator.clipboard)
		navigator.clipboard.writeText(text);
};

const showCreateReading = () => {
	if (!accountData.value) return;

	const lastReading = [...(accountData.value.readings || [])].sort((a, b) => {
		return new Date(b.created).getTime() - new Date(a.created).getTime();
	})[0];

	$modal.show('CreateReading', {
		title: 'Приём показаний',
		payload: {
			account: accountData.value.account,
			previousReading: lastReading?.reading ?? null,
			previousReadingDate: lastReading?.created ?? null,
		}
	});
}

const showBillDetails = () => {
	if (!accountData.value?.bill) return;

	$modal.show('BillDetails', {
		title: 'Детали квитанции',
		payload: {
			bill: accountData.value.bill,
		}
	});
}

function checkAccountParam() {
	// Если в URL нет аккаунта, то переходим на страницу профиля
	const account = Array.isArray(route.params.account) ? route.params.account[0] : route.params.account;
	if (!account) {
		navigateTo('/profile');
		return;
	}
	// Если аккаунт отличается от предыдущего
	if (accountStore.account !== account) {
		accountStore.setActiveAccount(account);
		return;
	}

	accountStore.fetchAccountData();
}
</script>

<style lang="scss">
#profile-page {
	.base-island .bi-title .base-icon {
		opacity: 1 !important;
		color: #2563ea;
	}

	.tile {
		flex:auto 1 1;
		background:#e9effd;
		color:#2b63dd;
		padding:1em;
		border-radius:12px;
		text-align:center;

		&.clickable {
			cursor: pointer;
			transition: opacity 200ms ease 0s, transform 200ms ease 0s;

			&:hover {
				opacity: .86;
				transform: translateY(-1px);
			}
		}

		&.red {
			background:#fef2f2;
			color:#dc2625;
		}
	}

	.contact-info-table {
		border-collapse: collapse;
		width: 100%;
		font-size:.9em;
		tr {
			&:not(:last-child) {
				td {
					border-bottom: 1px solid rgba(148, 163, 184, 0.18);
				}
			}
		}

		td {
			padding:.8em;

			&:first-child {
				color: #64748b;
			}
			&:last-child {
				color: #111827;
				font-weight: 600;
			}
		}
	}

	.consumption-analytics {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.chart-small {
			width: 100%;
			min-height: 380px;
			min-width:500px;
		}
	}
}
</style>
