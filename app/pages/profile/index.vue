<template>
	<section id="profile-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Карточка абонента' }]"/>

		<section style="display:flex; gap:1em; align-items:center; margin-top:1em;">
			<Avatar size="80px" name="Иванов Иван Иванович"/>
			<div>
				<h2 style="margin:0; color:#171717;">Иванов Иван Иванович</h2>
				<div style="color:#737373;">
					<span>Лицевой счет: </span>
					<span>123456789</span>
					<span style="padding:0 .3em; user-select:none;">·</span>
					<span style="color:#157f3d; font-weight:700;">Подключён</span>
				</div>
			</div>

			<div style="margin-left:auto;"></div>

			<BaseButton variant="primary">Принять показания</BaseButton>
			<BaseButton variant="outlined">Новая жалоба</BaseButton>
		</section>

		<!-- <section class="island" style="margin-top:1em; padding:1em; background:#fff; border:1px solid #e5e5e5; border-radius:16px;">
			<h3>Контактная информация</h3>
			<div style="display:flex; flex-direction:column; gap:.5em; margin-top:.5em;">
				<div><strong>Телефон:</strong> +7 (999) 123-45-67</div>
				<div><strong>Email:</strong> ivanov@example.com</div>
			</div>
		</section> -->

		<section class="statistics" style="display:flex; gap:1em; flex-wrap:wrap; margin-top:1em;">
			<template
				v-for="(item, index) of [
					{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-lightning-bolt',			value: 'Плановое 18.01 - ул. Ленина',		title: 'Отключение в районе' },
					{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-currency-usd',			value: '24,10 сом/м3',						title: 'Текущий тариф' },
					{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-calculator-variant',		value: 'Перерасчёт при смене счетчика',		title: 'Обновления FAQ' },
					{ bg: '#2563ea', 	color: '#2863e4', 		icon: 'mdi-alert-box',				value: '1 жалоба в обработке',				title: 'Открытые жалобы' },
				]" :key="index">
				<BaseIsland
					style="display:flex; gap:1em; align-items:center; flex:1 1 200px;"
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

		<section style="display:flex; gap:1em; flex-wrap:wrap; margin-top:1em;">
			<BaseIsland title="Контактная информация" prependIcon="mdi-card-account-details">
				 <table class="contact-info-table">
					<tbody>
						<tr>
							<td>ФИО</td>
							<td>Иванов Иван Иванович</td>
						</tr>
						<tr>
							<td>Лицевой счет</td>
							<td>123456789</td>
						</tr>
						<tr>
							<td>Адрес</td>
							<td>г. Бишкек, ул. Ленина, д. 10</td>
						</tr>
						<tr>
							<td>Статус</td>
							<td style="color:#157f3d; font-weight:700;">Подключён</td>
						</tr>
						<tr>
							<td>Телефон</td>
							<td>+7 (999) 123-45-67</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>ivanov@example.com</td>
						</tr>
						<tr>
							<td>Счетчик</td>
							<td>Газовый, 2015 г.в.</td>
						</tr>
						<tr>
							<td>Тип</td>
							<td>Телеметрический</td>
						</tr>
					</tbody>
				 </table>
			</BaseIsland>
			<BaseIsland title="Финансовые данные" prependIcon="mdi-wallet-bifold">
				<section style="display:flex; gap:1em; flex-wrap:wrap;">
					<div style="flex:auto 1 1; background:#e9effd; color:#2b63dd; padding:1em; border-radius:12px; text-align:center;">
						<div style="font-size:.9em;">Текущий баланс</div>
						<div style="font-size:1.4em; font-weight:700; line-height:1.6em;">1000.00 сом</div>
						<div style="font-size:.9em;">Предоплата</div>
					</div>
					<div style="flex:auto 1 1; background:#fef2f2; color:#dc2625; padding:1em; border-radius:12px; text-align:center;">
						<div style="font-size:1.4em; font-weight:700; line-height:1.6em;">Квитанция</div>
						<div style="font-size:.9em;">за апрель</div>
					</div>
				</section>
				<div style="font-weight:700; margin-top:1em;">Последние оплаты</div>
				<div style="display:flex; gap:.5em; margin-top:.5em; background:#fafafa; padding:1em; border-radius:12px;"
					v-for="(item, index) of [
						{ date: '18.01.2024', amount: '500.00', serviceId: 1, service: 'Газоснабжение природным газом', method: 'Онлайн-банк' },
						{ date: '15.12.2023', amount: '750.00', serviceId: 1, service: 'Газоснабжение природным газом', method: 'Терминал' },
						{ date: '10.11.2023', amount: '600.00', serviceId: 24, service: 'Изготовление эскизных чертежей', method: 'Онлайн-банк' },
						{ date: '10.11.2023', amount: '600.00', serviceId: 47, service: 'Согласование', method: 'Онлайн-банк' },
					]" :key="index">
					<div style="flex:33% 1 1; text-align:center;">
						<div style="font-weight:700; color:forestgreen;">{{ item.amount }}</div>
						<div style="font-size:.9em; color:#737373;">{{ item.date }}</div>
					</div>
					<div style="flex:33% 1 1; padding:0 1em; font-size:.8em; text-align:center; border-width:0 1px 0 1px; border-style:solid; border-color:#e5e5e5;">
						<div :style="{color: item.serviceId === 1 ? '#659df2' : '#fe9f4d'}">{{ item.service }}</div>
					</div>
					<div style="flex:33% 1 1; text-align:center; font-size:.9em; color:#525252;">{{ item.method }}</div>
				</div>
			</BaseIsland>
			<BaseIsland title="Таймлайн взаимодействий" prependIcon="mdi-history">
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
						<template #cell.status="{ item, column }">
							<div v-if="column.key === 'status'" :style="{ color: item.status === 'Аномалия' ? '#ee4444' : '#17a34a', fontWeight: '700' }">
								{{ item.status }}
							</div>
							<div v-else>
								{{ item[column.key] }}
							</div>
						</template>
					</BaseTable>
					<InfoBox type="warning" title="Внимание" message="Расход за январь (2 348 м³) превышает среднее значение на 162%. Необходимо проверить показания"/>
				</section>
			</BaseIsland>
			<BaseIsland title="Анализ потребления" prependIcon="mdi-chart-line">
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
import InfoBox from '~/components/common/InfoBox.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'sidebar'
});

