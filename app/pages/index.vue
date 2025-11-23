<template>
	<section class="index-page">
		<NuxtLink :to="page.link" class="tile" v-for="(page, index) of pages" :key="index">
			<section>
				<img :src="page.image" alt="" />
			</section>
			<section>
				<div class="title">{{ page.title }}</div>
				<div class="description">{{ page.description }}</div>
			</section>
		</NuxtLink>
	</section>
</template>

<script lang="ts" setup>
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'MANAGER'],
	layout: 'authorized'
});

const pages = [
	{
		title: 'Список заявок',
		description: 'Используется подрядчиками, для создания заявок и загрузки документов',
		link: '/issues',
		image: '/img/issues.webp'
	},
	{
		title: 'Абоненты',
		description: 'Используется опреторами, для просмотра сводений о абонентах и загрузки показаний',
		link: '/readings',
		image: '/img/readings.webp'
	}
];
</script>

<style lang="scss">
.index-page {
	// min-height: 100vh;
	// gap: 2em;

	section:nth-child(1) {
		img {
			width: 100px;
			height: 100px;
			overflow: hidden;
			object-fit: cover;
			border-radius:50%;
		}
	}

	.tile {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		gap: 1.6em;

		// flex: 300px 0 1;
		background-color: #fff;
		padding: 2em 2em;
		margin:1em;
		width: 400px;
		border-radius: 8px;
		box-shadow:1px 1px 10px rgba(0,0,0,.1);
		cursor: pointer;
		text-decoration: none;
		color: inherit;

		.title {
			font-size: 24px;
			font-weight: 700;
			margin-bottom:.4em;
		}
		.description {
			font-size:16px;
			opacity: .6;
		}
	}
}
</style>
