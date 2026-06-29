<template>
	<div v-if="bill" class="bill-modal">
		<main class="bm-content">
			<section class="bm-head">
				<div>
					<div class="bm-label">Квитанция</div>
					<h3>за {{ monthText }}</h3>
				</div>
				<div class="bm-total">
					<div class="bm-label">К оплате</div>
					<strong>{{ money(bill.payValue) }}</strong>
				</div>
			</section>

			<section class="bm-meta">
				<div class="bm-item">
					<div class="bm-label">Лицевой счет</div>
					<div class="bm-value">{{ bill.account }}</div>
				</div>
				<div class="bm-item">
					<div class="bm-label">Абонент</div>
					<div class="bm-value">{{ bill.fullName || 'Не указан' }}</div>
				</div>
				<div class="bm-item bm-wide">
					<div class="bm-label">Адрес</div>
					<div class="bm-value">{{ bill.address || 'Не указан' }}</div>
				</div>
			</section>

			<section class="bm-sections">
				<section class="bm-block">
					<header>
						<BaseIcon name="mdi-counter"/>
						<h4>Показания</h4>
					</header>
					<div class="bm-rows">
						<div class="bm-row">
							<span>Предыдущие</span>
							<strong>{{ bill.prevReadingsValue }} м³</strong>
							<small>{{ formatDate(bill.prevReadingsDate) || 'Дата не указана' }}</small>
						</div>
						<div class="bm-row">
							<span>Последние</span>
							<strong>{{ bill.lastReadingsValue }} м³</strong>
							<small>{{ formatDate(bill.lastReadingsDate) || 'Дата не указана' }}</small>
						</div>
						<div class="bm-row">
							<span>Расход</span>
							<strong>{{ consumption }} м³</strong>
							<small>К начислению: {{ bill.accrualM3Value }} м³</small>
						</div>
					</div>
				</section>

				<section class="bm-block">
					<header>
						<BaseIcon name="mdi-alert-circle-outline"/>
						<h4>Задолженность</h4>
					</header>
					<div class="bm-rows">
						<div class="bm-row">
							<span>Газ</span>
							<strong>{{ money(bill.balanceAccrualGasValue) }}</strong>
						</div>
						<div class="bm-row">
							<span>Пеня</span>
							<strong>{{ money(bill.balanceAccrualFineValue) }}</strong>
						</div>
						<div class="bm-row bm-total-row">
							<span>Итого долг</span>
							<strong>{{ debtValue > 0 ? money(debtValue) : 'нет' }}</strong>
						</div>
					</div>
				</section>

				<section class="bm-block">
					<header>
						<BaseIcon name="mdi-calculator-variant-outline"/>
						<h4>Начислено за период</h4>
					</header>
					<div class="bm-rows">
						<div class="bm-row">
							<span>Тариф</span>
							<strong>{{ money(bill.tariff) }} / м³</strong>
						</div>
						<div class="bm-row">
							<span>Газ</span>
							<strong>{{ money(bill.accrualGasValue) }}</strong>
						</div>
						<div class="bm-row">
							<span>Перерасчет</span>
							<strong>{{ bill.accrualRecalculationValue ? money(bill.accrualRecalculationValue) : 'нет' }}</strong>
						</div>
						<div class="bm-row">
							<span>Пеня</span>
							<strong>{{ bill.accrualFineValue ? money(bill.accrualFineValue) : 'нет' }}</strong>
						</div>
					</div>
				</section>

				<section class="bm-block bm-accent">
					<header>
						<BaseIcon name="mdi-cash-check"/>
						<h4>К оплате</h4>
					</header>
					<div class="bm-rows">
						<div class="bm-row">
							<span>Газ</span>
							<strong>{{ money(bill.payGasValue) }}</strong>
						</div>
						<div class="bm-row">
							<span>Пеня</span>
							<strong>{{ money(bill.payFineValue) }}</strong>
						</div>
						<div class="bm-row" v-if="bill.overpayValue">
							<span>Переплата</span>
							<strong>{{ money(bill.overpayValue) }}</strong>
						</div>
						<div class="bm-row bm-total-row">
							<span>Итого</span>
							<strong>{{ money(bill.payValue) }}</strong>
						</div>
					</div>
				</section>
			</section>
		</main>

		<footer class="bm-footer">
			<div class="bm-hint">
				Последняя оплата: {{ bill.lastPayDate ? `${formatDate(bill.lastPayDate)} · ${money(bill.lastPayGasValue + bill.lastPayFineValue)}` : 'нет данных' }}
			</div>
			<BaseButton prependIcon="mdi-close" variant="secondary" @click="close">Закрыть</BaseButton>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '../common/base/BaseButton.vue';
