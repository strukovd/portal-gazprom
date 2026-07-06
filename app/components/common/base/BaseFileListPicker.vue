<template>
	<div class="file-list-picker" :class="{ invalid: error }" @dragover.prevent @drop.prevent="selectFiles">
		<header v-if="label || error" class="header">
			<span v-if="label" class="caption">{{ label }}</span>
			<span v-if="error" class="error">{{ error }}</span>
		</header>

		<label class="control">
			<BaseIcon name="mdi-paperclip" size="22"/>
			<span>{{ buttonText }}</span>
			<small>{{ hintText }}</small>
			<input ref="input" type="file" :multiple="multiple" @change="selectFiles">
		</label>

		<ul v-if="files.length" class="list">
			<li v-for="file of files" :key="file.name + file.lastModified">
				<span>{{ file.name }}</span>
				<BaseIcon name="mdi-close" @click="removeFile(file)"/>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import BaseIcon from './BaseIcon.vue';

const props = withDefaults(defineProps<{
	modelValue?: File | File[] | null;
	label?: string;
	error?: string;
	multiple?: boolean;
	buttonText?: string;
	emptyText?: string;
	selectedText?: string;
}>(), {
	buttonText: 'Прикрепить файлы',
	emptyText: 'Файлы не выбраны',
	selectedText: 'Выбрано',
});

const emit = defineEmits<{
	'update:modelValue': [value: File | File[] | null];
}>();

const files = ref<File[]>([]);
const hintText = computed(() => files.value.length ? `${props.selectedText}: ${files.value.length}` : props.emptyText);

watch(() => props.modelValue, (value) => {
	files.value = Array.isArray(value) ? value : (value ? [value] : []);
}, { immediate: true });

function selectFiles(event: Event | DragEvent) {
	const selected = event instanceof DragEvent
		? event.dataTransfer?.files
		: (event.target as HTMLInputElement).files;

	if (!selected?.length) return;

	const nextFiles = Array.from(selected);
	files.value = props.multiple
		? [...files.value, ...nextFiles].filter((file, index, list) => {
			return list.findIndex(item => item.name === file.name && item.lastModified === file.lastModified) === index;
		})
		: [nextFiles[0]!];
	emitValue();

	if ('target' in event && event.target) {
		(event.target as HTMLInputElement).value = '';
	}
}

function removeFile(file: File) {
	files.value = files.value.filter(item => item !== file);
	emitValue();
}

function emitValue() {
	emit('update:modelValue', props.multiple ? [...files.value] : (files.value[0] || null));
}
</script>

<style lang="scss">
.file-list-picker {
	display: grid;
	gap: .5em;

	.header {
		display: flex;
		justify-content: space-between;
		gap: 1em;

		.caption {
			// font-size: 14px;
			line-height: 1.4em;
			// opacity: .6;

			color: #4b5563;
			font-size: 0.82rem;
			font-weight: 700;
			opacity:1;
		}

		.error {
			color: red;
			font-size: 14px;
			line-height: 1.4em;
			opacity: .6;
		}
	}

	.control {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: .7em;
		padding: .75em .9em;
		border: 1px dashed #cbd5e1;
		border-radius: 7px;
		background: #f8fafc;
		color: #475569;
		cursor: pointer;

		.base-icon {
			color: #64748b;
		}

		span {
			font-weight: 700;
		}

		small {
			color: #94a3b8;
			font-size: .78rem;
			text-align: right;
		}

		input {
			display: none;
		}
	}

	.list {
		display: grid;
		gap: .35em;
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: .6em;
			padding: .45em .6em;
			border-radius: 6px;
			background: #eef5ff;
			color: #334155;
			font-size: .84rem;

			span {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.base-icon {
				flex: none;
				color: #64748b;
				cursor: pointer;
			}
		}
	}

	&.invalid {
		.control {
			border-color: red;
			border-style: dashed;
		}
	}

	@media (max-width: 760px) {
		.control {
			grid-template-columns: auto minmax(0, 1fr);

			small {
				grid-column: 2;
				text-align: left;
			}
		}
	}
}
</style>
