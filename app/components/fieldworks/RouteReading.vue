<template>
	<BaseIsland :class="['route-reading', { popover }]">
		<div class="rr-heading">
			<div class="rr-name">{{ subscriber.fullName || 'Не указано' }}</div>
			<div class="rr-account">Л/с {{ subscriber.accountNo }}</div>
		</div>
		<div class="rr-previous">
			<span class="rr-label">Пред. показание</span>
			<span class="rr-value">{{ previousReading ?? 'Не указано' }} м³</span>
		</div>

		<BaseTextBox
			v-model="reading"
			:class="[`rr-reading-value`, { valid: hasReading && isValid, invalid: hasReading && !isValid }]"
			label="Показание, м³"
			:placeholder="`> ${previousReading ?? ''}`"
			type="number"
			autofocus
			@submit="save"
		/>
		<div v-if="error" class="rr-error">
			<BaseIcon name="mdi-alert-decagram"/>
			<span>{{ error }}</span>
		</div>

		<div class="rr-actions">
			<BaseButton variant="secondary" @click="emit('close')">Отмена</BaseButton>
			<BaseButton :disabled="!hasReading || !isValid" :loading="loading" prependIcon="mdi-check-circle-outline" @click="save">Принять</BaseButton>
		</div>
	</BaseIsland>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import { readings } from '~/services/readings';
import type { ControllerSubscriber } from '~/types/Portal';
import BaseIcon from '~/components/common/base/BaseIcon.vue';

const props = defineProps<{
	subscriber: ControllerSubscriber;
	popover?: boolean;
}>();
const emit = defineEmits<{
	close: [];
	saved: [];
}>();
const { $flags } = useNuxtApp();

const reading = ref<string | number>('');
const loading = ref(false);
const previousReading = computed(() => typeof props.subscriber.reading === 'number' ? props.subscriber.reading : null);
const hasReading = computed(() => String(reading.value).trim() !== '');
const isValid = computed(() => Number.isFinite(Number(reading.value)) && (previousReading.value === null || Number(reading.value) >= previousReading.value));
const error = computed(() => hasReading.value && !isValid.value ? 'Не может быть меньше предыдущего' : '');

async function save() {
	if (!hasReading.value || !isValid.value || loading.value) return;

	loading.value = true;
	try {
		await readings.create(props.subscriber.accountNo, Number(reading.value));
		$flags.success('Показание принято');
		emit('saved');
	}
	catch (error: any) {
		$flags.error(error?.data?.message || error?.response?._data?.message || error?.message || 'Не удалось передать показание');
	}
	finally {
		loading.value = false;
	}
}
</script>

<style lang="scss">
.route-reading {
	min-width: min(20em, 100%);
	padding: 1em;
	box-shadow: 0 12px 28px rgba(15, 23, 42, .16);
	overflow: hidden;

	&.popover {
		position: absolute;
		z-index: 200;
		top: calc(100% + .75em);
		left: 50%;
		transform: translateX(-50%);
	}

	.rr-heading {
		margin-bottom: .8em;

		.rr-name {
			color: #0f172a;
			font-size: 1rem;
			font-weight: 800;
		}

		.rr-account {
			margin-top: .2em;
			color: #2563eb;
			font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
			font-size: .8rem;
			font-weight: 700;
		}
	}

	.rr-previous {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: .5em;
		margin-bottom: .8em;
		padding: .7em .8em;
		border-radius: .7em;
		background: #f8fafc;

		.rr-label {
			font-size:.9em;
			font-weight: 400;
			color: #94a3b8;
		}

		.rr-value {
			font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
			color: #0f172a;
			font-weight: 800;
		}
	}

	.rr-reading-value {
		.text-box-area>input {
			font-size:1.4em;
			font-weight:700;
			font-family:monospace;
			outline:none;
			width: 100%;
		}
		&.invalid .text-box-area {
			background-color: #FEF2F2;
			color: #C10007;
			outline:2px solid #FFA2A2;
			&:focus-within {
				outline:3px solid #FFA2A2;
				border-color:transparent;
			}
		}
		&.valid .text-box-area {
			background-color: #F0FDF4;
			color: #15803d;
			outline:2px solid #22c55e;
			&:focus-within {
				outline:3px solid #22c55e;
				border-color:transparent;
			}
		}
	}
	.rr-error {
		margin:.4em 0;
		color: #FB2C36;
		font-size:.9em;
		font-weight: 400;
		display: flex;
		align-items: center;
		gap:.4em;
	}

	.rr-actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: .5em;
		margin-top: .9em;

		.base-button {
			justify-content: center;
			padding: .55em;
		}
	}
}
</style>
