<template>
	<section id="tariffs-page">
		<section class="row-tariffs">
			<BaseIsland title="Тариф природного газа" prependIcon="mdi-currency-usd" data-aos="zoom-in">
				<template #actions>
					<div class="tariff-links">
						<a href="#">Действующие</a>
						<a href="#">История</a>
					</div>
				</template>

				<div class="tariffs">
					<div
						v-for="(item, index) of tariffs"
						:key="index"
						:class="['tariff-card', item.accent]"
						data-aos="zoom-in"
					>
						<div class="status">
							<BaseIcon name="mdi-check-circle-outline"/>
							<span>Актуально</span>
						</div>

						<strong>{{ item.title }}</strong>

						<div class="price">
							{{ item.price }}
							<span>сом/м³</span>
						</div>

						<p>{{ item.description }}</p>
					</div>
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
	roles: ['ADMIN', 'CALLCENTER_MANAGER', 'CONTROLLER', 'CALLCENTER', 'CALLCENTER_COMPLAINT_ASSIGNEE'],
	layout: 'authorized'
});

const appStore = useAppStore();
const tariffs = computed(() => [
	{
		title: 'Население',
		price: appStore.tariffs?.fizValue ?? '-',
		accent: 'blue',
		description: `Текущий тариф для населения — ${appStore.tariffs?.fizValue ?? '-'} сом/м³.`,
	},
	{
		title: 'Население, г. Майлы-Суу',
		price: appStore.tariffs?.fizValue ?? '-',
		accent: 'blue',
		description: `Текущий тариф для жителей г. Майлы-Суу — ${appStore.tariffs?.fizValue ?? '-'} сом/м³.`,
	},
	{
		title: 'Юридические лица без налогов',
		price: appStore.tariffs?.ulValue ?? '-',
		accent: 'orange',
		description: `Стоимость указана без учета налогов — ${appStore.tariffs?.ulValue ?? '-'} сом/м³.`,
	},
]);

onMounted(() => {
	appStore.ensureTariffs();
});
</script>

<style lang="scss">
#tariffs-page {
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
