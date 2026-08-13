<template>
	<div class="navigation-modal">
		<section class="nm-grid">
			<template v-for="link of navigationLinks" :key="link.link ?? link.title">
				<button
					v-if="link.action"
					type="button"
					:class="['nm-item', { disabled: link.disabled }]"
					@click="handleActionClick(link)"
				>
					<BaseIcon :name="link.icon!" size="26"/>
					<span class="nm-title">{{ link.title }}</span>
				</button>

				<NuxtLink
					v-else
					:to="link.link"
					:class="['nm-item', { active: isActiveLink(link), disabled: link.disabled }]"
					@click="handleLinkClick(link, $event)"
				>
					<BaseIcon :name="link.icon!" size="26"/>
					<span class="nm-title">{{ link.title }}</span>
				</NuxtLink>
			</template>
		</section>
	</div>
</template>

<script lang="ts" setup>
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import type { NavigationLink } from '~/composables/useDefaultNavigation';

const props = defineProps<{
	payload?: {
		links?: NavigationLink[];
	};
}>();

const route = useRoute();
const appStore = useAppStore();
const defaultNavigation = useDefaultNavigation();
const navigationLinks = computed(() => props.payload?.links ?? defaultNavigation.links.filter(link => !link.spacer).slice(4));

function isActiveLink(link: NavigationLink) {
	if( link.link && route.path === link.link ) return true;
	return Boolean(link.children?.some(isActiveLink));
}

function close() {
	const modal = appStore.modals.pop();
	if (modal?.resolve) modal.resolve(false);
}

function handleLinkClick(link: NavigationLink, event: Event) {
	if( link.disabled ) {
		event.preventDefault();
		return;
	}

	close();
}

function handleActionClick(link: NavigationLink) {
	if( link.disabled ) return;
	link.action?.();
	close();
}
</script>

<style lang="scss">
.navigation-modal {
	.nm-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: .75rem;
		padding-bottom: .35rem;

		.nm-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: .5rem;
			min-height: 5.3rem;
			padding: .75rem .45rem;
			color: #475569;
			background: #f8fafc;
			border: 1px solid #e2e8f0;
			border-radius: 12px;
			text-align: center;
			text-decoration: none;
			cursor: pointer;

			&.active {
				color: #0e3896;
				background: #eff6ff;
				border-color: #bfdbfe;
			}

			&.disabled {
				color: #94a3b8;
				pointer-events: none;
			}

			.nm-title {
				max-width: 100%;
				font-size: .75rem;
				font-weight: 700;
				line-height: 1.15;
			}
		}
	}
}
</style>
