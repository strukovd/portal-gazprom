<template>
	<section class="sidebar">
		<ul class="links">
			<li v-for="link of links" class="link">
				<div v-if="link.spacer" :class="link.class"></div>
				<NuxtLink v-else :to="link.link">
					<BaseIcon :name="link.icon!" size="20" style="margin-right:.6em;"/>
					{{ link.title }}
				</NuxtLink>
			</li>
		</ul>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from './common/base/BaseIcon.vue';



const links = ref([
	{
		title: 'Панель правления',
		link: '/dashboard',
		icon: 'mdi-view-dashboard'
	},
	{
		title: 'Оперативные новости',
		link: '/news',
		icon: 'mdi-newspaper'
	},
	{
		title: 'Отключение газа',
		link: '/gas-off',
		icon: 'mdi-fire'
	},
	{
		title: 'Тарифы',
		link: '/tariffs',
		icon: 'mdi-currency-usd'
	},
	{
		title: 'Офисы обслуживания',
		link: '/offices',
		icon: 'mdi-office-building'
	},
	{
		title: 'Газификация',
		link: '/gasification',
		icon: 'mdi-gas-burner'
	},
	{
		spacer: true,
		class: 'splitter',
	},
	{
		title: 'Данные абонента',
		link: '/profile',
		icon: 'mdi-account'
	},
	{
		title: 'Показания счетчика',
		link: '/readings',
		icon: 'mdi-counter'
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
	{
		title: 'Ответственные лица',
		link: '/responsibles',
		icon: 'mdi-account-group'
	},
	{
		title: 'FAQ',
		link: '/faq',
		icon: 'mdi-help-circle-outline'
	},
	{
		spacer: true,
		class: 'spacer',
	},
	{
		title: 'Настройки',
		link: '/settings',
		icon: 'mdi-cog'
	},
	{
		title: 'Выход',
		link: '/logout',
		icon: 'mdi-logout'
	}
]);
</script>

<style lang="scss">
.sidebar {
	display: flex;
	flex-direction: column;
	background:#0e3896;
	color: #a9c0f6;
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
				flex:auto 1 1;
			}
			&:not(:has(.spacer, .splitter)):hover {
				background:#124bc6;
				color:#ffffff;
			}
			&.active {
				background:#124bc6;
				color:#ffffff;
			}

			.splitter {
				margin:1.6em 0;
				border-bottom:1px solid #5082ee;
			}

			a {
				display: block;
				color: inherit;
				text-decoration: none;
				font-size:1.1rem;
				padding:0 1em;
			}
		}
	}
}
</style>
