<template>
	<section class="authorized-layout">
		<header style="display:flex; align-items:center; gap:1em; padding:.5em 2em;">
			<section class="logo" @click="navigateTo(`/`)">
				<img height="20px" src="/img/logo.svg" alt="Логотип" />
				<h2>CallGas</h2>
			</section>
			<section class="search">
				<AccountSearch
					ref="accountSearchInput"
					v-model="accountSearch"
					placeholder="Поиск абонента по ФИО, лицевому счету"
					prependIcon="mdi-magnify"
					@select="selectAccount"
				/>
			</section>
			<!-- <section class="actions">
				<BaseButton style="line-height:1.4em; text-align:center;" variant="light">Новая жалоба</BaseButton>
				<BaseButton style="line-height:1.4em; text-align:center;" variant="outlined">Принять показания</BaseButton>
			</section> -->
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
import AccountSearch from '~/components/AccountSearch.vue';
import AccountLine from '~/components/AccountLine.vue';
import Avatar from '~/components/common/Avatar.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import Sidebar from '~/components/Sidebar.vue';
import type { FindPayload } from '~/types/Facility';
const s = useUserStore();
const appStore = useAppStore();
const accountStore = useAccountStore();
const route = useRoute();
const accountSearchInput = ref<any>(null);
const accountSearch = ref('');
// if( !userStore.userData ) navigateTo('/login');

onMounted(() => {
	checkAccountUrlParam();
	appStore.ensureTariffs();
	window.addEventListener('keydown', onSearchShortcut);
});
onBeforeUnmount(() => {
	window.removeEventListener('keydown', onSearchShortcut);
});

watch(() => route.params.account, () => {
	checkAccountUrlParam();
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

function selectAccount(account: FindPayload | null) {
	if (!account) return;
	accountStore.setActiveAccount(account.account);
	accountSearch.value = '';
	navigateTo(`/profile/${account.account}`);
}

function onSearchShortcut(e: KeyboardEvent) {
	// Убедимся что поле поиска доступно
	if( !accountSearchInput.value ) return;

	// Дополнительно: очистка поиска по Escape
	if (e.key === 'Escape' && accountSearchInput.value.hasFocus()) {
		accountSearchInput.value.clear();
		accountSearchInput.value.blur(); // Убираем фокус
		return;
	}

	// Убедимся что не забираем фокус у другого input'а
	const activeElement = document.activeElement?.tagName ?? '';
	if( ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement) ) return;
	// Игнорируем системные сочетания (Ctrl+C, Alt+Tab, F5 и т.д.) и проверяем, что нажата печатаемая клавиша (буква, цифра или спецсимвол)
	const modifierKeyIsNotPressed = !(e.ctrlKey || e.metaKey || e.altKey);
	const isSymbol = e.key.length === 1; // гарантирует, что это символ
	if (modifierKeyIsNotPressed && isSymbol) {
		// Фокус перейдет, но символ напечатается автоматически благодаря событию
		accountSearchInput.value.focus();
	}
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
			cursor:pointer;
		}
		.search {
			flex: auto 1 0;
			max-width: 400px;
			position:relative;
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

		>.page-content {
			flex: auto 1 1;
			// overflow-y: auto;
			padding: 2em;
		}
	}
}
</style>
