<template>
	<div v-if="complaint" class="complaint-details">
		<main class="cd-content">
			<section class="cd-summary">
				<div class="cd-box">
					<div class="cd-label">Абонент</div>
					<div class="cd-value">{{ complaint.subscriberName || 'Не указан' }}</div>
					<div class="cd-hint">ЛС: {{ complaint.account || 'не указан' }}</div>
				</div>

				<div class="cd-box">
					<div class="cd-label">Телефон</div>
					<div class="cd-value">{{ complaint.contactNumber || 'Не указан' }}</div>
					<div class="cd-hint">{{ complaint.branchName || 'Филиал не указан' }}</div>
				</div>
			</section>

			<section class="cd-address">
				<BaseIcon class="cd-address-icon" name="mdi-map-marker-outline" size="20"/>
				<div class="cd-address-text">{{ addressText }}</div>
			</section>

			<BaseMemo v-model="complaint.description" label="Описание жалобы" height="40px" disabled/>
			<!-- <section class="cd-description">
				<div class="cd-title">
					<div class="cd-title-text">Описание жалобы</div>
					<div :class="['cd-status', statusClass]">{{ complaint.status || 'Без статуса' }}</div>
				</div>
				<div class="cd-description-text">{{ complaint.description || complaint.subject || 'Описание не заполнено' }}</div>
			</section> -->

			<BaseMemo v-model="answer" label="Ответ абоненту" height="120px" resize="vertical" placeholder="Введите текст ответа абоненту..."/>
		</main>

		<footer class="cd-footer">
			<BaseButton prependIcon="mdi-send" @click="sendAnswer">Отправить ответ</BaseButton>
			<div class="cd-spacer"></div>
			<BaseButton prependIcon="mdi-close" variant="secondary" @click="close(false)">Отмена</BaseButton>
			<BaseButton prependIcon="mdi-check-circle-outline" color="#32bf69" @click="closeComplaint">Закрыть жалобу</BaseButton>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '../common/base/BaseButton.vue';
import BaseIcon from '../common/base/BaseIcon.vue';
import BaseMemo from '../common/base/BaseMemo.vue';
import type { ComplaintsPayload } from '~/services/complaints';

const props = defineProps<{
	payload?: {
		complaint?: ComplaintsPayload;
	};
}>();

const { $flags } = useNuxtApp();
const answer = ref('');
const complaint = computed(() => props.payload?.complaint || null);
const addressText = computed(() => 'Адрес абонента не указан');
const statusClass = computed(() => {
	switch (complaint.value?.status) {
		case 'Новая':
			return 'cd-new';
		case 'Просрочено':
			return 'cd-expired';
		case 'В работе':
			return 'cd-work';
		case 'Закрыто':
			return 'cd-closed';
		default:
			return '';
	}
});

function sendAnswer() {
	$flags.info('Отправка ответа пока не подключена к API');
}

function closeComplaint() {
	$flags.info('Закрытие жалобы пока не подключено к API');
}

function close(result: boolean) {
	const appStore = useAppStore();
	const modal = appStore?.modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.complaint-details {
	width: min(720px, 82vw);

	.cd-content {
		display: grid;
		gap: 1em;
		padding-bottom: 1.2em;

		.cd-summary {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: .8em;

			.cd-box {
				padding: .9em 1em;
				border: 1px solid #e5e7eb;
				border-radius: 8px;
				background: #f8fafc;

				.cd-label {
					color: #64748b;
					font-size: .78rem;
				}

				.cd-value {
					margin-top: .25em;
					color: #111827;
					font-weight: 700;
				}

				.cd-hint {
					margin-top: .25em;
					color: #64748b;
					font-size: .82rem;
				}
			}
		}

		.cd-address {
			display: flex;
			align-items: center;
			gap: .5em;
			color: #475569;
			font-size: .9rem;

			.cd-address-icon {
				color: #2563ea;
			}
		}

		.cd-description {
			display: grid;
			gap: .5em;
			padding: .9em 1em;
			border: 1px solid #e5e7eb;
			border-radius: 8px;

			.cd-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 1em;

				.cd-title-text {
					color: #111827;
					// font-weight: 700;
				}

				.cd-status {
					display: inline-block;
					padding: .4em .8em;
					border-radius: 6px;
					font-size: .78rem;
					font-weight: 600;

					&.cd-new {
						color: #2563eb;
						background: #ecf2fa;
					}

					&.cd-expired {
						color: #dc2626;
						background: #fef2f2;
					}

					&.cd-work {
						color: #d97706;
						background: #fffbeb;
					}

					&.cd-closed {
						color: #16a34a;
						background: #f0fdf4;
					}
				}
			}

			.cd-description-text {
				color: #4b5563;
				line-height: 1.45;
				white-space: pre-wrap;
			}
		}
	}

	.cd-footer {
		display: flex;
		justify-content: flex-end;
		gap: .5em;

		>.cd-spacer {
			flex-grow: 1;
		}
	}

	@media (max-width: 700px) {
		width: 100%;

		.cd-content {
			.cd-summary {
				grid-template-columns: 1fr;
			}
		}

		.cd-footer {
			display: grid;
		}
	}
}
</style>
