<template>
	<section class="sidebar">
		<ul class="links">
			<li
				v-for="link of links"
				:key="link.link ?? link.title ?? link.class"
				class="link"
			>
				<div v-if="link.spacer" :class="link.class">{{ link.title ?? '' }}</div>
				<template v-else>
					<button v-if="link.action"
						type="button"
						:class="['link-row', { 'disabled': link.disabled }]"
						@click="link.action?.()"
					>
						<BaseIcon :name="link.icon!" size="20" style="margin-right:.6em;"/>
						{{ link.title }}
					</button>
					<NuxtLink v-else
						:to="link.link"
						:class="['link-row', { 'active': isActiveLink(link), 'disabled': link.disabled }]"
						@click="handleDisabledLink(link, $event)"
					>
						<BaseIcon :name="link.icon!" size="20" style="margin-right:.6em;"/>
						{{ link.title }}
					</NuxtLink>
					<ul v-if="link.children?.length" class="children">
						<li
							v-for="child of link.children"
							:key="child.link ?? child.title"
							class="child-link"
						>
							<div v-if="child.spacer" :class="child.class">{{ child.title ?? '' }}</div>
							<NuxtLink v-else
								:to="child.link"
								:class="['link-row', { 'active': isActiveLink(child), 'disabled': child.disabled }]"
								@click="handleDisabledLink(child, $event)"
							>
								<BaseIcon :name="child.icon!" size="18" style="margin-right:.6em;"/>
								{{ child.title }}
							</NuxtLink>
						</li>
					</ul>
				</template>
			</li>
		</ul>
		<footer class="sidebar-footer">
			<span>Version: {{ version }}</span>
		</footer>
	</section>
</template>

<script lang="ts" setup>
import { version } from '../../package.json';
import BaseIcon from './common/base/BaseIcon.vue';
type SidebarLink = {
	title?: string
	link?: string
	icon?: string
	action?: () => void
	disabled?: boolean
	spacer?: boolean
	class?: string
	children?: SidebarLink[]
}


const route = useRoute();
const userStore = useUserStore();
const links = ref<SidebarLink[]>([
	{
		title: 'Панель правления',
		link: '/',
		icon: 'mdi-view-dashboard'
	},
	{
		title: 'Оперативные новости',
		link: '/news',
		icon: 'mdi-newspaper',
		// children: [
		// 	{
		// 		title: 'Отключение газа',
		// 		link: '/gas-off',
		// 		icon: 'mdi-fire',
		// 		disabled: true
		// 	},
		// 	{
		// 		title: 'Газификация',
		// 		link: '/gasification',
		// 		icon: 'mdi-gas-burner',
		// 		disabled: true
		// 	},
		// ]
	},
	{
		title: 'Тарифы',
		link: '/tariffs',
		icon: 'mdi-currency-usd',
	},
	{
		title: 'Офисы обслуживания',
		link: '/offices',
		icon: 'mdi-office-building',
	},
	{
		spacer: true,
		class: 'splitter',
	},
	{
		title: 'Данные абонента',
		link: '/profile',
		icon: 'mdi-account',
		// children: [
		// 	{ title: 'Профиль', link: '/profile', icon: 'mdi-account' },
		// 	{ title: 'Счётчики', link: '/counters', icon: 'mdi-counter' },
		// ]
	},
	{
		spacer: true,
		class: 'splitter',
	},
	{
		title: 'Жалобы',
		link: '/complaints',
		icon: 'mdi-alert-circle'
	},
	// {
	// 	title: 'Ответственные лица',
	// 	link: '/responsibles',
	// 	icon: 'mdi-account-group'
	// },
	// {
	// 	title: 'FAQ',
	// 	link: '/faq',
	// 	icon: 'mdi-help-circle-outline'
	// },
	{
		spacer: true,
		class: 'spacer',
	},
	{
		title: 'Настройки',
		link: '/settings',
		icon: 'mdi-cog',
	},
	{
		title: 'Выход',
		action: userStore.logout,
		icon: 'mdi-logout',
	}
]);

function isActiveLink(link: SidebarLink) {
	if( link.link && route.path === link.link ) return true;
	return Boolean(link.children?.some(isActiveLink));
}

function handleDisabledLink(link: SidebarLink, event: Event) {
	if( !link.disabled ) return;
	event.preventDefault();
}
</script>

<style lang="scss">
.sidebar {
	display: flex;
	flex-direction: column;
	background:#0e3896;
	color: #a9c0f6;
	min-width: 18em;
	max-width:50vw;

	.links {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-height: 0;
		box-sizing: border-box;
		list-style-type: none;
		margin:0;
		padding:1rem;

		.link {
			line-height: 3em;
			border-radius:7px;
			&:has(.spacer) {
				flex:1 1 auto;
			}

			.splitter {
				margin:.2em 0;
				border-bottom:1px dashed #5082ee66;
			}

			.link-row {
				display: block;
				color: inherit;
				text-decoration: none;
				font-size:1.1rem;
				padding:0 1em;
				&:is(button) {
					display: block;
					width: 100%;
					text-align: left;
					background: transparent;
					border: 0;
					line-height: inherit;
					cursor: pointer;
				}

				&:hover,
				&.active {
					background:#124bc6;
					color:#ffffff;
					border-radius:7px;
				}

				&.disabled {
					color:#ffffff55;
					cursor: inherit;
					pointer-events: none;
				}
			}

			.children {
				list-style-type: none;
				margin:0;
				padding:0 0 .4em 1.9em;

				.child-link {
					line-height: 2.4em;
					border-radius:7px;

					.link-row {
						font-size:1rem;
						padding:0 1em;
					}
				}
			}
		}
	}

	.sidebar-footer {
		padding:1rem;
		font-size: .9rem;
		color:#ffffff22;
		text-align: center;
	}
}
</style>
