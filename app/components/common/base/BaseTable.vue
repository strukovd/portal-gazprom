<template>
	<div class="base-table-wrapper">
		<table class="base-table">
			<thead class="bt-thead">
				<tr>
					<th
						v-for="column in columns"
						:key="column.key"
						class="base-table__cell"
						:style="{ width: column.width }"
					>
						{{ column.label }}
					</th>
				</tr>
			</thead>

			<tbody class="bt-tbody">
				<tr v-if="loading">
					<td class="base-table__cell base-table__cell--state" :colspan="columns.length">
						<slot name="loading">Загрузка...</slot>
					</td>
				</tr>

				<tr v-else-if="!items.length">
					<td class="base-table__cell base-table__cell--state" :colspan="columns.length">
						<slot name="empty">Нет данных</slot>
					</td>
				</tr>

				<tr v-else
					v-for="(item, rowIndex) in items"
					:key="getRowKey(item, rowIndex)"
					class="base-table-row"
				>
					<td v-for="column in columns" :key="column.key" class="base-table__cell">
						<slot
							:name="`cell.${column.key}`"
							:item="item"
							:value="getValue(item, column.key)"
							:column="column"
							:row-index="rowIndex"
						>
							{{ getValue(item, column.key) }}
						</slot>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
type TableColumn = {
	key: string;
	label: string;
	width?: string;
};

type TableItem = Record<string, unknown>;

const props = withDefaults(defineProps<{
	columns: TableColumn[];
	items: TableItem[];
	loading?: boolean;
	rowKey?: string | ((item: TableItem, index: number) => string | number);
}>(), {
	loading: false,
	rowKey: 'id',
});

function getValue(item: TableItem, key: string): unknown {
	return item[key] ?? '';
}

function getRowKey(item: TableItem, index: number): string | number {
	if(typeof props.rowKey === 'function') {
		return props.rowKey(item, index);
	}

	const value = item[props.rowKey];

	if(typeof value === 'string' || typeof value === 'number') {
		return value;
	}

	return index;
}
</script>

<style lang="scss">
.base-table-wrapper {
	width: 100%;
	overflow-x: auto;
}

.base-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;

	.bt-thead {
		tr {
			border-bottom: 1px solid #e5e5e5;
		}
	}

	.bt-tbody {
		tr {
			border-bottom: 1px solid #f5f5f5;

			&:last-child {
				border-bottom: none;
			}
		}
	}


	&__cell {
		padding: 10px 12px;
		text-align: left;
		vertical-align: middle;
		white-space: nowrap;

		&--state {
			padding: 24px;
			text-align: center;
			color: #777;
		}
	}
}
</style>