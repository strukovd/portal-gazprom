<template>
	<section class="construct-pass-page">
		<div class="documents">
			<article class="document">

				<h1 class="center">СТРОИТЕЛЬНЫЙ ПАСПОРТ</h1>
				<h1 class="center">ВНУТРИДОМОВОГО (ВНУТРИЦЕХОВОГО) ГАЗООБОРУДОВАНИЯ</h1>
				<div class="flex-line">
					смонтированного <BaseTextBox v-model="form['smrName']" placeholder="Наименование проектной организации"/>
				</div>

				<h2 class="center">Служба по обслуживанию внутридомового газового оборудования</h2>
				<div class="flex-line">по адресу: <BaseTextBox v-model="form['address']" placeholder="Адрес абонента"/></div>

				<h2 class="center">1.ХАРАКТЕРИСТИКА ГАЗООБОРУДОВАНИЯ</h2>
				<p>Указывается для внутридомового газооборудования – число квартир, тип и число установленных газовых приборов, общая протяженность газопровода и число запорных устройств на них; для внутрицехового оборудования общая протяженность газопровода, тип и число установленного газооборудования, рабочее давление газа</p>
				<BaseMemo v-model="form['characteristics']" resize="vertical" placeholder="Начните вводить сюда"/>

				<h2 class="center">2. ПЕРЕЧЕНЬ ПРИЛАГАЕМЫХ СЕРТИФИКАТОВ, ТЕХНИЧЕСКИХ ПАСПОРТОВ И ДРУГИХ ДОКУМЕНТОВ, УДОСТОВЕРЯЮЩИХ КАЧЕСТВО МАТЕРИАЛОВ И ОБОРУДОВАНИЯ</h2>
				<BaseMemo v-model="form['certificateList']" resize="vertical" placeholder="Начните вводить сюда"/>

				<h2 class="center">3. ДАННЫЕ О СВАРКЕ СТЫКОВ ГАЗОПРОВОДА</h2>

				<table>
					<thead>
						<tr>
							<td rowspan="2">ФИО сварщика</td>
							<td colspan="2">Клеймо и номер удостоверения сварщика</td>
							<td rowspan="2">Сварено стыков</td>
							<td rowspan="2">Дата проведения сварочных работ</td>
						</tr>
						<tr>
							<td colspan="0.5">Диаметр, мм</td>
							<td colspan="0.5">Число, шт.</td>
						</tr>
					</thead>
					<tbody>
						<DynamicRow v-model="firstTable" :n="5"/>
					</tbody>
				</table>

				<br>
				<BaseTextBox v-model="form['performingWorkPerson']" placeholder="Должность, подпись, инициалы, фамилия производителя работ"/>


				<h2 class="center">4. ПРОВЕРКА И ОЧИСТКА ВНУТРЕННЕЙ ПОЛОСТИ ГАЗОПРОВОДА ИСПЫТАНИЕ ГАЗОПРОВОДА НА ПРОЧНОСТЬ И ГЕРМЕТИЧНОСТЬ</h2>
				<ol>
					<li>Перед монтажом газопровода трубы осмотрены и внутренняя полость их очищена от грязи, окалины и других засорений</li>
					<li>
						<p>
							<BaseTextBox v-model="form.testedAirPressureDate" type="date"/> газопровод испытан на прочность давлением воздуха <BaseTextBox v-model="form.airPressure"/> МПа <BaseTextBox v-model="form.airPressureCm2"/> кгс/см<sup>2</sup> в течении 1 ч на участке от отключающего устройства на вводе до кранов на отпусках к оборудованию (приборам). Испытание на прочность газопровода выдержал с внешним осмотром и поверкой сварных и фланцевых соединений с помощью мыльной эмульсии после давления до
							<BaseTextBox v-model="form.soapEmulsionPressure"/> МПа <BaseTextBox v-model="form.soapEmulsionPressureCm2" placeholder="кгс/см2"/>.
						</p>
						<p>
							Дефекты и утечки не обнаружены. Испытание на прочность газопровод выдержал.
						</p>
					</li>
					<li>
						<p>
							<BaseTextBox v-model="form['checkDate2']" type="date"/> Газопровод испытан на герметичность давлением воздуха <BaseTextBox v-model="form.waterColumn"/> вод/ст. <BaseTextBox v-model="form.tightnessAirPressure"/> МПа <BaseTextBox v-model="form.tightnessAirPressureCm2"/> кгс/см2 с подключением газовыми приборами. При испытании в течении <BaseTextBox v-model="form.tightnessDuration"/> давление упало на <BaseTextBox v-model="form.tightnessPressureDrop"/> МПа <BaseTextBox v-model="form.tightnessPressureDropCm2"/> кгс/см2 при допустимом падении <BaseTextBox v-model="form.tightnessPermissiblePressureDrop"/> вод/ст.  <BaseTextBox v-model="form.tightnessPermissiblePressureDropCm2"/> кгс/см2.
						</p>
						<p>
							Испытание на герметичность газопровод выдержал.
						</p>
						<div class="flex-line">Производитель работ <BaseTextBox v-model="form['workSupervisor']" placeholder="должность, инициалы, фамилия"/></div>
						<div class="flex-line">Представитель газового хозяйства <BaseTextBox v-model="form['gasRepresentative']" placeholder="должность, инициалы, фамилия"/></div>
					</li>
				</ol>

				<h2 class="center">5. ЗАКЛЮЧЕНИЕ</h2>
				<p>Внутридомовое (внутрицеховое) газооборудование (включая газопровод и ГРУ) смонтировано в соответствии с проектом, разработанным</p>
				<div class="flex-line">
					<BaseTextBox v-model="form['organizationName']" placeholder="Наименование проектной организации"/>
					<BaseTextBox v-model="form['projectReleaseDate']" type="date" placeholder="Дата выпуска проекта"/>
				</div>
				<p>с учетом согласованных изменений, внесенных в рабочие чертежи № <BaseTextBox v-model="form['drawingNumber']" placeholder="номер чертежа"/></p>
				<p>Строительство начато <BaseTextBox v-model="form['buildStartDate']" type="date"/></p>
				<p>Строительство закончено <BaseTextBox v-model="form['buildEndDate']" type="date"/></p>

				<div class="flex-line">Ведущий инженер СОВГО: <BaseTextBox v-model="form['engineerSOVGO']" placeholder="должность, инициалы, фамилия"/></div>
				<!-- <div class="flex-line">Представител газового хозяйства: <BaseTextBox placeholder="должность, инициалы, фамилия"/></div> -->
				 <!-- там gasRepresentative 2ой раз использутеся!! -->

				<p style="font-style:italic; font-size:14px; opacity:.6; line-height:1.4em; margin-bottom:.8em;">
					Примечание: Если в цехе (котельной) имеются ГРУ, смонтировано в общем помещении цеха и обслуживающая только данный цех, то на внутрицеховой газопровод и ГРУ допускается составлять общий строительный паспорт. В том случае ниже приведенную форму паспорта должны быть внесены следующие изменения
				</p>
				<ol style="list-style-type:lower-latin; margin-top:.4em;">
					<li>в раздел 1 характеристика газооборудования цеха должна быть приведена по следующей форме:</li>
					<table style="font-size:.8em; max-width:100%;">
						<thead>
							<tr>
								<td rowspan="2">Общая протяженность газопровода цеха, м</td>
								<td colspan="2">Давление газа МПа (кгс/см2)</td>
								<td colspan="4">Оборудование ГРУ, тип, размер</td>
								<td colspan="4">Газифицируемое оборудование (печи, котла, приборы, шт.)</td>
							</tr>
							<tr>
								<td>На входе P max</td>
								<td>На выходе из ГРП (рабочее Р)</td>
								<td>Регулятор давления</td>
								<td>Клапан отключитель</td>
								<td>Предохранительный сбросной клапан</td>
								<td>Фильтр</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							<DynamicRow v-model="secondTable" :n="11"/>
						</tbody>
					</table>
					<li>в разделе 2,3,4 необходимо учесть ГРУ</li>
					<li>дополнить паспорт разделом «Испытание ГРУ на прочность и герметичность»</li>
					<li>в «Заключении» вместо слов «(включая газопровод)» следует написать «(включая газопровод и ГРУ)»</li>
				</ol>
			</article>

			<!-- TODO: Вместо этого сделать некий flag -->
			<div v-if="errorMessage" class="error" style="margin-top:1em; color:red;">{{ errorMessage }}</div>

			<div style="margin:1.4em 0 5em; display:flex; justify-content:flex-end; gap:1em;">
				<BaseButton :disabled="loading" prependIcon="mdi-content-save" style="font-size:1.2em;" @click="sendDocument">Сохранить</BaseButton>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR']
});

