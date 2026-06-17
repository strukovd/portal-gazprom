<template>
	<div class="confirm-modal">
		<main class="content">
			<section>
				<h4>Предыдущие показания (м³)</h4>
				<span class="glass" style="font-size:2em; font-weight:700; padding:.5em 1em;">127</span>
			</section>
			<section>
				<h4>Новое показание (м³)</h4>
				<BaseTextBox autofocus v-model="reading" placeholder="Новые показания" />
			</section>

			<InfoBox v-if="msg.type" :type="msg.type" :title="msg.title" :message="msg.message"/>
		</main>
		<footer class="footer">
			<div class="buttons">
				<BaseButton prependIcon="mdi-check" @click="sendReading" @keyup.enter="sendReading">Отправить</BaseButton>
				<BaseButton prependIcon="mdi-close" @click="close" variant="secondary" @keyup.escape="close">Отмена</BaseButton>
			</div>
		</footer>
	</div>
</template>

<script lang="ts" setup>
import BaseButton from '../common/base/BaseButton.vue';
import BaseTextBox from '../common/base/BaseTextBox.vue';
import InfoBox from '../common/InfoBox.vue';
const { $fetchPortal } = useNuxtApp();
const props = defineProps({
	payload: Object
});

const reading = ref('');
const msg = reactive({
	type: '' as `info`|`error`|`warning`|`protect`|`success`,
	title: '',
	message: ''
});


function sendReading() {
	if( !/^\d+$/.test(reading.value) ) {
		msg.type = 'warning';
		msg.title = 'Внимание!';
		msg.message = 'Новые показания должны быть числом';
		return;
	}

	$fetchPortal('v1/portal/readings', {
		method: 'POST',
		body: {
			account: props.payload?.account,
			reading: reading.value
		}
	})
}

function confirm() {
	sendReading();
	const appStore = useAppStore();
	if (appStore) {
		const modal = appStore.modals.pop();
		if(modal && modal.resolve) modal?.resolve(true);
	}
}

function close() {
	const appStore = useAppStore();
	if (appStore) {
		const modal = appStore.modals.pop();
		if(modal && modal.resolve) modal?.resolve(false);
	}
}
</script>

<style lang="scss">
.confirm-modal {
	.content {
		padding:0 0 1.6em 0;

		.title {
			padding:0 0 .2em 0;
			margin:0 0 .2em 0;
			font-weight: 300;
			line-height: 1.3em;
			text-align:center;
			border-bottom:1px solid #46587c25;
		}
		.description {
			color:#46587c;
			text-align:center;
			white-space: pre-wrap;
		}
	}
	.footer {
		.buttons {
			// margin:1.6em 0 0 0;
			display: flex;
			gap: .4em;
			justify-content: flex-end;
		}
	}
}
</style>