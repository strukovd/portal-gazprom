<template>
	<div class="assignee-select-modal">
		<section class="asm-search">
			<BaseTextBox v-model="search" label="Поиск исполнителя" placeholder="ФИО или логин" prependIcon="mdi-magnify"/>
		</section>

		<section class="asm-list">
			<button
				v-for="user of filteredAssignees"
				:key="user.id"
				type="button"
				class="asm-user"
				@click="close(user)"
			>
				<UserBadge :name="user.name" :login="user.login"/>
				<BaseIcon name="mdi-plus" size="1.25em"/>
			</button>

			<div v-if="!filteredAssignees.length" class="asm-empty">Нет доступных исполнителей</div>
		</section>

		<footer class="asm-footer">
			<BaseButton prependIcon="mdi-close" variant="secondary" @click="close(null)">Закрыть</BaseButton>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '~/components/common/base/BaseButton.vue';
import BaseIcon from '~/components/common/base/BaseIcon.vue';
import BaseTextBox from '~/components/common/base/BaseTextBox.vue';
import UserBadge from '~/components/common/UserBadge.vue';
import type { AssigneePayload } from '~/services/complaints';

const props = defineProps<{
	payload?: {
		assignees?: AssigneePayload[];
	};
}>();

const search = ref('');
const filteredAssignees = computed(() => {
	const query = search.value.trim().toLowerCase();
	const assignees = props.payload?.assignees || [];
	if (!query) return assignees;

	return assignees.filter(user => {
		return [user.name, user.login].some(value => value.toLowerCase().includes(query));
	});
});

function close(result: AssigneePayload | null) {
	const modal = useAppStore().modals.pop();
	if (modal?.resolve) modal.resolve(result);
}
</script>

<style lang="scss">
.assignee-select-modal {
	width: min(560px, 82vw);

	.asm-search {
		margin: 0 0 1em 0;
	}

	.asm-list {
		display: grid;
		gap: .6em;
		max-height: 55vh;
		overflow-y: auto;
		padding-right: .2em;

		.asm-user {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: .8em;
			width: 100%;
			padding: .75em;
			border: 1px solid #e5e7eb;
			border-radius: 8px;
			color: #2563eb;
			background: #fff;
			cursor: pointer;
			transition: border-color 180ms ease 0s, background 180ms ease 0s, transform 180ms ease 0s;

			&:hover {
				border-color: #bfdbfe;
				background: #eff6ff;
				transform: translateY(-1px);
			}
		}

		.asm-empty {
			padding: 2em 1em;
			color: #737373;
			font-size: .9em;
			font-weight: 700;
			text-align: center;
		}
	}

	.asm-footer {
		display: flex;
		justify-content: flex-end;
		margin: 1em 0 0 0;
	}
}
</style>
