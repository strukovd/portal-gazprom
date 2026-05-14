<template>
	<section class="login-page">
		<div class="auth">
			<section style="margin:2em 0;">
				<h2 class="title">Вход в систему</h2>
				<div style="color:#737373; font-size:.9em; text-align:center;">Авторизуйтесь для полного доступа к рабочей панели</div>
			</section>
			<form class="form" @keyup.enter="signIn" @submit.prevent="signIn">
				<BaseTextBox v-model="login" label="Логин сотрудника" prependIcon="mdi-account-outline" placeholder="Введите логин" autofocus/>
				<BaseTextBox v-model="password" label="Пароль" type="password" prependIcon="mdi-lock" placeholder="Введите пароль"/>
				<div v-if="error" style="color:red; text-align:center; font-size:.9em">{{ error }}</div>
				<div style="display:flex; justify-content:space-between; align-items:center; margin-top:.5em;">
					<BaseCheckbox label="Запомнить сессию" v-model="rememberMe"/>
					<a href="/forgot-password" style="color:#2563ea; font-size:.9em;">Забыли пароль?</a>
				</div>
				<InfoBox type="error" title="Ошибка авторизации" :message="`Неверный логин или пароль. Проверьте данные и повторите попытку. Если проблема сохраняется — восстановите доступ или обратитесь к администратору.`"/>
				<BaseButton @click="signIn" style="line-height:2em; text-align:center;">Войти в систему</BaseButton>
			</form>
			<InfoBox type="protect" title="Защищённый доступ" :message="`Все данные абонентов передаются по шифрованному каналу. \nДоступ регулируется политикой безопасности компании.`"/>
			<p style="font-size:.8em; color:#a3a3a3; text-align: center;">Вход доступен только для авторизованных сотрудников колл-центра.При возникновении проблем обратитесь в IT-поддержку</p>
		</div>
	</section>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();
import type { FetchError } from 'ofetch';
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseCheckbox from '~/components/common/base/BaseCheckbox.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import InfoBox from '~/components/common/InfoBox.vue';
import { useUserStore } from '~/stores/UserStore';
import { type UserData } from '~/types/UserData';

const login = ref('');
const password = ref('');
const error = ref('');
const rememberMe = ref(false);


async function signIn() {
	navigateTo('/dashboard');
	return;

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

	a {
		text-decoration: none;
		color: #2563ea;
		font-weight:700;
	}
	.island {
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		padding: 20px;
	}
	.auth {
		max-width: 440px;

		.title {
			color:#0d3895;
			font-size: 2em;
			text-align: center;
			margin:0 0 .2em 0;
		}
		.form {
			.logo {
				text-align: center;
			}
			padding:3em 3em 3em 3em;
			display: flex;
			flex-direction: column;
			gap: 1em;
			background-color: #fff;
			border-radius:12px;
			border: 1px solid #e5e5e5;
			// filter: drop-  shadow(0px 0px 4px rgba(0, 0, 0, 0.1));
		}
	}
}
</style>
