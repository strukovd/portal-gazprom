<template>
	<section class="readings-page">
		<div class="readings-container">
			<h1>Показания</h1>
			<BaseTextBox v-model="search" @submit="fetchReadings" style="width:100%;" prepend-icon="mdi-magnify" button="Найти" placeholder="Поиск" />

			<div class="readings">
				<div class="reading" v-for="reading of readingList" :key="String(reading.name).slice(0, 4)">
					<label>
						<div class="name">{{ reading.name }}</div>
						<div class="address">{{ reading.address }}</div>
						<div class="reading-date"><span>Создан: </span><span class="date">{{ reading.created }}</span></div>
						<!-- <div class="flex-line">
							<div class="account">{{ reading.account }}</div>
						</div> -->
						<!-- <BaseButton @click="navigateTo('/construct-pass')" prependIcon="mdi-plus">Добавить строй паспорт</BaseButton> -->
						<BaseTextBox prepend-icon="mdi-counter" button="Отправить" placeholder="Введите показание" />
					</label>
				</div>
			</div>
			<!-- <div v-if="search && !readingList.length && !loading">
				<BaseIcon name="mdi-magnify" size="1.2em" style="margin:0 .4em 0 0;"/>
				<span>Ничего не найдено</span>
			</div> -->
		</div>
	</section>
</template>

<script lang="ts" setup>
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CALLCENTER'],
	layout: 'authorized'
});

type Reading = {
	name: string;
	account: string;
	address: string;
	created: string;
};

const { $api } = useNuxtApp();
import BaseButton from '~/components/common/BaseButton.vue';
import BaseIcon from '~/components/common/BaseIcon.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import type { IssueList } from '~/types/IssueList';


const search = ref('');
const loading = ref(false);
const readingList = ref([]) as Ref<Reading[]>;


async function fetchReadings() {
	loading.value = true;

	const queryParams = {} as Record<string, string | number>;
	if(search.value) queryParams.search = search.value;
	queryParams.limit = 10;

	if(search.value) queryParams.search = search.value;

	const data: IssueList = await $api('v2/facility/find', {
		query: queryParams,
		method: 'GET',
	});

	if(true || data.success) {
		readingList.value = data.data as any;
	}

	loading.value = false;
}
</script>

<style lang="scss">
body:has(.readings-page) {
	background-color: #e0f2fe;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	color: #183d6d;
}

.readings-page {
	.readings-container {
		max-width:650px;
		margin:1em auto;

		.readings {
			padding: .6em 0;

			.reading {
				background-color: #fff;
				position: relative;
				margin:.4em 0;
				padding: .6em 1em;
				// max-width: 600px;
				border-radius: 6px;
				box-shadow: 0 6px 40px rgba(0,0,0,.05);
				// box-shadow: 0 0 8px 0px #0079C1aa;

				.name {
					font-size: 1.2em;
					font-weight: 600;
					margin-bottom: .4em;
				}
				.address {
					font-size: 14px;
					opacity: .6;
					margin:.4em 0;
				}

				.reading-date {
					font-size: 14px;
					opacity: .6;
					margin:.4em 0;

					.date {
						color: #7e0606;
						font-weight: 600;
					}
				}

				// .flex-line {
				// 	display:flex;
				// 	align-items:center;
				// 	gap:1em;
				// 	justify-content: space-between;
				// 	align-items: center;

				// 	// &>* {
				// 	// 	flex:auto 1 1;
				// 	// }
				// }

				.status {
					// position: absolute;
					// top: 0;
					// right: 0;
					display: inline-block;
					background-color: #0079C1;
					color: #fff;
					padding:.4em .9em;
					font-size: 14px;
					border-radius:6px;
				}
			}
		}
	}
}
</style>
