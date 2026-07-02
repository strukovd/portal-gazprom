<template>
	<div class="account-search">
		<div class="field">
			<label v-if="label">{{ label }}<span v-if="required">*</span></label>
			<div class="control">
				<BaseIcon :name="prependIcon"/>
				<input
					ref="inputEl"
					v-model="search"
					type="text"
					:autofocus="autofocus"
					:placeholder="placeholder"
					@focus="focused = true"
					@blur="onBlur"
					@input="onInput"
					@keydown="onKeydown"
				>
				<BaseIcon v-if="loading" name="mdi-loading" class="loading"/>
				<BaseIcon v-else-if="search" name="mdi-close" class="clear" @mousedown.prevent="clear"/>
			</div>
		</div>

		<ul v-if="visibleList" class="found-list">
			<li class="found-item"
				v-for="(item, index) of items"
				:key="item.account"
				:class="{ active: activeIndex === index }"
				@mousedown.prevent="select(item)"
				@mouseenter="activeIndex = index"
			>
				<div class="fi-avatar">
					<BaseIcon v-if="isLegalAccount(item.account)" class="legal" name="mdi-scale-balance" size="18"/>
					<BaseIcon v-else name="mdi-account-outline" size="18"/>
				</div>
				<div class="fi-content">
					<div class="fi-topline">
						<strong class="fi-name">{{ item.name || 'Абонент' }}</strong>
						<span class="fi-account">{{ item.account }}</span>
					</div>
					<div class="fi-address">{{ item.address || 'Адрес не указан' }}</div>
				</div>
				<BaseIcon class="fi-chevron" name="mdi-chevron-right" size="20"/>
			</li>
			<li v-if="empty" class="empty-item">
				<BaseIcon name="mdi-account-search-outline" size="20"/>
				<span>Ничего не найдено</span>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import BaseIcon from './common/base/BaseIcon.vue';
import type { FindPayload } from '~/types/Facility';

const props = withDefaults(defineProps<{
	modelValue?: string | null;
	label?: string;
	placeholder?: string;
	prependIcon?: string;
	autofocus?: boolean;
	required?: boolean;
}>(), {
	placeholder: 'Введите лицевой счет или ФИО',
	prependIcon: 'mdi-account-search-outline',
});

const emit = defineEmits<{
	'update:modelValue': [value: string];
	'select': [value: FindPayload | null];
}>();

const accountStore = useAccountStore();
const search = ref(props.modelValue || '');
const items = ref<FindPayload[]>([]);
const loading = ref(false);
const focused = ref(false);
const inputEl = ref<HTMLInputElement | null>(null);
const searched = ref(false);
const empty = computed(() => searched.value && search.value.trim().length > 1 && !loading.value && !items.value.length);
const visibleList = computed(() => focused.value && (items.value.length || empty.value));
const activeIndex = ref(-1);
let timer: ReturnType<typeof setTimeout> | null = null;

watch(() => props.modelValue, (value) => {
	if ((value || '') !== search.value) {
		search.value = value || '';
		searched.value = false;
	}
});

watch(items, () => {
	activeIndex.value = items.value.length ? 0 : -1;
});

onMounted(() => {
	if (props.autofocus) {
		nextTick(() => inputEl.value?.focus());
	}
});

defineExpose({
	focus: () => inputEl.value?.focus(),
	blur: () => inputEl.value?.blur(),
	hasFocus: () => document.activeElement === inputEl.value,
	clear,
});

function onInput() {
	focused.value = true;
	const value = search.value.trim();
	emit('update:modelValue', value);
	emit('select', null);

	if (timer) clearTimeout(timer);
	if (value.length < 2) {
		items.value = [];
		searched.value = false;
		return;
	}

	timer = setTimeout(async () => {
		loading.value = true;
		try {
			items.value = await accountStore.find(value);
		}
		catch {
			items.value = [];
			useNuxtApp().$flags.error('Не удалось выполнить поиск абонента');
		}
		finally {
			loading.value = false;
			searched.value = true;
		}
	}, 250);
}

function select(item: FindPayload) {
	search.value = item.account;
	items.value = [];
	searched.value = false;
	activeIndex.value = -1;
	emit('update:modelValue', item.account);
	emit('select', item);
}

