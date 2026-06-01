<template>
	<section id="complaint-create-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Жалобы' }]"/>

		<header>
			<div>
				<h2>Жалобы</h2>
				<p>Регистрация и контроль исполнения обращений абонентов</p>
			</div>
		</header>

		<BaseIsland title="Регистрация жалобы" prependIcon="mdi-pencil-box-outline">
			<div class="form-grid">
				<section class="left">
					<div class="field">
						<label>Абонент<BaseIcon name="mdi-account-check"/></label>

						<div class="search">
							<BaseTextBox model-value="" placeholder="Поиск по ФИО или лицевому счёту..."/>
							<BaseButton variant="outlined" icon="mdi-magnify"/>
						</div>
					</div>

					<div class="subscriber-card">
						<strong>Маратов Ержан Кайратович</strong>
						<span>| ЛС: 10 000 26 57</span>
						<span>| Чуйская область, Ысык-Атинский район, ул. Абая 45, кв. 12</span>
					</div>

					<div class="field">
						<label>Клиент</label>
						<BaseTextBox model-value="" placeholder="Введите ФИО"/>
					</div>

					<div class="field">
						<BaseTextBox model-value="" placeholder="Введите Номер телефона: +996......"/>
					</div>
				</section>

				<section class="right">
					<div class="field">
						<label>Тема обращения<span>*</span></label>

						<BaseSelect
							model-value="Некорректные начисления"
							:items="[
								'Некорректные начисления',
								'Нет газа',
								'Проблема со счётчиком',
								'Консультация',
							]"
						/>
					</div>

					<div class="right-row">
						<div class="field">
							<label>Подтверждающие материалы</label>

							<div class="upload">
								<div class="upload-box">
									<BaseIcon name="mdi-cloud-upload"/>
									<span>Перетащите<br>файлы или</span>
									<BaseButton size="small" variant="outlined">Выбрать</BaseButton>
									<small>Макс. 10 МБ</small>
								</div>

								<div class="files">
									<div class="file"
										v-for="(file, index) of [
											{ name: 'фото_плиты.jpg', icon: 'mdi-image-outline' },
											{ name: 'акт_проверки.pdf', icon: 'mdi-file-pdf-box' },
										]" :key="index">
										<v-icon :icon="file.icon"/>
										<span>{{ file.name }}</span>
										<button type="button">
											<BaseIcon name="mdi-close"/>
										</button>
									</div>
								</div>
							</div>
						</div>

						<div class="field urgency">
							<label>Уровень срочности</label>
							<BaseSelect model-value="Обычная" :items="['Обычная', 'Высокая', 'Критическая']"/>
						</div>
					</div>
				</section>

				<section class="description">
					<div class="field">
						<label>Описание ситуации</label>

						<BaseTextarea model-value="" placeholder="Подробное описание проблемы абонента..."/>
					</div>
				</section>

				<section class="answer-template">
					<div class="template-title">
						<BaseIcon name="mdi-file-document-outline"/>
						<strong>Шаблон ответа абоненту</strong>
					</div>

					<div class="template-text">
						Уважаемый(ая) Маратов Ержан Кайратович! Ваше обращение №ЖЛ-2025-04187 от 12.06.2025 принято в работу.
						Ответственный специалист - Закирова А. Плановый срок рассмотрения — до 19.06.2026.
						По результатам проверки Вам будет направлено уведомление. Благодарим за обращение.
						С уважением, КЦ ОсОО «Газпром Кыргызстан».
					</div>
				</section>

				<section class="actions">
					<BaseButton>Зарегистрировать жалобу</BaseButton>
					<BaseButton variant="outlined">Очистить</BaseButton>
				</section>
			</div>
		</BaseIsland>

		<BaseIsland title="Реестр жалоб" prependIcon="mdi-file-document-outline">
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
			/>
		</BaseIsland>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTable from '~/components/common/base/BaseTable.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'sidebar'
});
</script>

<style lang="scss">
#complaint-create-page {
	header {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 16px;

		h2 {
			margin: 0;
			font-size: 22px;
			font-weight: 700;
		}

		p {
			margin: 4px 0 0;
			color: #6b7280;
			font-size: 14px;
		}

		.updated {
			display: flex;
			align-items: center;
			gap: 6px;
			margin-top: 4px;
			color: #6b7280;
			font-size: 12px;
			white-space: nowrap;

			.v-icon {
				font-size: 15px;
			}
		}
	}

	.form-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(360px, .85fr);
		gap: 28px 84px;
	}

	.left,
	.right {
		display: grid;
		align-content: start;
		gap: 14px;
	}

	.field {
		display: grid;
		gap: 7px;

		label {
			display: flex;
			align-items: center;
			gap: 6px;
			font-size: 13px;
			font-weight: 700;
			color: #333;

			.v-icon,
			span {
				color: #2563eb;
			}

			.v-icon {
				font-size: 16px;
			}
		}
	}

	.search {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 44px;
		gap: 10px;
	}

	.subscriber-card {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 42px;
		padding: 0 12px;
		border-radius: 8px;
		background: #eaf1ff;
		color: #4b5563;
		font-size: 12px;

		strong {
			color: #174ea6;
			font-size: 13px;
			white-space: nowrap;
		}

		span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.right-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 150px;
		gap: 28px;
		align-items: start;
	}

	.upload {
		display: grid;
		gap: 10px;
	}

	.upload-box {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		align-items: center;
		gap: 10px;
		min-height: 58px;
		padding: 10px 12px;
		border: 2px dashed #d1d5db;
		border-radius: 10px;
		background: #fafafa;
		color: #6b7280;
		font-size: 12px;

		.v-icon {
			color: #9ca3af;
			font-size: 22px;
		}

		small {
			color: #9ca3af;
			font-size: 11px;
		}
	}

	.files {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.file {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 5px 8px;
		border-radius: 5px;
		background: #eef3ff;
		color: #2563eb;
		font-size: 12px;
		font-weight: 600;

		.v-icon {
			font-size: 14px;
		}

		button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 16px;
			height: 16px;
			padding: 0;
			border: 0;
			background: transparent;
			color: #9ca3af;
			cursor: pointer;

			.v-icon {
				font-size: 12px;
			}
		}
	}

	.urgency {
		:deep(.base-select),
		:deep(.v-field) {
			background: #fff3b0;
		}
	}

	.description {
		grid-column: 1 / -1;

		:deep(textarea) {
			min-height: 74px;
		}
	}

	.answer-template {
		grid-column: 1 / -1;
		display: grid;
		gap: 14px;
		padding: 18px 22px 26px;
		border: 1px solid #bdd0ff;
		border-radius: 14px;
		background: #eaf1ff;
	}

	.template-title {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #174ea6;
		font-size: 14px;

		.v-icon {
			font-size: 16px;
		}
	}

	.template-text {
		padding: 14px 16px;
		border-radius: 8px;
		background: #fff;
		color: #333;
		font-size: 14px;
		line-height: 1.45;
	}

	.actions {
		grid-column: 1 / -1;
		display: flex;
		justify-content: flex-end;
		gap: 14px;
	}

	@media (max-width: 1100px) {
		.form-grid {
			grid-template-columns: 1fr;
			gap: 22px;
		}

		.right-row {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		header {
			display: grid;

			.updated {
				white-space: normal;
			}
		}

		.subscriber-card {
			display: grid;
			gap: 4px;
			padding: 10px 12px;

			strong,
			span {
				white-space: normal;
			}
		}

		.upload-box {
			grid-template-columns: 1fr;
			justify-items: start;
		}

		.actions {
			display: grid;
			grid-template-columns: 1fr;
		}
	}
}
</style>
