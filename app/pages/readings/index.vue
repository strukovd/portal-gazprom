<template>
	<section id="readings-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Показания счётчика' }]"/>
		<h2>Приём показаний</h2>

		<section class="page-grid" style="gap:.8em;">
			<section class="col-7 left-column">
				<BaseIsland title="Выбор абонента" prependIcon="mdi-account-box">
					<div class="subscriber">
						<div class="field">
							<label>Абонент</label>
							<BaseTextBox model-value="Сидорова Елена Викторовна" prependIcon="mdi-magnify"/>
						</div>

						<a href="#" class="profile-link">Карточка</a>
					</div>

					<div class="subscriber-meta">
						<div>
							<span>Лицевой счёт:</span>
							<strong>10 000 26 47</strong>
						</div>

						<div>
							<span>Адрес:</span>
							<strong>Чуйская область, Ысык-Атинский район,<br>Новопокровка, ул. Ленина, д. 47</strong>
						</div>
					</div>
				</BaseIsland>

				<BaseIsland title="Данные счётчика и показания" prependIcon="mdi-counter">
					<div class="info-grid">
						<div>
							<span>Тип счётчика</span>
							<strong>Телеметрия</strong>
						</div>

						<div>
							<span>Заводской №</span>
							<strong>09284756</strong>
						</div>

						<div>
							<span>Предыдущие показания</span>
							<strong>4 827 м³</strong>
						</div>

						<div>
							<span>Дата последней передачи</span>
							<strong>18.04.2026</strong>
						</div>

						<div>
							<span>Допустимый диапазон</span>
							<strong class="blue">4 827 – 5 827 м³</strong>
						</div>

						<div>
							<span>Период приёма</span>
							<strong>10.05 – 31.05.2026</strong>
						</div>
					</div>

					<div class="divider"></div>

					<div class="new-value">
						<label>Новое показание (м³)</label>

						<div class="actions">
							<BaseTextBox model-value="4 891"/>
							<BaseButton>Отправить</BaseButton>
							<BaseButton variant="outlined">Сброс</BaseButton>
						</div>
					</div>

					<div class="message success">
						<BaseIcon name="mdi-check-circle-outline"/>
						<span>Значение в допустимом диапазоне, показания приняты</span>
					</div>

					<div class="message warning">
						<BaseIcon name="mdi-alert-outline"/>
						<span>Внимание: Текущие показание меньше предыдущих на 200 м³, показания не приняты</span>
					</div>
				</BaseIsland>

				<BaseIsland title="Предпросмотр результата" prependIcon="mdi-eye-circle-outline">
					<div class="result-grid">
						<div>
							<span>Расчет потребления</span>
							<strong class="blue">64 м³</strong>
						</div>

						<div>
							<span>Дата приема показаний</span>
							<strong>20.05.2026, 14:32</strong>
						</div>

						<div>
							<span>Тариф</span>
							<strong class="blue">24,10 сом/м³</strong>
						</div>

						<div>
							<span>Сумма потребления</span>
							<strong>1542,4 сом</strong>
						</div>
					</div>
				</BaseIsland>
			</section>

			<section class="col-5 right-column">
				<BaseIsland class="no-api" title="Статистика принятых показаний" prependIcon="mdi-finance">
					<div class="stats">
						<div class="stat-card">
							<strong>147</strong>
							<span>Успешно принято</span>
						</div>

						<div class="stat-card danger">
							<strong>5</strong>
							<span>Ошибка в показаниях.</span>
						</div>
					</div>
				</BaseIsland>

				<BaseIsland title="Проверка на ошибки" prependIcon="mdi-alert-circle-outline">
					<div class="checks">
						<div class="check-item">
							<BaseIcon name="mdi-check"/>
							<span>Текущие показания не ниже предыдущего более чем 100 м³</span>
						</div>

						<div class="check-item">
							<BaseIcon name="mdi-check"/>
							<span>Скачок в пределах нормы</span>
						</div>

						<div class="check-item">
							<BaseIcon name="mdi-check"/>
							<span>Текущие показания больше предыдущих более чем в 5 раз</span>
						</div>

						<div class="check-item">
							<BaseIcon name="mdi-check"/>
							<span>Период приёма: допустимый с 10 по 30/31 числа</span>
						</div>
					</div>
				</BaseIsland>

				<BaseIsland class="no-api" title="Журнал последних действий" prependIcon="mdi-history">
					<div class="journal">
						<div class="journal-item">
							<div>
								<strong>Сидорова Е.В. ЛС: 10 000 26 47</strong>
								<span>4 891 м³ · 20.04.2026 14:32</span>
							</div>

							<b class="accepted">Принято</b>
							<a href="#">Открыть</a>
						</div>

						<div class="journal-item">
							<div>
								<strong>Кузнецов М.А. ЛС: 10 000 26 44</strong>
								<span>2 314 м³ · 20.05.2025 14:18</span>
							</div>

							<b class="accepted">Принято</b>
							<a href="#">Открыть</a>
						</div>

						<div class="journal-item">
							<div>
								<strong>Ахметова Р.Т. ЛС: 10 000 26 42</strong>
								<span>7 100 м³ · 20.06.2025 13:55</span>
							</div>

							<b class="error">Ошибка</b>
							<a href="#">Открыть</a>
						</div>

						<div class="journal-item">
							<div>
								<strong>Петров И.Д.</strong>
								<span>1 583 м³ · 20.6.2025 13:40</span>
							</div>

							<b class="accepted">Принято</b>
							<a href="#">Открыть</a>
						</div>

						<div class="journal-item">
							<div>
								<strong>Галиева Н.С.</strong>
								<span>3 247 м³ · 20.06.2025 13:12</span>
							</div>

							<b class="repeat">Повтор</b>
							<a href="#">Открыть</a>
						</div>
					</div>
				</BaseIsland>
			</section>
		</section>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR', 'CALLCENTER'],
	layout: 'authorized'
});
</script>

