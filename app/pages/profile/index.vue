<template>
	<section id="profile-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Данные абонента' }]"/>

		<section>
			<BaseIsland title="Выбор абонента" prependIcon="mdi-account-box">
				<BaseTextBox label="Абонент" vmodel="searchText" prependIcon="mdi-magnify" button="Поиск" @submit="findAccounts"/>
			</BaseIsland>
		</section>

		<section class="found-list">
			<BaseIsland v-for="a of foundAccounts" :key="a.account"
				class="found-item"
				@click="selectAccount(a)"
			>
				<div class="found-item-avatar">
					<BaseIcon name="mdi-account-outline" size="18"/>
				</div>
				<div class="found-item-content">
					<div class="found-item-name">{{ a.name }}</div>
					<div class="found-item-account">{{ a.account }}</div>
					<div class="found-list__address">{{ a.address || 'Адрес не указан' }}</div>
				</div>
				<BaseIcon class="found-item-chevron" name="mdi-chevron-right" size="20"/>
			</BaseIsland>
		</section>




		<section style="display:flex; gap:1em; margin-top:1em;">
			<BaseIsland title="История показаний" prependIcon="mdi-clipboard-list-outline">
				<section style="display:flex; flex-direction:column; gap:.5em;">
					<div style="font-size:.9em; display:flex; gap:.6em;">
						<div style="color:#737373;">Расчётный период:</div>
						<div style="color:#171717; font-weight:700;">Январь 2024</div>
					</div>

					<BaseTable :columns="[
						{ label: 'Дата', key: 'date' },
						{ label: 'Показание, м³', key: 'reading' },
						{ label: 'Расход', key: 'consumption' },
						{ label: 'Источник', key: 'source' },
						{ label: 'Статус', key: 'status' },
					]" :rows="[
						{ date: '18.01.2024', reading: '1500', consumption: '50', source: 'Счетчик', status: 'Аномалия' },
						{ date: '18.12.2023', reading: '1450', consumption: '50', source: 'Счетчик', status: 'Норма' },
						{ date: '18.11.2023', reading: '1400', consumption: '50', source: 'Счетчик', status: 'Норма' },
						{ date: '18.10.2023', reading: '1350', consumption: '50', source: 'Счетчик', status: 'Норма' },
						{ date: '18.09.2023', reading: '1300', consumption: '50', source: 'Счетчик', status: 'Норма' },
					]">
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
			<BaseIsland class="no-api" title="Анализ потребления" prependIcon="mdi-chart-line">
				<section class="consumption-analytics">
					<VChart :option="dualLineChartOption" class="chart-small"/>
				</section>
			</BaseIsland>
		</section>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTable from '~/components/common/base/BaseTable.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import InfoBox from '~/components/common/InfoBox.vue';
const route = useRoute();
const a = useAccountStore();
const { $fetchApi } = useNuxtApp();

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER', 'CONTRACTOR'],
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


const searchText = ref(``);
const foundAccounts = ref<any[]>([]);
function findAccounts(text: string, e: Event) {
	console.log(text, e);
	foundAccounts.value = a.find(text);
}
</script>

<style lang="scss">
#profile-page {
	.base-island .bi-title .base-icon {
		opacity: 1 !important;
		color: #2563ea;
	}

	.found-list {
		.found-item {
			display: flex;
			align-items: center;
			gap: 1rem;
			cursor: pointer;
			padding: 1rem 1.1rem;

			&:hover,
			&:focus-visible {
				background: #eff6ff;
				border-color: #bfdbfe;
				// transform: translateY(-1px);
				outline: none;
			}

			.found-item-avatar {
				width: 42px;
				height: 42px;
				flex: 0 0 42px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 14px;
				background: #eff6ff;
				color: #2563ea;
				box-shadow: inset 0 0 0 1px rgba(37, 99, 234, 0.08);
			}

			.found-item-content {
				min-width: 0;
				flex: 1 1 auto;

				.found-item-name {
					font-size: 1.4rem;
					color: #111827;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-weight: 700;
				}
				
				.found-item-account {
					margin-top:.2em;
					font-size: 1.9em;
					font-weight: 700;
					// color: #0f172a;
					color: #2563ea;
					background: #eff6ff;
					padding: 0.55rem 0.85rem;
					border-radius: 14px;
					display: inline-flex;
					align-items: center;
					box-shadow: inset 0 0 0 1px rgba(37, 99, 234, 0.12);
				}

				.found-list__address {
					margin-top: 0.35em;
					color: #64748b;
					font-size: 0.83rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.found-item-chevron {
				color: #94a3b8;
				// flex: 0 0 auto;
			}
		}
	}
}
</style>
