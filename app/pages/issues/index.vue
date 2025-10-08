<template>
	<section class="issues-page">
		<div class="issues">
			<h1>Заявки сотрудника</h1>
			<BaseTextBox v-model="search" @submit="fetchIssues" style="width:100%;" prepend-icon="mdi-magnify" button="Найти" placeholder="Поиск" />
			<div class="issue" v-for="issue of appStore.issues" :key="String(issue.summary).slice(0, 4)">
				<div class="title">{{ issue.summary }}</div>
				<div class="flex-line">
					<div class="issue-date"><span>Дата подачи: </span><span class="date">{{ issue.date }}</span></div>
					<div class="status" :style="{ background: issue.color }">{{ issue.issueStatus }}</div>
				</div>
				<BaseButton @click="navigateTo('/construct-pass')" prependIcon="mdi-plus">Добавить строй паспорт</BaseButton>
			</div>
			<div v-if="!appStore.issues.length">
				<BaseIcon name="mdi-magnify" size="1.2em" style="margin:0 .4em 0 0;"/>
				<span>Ничего не найдено</span>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
definePageMeta({
	auth: true,
	roles: ['ADMIN', 'CONTRACTOR'],
	layout: 'authorized'
});

const { $api } = useNuxtApp();
import BaseButton from '~/components/common/BaseButton.vue';
import BaseIcon from '~/components/common/BaseIcon.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import type { IssueList } from '~/types/IssueList';

const userStore = useUserStore();
const appStore = useAppStore();
const search = ref('');


async function fetchIssues() {
	console.log(`fetchIssues`);

	const queryParams = {} as Record<string, string | number>;
	queryParams.page = 1;
	queryParams.size = 10;
	const token = userStore.token;

	if(!token) {
		console.error('No token');
		return;
	}

	if(search.value) queryParams.search = search.value;

	const data: IssueList = await $api('portal/notes', {
		query: queryParams,
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		},
	});

	if(data.success) {
		const issues = data.data;
		const colors = [ '#0079C1', '#14cf34', '#e3ce31', ];

		issues.forEach((issue: any) => {
			const color = colors[Math.floor(Math.random() * colors.length)];
			issue.color = color;
		});

		appStore.issues = issues;
	}
}

onBeforeMount(() => {
	fetchIssues();
});
</script>

<style lang="scss">
body:has(.issues-page) {
	background-color: #e0f2fe;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	color: #183d6d;
}

.issues-page {
	.issues {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: .6em;
		max-width:650px;
		margin:1em auto;

		.issue {
			background-color: #fff;
			position: relative;
			padding: .6em 1em;
			// max-width: 600px;
			border-radius: 6px;
			box-shadow: 0 6px 40px rgba(0,0,0,.05);
			// box-shadow: 0 0 8px 0px #0079C1aa;

			.title {
				font-size: 1.2em;
				font-weight: 500;
				margin-bottom: .4em;
			}

			.issue-date {
				font-size: 14px;
				opacity: .6;

				.date {
					color: #7e0606;
					font-weight: 600;
				}
			}

			.flex-line {
				display:flex;
				align-items:center;
				gap:1em;
				justify-content: space-between;
				align-items: center;

				// &>* {
				// 	flex:auto 1 1;
				// }
			}

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
</style>
