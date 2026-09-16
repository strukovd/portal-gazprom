<template>
	<section id="subscriber-page">
		<main class="page-blocks">
			<NuxtLink class="sb-back" :to="backLink"><BaseIcon name="mdi-arrow-left" size="1.2em"/>Назад к реестру</NuxtLink>

			<template v-if="loading">
				<BaseIsland class="sb-skeleton"><BaseSkeleton width="55%" height="3.5em"/></BaseIsland>
				<section class="sb-details"><BaseIsland><BaseSkeleton height="12em"/></BaseIsland><BaseIsland><BaseSkeleton height="12em"/></BaseIsland></section>
				<BaseIsland class="sb-skeleton"><BaseSkeleton height="15em"/></BaseIsland>
			</template>

			<template v-else-if="subscriber">
				<BaseIsland class="sb-header">
					<div class="sb-profile">
						<Avatar :name="subscriber.fullName" size="3em"/>
						<div class="sb-profile-content">
							<div class="sb-name">{{ subscriber.fullName || 'Не указано' }}</div>
							<div class="sb-meta"><span class="sb-account">Л/с {{ subscriber.accountNo }}</span><span class="sb-address"><BaseIcon name="mdi-map-marker-outline" size="1em"/>{{ subscriber.addressText || 'Не указано' }}</span></div>
						</div>
					</div>
					<div class="sb-contact">
						<div :class="['sb-status', readingStatus.source]"><BaseIcon :name="readingStatus.icon" size="1em"/>{{ readingStatus.label }}</div>
						<div class="sb-phone"><BaseIcon name="mdi-phone-outline" size="1em"/>Не указано</div>
					</div>
				</BaseIsland>

				<section class="sb-details">
					<BaseIsland class="sb-card">
						<div class="sb-card-title"><BaseIcon name="mdi-gauge" size="1.35em"/>Данные счётчика</div>
						<div class="sb-data"><span class="sb-label">Номер счётчика</span><span class="sb-value">{{ subscriber.meterSerial || 'Не указано' }}</span></div>
						<div class="sb-data"><span class="sb-label">Модель</span><span class="sb-value">{{ subscriber.meterModel }}</span></div>
						<div class="sb-data"><span class="sb-label">Мощность</span><span class="sb-value">Не указано</span></div>
						<div class="sb-data"><span class="sb-label">№ пломбы</span><span class="sb-value">Не указано</span></div>
						<div class="sb-data"><span class="sb-label">Знак</span><span class="sb-value">Не указано</span></div>
					</BaseIsland>

					<BaseIsland class="sb-card">
						<div class="sb-card-title"><BaseIcon name="mdi-wallet-outline" size="1.35em"/>Финансы</div>
						<div class="sb-data"><span class="sb-label">Последняя оплата</span><span class="sb-value">{{ subscriber.lastPayment || 'Не указано' }}</span></div>
						<div class="sb-data"><span class="sb-label">Сальдо - Газ</span><span :class="['sb-value', { green: subscriber.debtGas && subscriber.debtGas < 0, red: subscriber.debtGas && subscriber.debtGas > 0 }]">{{ subscriber.debtGas ?? 'Не указано' }}</span></div>
						<div class="sb-data"><span class="sb-label">Сальдо - Пеня</span><span :class="['sb-value', { red: subscriber.penalty && subscriber.penalty > 0 }]">{{ subscriber.penalty ?? 'Не указано' }}</span></div>
						<div class="sb-data"><span class="sb-label">Пред. показание</span><span class="sb-value">{{ subscriber.reading ?? 'Не указано' }} м³</span></div>
					</BaseIsland>
				</section>

				<BaseIsland :class="['sb-reading', readingStatus.source]">
					<div class="sb-reading-heading">
						<div class="sb-reading-title"><BaseIcon :name="readingStatus.icon" size="1.35em"/>{{ readingStatus.heading }}</div>
						<div class="sb-reading-description">{{ readingStatus.description }}</div>
					</div>

					<template v-if="readingStatus.source === 'subscriber'">
						<section class="sb-reading-values">
							<div class="sb-reading-value"><span class="sb-label">Предыдущее</span><span class="sb-reading-number">{{ subscriber.reading ?? 'Не указано' }} м³</span></div>
							<div class="sb-reading-value current"><span class="sb-label">Текущее</span><span class="sb-reading-number">Не указано</span></div>
							<div class="sb-reading-value"><span class="sb-label">Расход</span><span class="sb-reading-number">Не указано</span></div>
						</section>
						<InfoBox type="protect" title="Показание подтверждено абонентом" message="Изменение показания, переданного абонентом самостоятельно, недоступно для контроллёра."/>
						<BaseButton class="sb-return" variant="outlined" @click="navigateTo(backLink)">Вернуться к реестру</BaseButton>
					</template>

					<template v-else>
						<div class="sb-previous"><span class="sb-previous-label"><BaseIcon name="mdi-history" size="1em"/>Предыдущее показание</span><span class="sb-previous-value">{{ subscriber.reading ?? 'Не указано' }} м³</span></div>
						<BaseTextBox v-model="reading" class="sb-reading-input" :disabled="readingStatus.source === 'controller'" label="Текущее показание, м³" placeholder="Введите значение" type="number"/>
						<div v-if="readingStatus.source === 'controller'" class="sb-consumption"><span>Расход за период</span><span>Не указано</span></div>
						<div class="sb-actions">
							<BaseButton variant="outlined" @click="navigateTo(backLink)">Отмена</BaseButton>
							<BaseButton :disabled="String(reading).trim() === ''" prependIcon="mdi-check-circle-outline">Принять показание</BaseButton>
						</div>
					</template>
				</BaseIsland>
			</template>
		</main>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import InfoBox from '~/components/common/InfoBox.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseSkeleton from '~/components/common/base/BaseSkeleton.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import { useFieldworksStore } from '~/stores/FieldworksStore';
