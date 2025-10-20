<template>
	<section class="page-403">
		<h1 class="h1">💀 403</h1>
		<p class="description">Вы пытались зайти на страницу на которую у вас нет доступа.</p>
		<p class="description">
			<BaseButton color="#333" @click="navigateTo('/')" prependIcon="mdi-home">Перейдите на главную</BaseButton><br> для переадресации на страницу назначения,
			или <br>
			<BaseButton color="#333" @click="logout" prependIcon="mdi-logout"> сбросьте сессию</BaseButton>
			<br> для повторной авторизации
		</p>
	</section>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/BaseButton.vue';

definePageMeta({
	// layout: 'authorized'
});

function logout() {
	useUserStore().clear();
	navigateTo('/login');
}
</script>

<style lang="scss">

body:has(.page-403) {
	background-color: #0079C1;
	color: #fff;
}

.page-403 {
	.base-button {
		font-size: .8em;
		margin: 1em 0;
	}
	.h1 {
		font-size: 6em;
		text-align: center;
	}
	.description {
		font-size: 1.4em;
		line-height: 1em;
		text-align: center;
	}
}
</style>