const chartMonths = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const monthlyConsumption = [2600, 2400, 2100, 1840, 1380, 920, 760, 720, 930, 1480, 1980, 2360];
const monthlyTemperature = [-6, -2, 5, 11, 17, 23, 27, 26, 19, 11, 4, -1];

const baseChartGrid = {
	left: 18,
	right: 18,
	top: 48,
	bottom: 24,
	containLabel: true
};

const baseXAxis = {
	type: 'category',
	boundaryGap: true,
	data: chartMonths,
	axisTick: { show: false },
	axisLine: { lineStyle: { color: '#d4d4d4' } },
	axisLabel: { color: '#737373' }
};

const baseTooltip = {
	trigger: 'axis',
	backgroundColor: '#171717',
	borderWidth: 0,
	textStyle: { color: '#ffffff' }
};

const dualLineChartOption = {
	tooltip: baseTooltip,
	legend: {
		top: 8,
		textStyle: { color: '#525252' },
		data: ['Расход', 'Температура']
	},
	grid: baseChartGrid,
	xAxis: { ...baseXAxis, boundaryGap: false },
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
</script>

<style lang="scss">
#profile-page {
	.base-island .bi-title .base-icon {
		opacity: 1 !important;
		color: #2563ea;
	}

	.contact-info-table {
		border-collapse: collapse;
		width: 100%;
		font-size:.9em;
		td {
			padding-bottom:.4em;

			&:first-child {
				color: #737373;
			}
			&:last-child {
				color: #171717;

			}
		}
	}

	.consumption-analytics {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.chart-small {
			width: 100%;
			height: 380px;
		}
	}
}
</style>