const { $api } = useNuxtApp();
const route = useRoute();
const issueKey = route.query.issueKey as string;
import BaseAutocomplete from '~/components/common/BaseAutocomplete.vue';
import BaseButton from '~/components/common/BaseButton.vue';
import BaseMemo from '~/components/common/BaseMemo.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import DynamicRow from '~/components/DynamicRow.vue';

const errorMessage = ref('');
const loading = ref(false);


function normalizeForm(form: Record<string, any>) {
	const normalizedForm = {} as Record<string, any>;
	const fieldMap: Record<string, string> = {
		testedAirPressureDate: 'checkDate1',
		airPressure: 'airPressure1',
		airPressureCm2: 'airPressure2',
		soapEmulsionPressure: 'pressure1',
		soapEmulsionPressureCm2: 'pressure2',
		waterColumn: 'pressure3',
		tightnessAirPressure: 'pressure4',
		// tightnessAirPressureCm2: '',
		tightnessDuration: 'duration',
		tightnessPressureDrop: 'pressureDown1',
		tightnessPressureDropCm2: 'pressureDown2',
		tightnessPermissiblePressureDrop: 'pressureDown3',
		tightnessPermissiblePressureDropCm2: 'pressureDown4',
	};

	Object.keys(form).forEach(oldKey => {
		const newKey = fieldMap[oldKey] ?? oldKey;
		normalizedForm[newKey] = form[oldKey] ?? '';
	})

	return normalizedForm;
}

