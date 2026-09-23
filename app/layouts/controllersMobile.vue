<template>
	<section class="controllers-mobile-layout">
		<header class="cm-header">
			<button class="cm-brand" type="button" @click="navigateTo('/fieldworks/sectors')">
				<BaseIcon name="mdi-gauge" size="1.25em"/>
				<span>Полевые работы</span>
			</button>
			<div class="cm-spacer"></div>
			<Avatar :name="userStore.userData?.userName" size="2em"/>
			<button class="cm-logout" type="button" title="Выйти" @click="userStore.logout">
				<BaseIcon name="mdi-logout" size="20"/>
			</button>
		</header>

		<main class="cm-main"><slot/></main>
		<footer class="cm-footer"><BottomNavigation :links="links"/></footer>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BottomNavigation from '~/components/BottomNavigation.vue';
import type { NavigationLink } from '~/composables/useDefaultNavigation';

defineProps<{
	links: NavigationLink[];
}>();

const userStore = useUserStore();
</script>

<style lang="scss">
.controllers-mobile-layout {
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	max-width: 100vw;
	overflow-x: hidden;

	.cm-header {
		display: flex;
		align-items: center;
		gap: .65em;
		padding: .65em 1em;
		background: #f6f7fb;
		border-bottom: 1px solid #e5e5e5;

		.cm-brand {
			display: flex;
			align-items: center;
			gap: .45em;
			padding: 0;
			color: #0e3896;
			font-size: .95rem;
			font-weight: 800;
			background: transparent;
			border: 0;
			cursor: pointer;
		}

		.cm-spacer {
			flex: 1 1 auto;
		}

		.cm-logout {
			display: flex;
			padding: .3em;
			color: #64748b;
			background: transparent;
			border: 0;
			cursor: pointer;
		}
	}

	.cm-main {
		flex: 1 1 auto;
		min-width: 0;
		padding-bottom: 5rem;
	}
}
</style>