import BaseIcon from '../common/base/BaseIcon.vue';
import type { AccountData } from '~/types/Facility';
import { formatDate, formatMonth } from '~/utils/format';

type Bill = NonNullable<AccountData['bill']>;

const props = defineProps<{
	payload?: {
		bill?: Bill | null;
	};
}>();

const bill = computed(() => props.payload?.bill || null);
const monthText = computed(() => formatMonth(bill.value?.accrualMonth) || bill.value?.accrualMonth || 'период не указан');
const consumption = computed(() => {
	if (!bill.value) return 0;
	return bill.value.lastReadingsValue - bill.value.prevReadingsValue;
});
const debtValue = computed(() => {
	if (!bill.value) return 0;
	return bill.value.balanceAccrualGasValue + bill.value.balanceAccrualFineValue;
});
const moneyFormatter = new Intl.NumberFormat('ru-RU', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

function money(value: number | null | undefined) {
	return `${moneyFormatter.format(Number(value || 0))} сом`;
}

function close() {
	const appStore = useAppStore();
	const modal = appStore?.modals.pop();
	if (modal?.resolve) modal.resolve(false);
}
</script>

<style lang="scss">
.bill-modal {
	.bm-content {
		display: grid;
		gap: 1em;
		padding-bottom: 1.2em;

		.bm-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1em;
			padding: 1em;
			border-radius: 8px;
			background: #eef5ff;

			h3 {
				margin: .1em 0 0;
				color: #172b4d;
				font-size: 1.35rem;
			}

			.bm-total {
				text-align: right;

				strong {
					color: #174ea6;
					font-size: 1.45rem;
				}
			}
		}

		.bm-label {
			color: #64748b;
			font-size: .78rem;
		}

		.bm-meta {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: .7em;

			.bm-item {
				padding: .8em;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				background: #fff;

				.bm-value {
					margin-top: .25em;
					color: #111827;
				}

				&.bm-wide {
					grid-column: 1 / -1;
				}
			}
		}

		.bm-sections {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: .8em;

			.bm-block {
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				overflow: hidden;

				header {
					display: flex;
					align-items: center;
					gap: .45em;
					padding: .75em .85em;
					border-bottom: 1px solid #eff6ff;
					color: #174ea6;

					h4 {
						margin: 0;
						color: #172b4d;
					}
				}

				.bm-rows {
					display: grid;

					.bm-row {
						display: grid;
						grid-template-columns: minmax(0, 1fr) auto;
						gap: .35em .8em;
						padding: .7em .85em;

						&:not(:last-child) {
							border-bottom: 1px solid #f1f5f9;
						}

						span {
							color: #64748b;
						}

						strong {
							color: #111827;
							text-align: right;
						}

						small {
							grid-column: 1 / -1;
							color: #94a3b8;
						}

						&.bm-total-row {
							background: #f8fafc;

							strong {
								color: #174ea6;
							}
						}
					}
				}

				&.bm-accent {
					border-color: #bfdbfe;

					bm-header,
					.bm-total-row {
						background: #eff6ff;
					}
				}
			}
		}
	}

	.bm-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;

		.bm-hint {
			color: #64748b;
			font-size: .86rem;
		}
	}

	@media (max-width: 760px) {
		width: 100%;

		.bm-content {
			.bm-head {
				display: grid;

				.bm-total {
					text-align: left;
				}
			}

			.bm-meta,
			.bm-sections {
				grid-template-columns: 1fr;
			}
		}

		.bm-footer {
			display: grid;
		}
	}
}
</style>