function clear() {
	search.value = '';
	items.value = [];
	searched.value = false;
	activeIndex.value = -1;
	emit('update:modelValue', '');
	emit('select', null);
}

function isLegalAccount(account: string) {
	return '56789'.includes(account.charAt(0));
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === 'ArrowDown') {
		event.preventDefault();
		event.stopPropagation();
		focused.value = true;
		if (!items.value.length) return;
		activeIndex.value = activeIndex.value >= items.value.length - 1 ? 0 : activeIndex.value + 1;
		return;
	}

	if (event.key === 'ArrowUp') {
		event.preventDefault();
		event.stopPropagation();
		focused.value = true;
		if (!items.value.length) return;
		activeIndex.value = activeIndex.value <= 0 ? items.value.length - 1 : activeIndex.value - 1;
		return;
	}

	if (event.key === 'Enter') {
		if (!visibleList.value || !items.value.length) return;
		event.preventDefault();
		event.stopPropagation();
		select(items.value[Math.max(activeIndex.value, 0)]!);
		return;
	}

	if (event.key === 'Escape') {
		if (visibleList.value || document.activeElement === inputEl.value) {
			event.preventDefault();
			event.stopPropagation();
			focused.value = false;
			items.value = [];
			inputEl.value?.blur();
		}
	}
}

function onBlur() {
	setTimeout(() => {
		focused.value = false;
	}, 120);
}
</script>

<style lang="scss">
.account-search {
	position: relative;

	.field {
		display: grid;
		gap: .4em;

		label {
			display: flex;
			align-items: center;
			gap: .35em;
			color: #333;
			font-size: .82rem;
			font-weight: 700;

			span {
				color: #2563eb;
			}
		}

		.control {
			display: flex;
			align-items: center;
			gap: .45em;
			padding: .2em .55em;
			border: 1px solid #d4d4d4;
			border-radius: 7px;
			background: #fff;

			.base-icon {
				color: #8b95a5;
			}

			input {
				flex: 1 1 auto;
				padding: .4em .2em;
				border: 0;
				outline: 0;
				min-width: 0;
				background: transparent;
				font: inherit;

				&::placeholder {
					color: #95a3b8;
					font-weight: 300;
					opacity: .9;
				}
			}

			.clear {
				cursor: pointer;
			}

			.loading {
				animation: account-search-spin 900ms linear infinite;
			}

			&:focus-within {
				border-color: #2563ea80;
				box-shadow: 0 0 0 2px #2563ea80;
			}
		}
	}

	.found-list {
		position: absolute;
		background: #fff;
		border: 1px solid #dbe2ea;
		box-shadow: 0 14px 40px rgb(15 23 42 / 14%);
		top: calc(100% + .4em);
		left: 0;
		right: 0;
		z-index: 20;
		border-radius: 8px;
		overflow: auto;
		// overflow-y: auto;
		padding: .35em;
		max-height: 380px;
		margin: 0;
		overflow-x: hidden;
		box-sizing: border-box;
		list-style: none;

		.found-item {
			display: flex;
			align-items: center;
			gap: .65em;
			border: 0;
			border-radius: 6px;
			background: transparent;
			color: #171717;
			text-align: left;
			padding: .65em .55em;
			cursor: pointer;
			&:hover,
			&.active {
				background: #eef5ff;
			}

			>.fi-avatar {
				width: 32px;
				height: 32px;
				flex: 0 0 32px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 6px;
				background: #e9effd;
				color: #2563ea;

				.base-icon {
					color: currentColor;

					&.legal {
						color: brown;
					}
				}
			}

			>.fi-content {
				flex: 1 1 auto;
				min-width: 0;

				.fi-topline {
					display: flex;
					align-items: baseline;
					justify-content: space-between;
					gap: .7em;

					.fi-name {
						font-size: .9rem;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.fi-account {
						flex: 0 0 auto;
						color: #2563ea;
						font-size: .76rem;
						font-weight: 700;
					}
				}

				.fi-address {
					margin-top: .15em;
					color: #737373;
					font-size: .78rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.fi-chevron {
				color: #a3a3a3;
			}

		}
		.empty-item {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: .4em;
			padding:.8em 0;
			color: #737373;
			font-size: 1rem;
			cursor: default;

			&:hover {
				background: transparent;
			}
		}
	}
}

@keyframes account-search-spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>