<style lang="scss">
#readings-page {
	.page-grid {
		align-items: start;
	}

	.left-column,
	.right-column {
		display: flex;
		flex-direction: column;
		gap: .8em;
	}

	h2 {
		margin: 0 0 16px;
		font-size: 22px;
		font-weight: 700;
	}

	.subscriber {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: 12px;

		.field {
			display: grid;
			gap: 6px;
		}

		label {
			font-size: 13px;
			color: #555;
		}

		.profile-link {
			padding-bottom: 10px;
			font-size: 13px;
			font-weight: 600;
			color: #2563eb;
			text-decoration: none;
		}
	}

	.subscriber-meta {
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: 20px;
		margin-top: 16px;

		div {
			display: grid;
			gap: 4px;
		}

		span {
			font-size: 12px;
			color: #777;
		}

		strong {
			font-size: 13px;
			line-height: 1.25;
		}
	}

	.info-grid,
	.result-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px 40px;

		div {
			display: grid;
			gap: 4px;
		}

		span {
			font-size: 12px;
			color: #777;
		}

		strong {
			font-size: 14px;
			line-height: 1.25;
		}

		.blue {
			color: #2563eb;
		}
	}

	.result-grid {
		max-width: 520px;
	}

	.divider {
		height: 1px;
		margin: 20px 0 16px;
		background: #eee;
	}

	.new-value {
		display: grid;
		gap: 10px;

		label {
			font-size: 14px;
			font-weight: 700;
		}

		.actions {
			display: grid;
			grid-template-columns: 180px 110px 80px;
			gap: 10px;
		}
	}

	.message {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 10px;
		padding: 10px 12px;
		border-radius: 8px;
		font-size: 13px;

		.v-icon {
			font-size: 16px;
		}

		&.success {
			color: #058039;
			background: #e8f9ef;
		}

		&.warning {
			color: #9a6500;
			background: #fff1bf;
		}
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;

		.stat-card {
			display: grid;
			place-items: center;
			gap: 6px;
			min-height: 74px;
			border-radius: 12px;
			background: #f1f4f9;

			strong {
				font-size: 28px;
				line-height: 1;
				color: #2563eb;
			}

			span {
				font-size: 12px;
				color: #777;
			}

			&.danger strong {
				color: #ff3045;
			}
		}
	}

	.checks {
		display: grid;
		gap: 10px;

		.check-item {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 10px 12px;
			border-radius: 8px;
			color: #058039;
			background: #e7f8ef;
			font-size: 13px;

			.v-icon {
				font-size: 16px;
			}
		}
	}

	.journal {
		display: grid;

		.journal-item {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto auto;
			align-items: center;
			gap: 14px;
			padding: 11px 0;
			border-bottom: 1px solid #eee;

			&:last-child {
				border-bottom: 0;
			}

			div {
				display: grid;
				gap: 4px;
				min-width: 0;
			}

			strong {
				font-size: 13px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			span {
				font-size: 12px;
				color: #777;
			}

			b {
				font-size: 12px;
			}

			a {
				font-size: 12px;
				font-weight: 600;
				color: #2563eb;
				text-decoration: none;
			}

			.accepted {
				color: #058039;
			}

			.error {
				color: #dc2626;
			}

			.repeat {
				color: #d95f00;
			}
		}
	}

	@media (max-width: 1024px) {
		.col-7,
		.col-5 {
			grid-column: span 12;
		}
	}

	@media (max-width: 768px) {
		.subscriber,
		.subscriber-meta,
		.info-grid,
		.result-grid,
		.stats {
			grid-template-columns: 1fr;
		}

		.new-value {
			.actions {
				grid-template-columns: 1fr;
			}
		}

		.journal {
			.journal-item {
				grid-template-columns: 1fr;
				gap: 6px;
			}
		}
	}
}
</style>
