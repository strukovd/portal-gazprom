<template>
	<BaseIsland class="fieldworks-overall">
		<div class="fwo-heading">
			<strong class="fwo-title">По всем контроллёрам</strong>
			<strong class="fwo-percent">{{ Math.round(statistics.collectionPercentage) }}%</strong>
		</div>
		<BaseProgressBar :percent="statistics.collectionPercentage" height=".5em"/>
		<div class="fwo-counts">
			<span><b>{{ statistics.collectedReadings }}</b> собрано</span>
			<span><b>{{ statistics.remainingReadings }}</b> осталось</span>
		</div>
	</BaseIsland>
</template>

<script lang="ts" setup>
import BaseIsland from '~/components/common/base/BaseIsland.vue';
import BaseProgressBar from '~/components/common/base/charts/BaseProgressBar.vue';
import type { AdminControllersPayload } from '~/types/Portal';

defineProps<{ statistics: AdminControllersPayload['overallStatistics'] }>();
</script>

<style lang="scss">
.fieldworks-overall {
	display: grid;
	gap: .75em;
	min-width: 0;

	.fwo-heading, .fwo-counts {
		display: flex;
		justify-content: space-between;
		gap: 1em;
	}

	.fwo-title { font-size: 1em; }
	.fwo-percent { color: #2563eb; }
	.fwo-counts { color: #64748b; font-size: .85em; }
}
</style>
