<template>
	<section id="news-page">

		<section class="row-tabs">
			<BaseTabs v-model="form.tab" :items="[
				{ caption: 'Все', key: undefined },
				{ caption: 'Отключение', key: 'gas-off' },
				{ caption: 'Газификация', key: 'gasification' },
			]"/>
		</section>

		<section v-if="!form.tab || form.tab === `gas-off`" class="row-outages">
			<BaseIsland title="Отключение газа по районам" prependIcon="mdi-fire-alert">
				<template #actions>
					<div class="island-actions">
						<span>3 активных</span>
						<a href="#">К абоненту →</a>
					</div>
				</template>

				<section class="filters">
					<BaseAutocomplete model-value="Все районы" :items="['Все районы', 'Ленинский район', 'Октябрьский район', 'Аламединский район']" prepend-icon="mdi-navigation-variant-outline"/>
					<BaseTextBox model-value="" type="date"/>
					<BaseTextBox model-value="" placeholder="Улица..." prepend-icon="mdi-road-variant"/>
					<BaseButton>Найти</BaseButton>
				</section>

				<section class="outage-list">
					<article
						v-for="(item, index) of [
							{
								type: 'danger',
								priority: 'ВЫСОКИЙ',
								publishedAt: '15.01.2026',
								activeLabel: 'Действует до',
								activeTo: '15.01.2026 18:00',
								status: 'Актуально',
								title: 'Бишкекгаз: Ленинский район, ул. Калинина от дома 12 до дома 225',
								description: 'Аварийное отключение газа в связи с утечкой на распределительном узле. Ведутся восстановительные работы. Ориентировочный срок устранения — 48 часов',
								voiceText: 'На данный момент на вашей улице ведутся аварийные работы. Ориентировочный срок восстановления — до 16 января. Следите за обновлениями на нашем сайте.',
							},
							{
								type: 'warning',
								priority: 'СРЕДНИЙ',
								publishedAt: '14.01.2026',
								activeLabel: 'Действует до',
								activeTo: '16.01.2026 20:00',
								status: 'Актуально',
								title: 'Бишкекгаз: Октябрьский район — мкр. 10, д. 1–15',
								description: 'Плановое отключение газоснабжения с 09:00 до 18:00 в связи с ремонтными работами на газопроводе. Подача газа будет возобновлена до конца рабочего дня.',
								voiceText: 'Уважаемый абонент, на вашей улице сегодня проводятся плановые ремонтные работы. Подача газа будет восстановлена до 18:00. Приносим извинения за неудобства.',
							},
							{
								type: 'default',
								priority: 'ОБЫЧНЫЙ',
								publishedAt: '13.01.2026',
								activeLabel: 'Действует до',
								activeTo: '17.01.2026 12:00',
								status: 'Актуально',
								title: 'Бишкекгаз: Ленинский район, ж/м Арча-Бешик — ул. Тулебаева, д. 100–130',
								description: 'Плановая замена задвижки на газопроводе низкого давления. Работы продлятся 3 дня.',
								voiceText: 'На улице Тулебаева ведутся плановые работы по замене оборудования. Подача газа будет восстановлена до 17 января.',
							},
							{
								type: 'old',
								priority: 'ОБЫЧНЫЙ',
								publishedAt: '10.01.2026',
								activeLabel: 'Действовало до',
								activeTo: '12.01.2026',
								status: 'Устарело',
								title: 'Бишкекгаз: Аламединский район — ул. Жаштык, д. 20–35',
								description: 'Завершённые плановые работы по модернизации газопровода. Газоснабжение восстановлено.',
								voiceText: '',
							},
						]"
						:key="index"
						:class="['outage-card', item.type]"
					>
						<div class="meta">
							<b>{{ item.priority }}</b>
							<span>Опубликовано: {{ item.publishedAt }}</span>
							<span>{{ item.activeLabel }}: {{ item.activeTo }}</span>
							<strong :class="{ muted: item.status === 'Устарело' }">
								{{ item.status }}
							</strong>
						</div>

						<h3>{{ item.title }}</h3>

						<p>{{ item.description }}</p>

						<div
							v-if="item.voiceText"
							class="voice-text"
						>
							<div>
								<BaseIcon name="mdi-microphone-outline"/>
								<span>Текст для озвучивания:</span>
							</div>

							<p>«{{ item.voiceText }}»</p>
						</div>
					</article>
				</section>
			</BaseIsland>
		</section>

		<section v-if="!form.tab || form.tab === 'gasification'" class="row-gasification">
			<BaseIsland title="Газификация населённых пунктов" prependIcon="mdi-map-marker">
				<template #actions>
					<a href="#">2 обновления</a>
				</template>

				<div class="gasification-list">
					<article
						v-for="(item, index) of [
							{
								title: 'с. Новопокровка — подключение завершено',
								publishedAt: '10.01.2024',
								region: 'Чуйгаз, Кантская ЭГС, Чуйская область',
								description: 'Газификация села Новопокровка завершена. К газоснабжению подключены 3 539 домохозяйств. Приём заявок на подключение продолжается.',
								voiceText: 'Село Новопокровка полностью газифицировано. Для подключения подайте заявку в ближайшем офисе обслуживания либо отправьте заявку через сайт или мобильное приложение.',
							},
							{
								title: 'ж/м Биримдик — проектирование строительства газопровода',
								publishedAt: '08.01.2025',
								region: 'Бишкекгаз, Бишкек',
								description: 'Ведутся проектно-изыскательные работы. Строительство газопровода среднего давления запланировано на 2 квартал 2027 г.',
								voiceText: 'Ведутся проектно-изыскательные работы. Строительство газопровода среднего давления запланировано на 2 квартал 2027 г. Заявки на подключение можно подать после завершения строительно-монтажных работ.',
							},
						]"
						:key="index"
						class="gasification-card"
					>
						<div class="status">
							<BaseIcon name="mdi-check-circle-outline"/>
							<span>Актуально</span>
						</div>

						<h3>{{ item.title }}</h3>

						<span class="date">
							Опубликовано: {{ item.publishedAt }} · Территория: {{ item.region }}
						</span>

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
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import BaseAutocomplete from '~/components/common/base/BaseAutocomplete.vue';
import BaseTabs from '~/components/common/base/BaseTabs.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'sidebar'
});