function sendDocument() {
	loading.value = true;
	const normalizedForm = normalizeForm(form);
	const denormalizedFirstTable = denormalizeTable(firstTable.value, 'firstTable');
	const denormalizedSecondTable = denormalizeTable(secondTable.value, 'secondTable');
	const token = useUserStore().token;

	const body = {
		issueKey,
		data: {
			...normalizedForm,
			...denormalizedFirstTable,
			...denormalizedSecondTable,
		}
	};
	fillEmptyFields(body.data);

	console.log(`body`, body);
	$api('v1/portal/generate-passport', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`
		},
		body
	})
		.then((res: any) => {
			navigateTo(`/issues/`);
		})
		.catch(err => {
			console.error(err);
			errorMessage.value = err.data.message;
		})
		.finally(() => {
			loading.value = false;
		})
}

function fillEmptyFields(form: Record<string, any>) {
	const allKeys = [
		"smrName",
		"serviceName",
		"address",
		"characteristics",
		"certificateList",
		"firstTableRow1Column1",
		"firstTableRow1Column2",
		"firstTableRow1Column3",
		"firstTableRow1Column4",
		"firstTableRow1Column5",
		"firstTableRow1Column6",
		"firstTableRow2Column1",
		"firstTableRow2Column2",
		"firstTableRow2Column3",
		"firstTableRow2Column4",
		"firstTableRow2Column5",
		"firstTableRow2Column6",
		"firstTableRow3Column1",
		"firstTableRow3Column2",
		"firstTableRow3Column3",
		"firstTableRow3Column4",
		"firstTableRow3Column5",
		"firstTableRow3Column6",
		"firstTableRow4Column1",
		"firstTableRow4Column2",
		"firstTableRow4Column3",
		"firstTableRow4Column4",
		"firstTableRow4Column5",
		"firstTableRow4Column6",
		"firstTableRow5Column1",
		"firstTableRow5Column2",
		"firstTableRow5Column3",
		"firstTableRow5Column4",
		"firstTableRow5Column5",
		"firstTableRow5Column6",
		"firstTableRow6Column1",
		"firstTableRow6Column2",
		"firstTableRow6Column3",
		"firstTableRow6Column4",
		"firstTableRow6Column5",
		"firstTableRow6Column6",
		"firstTableRow7Column1",
		"firstTableRow7Column2",
		"firstTableRow7Column3",
		"firstTableRow7Column4",
		"firstTableRow7Column5",
		"firstTableRow7Column6",
		"firstTableRow8Column1",
		"firstTableRow8Column2",
		"firstTableRow8Column3",
		"firstTableRow8Column4",
		"firstTableRow8Column5",
		"firstTableRow8Column6",
		"firstTableRow9Column1",
		"firstTableRow9Column2",
		"firstTableRow9Column3",
		"firstTableRow9Column4",
		"firstTableRow9Column5",
		"firstTableRow9Column6",
		"firstTableRow10Column1",
		"firstTableRow10Column2",
		"firstTableRow10Column3",
		"firstTableRow10Column4",
		"firstTableRow10Column5",
		"firstTableRow10Column6",
		"performingWorkPerson",
		"checkDate1",
		"airPressure1",
		"airPressure2",
		"pressure1",
		"pressure2",
		"checkDate2",
		"presure3",
		"presure4",
		"duration",
		"presureDown1",
		"presureDown2",
		"presureDown3",
		"presureDown4",
		"workSupervisor",
		"gasRepresentative",
		"organizationName",
		"projectReleaseDate",
		"drawingNumber",
		"buildStartDate",
		"buildEndDate",
		"engineerSOVGO",
		"secondTableRow1Column1",
		"secondTableRow1Column2",
		"secondTableRow1Column3",
		"secondTableRow1Column4",
		"secondTableRow1Column5",
		"secondTableRow1Column6",
		"secondTableRow1Column7",
		"secondTableRow1Column8",
		"secondTableRow1Column9",
		"secondTableRow1Column10",
		"secondTableRow1Column11",
		"secondTableRow2Column1",
		"secondTableRow2Column2",
		"secondTableRow2Column3",
		"secondTableRow2Column4",
		"secondTableRow2Column5",
		"secondTableRow2Column6",
		"secondTableRow2Column7",
		"secondTableRow2Column8",
		"secondTableRow2Column9",
		"secondTableRow2Column10",
		"secondTableRow2Column11",
		"secondTableRow3Column1",
		"secondTableRow3Column2",
		"secondTableRow3Column3",
		"secondTableRow3Column4",
		"secondTableRow3Column5",
		"secondTableRow3Column6",
		"secondTableRow3Column7",
		"secondTableRow3Column8",
		"secondTableRow3Column9",
		"secondTableRow3Column10",
		"secondTableRow3Column11",
		"secondTableRow4Column1",
		"secondTableRow4Column2",
		"secondTableRow4Column3",
		"secondTableRow4Column4",
		"secondTableRow4Column5",
		"secondTableRow4Column6",
		"secondTableRow4Column7",
		"secondTableRow4Column8",
		"secondTableRow4Column9",
		"secondTableRow4Column10",
		"secondTableRow4Column11"
	];

	allKeys.forEach(key => {
		form[key] = form[key] ?? '';
	});
}

function denormalizeTable(table: string[][], prefix: string) {
	// max firstTableRow10Column6
	const res = {} as Record<string, string>;
	for(let i = 0; i < table.length; i++) {
		const row = table[i];
		if( !row || !Array.isArray(row) ) continue;

		for(let j = 0; j < row.length; j++) {
			const cell = row[j];
			res[`${prefix}Row${i + 1}Column${j + 1}`] = cell ?? '';
		}
	}
	return res;
}

const form = reactive({}) as Record<string, string | number>;
const firstTable = ref([]) as Ref<string[][]>;
const secondTable = ref([]) as Ref<string[][]>;

const today = new Date();
const todayISO = today.toLocaleDateString('fr-CA');
form.testedAirPressureDate = todayISO; // checkDate1
form.airPressure = '0.1'; // airPressure1
form.airPressureCm2 = '1.0'; // airPressure2
form.soapEmulsionPressure = '0.005'; // pressure1
form.soapEmulsionPressureCm2 = '0.05'; // pressure2

form.waterColumn = '500мм.'; // presure3
form.tightnessAirPressure = '0.05'; // presure4
form.tightnessAirPressureCm2 = '-';
form.tightnessDuration = '5 мин.'; // duration
form.tightnessPressureDrop = '0.005'; // presureDown1
form.tightnessPressureDropCm2 = '-'; // presureDown2
form.tightnessPermissiblePressureDrop = '20 мм.'; // presureDown3
form.tightnessPermissiblePressureDropCm2 = '-'; // presureDown4

const userData = JSON.parse( localStorage.getItem('user') || '{}' );
form['smrName'] = userData.userName ?? '';

const issues = useAppStore().issues;
if( issueKey ) {
	const issue = issues.find(issue => issue.issueKey === issueKey);
	if( issue ) {
		form['address'] = issue?.address ?? '';
	}
}
</script>

<style lang="scss">
.construct-pass-page {
	.documents {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: .6em;
		margin-top:5em;
		padding: 0 1rem;

		.document {
			font-family: serif;
			color: #222;
			background-color: #fff;
			position: relative;
			padding: clamp(1.4em, 3vw, 2em) clamp(1.8em, 6vw, 4em);
			width: min(800px, 100%);
			border-radius: 6px;
			box-shadow: 0 6px 40px rgba(0,0,0,.05);
			// box-shadow: 0 0 8px 0px #0079C1aa;
			overflow-x: auto;

			h1 {
				font-size: clamp(18px, 2.6vw, 24px);
			}
			h2 {
				font-size: clamp(16px, 2.4vw, 20px);
			}

			p {
				text-indent:2em;
				line-height:1.4em;

				.base-text-box {
					display: inline-block;
					input {
						field-sizing: content;
					}
				}
			}

			.center {
				text-align: center;
			}

			.small {
				font-size: .8em;
				opacity: .6;
			}

			.flex-line {
				display:flex;
				align-items:center;
				gap:1em;
				flex-wrap: wrap;

				&>* {
					flex:1 1 220px;
					min-width: 0;
				}
			}

			table {
				width: 100%;
				border-collapse: collapse;
				font-size: 14px;

				td, th {
					border: 1px solid #ddd;
					text-align: center;
					padding: .4em;
				}
			}
		}
	}

	table td[contenteditable]:empty::before {
		// content: attr(data-placeholder);
		content: "___";
		opacity: .35;
	}
	table td[contenteditable]:focus::before {
		content: "";
	}
	table td[contenteditable] {
		min-width: 4ch;
		padding: .4rem .6rem;
		outline: none;
		border: 1px solid #e5e7eb;
	}
	table tr + tr td {
		border-top: none;
	}

	@media (max-width: 768px) {
		.documents {
			margin-top: 2.4em;
			gap: 1em;
		}

		.document {
			padding: 1.2em 1.4em;
			border-radius: 10px;
			box-shadow: 0 4px 18px rgba(0,0,0,.08);

			.flex-line {
				gap: .6em;
			}

			table {
				font-size: 13px;
			}
		}
	}
}
</style>
