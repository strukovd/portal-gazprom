<template>
	<section class="authorized-layout">
		<header style="display:flex; align-items:center; gap:1em; padding:.5em 2em;">
			<section class="logo">
				<img height="20px" src="/img/logo.svg" alt="Логотип" />
				<h2>CallGas</h2>
			</section>
			<section class="search" @focusin="searchFocused = true" @focusout="hideFoundList">
				<BaseTextBox
					ref="searchInput"
					v-model="accountSearch"
					placeholder="Поиск абонента по ФИО, лицевому счету"
					prependIcon="mdi-magnify"
					@submit="selectFirstFoundAccount"
				/>

				<section v-if="showFoundList" class="found-list">
					<button
						v-for="a of foundAccounts"
						:key="a.account"
						class="found-list__item"
						type="button"
						@click="selectAccount(a)"
					>
						<div class="found-list__avatar">
							<BaseIcon v-if="`56789`.split('').includes(a.account.charAt(0))" name="mdi-scale-balance" style="color:brown;" size="18"/>
							<BaseIcon v-else name="mdi-account-outline" size="18"/>
						</div>
						<div class="found-list__content">
							<div class="found-list__topline">
								<strong>{{ a.name || 'Абонент' }}</strong>
								<span>{{ a.account }}</span>
							</div>
							<div class="found-list__address">{{ a.address || 'Адрес не указан' }}</div>
						</div>
						<BaseIcon class="found-list__select" name="mdi-chevron-right" size="20"/>
					</button>

					<div v-if="!foundAccounts.length" class="found-list__empty">
						<BaseIcon name="mdi-account-search-outline" size="20"/>
						<span>Абоненты не найдены</span>
					</div>
				</section>
			</section>
			<section class="actions">
				<BaseButton style="line-height:1.4em; text-align:center;" variant="light">Новая жалоба</BaseButton>
				<BaseButton style="line-height:1.4em; text-align:center;" variant="outlined">Принять показания</BaseButton>
			</section>
			<div class="flex-spacer"></div>
			<section class="service-tools">
				<BaseIcon name="mdi-bell" size="20" style="color:#525252;"/>
				<BaseIcon name="mdi-help-circle-outline" size="20" style="color:#525252;"/>
				<BaseIcon name="mdi-cog" size="20" style="color:#525252;"/>
			</section>
			<section class="user-box">
				<!-- <img src="/img/user-avatar.png" alt="Аватар пользователя" /> -->
				<div class="user-info" style="text-align:right;">
					<div class="name" style="color:#171717; font-size:.9rem; font-weight:700;">{{ s.userData?.userName }}</div>
					<div class="role" style="color:#737373; font-size:.8rem;">{{ s.prettyRole }}</div>
				</div>
				<div>
					<Avatar size="2.2em" :name="s.userData?.userName"/>
				</div>
				<div style="color:#a3a3a3; cursor:pointer;">
					<BaseIcon @click="s.logout" name="mdi-logout" size="20"/>
				</div>
			</section>
		</header>

		<AccountLine/>
		<main>
			<Sidebar v-resizeble="`right`"/>
			<section class="page-content">
				<slot/>
			</section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import AccountLine from '~/components/AccountLine.vue';
import Avatar from '~/components/common/Avatar.vue';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import Sidebar from '~/components/Sidebar.vue';
import type { FindPayload } from '~/stores/AccountStore';
const s = useUserStore();
const accountStore = useAccountStore();
const route = useRoute();
const searchInput = ref<any>(null);
const accountSearch = ref('');
const searchFocused = ref(false);
const foundAccounts = ref<FindPayload[]>([]);
let hideFoundListTimer: ReturnType<typeof window.setTimeout> | null = null;
// if( !userStore.userData ) navigateTo('/login');

const showFoundList = computed(() => {
	return searchFocused.value && accountSearch.value.trim().length >= 2;
});

onMounted(() => {
	checkAccountUrlParam();
	initAutofocus();
});

watch(() => route.params.account, () => {
	checkAccountUrlParam();
});

watch(accountSearch, async (value) => {
	foundAccounts.value = await accountStore.find(value);
});

function checkAccountUrlParam() {
	const account = Array.isArray(route.params.account) ? route.params.account[0] : route.params.account;
	if (account) {
		accountStore.setActiveAccount(account);
		return;
	}
	else {
		accountStore.fetchAccountData();
	}
}

