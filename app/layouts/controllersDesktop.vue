<template>
	<section class="controllers-desktop-layout">
		<header class="cd-header">
			<button class="cd-brand" type="button" @click="navigateTo('/fieldworks/sectors')">
				<BaseIcon name="mdi-gauge" size="1.35em"/>
				<span>Полевые работы</span>
			</button>
			<div class="cd-spacer"></div>
			<section class="cd-user">
				<div class="cd-user-info">
					<div class="cd-user-name">{{ userStore.userData?.userName }}</div>
					<div class="cd-user-role">{{ userStore.prettyRole }}</div>
				</div>
				<Avatar :name="userStore.userData?.userName" size="2.2em"/>
				<button class="cd-logout" type="button" title="Выйти" @click="userStore.logout">
					<BaseIcon name="mdi-logout" size="20"/>
				</button>
			</section>
		</header>

		<main class="cd-main">
			<Sidebar v-resizeble="'right'" :links="links"/>
			<section class="cd-content"><slot/></section>
		</main>
	</section>
</template>

<script lang="ts" setup>
import Avatar from '~/components/common/Avatar.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import Sidebar from '~/components/Sidebar.vue';
import type { NavigationLink } from '~/composables/useDefaultNavigation';

defineProps<{
	links: NavigationLink[];
}>();

const userStore = useUserStore();
</script>

<style lang="scss">
.controllers-desktop-layout {
	min-height: 100dvh;
	display: flex;
	flex-direction: column;

	.cd-header {
		display: flex;
		align-items: center;
		gap: 1em;
		padding: .5em 2em;
		background: #f6f7fb;
		border-bottom: 1px solid #e5e5e5;

		.cd-brand {
			display: flex;
			align-items: center;
			gap: .55em;
			padding: 0;
			color: #0e3896;
			font-size: 1.1rem;
			font-weight: 800;
			background: transparent;
			border: 0;
			cursor: pointer;
		}

		.cd-spacer {
			flex: 1 1 auto;
		}

		.cd-user {
			display: flex;
			align-items: center;
			gap: .55em;

			.cd-user-info {
				text-align: right;

				.cd-user-name {
					color: #171717;
					font-size: .9rem;
					font-weight: 700;
				}

				.cd-user-role {
					margin-top: .15em;
					color: #737373;
					font-size: .8rem;
				}
			}

			.cd-logout {
				display: flex;
				padding: .35em;
				color: #a3a3a3;
				background: transparent;
				border: 0;
				cursor: pointer;

				&:hover {
					color: #dc2626;
				}
			}
		}
	}

	.cd-main {
		display: flex;
		flex: 1 1 auto;
		min-height: 0;

		.cd-content {
			flex: 1 1 auto;
			min-width: 0;
			padding: 2em;
		}
	}
}
</style>
