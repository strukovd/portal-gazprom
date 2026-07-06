<template>
	<section v-if="accountData" id="account-line">
		<section class="account-info">
			<section @click="navigateTo(`/profile/${accountStore.account}`)" class="summary-section glass">
				<Avatar size="2.2em" :name="accountData.name"/>
				<section>
					<h2 style="font-size:1.2em;">
						<span>{{ accountData.name }}</span>
						<!-- <span> · </span>
						<BaseIcon v-if="accountData.type === `FL`" style="margin-right:.3em;" name="mdi-account-box"/>
						<BaseIcon v-if="accountData.type === `UL`" style="color:brown; margin-right:.3em;" name="mdi-scale-balance"/>
						<span>{{ accountStore.prettyType }}</span> -->
					</h2>
					<div>
						<span>
							<BaseIcon name="mdi-map-marker" style="margin-right:.3em;"/>
							<span>{{ accountData.address }}</span>
						</span>
					</div>
				</section>
			</section>
			<section class="address-section glass">
				<div>
					<!-- <BaseIcon name="mdi-counter"/> -->
					<BaseIcon v-if="accountData.type === `FL`" style="" name="mdi-account-box"/>
					<BaseIcon v-if="accountData.type === `UL`" style="color:brown;" name="mdi-scale-balance"/>
					<span> Лицевой счет</span>
				</div>
				<h2 style="font-size:1.2em;">{{ accountData.account }}</h2>
			</section>
			<section class="wallet-section glass">
				<div>
					<BaseIcon name="mdi-wallet-outline"/>
					<span> Баланс</span>
				</div>
				<h2 style="font-size:1.2em;">{{ accountData.balance }}</h2>
			</section>
			<section class="wallet-section glass">
				<div>
					<BaseIcon name="mdi-hand-coin-outline"/>
					<span> Тариф</span>
				</div>
				<h2 style="font-size:1.2em;">{{ tariffText }}</h2>
			</section>
		</section>

		<!-- <div class="main">
			<div>
				<div class="name">{{ accountData.name }}</div>
				<div class="meta">
					<span>{{ accountData.account }}</span>
					<span v-if="accountData.type"> · {{ accountData.type === "UL" ? "Юр. лицо" : "Физ. лицо" }}</span>
				</div>
			</div>
		</div>
		<div v-if="accountData.address" class="address">{{ accountData.address }}</div>
		<div class="extra">
			<span>Баланс: {{ accountData.balance }} сом</span>
			<span v-if="accountStore.loading">Обновление...</span>
			<span v-else-if="accountStore.error">Не удалось обновить данные</span>
		</div> -->

		<!-- <section class="tariff-section">
			<BaseIcon name="mdi-currency-usd" style="color:forestgreen; margin-right:.2em;"/>
			<span style="font-size:.8em;">Текущий тариф: </span>
			<b style="padding:0 .1em;">не указан</b>
		</section> -->

		<section class="close-context" title="Сбросить активного абонента" @click="clearContext">
			<BaseIcon name="mdi-close" size="26"/>
		</section>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from './common/base/BaseIcon.vue';
import Avatar from './common/Avatar.vue';

const accountStore = useAccountStore();
const appStore = useAppStore();
const route = useRoute();
const accountData = computed(() => accountStore.accountData);
const tariffText = computed(() => {
	const tariff = appStore.getTariff(accountData.value?.account);
	return tariff !== null ? `${tariff} сом/м³` : 'Не указан';
});

function clearContext() {
	accountStore.clearAccount();
	if (route.path.startsWith('/profile')) {
		navigateTo('/profile');
	}
}
</script>

<style lang="scss">
#account-line {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1em;
	position: sticky;
	top: 0;
	z-index: 10;
	padding: .5em 1em;
	// background: rgb(255, 202, 0);
	background-color: #ffdc58;
	color: #444;

	.account-info {
		display: flex;
		justify-content: center;
		gap: .7em;

		border-radius: 9px;
		// background: rgb(255 255 255 / 60%);
		font-size:.8em;

		.summary-section {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: .6em;
			// background: rgb(255 255 255 / 100%);
			// border-radius:5px;
			padding: .3em .8em;
			cursor:pointer;
		}

		.address-section, .wallet-section {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			// background-color:whitesmoke;
			// border-radius:5px;
			padding: .3em .8em;
		}
	}

	// .tariff-section {
	// 	padding: .3em .8em;
	// 	border-radius: 9px;
	// 	color: #444;
	// 	background: rgb(255 202 0);
	// 	filter: sepia(1);
	// }

	.close-context {
		color: #836212;
		cursor: pointer;

		.base-icon {
			transition: all 300ms ease 0s;

			&:hover {
				color: #3d2e09;
			}
		}
	}

	.glass {
		background: rgba(255, 255, 255, 0.3);
		border-radius: 5px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}
}
</style>
