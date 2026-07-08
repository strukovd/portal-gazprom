<template>
	<div class="complaints-list-modal">
		<main class="cl-content">
			<section v-if="!complaints.length" style="display: grid; place-items: center; padding: 2em 0;">
				<img src="/images/complaints-empty.svg" width="160px"/>
				<div class="cl-empty">Жалоб нет</div>
			</section>

			<section v-else class="cl-list">
				<article v-for="complaint of complaints" :key="complaint.id" class="cl-complaint" @click="showComplaint(complaint)">
					<div class="cl-icon">
						<BaseIcon name="mdi-alert-box-outline" size="1.3em"/>
					</div>

					<div class="cl-body">
						<div class="cl-title">
							<span class="cl-key">#{{ complaint.id }}</span>
							<span class="cl-status">{{ complaint.status || 'Без статуса' }}</span>
						</div>
						<div class="cl-subject">{{ complaint.subject || 'Без темы' }}</div>
						<div class="cl-description">{{ complaint.description || 'Описание не заполнено' }}</div>
						<div class="cl-meta">
							<span>{{ complaint.userName || 'Исполнитель не назначен' }}</span>
							<span>{{ toLocaleDate(complaint.created) || complaint.created || 'Дата не указана' }}</span>
							<span v-if="complaint.sla">{{ complaint.sla }} дн.</span>
						</div>
					</div>
				</article>
			</section>
		</main>

		<footer class="cl-footer">
			<BaseButton prependIcon="mdi-close" variant="secondary" @click="close">Закрыть</BaseButton>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '../common/base/BaseButton.vue';
import BaseIcon from '../common/base/BaseIcon.vue';
import type { ComplaintsPayload } from '~/services/complaints';
import { toLocaleDate } from '~/utils/format';

const props = defineProps<{
	payload?: {
		complaints?: ComplaintsPayload[];
	};
}>();

const { $modal } = useNuxtApp();
const complaints = computed(() => props.payload?.complaints || []);

function showComplaint(complaint: ComplaintsPayload) {
	$modal.show('ComplaintDetails', {
		title: `Жалоба #${complaint.id}`,
		payload: {
			complaint,
		}
	});
}

function close() {
	const modal = useAppStore().modals.pop();
	if (modal?.resolve) modal.resolve(false);
}
</script>

<style lang="scss">
.complaints-list-modal {
	width: min(720px, 82vw);

	.cl-content {
		padding-bottom: 1em;

		.cl-empty {
			padding: .4em 0;
			color: #467cec;
			font-size: 0.9em;
			font-weight: 700;
			text-align: center;
		}

		.cl-list {
			display: grid;
			gap: .8em;
			max-height: 65vh;
			overflow-y: auto;
			padding-right: .2em;

			.cl-complaint {
				display: flex;
				gap: .8em;
				padding: 1em;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				background: #fff;
				cursor: pointer;
				transition: opacity 200ms ease 0s, transform 200ms ease 0s;

				&:hover {
					opacity: .86;
					transform: translateY(-1px);
				}

				.cl-icon {
					display: grid;
					place-items: center;
					flex: 0 0 2.5em;
					width: 2.5em;
					height: 2.5em;
					border-radius: 8px;
					background: #fff1f2;
					color: #dc2626;
				}

				.cl-body {
					display: grid;
					gap: .45em;
					min-width: 0;
					flex: 1;

					.cl-title {
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: .8em;

						.cl-key {
							color: #111827;
							font-weight: 800;
						}

						.cl-status {
							padding: .25em .6em;
							border-radius: 999px;
							background: #f3f4f6;
							color: #475569;
							font-size: .78em;
							font-weight: 700;
							white-space: nowrap;
						}
					}

					.cl-subject {
						color: #111827;
						font-weight: 700;
					}

					.cl-description {
						color: #374151;
						line-height: 1.4;
					}

					.cl-meta {
						display: flex;
						flex-wrap: wrap;
						gap: .4em .8em;
						color: #737373;
						font-size: .86em;
					}
				}
			}
		}
	}

	.cl-footer {
		display: flex;
		justify-content: flex-end;
	}

	@media (max-width: 700px) {
		width: 100%;

		.cl-content {
			.cl-list {
				.cl-complaint {
					.cl-body {
						.cl-title {
							align-items: flex-start;
							flex-direction: column;
							gap: .4em;
						}
					}
				}
			}
		}
	}
}
</style>