import type { ControllerSubscriber } from '~/types/Portal';

const route = useRoute();
const subscriberId = computed(() => String(route.params.id));
const routeId = computed(() => typeof route.query.route === 'string' ? route.query.route : '');
const sectorId = computed(() => typeof route.query.sector === 'string' ? route.query.sector : '');
const backLink = computed(() => routeId.value
	? { path: `/fieldworks/routes/${routeId.value}`, query: sectorId.value ? { sector: sectorId.value } : {} }
	: '/fieldworks/routes'
);

const loading = ref(true);
const reading = ref<string | number>('');
const subscriber = ref<ControllerSubscriber | null>(null);
const fieldworksStore = useFieldworksStore();
const readingStatus = computed(() => {
	if (subscriber.value?.status === 'Передано абонентом') return { source: 'subscriber', label: 'Передано абонентом', heading: 'Показание передано абонентом', description: 'Редактирование контроллёром заблокировано', icon: 'mdi-shield-check-outline' };
	if (subscriber.value?.status !== 'Не передано') return { source: 'controller', label: 'Принято', heading: 'Ввод текущего показания', description: 'Показание принято контроллёром', icon: 'mdi-check-circle-outline' };
	return { source: 'none', label: 'Не принято', heading: 'Ввод текущего показания', description: 'Метод 1 - карточка абонента', icon: 'mdi-gauge' };
});

onMounted(async () => {
	subscriber.value = await fetchSubscriber();
	loading.value = false;
});

async function fetchSubscriber(): Promise<ControllerSubscriber | null> {
	const data = await fieldworksStore.fetchAreas();
	return data?.areas
		.flatMap(area => area.routes)
		.flatMap(route => route.streets)
		.flatMap(street => street.subscribers)
		.find(item => item.accountNo === subscriberId.value) ?? null;
}
</script>