function selectAccount(account: any) {
	accountStore.setActiveAccount(account.account);
	accountSearch.value = '';
	searchFocused.value = false;
	navigateTo(`/profile/${account.account}`);
}

function selectFirstFoundAccount() {
	const account = foundAccounts.value[0];
	if (account) selectAccount(account);
}

function hideFoundList() {
	if (hideFoundListTimer) window.clearTimeout(hideFoundListTimer);
	hideFoundListTimer = window.setTimeout(() => {
		searchFocused.value = false;
	}, 160);
}

function initAutofocus() {
	window.addEventListener('keydown', (e) => {
		// Убедимся что поле поиска доступно
		if( !searchInput.value ) return;
		const input = searchInput.value.$el.querySelector('input') as HTMLInputElement;

		// Убедимся что не забираем фокус у другого input'а
		const activeElement = document.activeElement?.tagName ?? '';
		if( ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement) ) return;
		// Игнорируем системные сочетания (Ctrl+C, Alt+Tab, F5 и т.д.) и проверяем, что нажата печатаемая клавиша (буква, цифра или спецсимвол)
		const modifierKeyIsNotPressed = !(e.ctrlKey || e.metaKey || e.altKey);
		const isSymbol = e.key.length === 1; // гарантирует, что это символ
		if (modifierKeyIsNotPressed && isSymbol) {
			// Фокус перейдет, но символ напечатается автоматически благодаря событию
			input.focus();
		}

		// Дополнительно: очистка поиска по Escape
		if (e.key === 'Escape' && document.activeElement === input) {
			input.setAttribute('value', '');
			input.blur(); // Убираем фокус
		}
	});
}
</script>

<style lang="scss">
.authorized-layout {
	min-height: 100dvh;
	display: flex;
	flex-direction: column;

	>header {
		// занимает свою естественную высоту
		flex: 0 0 auto;
		background-color: #f6f7fb;
		border-bottom: 1px solid #e5e5e5;

		.flex-spacer {
			flex: 1 1 auto;
		}
		.logo {
			display:flex;
			align-items:center;
			gap:.6em;
			margin-right:2em;
		}
		.search {
			flex: auto 1 0;
			max-width: 400px;
			position:relative;

			.found-list {
				position: absolute;
				background: white;
				border: 1px solid #e5e5e5;
				box-shadow: 0 16px 32px rgba(15, 23, 42, 0.14);
				width: 100%;
				top: calc(100% + .4em);
				left: 0;
				z-index: 20;
				border-radius: 8px;
				overflow: hidden;
				padding: .35em;
				box-sizing: border-box;
				max-height: 380px;
				overflow-y: auto;

				&__item {
					width: 100%;
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
					&:focus-visible {
						background: #f4f7fb;
						outline: none;
					}
				}

				&__avatar {
					width: 32px;
					height: 32px;
					flex: 0 0 32px;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 6px;
					background: #e9effd;
					color: #2563ea;
				}

				&__content {
					min-width: 0;
					flex: 1 1 auto;
				}

				&__topline {
					display: flex;
					align-items: baseline;
					justify-content: space-between;
					gap: .7em;

					strong {
						font-size: .9rem;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					span {
						flex: 0 0 auto;
						color: #2563ea;
						font-size: .76rem;
						font-weight: 700;
					}
				}

				&__address {
					margin-top: .15em;
					color: #737373;
					font-size: .78rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				&__select {
					color: #a3a3a3;
				}

				&__empty {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: .45em;
					color: #737373;
					font-size: .84rem;
					padding: 1em;
				}
			}
		}
		.actions {
			display:flex;
			gap:.5em;
		}
		.service-tools {
			display:flex;
			gap:1em;
		}
		.user-box {
			display:flex;
			align-items:center;
			gap:.5em;
		}
	}

	>main {
		// забирает остаток экрана
		display: flex;
		flex: 1 1 auto;
		min-height: 0; // можно быть меньше высоты собственного контента, если layout требует, позволяет дочерним элементам корректно обрабатывать overflow

		.page-content {
			flex: auto 1 1;
			overflow-y: auto;
			padding: 2em;
		}
	}
}
</style>
