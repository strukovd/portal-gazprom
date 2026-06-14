<template>
	<section v-if="accountInfo.account" id="account-line">
		<section class="tariff-section">
			<BaseIcon name="mdi-currency-usd" style="color:forestgreen; margin-right:.2em;"/>
			<span style="font-size:.8em;">Текущий тариф: </span>
			<b style="padding:0 .1em;">{{ accountInfo.tariff || 'не указан' }}</b>
			<span v-if="accountInfo.tariff" style="font-size:.8em;"> сом/м³</span>
		</section>

		<section class="account-info">
			<template v-if="accountInfo.account">
				<div class="account-info__main">
					<BaseIcon name="mdi-account-circle-outline" size="20"/>
					<div>
						<div class="account-info__name">{{ accountInfo.name || 'Абонент' }}</div>
						<div class="account-info__meta">
							<span>Л/с {{ accountInfo.account }}</span>
							<span v-if="accountInfo.status">· {{ accountInfo.status }}</span>
						</div>
					</div>
				</div>
				<div v-if="accountInfo.address" class="account-info__address">{{ accountInfo.address }}</div>
				<div class="account-info__extra">
					<span v-if="accountInfo.balance !== ''">Баланс: {{ accountInfo.balance }} сом</span>
					<span v-if="accountStore.loading">Обновление...</span>
					<span v-else-if="accountStore.error">Не удалось обновить данные</span>
				</div>
			</template>
		</section>

		<section class="close-context">
			<BaseIcon name="mdi-close" size="26"/>
		</section>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from './common/base/BaseIcon.vue';
const accountStore = useAccountStore();
const accountInfo = computed(() => accountStore.activeAccountInfo);

</script>

<style lang="scss">
#account-line {
	display:flex;
	align-items:center;
	justify-content:space-between;
	gap:1em;
	background:#ffca00;
	padding:.5em 1em;
	position:sticky;
	top:0;
	z-index:10;

	.tariff-section {
		background:rgb(255 202 0);
		filter:sepia(1);
		color:#444;
		padding:.3em .8em;
		border-radius:9px;

		// .flag-icon {
		// 	width: 40px;
		// 	height: 40px;
		// 	border-radius: 4px;
		// }
	}

	.account-info {
		display:flex;
		flex-direction:column;
		align-items:flex-end;
		gap:.15em;
		text-align:right;
		min-width:0;
		color:#171717;

		&__main {
			display:flex;
			align-items:center;
			justify-content:flex-end;
			gap:.45em;
			max-width:100%;
		}

		&__name {
			font-size:.9rem;
			font-weight:700;
			white-space:nowrap;
			overflow:hidden;
			text-overflow:ellipsis;
			max-width:420px;
		}

		&__meta,
		&__address,
		&__extra {
			color:#525252;
			font-size:.78rem;
		}

		&__address {
			white-space:nowrap;
			overflow:hidden;
			text-overflow:ellipsis;
			max-width:520px;
		}

		&__extra {
			display:flex;
			gap:.5em;
			justify-content:flex-end;
			flex-wrap:wrap;
		}

	}

	.close-context {
		cursor: pointer;
		color:#836212;
		
		.base-icon {
			transition:all 300ms ease 0s;
			
			&:hover {
				color:#3d2e09;
			}
		}
	}
}
</style>