<style lang="scss">
#subscriber-page {
	.page-blocks {
		display: grid;
		gap: 1.25em;
		margin: 1em 0;
	}

	.sb-back {
		display: inline-flex;
		align-items: center;
		gap: .35em;
		width: fit-content;
		color: #475569;
		font-weight: 700;
		text-decoration: none;

		&:hover {
			color: #2563eb;
		}
	}

	.sb-skeleton {
		overflow: hidden;
	}

	.sb-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1em;
		border-color: #bfdbfe;
		background: #f8fbff;

		.sb-profile {
			display: flex;
			align-items: center;
			gap: .85em;
			min-width: 0;

			.sb-profile-content {
				min-width: 0;

				.sb-name {
					color: #0f172a;
					font-size: 1.15rem;
					font-weight: 900;
				}

				.sb-meta {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: .35em .8em;
					margin-top: .3em;
					color: #64748b;
					font-size: .86rem;

					.sb-account {
						color: #2563eb;
						font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
						font-weight: 800;
					}

					.sb-address {
						display: inline-flex;
						align-items: center;
						gap: .25em;
					}
				}
			}
		}

		.sb-contact {
			display: grid;
			justify-items: end;
			gap: .55em;
			white-space: nowrap;

			.sb-status {
				display: inline-flex;
				align-items: center;
				gap: .35em;
				padding: .45em .75em;
				border-radius: 1em;
				color: #ea580c;
				background: #fff7ed;
				font-size: .82rem;
				font-weight: 800;

				&.subscriber {
					color: #7c3aed;
					background: #f5f3ff;
				}

				&.controller {
					color: #16a34a;
					background: #ecfdf5;
				}
			}

			.sb-phone {
				display: inline-flex;
				align-items: center;
				gap: .3em;
				color: #2563eb;
				font-size: .85rem;
				text-decoration: none;
			}
		}
	}

	.sb-details {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1em;

		.sb-card {
			.sb-card-title {
				display: flex;
				align-items: center;
				gap: .55em;
				margin-bottom: 1em;
				padding-bottom: .8em;
				border-bottom: 1px solid #eef2f7;
				color: #0f172a;
				font-size: 1.05rem;
				font-weight: 900;
			}

			.sb-data {
				display: flex;
				justify-content: space-between;
				gap: 1em;
				padding: .45em 0;
				font-size: .9rem;

				.sb-label { color: #94a3b8; }
				.sb-value { color: #0f172a; font-weight: 800;
					&.green { color: #16a34a; }
					&.red { color: #dc2626; }
				}
			}
		}
	}

	.sb-reading {
		display: grid;
		gap: 1em;
		border-color: #bfdbfe;

		&.subscriber { border-color: #ddd6fe; background: #faf9ff; }

		.sb-reading-heading {
			padding-bottom: 1em;
			border-bottom: 1px solid #eef2f7;
			.sb-reading-title { display: flex; align-items: center; gap: .5em; color: #0f172a; font-size: 1.1rem; font-weight: 900; }
			.sb-reading-description { margin-top: .35em; color: #94a3b8; font-size: .86rem; }
		}

		.sb-previous {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1em;
			padding: 1em;
			border-radius: 8px;
			background: #f8fafc;
			.sb-previous-label { display: inline-flex; align-items: center; gap: .4em; color: #64748b; font-size: .9rem; }
			.sb-previous-value { color: #0f172a; font-size: 1.25rem; font-weight: 900; }
		}

		.sb-reading-input {
			.text-box-area { border-color: #93c5fd; background: #f8fbff; }
		}

		.sb-consumption { display: flex; justify-content: space-between; gap: 1em; padding: .9em 1em; border-radius: 8px; color: #ffffff; background: #2563eb; font-weight: 800; }

		.sb-reading-values {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1em;
			.sb-reading-value {
				display: grid;
				justify-items: center;
				gap: .45em;
				padding: 1em;
				border: 1px solid #e5e7eb;
				border-radius: 10px;
				background: #ffffff;
				&.current { border-color: #7c3aed; color: #ffffff; background: #7c3aed; }
				.sb-label { color: #94a3b8; font-size: .75rem; font-weight: 700; text-transform: uppercase; }
				.sb-reading-number { font-size: 1.25rem; font-weight: 900; }
			}
		}

		.sb-return { width: 100%; justify-content: center; }
		.sb-actions { display: flex; justify-content: flex-end; gap: .75em; .base-button { min-width: 12em; justify-content: center; } }
	}
}
</style>
