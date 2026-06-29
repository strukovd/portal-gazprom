<template>
	<VueDatePicker
		v-model="model"
		class="base-date-picker"
		range
		:enable-time-picker="false"
		:teleport="true"
		:clearable="true"
		:locale="ruLocale"
		:formats="{ preview: 'dd.MM.yyyy', input: 'dd.MM.yyyy' }"
		:placeholder="placeholder"
	>
		<template #input-icon>
			<BaseIcon name="mdi-calendar-month" size="1.4em" class="icon"/>
		</template>
		<template #action-row="{ selectDate, closePicker }">
			<section class="picker-actions">
				<BaseButton @click="selectDate()">Выбрать</BaseButton>
				<BaseButton @click="closePicker()" variant="secondary">Отменить</BaseButton>
			</section>
		</template>
		<template #calendar-header="{ day }">
			<span class="picker-header">{{ day }}</span>
		</template>
		<template #day="{ day }">
			<span class="picker-day">{{ day }}</span>
		</template>
	</VueDatePicker>
</template>

<script lang="ts" setup>
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ru as ruLocale } from 'date-fns/locale/ru';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';

const model = defineModel<Date[] | null>();

defineProps({
	placeholder: {
		type: String,
		default: 'Период'
	}
});
</script>

<style lang="scss">
.base-date-picker {
	display: inline-block;

	.dp--input-wrap {
		.icon {
			color: #344563;
			padding: .2em .7em 0 .8em;
		}

		.dp--input {
			// background-color: #344563;
			min-height: calc(1.4em + 1.2em + 2px);
			border: 1px solid transparent;
			border-radius: 7px;
			color: #344563;
			font-family: inherit;
			font-size: .9em;
			font-weight: 700;
			line-height: 1.4em;
			background: rgba(9, 30, 66, .08);
			box-shadow: none;
			transition: all 300ms ease 0s;
			padding: .7em 1.5em .3em 3em;

			&::placeholder {
				color: #344563;
				opacity: 1;
			}

			&:hover {
				opacity: .8;
			}

			&:focus {
				border-color: transparent;
				box-shadow: none;
			}
		}
	}
}

.picker-actions {
	flex: auto 1 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: .5em;

	button {
		flex: auto 1 0;
	}
}

.picker-header,
.picker-day {
	font-size: .9em;
	font-weight: 400;
}

.picker-header {
	text-transform: capitalize;
}
</style>
