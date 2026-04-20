<template>
	<section class="login-page">
		<h1>Вход в систему</h1>
		<div>Авторизуйтесь для полного доступа к рабочей панели</div>
		<div class="auth">
			<!-- <h2 class="title">Авторизация</h2> -->
			<form class="form" @keyup.enter="signIn" @submit.prevent="signIn">
				<BaseTextBox v-model="login" label="Логин сотрудника" prependIcon="mdi-account-outline" placeholder="Введите логин" autofocus/>
				<BaseTextBox v-model="password" label="Пароль" type="password" prependIcon="mdi-lock" placeholder="Введите пароль"/>
				<div v-if="error" style="color:red; text-align:center; font-size:.9em">{{ error }}</div>
				<div>
					<BaseCheckbox id="remember" label="Запомнить меня" v-model="rememberMe">Запомнить сессию</BaseCheckbox>
					<a href="/forgot-password" style="color:#0d3895; font-size:.9em;">Забыли пароль?</a>
				</div>
				<BaseButton @click="signIn" style="line-height:2em; text-align:center;">Войти в систему</BaseButton>
			</form>
		</div>
	</section>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();
import type { FetchError } from 'ofetch';
import BaseButton from '~/components/common/BaseButton.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import { useUserStore } from '~/stores/UserStore';
import { type UserData } from '~/types/UserData';

const login = ref('');
const password = ref('');
const error = ref('');


async function signIn() {
	$api<UserData>('v1/portal/auth', {
		method: 'POST',
		body: { login: login.value, password: password.value },
	})
		.then((data) => {
			if(data.success) {
				useUserStore().setData(data);

				switch( String(data.userData.role).toUpperCase() ) {
					case 'CONTRACTOR':
						navigateTo('/issues');
						break;
					case 'ADMIN':
						navigateTo('/');
						break;
					case 'CALLCENTER':
					case 'CONTROLLER':
						navigateTo('/readings');
						break;

					default:
						navigateTo('/');
						break;
				}
			}
		})
		.catch((err: FetchError) => {
			error.value = err.data.message;
		});

}


</script>

<style lang="scss">
.login-page {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100vh;

	h1 {
		color:#0d3895;
	}
	.island {
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 20px;
	}
	.auth {
		.title {
			font-size: 2em;
			text-align: center;
			margin-bottom:.6em;
		}
		.form {
			.logo {
				text-align: center;
			}
			padding:1em 3em 3em 3em;
			display: flex;
			flex-direction: column;
			gap: 1em;
			background-color: #fff;
			border-radius: 6px;
			border: 1px solid #e5e5e5;
			// filter: drop-  shadow(0px 0px 4px rgba(0, 0, 0, 0.1));
		}
	}
}
</style>
