<template>
	<BaseIsland class="reading-history">
		<div class="rh-heading">
			<div class="rh-title"><BaseIcon name="mdi-history" size="1.25em"/>История показаний</div>
			<div class="rh-tools">
				<BaseButton variant="secondary" prependIcon="mdi-refresh" :loading="loading" title="Обновить историю" aria-label="Обновить историю" @click="fetchHistory"/>
			</div>
		</div>
		<BaseSkeleton v-if="loading" height="10em"/>
		<InfoBox v-else-if="error" type="error" title="История недоступна" :message="error"/>
		<template v-for="(group, groupIndex) of months" :key="group.month">
			<div class="rh-month">{{ group.month }}</div>
			<div v-for="(item, index) of group.items" :key="item.id ?? `${item.created}-${index}`" class="rh-row">
				<div class="rh-author">
					<Avatar :name="item.supplier?.name" size="2em"/>
					<div class="rh-person">
						<div class="rh-name">{{ item.supplier?.name || 'Неизвестный источник' }}</div>
					</div>
				</div>
				<div class="rh-date" :datetime="item.created">
					{{ toLocaleDate(item.created) }}
				</div>
				<div class="rh-reading">
					<div class="rh-label">Показание</div>
					<div class="rh-value">{{ item.reading?.toLocaleString('ru-RU', { maximumFractionDigits: 20 }) ?? 'Не указано' }} <span v-if="item.reading != null" class="rh-unit">м³</span></div>
				</div>
				<div class="rh-consumption">
					<div class="rh-label">Расход</div>
					<div class="rh-value">{{ item.consumption?.toLocaleString('ru-RU', { maximumFractionDigits: 20 }) ?? 'Не указано' }} <span v-if="item.consumption != null" class="rh-unit">м³</span></div>
				</div>
				<div v-if="false" class="rh-actions">
					<BaseButton class="rh-delete" variant="secondary" prependIcon="mdi-delete-outline" title="Удалить показание" aria-label="Удалить показание" @click="previewDeletion(item)"/>
				</div>
			</div>
		</template>
		<div v-if="!loading && !error && !items.length" class="rh-empty">Нет переданных показаний</div>
	</BaseIsland>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseSkeleton from '~/components/common/base/BaseSkeleton.vue';
import InfoBox from '~/components/common/InfoBox.vue';
import { facility } from '~/services/facility';
import type { FacilityReading } from '~/types/Facility';

const props = defineProps<{
	account: string;
	refreshKey?: number;
}>();

const items = ref<FacilityReading[]>([]);
const loading = ref(false);
const error = ref('');
const { $modal } = useNuxtApp();
let requestId = 0;

watch(() => [props.account, props.refreshKey], fetchHistory, { immediate: true });
onBeforeUnmount(() => { requestId++; });

function previewDeletion(item: FacilityReading) {
	$modal.show('ConfirmModal', {
		title: 'Удаление показания',
		payload: {
			title: `Удалить показание ${item.reading?.toLocaleString('ru-RU')} м³?`,
			description: `Л/с ${props.account}\nПока это только макет: удаление не выполняется.`,
		},
	});
}

async function fetchHistory() {
	const request = ++requestId;
	items.value = [];
	error.value = '';
	loading.value = true;
	try {
		const response = await facility.fetchReadings({ account: props.account, includePortalUser: true });
		if (request !== requestId) return;
		items.value = response.data;
	}
	catch (cause: any) {
		if (request === requestId) error.value = cause?.data?.message || cause?.message || 'Не удалось загрузить историю показаний';
	}
	finally {
		if (request === requestId) loading.value = false;
	}
}

const months = computed(() => {
	const groups = new Map<string, FacilityReading[]>();
	for (const item of [...items.value].sort((a, b) => Date.parse(b.created) - Date.parse(a.created) || (b.id ?? 0) - (a.id ?? 0))) {
		const month = new Date(item.created).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric', timeZone: 'Asia/Bishkek' });
		if (!groups.has(month)) groups.set(month, []);
		groups.get(month)!.push(item);
	}
	return Array.from(groups, ([month, items]) => ({ month, items }));
});
</script>

<style lang="scss">
.reading-history {
	.rh-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: .5em 1em;
		padding-bottom: 1em;

		.rh-title {
			display: flex;
			align-items: center;
			gap: .5em;
			font-weight: 700;
		}

		.rh-tools { display: flex; flex-wrap: wrap; gap: .5em; }
	}

	.rh-month {
		padding: .65em 0;
		color: #64748b;
		font-size: .8rem;
		font-weight: 700;

		&:first-letter { text-transform: uppercase; }
	}

	.rh-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 11em repeat(2, minmax(6em, auto));
		grid-template-areas: 'author date reading consumption';
		align-items: center;
		gap: .65em 1em;
		padding: .85em 0;
		border-top: 1px solid #eef2f7;
		font-size: .9rem;

		&:has(.rh-actions) {
			grid-template-columns: minmax(0, 1fr) 11em repeat(2, minmax(6em, auto)) 2.75rem;
			grid-template-areas: 'author date reading consumption actions';
		}

		.rh-actions {
			grid-area: actions;

			.rh-delete { width: 2.75rem; height: 2.75rem; justify-content: center; padding: 0; }
		}

		.rh-date {
			grid-area: date;
			color: #64748b;
			font-variant-numeric: tabular-nums;
		}

		.rh-author {
			grid-area: author;
			display: flex;
			align-items: center;
			gap: .6em;
			min-width: 0;

			.rh-person {
				min-width: 0;

				.rh-name { overflow-wrap: anywhere; }
			}
		}

		.rh-reading { grid-area: reading; }
		.rh-consumption { grid-area: consumption; }

		.rh-reading, .rh-consumption {
			text-align: right;
			min-width: 0;

			.rh-label { margin-bottom: .25em; color: #64748b; font-size: .75rem; }

			.rh-value {
				font-size: 1.1rem;
				font-weight: 700;
				font-variant-numeric: tabular-nums;
				overflow-wrap: anywhere;

				.rh-unit { color: #64748b; font-size: .75rem; font-weight: 400; }
			}

			.rh-latest { color: #15803d; font-size: .75rem; }
		}
	}

	.rh-empty { padding: 1em 0; color: #64748b; }

	@media (max-width: 600px) {
		.rh-row {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			grid-template-areas: 'author author' 'date date' 'reading consumption';

			&:has(.rh-actions) {
				grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 2.75rem;
				grid-template-areas: 'author author actions' 'date date date' 'reading consumption .';
			}

			.rh-reading { text-align: left; }
		}
	}
}
</style>
