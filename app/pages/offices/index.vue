<template>
	<section id="offices-page">

		<section class="row-offices">
			<BaseIsland title="Офисы обслуживания" prependIcon="mdi-office-building-outline" data-aos="zoom-in">
				<template #actions>
					<a href="#">3 обновления</a>
				</template>

				<div class="office-list">
					<article
						v-for="(item, index) of offices"
						:key="index"
						:class="['office-card', item.type]"
						data-aos="fade-up"
					>
						<div class="office-meta">
							<span class="actual">Актуально</span>
							<span :class="['priority', item.priorityClass]">{{ item.priority }}</span>
							<span>Опубликовано: {{ item.publishedAt }}</span>
							<span>Действует до: {{ item.activeTo }}</span>
						</div>

						<div class="office-title">
							<BaseIcon :name="item.icon"/>
							<strong>{{ item.title }}</strong>
						</div>

						<p>{{ item.description }}</p>

						<div class="voice-text">
							<div>
								<BaseIcon name="mdi-microphone-outline"/>
								<span>Текст для озвучивания:</span>
							</div>

							<p>«{{ item.voiceText }}»</p>
						</div>
					</article>
				</div>
			</BaseIsland>
		</section>

	</section>
</template>

<script lang="ts" setup>
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTRACTOR', 'CALLCENTER'],
	layout: 'authorized'
});

const offices = [
	{
		priority: 'СРЕДНИЙ',
		priorityClass: 'medium',
		type: 'default',
		icon: 'mdi-alert-outline',
		title: 'Праздничные изменения — Нооруз, 21 марта',
		publishedAt: '14.03.2026',
		activeTo: '21.03.2026',
		description: 'Все офисы обслуживания будут закрыты 21 марта. 20 марта — сокращённый день до 16:00. С 22 марта офисы работают в обычном режиме.',
		voiceText: 'В праздничные дни Нооруза наши офисы будут закрыты 21 марта. 20 марта работаем до 16:00.',
	},
	{
		priority: 'СРЕДНИЙ',
		priorityClass: 'medium',
		type: 'default',
		icon: 'mdi-clock-outline',
		title: 'Стандартный режим работы офисов',
		publishedAt: '12.01.2024',
		activeTo: 'Постоянно',
		description: 'Пн–Пт: 08:00–17:00, перерыв 12:00–13:00. Сб–Вс: выходной. Касса закрывается за 30 минут до конца рабочего дня.',
		voiceText: 'Наши офисы работают с понедельника по пятницу с 8:00 до 17:00, суббота и воскресенье — выходной.',
	},
	{
		priority: 'ВЫСОКИЙ',
		priorityClass: 'high',
		type: 'danger',
		icon: 'mdi-close-circle-outline',
		title: 'Временное закрытие офиса на ул. Ю. Фучика 19',
		publishedAt: '15.04.2026',
		activeTo: '22.05.2026',
		description: 'Офис временно закрыт в связи с ремонтом помещения. Абонентов просим обращаться в офис на ул. М. Горького 22 либо И. Ахунбаева 146.',
		voiceText: 'Офис на улице Ю. Фучика временно закрыт на ремонт. Ближайший офис — на И. Ахунбаева, 416 и М. Горького 22. Приносим извинения за предоставленные неудобства.',
	},
];
</script>

<style lang="scss">
#offices-page {
	display: flex;
	flex-direction: column;
	gap: 18px;

	.row-tariffs,
	.row-offices {
		width: 100%;
	}

	.tariff-links {
		display: flex;
		gap: 18px;

		a {
			color: #2563eb;
			font-size: 12px;
			font-weight: 700;
			text-decoration: none;
		}
	}

	.tariffs {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	.tariff-card {
		display: grid;
		align-content: space-between;
		gap: 12px;
		min-height: 210px;
		padding: 20px;
		border: 1px solid #e5e7eb;
		border-radius: 14px;
		background: #fff;

		.status {
			display: flex;
			align-items: center;
			gap: 6px;
			color: #059669;
			font-size: 12px;
			font-weight: 700;
		}

		strong {
			font-size: 15px;
			font-weight: 800;
		}

		.price {
			color: #2563eb;
			font-size: 34px;
			font-weight: 900;
			line-height: 1;

			span {
				font-size: 26px;
			}
		}

		p {
			margin: 0;
			padding: 12px;
			border-radius: 8px;
			background: rgba(255, 255, 255, .72);
			color: #4b5563;
			font-size: 12px;
			line-height: 1.4;
		}

		&.blue {
			border-color: #bcd3ff;
			background: #eaf2ff;
		}

		&.orange {
			.price {
				color: #d97706;
			}

			p {
				color: #b45309;
				background: #fff7ed;
			}
		}
	}

	.office-list {
		display: grid;
		gap: 14px;
	}

	.office-card {
		display: grid;
		gap: 12px;
		padding: 18px 20px;
		border: 1px solid #e5e7eb;
		border-radius: 14px;
		background: #fff;

		&.danger {
			border-color: #fecaca;
			background: #fff1f2;
		}
	}

	.office-meta {
		display: grid;
		grid-template-columns: 110px 100px 1fr auto;
		align-items: center;
		gap: 16px;
		color: #6b7280;
		font-size: 12px;

		.actual {
			color: #059669;
			font-weight: 800;
		}

		.priority {
			font-weight: 800;

			&.medium {
				color: #374151;
			}

			&.high {
				color: #dc2626;
			}
		}
	}

	.office-title {
		display: flex;
		align-items: center;
		gap: 8px;

		.base-icon {
			color: #d97706;
		}

		strong {
			font-size: 15px;
			font-weight: 800;
		}
	}

	.office-card.danger {
		.office-title {
			.base-icon {
				color: #ef4444;
			}
		}
	}

	.office-card > p {
		margin: 0;
		color: #374151;
		font-size: 14px;
		line-height: 1.45;
	}

	.voice-text {
		display: grid;
		gap: 8px;
		margin-top: 8px;
		padding: 14px 16px;
		border-radius: 10px;
		background: #f9fafb;

		div {
			display: flex;
			align-items: center;
			gap: 6px;
			color: #6b7280;
			font-size: 12px;
		}

		p {
			margin: 0;
			color: #111827;
			font-size: 14px;
			line-height: 1.45;
		}
	}

	a {
		color: #2563eb;
		font-size: 12px;
		font-weight: 700;
		text-decoration: none;
	}

	@media (max-width: 1000px) {
		.tariffs {
			grid-template-columns: 1fr;
		}

		.office-meta {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 8px 16px;
		}
	}

	@media (max-width: 640px) {
		.office-meta {
			grid-template-columns: 1fr;
		}

		.tariff-card {
			min-height: auto;
		}
	}
}
</style>
