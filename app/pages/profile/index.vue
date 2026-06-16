<template>
	<section id="profile-search-page">
		<BaseBreadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/' }, { title: 'Данные абонента' }]" />


		<section>
			<BaseIsland class="search-panel" title="Выбор абонента" prependIcon="mdi-account-box">
				<BaseTextBox v-model="searchText" @submit="findAccounts" label="Абонент" prependIcon="mdi-magnify" button="Поиск" placeholder="Введите ФИО, адрес или лицевой счет"/>
			</BaseIsland>
	
			<section v-if="foundList?.length" class="found-list">
				<BaseIsland v-for="account of foundList" :key="account.account" class="item"
					@click="selectAccount(account)">
					<div class="avatar">
						<BaseIcon name="mdi-account-outline" size="22" />
					</div>
					<div class="content">
						<div class="name">{{ account.name || 'Абонент' }}</div>
						<div class="number">Л/с {{ account.account }}</div>
						<div class="address">{{ account.address || 'Адрес не указан' }}</div>
					</div>
					<BaseIcon class="chevron" name="mdi-chevron-right" size="24" />
				</BaseIsland>
			</section>
			<template v-else-if="foundList?.length === 0">
				<BaseIsland class="empty-state">
					<BaseIcon name="mdi-account-search-outline" size="32" />
					<div>
						<div class="title">Абоненты не найдены</div>
						<div class="message">Попробуйте изменить ФИО, адрес или лицевой счет.</div>
					</div>
				</BaseIsland>
			</template>
		</section>
	</section>
</template>

<script lang="ts" setup>
import BaseBreadcrumbs from '~/components/common/base/BaseBreadcrumbs.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';

definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER', 'CONTRACTOR'],
	layout: 'authorized'
});

const accountStore = useAccountStore();
const { $flags } = useNuxtApp();

const searchText = ref('');
const foundList = ref<any[] | null>(null);

onMounted(() => {
	redirectToActiveAccount();
});

watch(() => accountStore.account, () => {
	redirectToActiveAccount();
});

async function findAccounts(text = searchText.value) {
	const value = String(text || '').trim();
	foundList.value = await accountStore.find(value);
}

function selectAccount(account: any) {
	accountStore.setActiveAccount(account.account);
	$flags.success(`Выбран абонент: Л/с ${account.account}`);
	navigateTo(`/profile/${account.account}`);
}

function redirectToActiveAccount() {
	if (accountStore.account) {
		navigateTo(`/profile/${accountStore.account}`);
	}
}
</script>

<style lang="scss">
#profile-search-page {
	display: flex;
	flex-direction: column;
	gap: 1em;

	.search-panel {

	}

	.found-list {
		display: grid;
		gap: .75em;
		// max-width: 920px;

		.item {
			display: flex;
			align-items: center;
			gap: 1em;
			cursor: pointer;
			padding: 1em 1.1em;

			&:hover,
			&:focus-visible {
				background: #eff6ff;
				border-color: #bfdbfe;
				outline: none;
			}

			.avatar {
				width: 44px;
				height: 44px;
				flex: 0 0 44px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 8px;
				background: #eff6ff;
				color: #2563ea;
			}

			.content {
				min-width: 0;
				flex: 1 1 auto;

				.name {
					color: #111827;
					font-size: 1.05rem;
					font-weight: 700;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.number {
					margin-top: .2em;
					color: #2563ea;
					font-size: .9rem;
					font-weight: 700;
				}

				.address {
					margin-top: .2em;
					color: #64748b;
					font-size: .86rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.chevron {
				color: #94a3b8;
			}
		}
	}

	.empty-state {
		display: flex;
		align-items: center;
		gap: .9em;
		max-width: 720px;
		color: #64748b;

		.base-icon {
			color: #2563ea;
		}

		.title {
			color: #111827;
			font-weight: 700;
		}

		.message {
			margin-top: .2em;
			font-size: .9rem;
		}
	}
}
</style>