const form = reactive({}) as Record<string, string | number>;

</script>

<style lang="scss">
#news-page {
	.row-outages {
		width: 100%;

		.island-actions {
			display: flex;
			align-items: center;
			gap: 24px;

			span {
				color: #dc2626;
				font-size: 12px;
				font-weight: 800;
			}

			a {
				color: #2563eb;
				font-size: 12px;
				font-weight: 700;
				text-decoration: none;
			}
		}

		.filters {
			display: grid;
			grid-template-columns: 190px 180px minmax(240px, 1fr) 100px;
			gap: 18px;
			margin-bottom: 18px;
		}

		.outage-list {
			display: grid;
			gap: 14px;
		}

		.outage-card {
			display: grid;
			gap: 10px;
			padding: 18px 22px;
			border: 1px solid #e5e7eb;
			border-radius: 14px;
			background: #fff;

			.meta {
				display: grid;
				grid-template-columns: 120px 1fr 1fr auto;
				align-items: center;
				gap: 18px;
				font-size: 12px;

				b {
					font-weight: 900;
				}

				span {
					color: #6b7280;
				}

				strong {
					color: #059669;
					font-size: 12px;
					text-align: right;

					&.muted {
						color: #6b7280;
					}
				}
			}

			h3 {
				margin: 0;
				font-size: 15px;
				font-weight: 800;
			}

			> p {
				margin: 0;
				color: #374151;
				font-size: 14px;
				line-height: 1.45;
			}

			&.danger {
				border-color: #fecaca;
				background: #fff1f2;

				.meta b {
					color: #dc2626;
				}
			}

			&.warning {
				border-color: #fde68a;
				background: #fffbeb;

				.meta b {
					color: #f59e0b;
				}
			}

			&.default {
				.meta b {
					color: #059669;
				}
			}

			&.old {
				opacity: .82;

				.meta b {
					color: #059669;
				}
			}
		}

		.voice-text {
			display: grid;
			gap: 8px;
			margin-top: 12px;
			padding: 14px 16px;
			border: 1px solid rgba(229, 231, 235, .8);
			border-radius: 10px;
			background: rgba(255, 255, 255, .82);

			div {
				display: flex;
				align-items: center;
				gap: 7px;
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

		@media (max-width: 900px) {
			.filters {
				grid-template-columns: 1fr 1fr;
			}

			.outage-card {
				.meta {
					grid-template-columns: 1fr 1fr;
					gap: 8px 14px;

					strong {
						text-align: left;
					}
				}
			}
		}

		@media (max-width: 640px) {
			.island-actions {
				align-items: flex-start;
				flex-direction: column;
				gap: 6px;
			}

			.filters {
				grid-template-columns: 1fr;
			}

			.outage-card {
				padding: 16px;

				.meta {
					grid-template-columns: 1fr;
				}
			}
		}
	}

	.row-gasification,
	.row-faq-updates {
		width: 100%;
	}

	.gasification-list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px;
	}

	.gasification-card {
		display: grid;
		gap: 10px;
		padding: 22px 26px;
		border: 1px solid #e5e7eb;
		border-radius: 14px;
		background: #fff;

		.status {
			display: flex;
			align-items: center;
			gap: 6px;
			color: #059669;
			font-size: 12px;
			font-weight: 800;
		}

		h3 {
			margin: 0;
			font-size: 16px;
			font-weight: 800;
		}

		.date {
			color: #6b7280;
			font-size: 13px;
		}

		> p {
			margin: 0;
			color: #374151;
			font-size: 14px;
			line-height: 1.45;
		}
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
			color: #4b5563;
			font-size: 13px;
			line-height: 1.45;
		}
	}

	.faq-list {
		display: grid;
		gap: 10px;
	}

	.faq-card {
		display: grid;
		grid-template-columns: 80px minmax(0, 1fr) auto;
		align-items: center;
		gap: 18px;
		padding: 16px 18px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: #fff;

		b {
			font-size: 12px;
			font-weight: 900;
		}

		div {
			display: grid;
			gap: 4px;
			min-width: 0;
		}

		h3 {
			margin: 0;
			font-size: 14px;
			font-weight: 800;
		}

		p {
			margin: 0;
			color: #6b7280;
			font-size: 12px;

			span:last-child {
				color: #d97706;
			}
		}

		.id {
			color: #9ca3af;
			font-size: 12px;
			white-space: nowrap;
		}

		&.new {
			border-color: #bcd3ff;
			background: #eaf2ff;

			b {
				color: #16a34a;
			}
		}

		&.updated {
			border-color: #fde68a;
			background: #fffbeb;

			b {
				color: #f97316;
			}
		}
	}

	a {
		color: #2563eb;
		font-size: 12px;
		font-weight: 700;
		text-decoration: none;
	}

	@media (max-width: 900px) {
		.gasification-list {
			grid-template-columns: 1fr;
		}

		.faq-card {
			grid-template-columns: 1fr;
			gap: 6px;

			.id {
				white-space: normal;
			}
		}
	}
}
</style>
