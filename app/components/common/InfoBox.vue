<template>
	<section :class="[`info-box`, type]">
		<div class="icon-area">
			<BaseIcon v-if="iconName" :name="iconName" size="2em" color="#f5a3a3"/>
			<!-- <BaseIcon v-else="type === 'protect'" name="mdi-shield-lock" size="2em" color="#2563ea"/> -->
		</div>
		<div class="content-area">
			<h2>{{ title }}</h2>
			<p>{{ message }}</p>
		</div>
	</section>
</template>

<script lang="ts" setup>
import BaseIcon from './base/BaseIcon.vue';

const props = defineProps({
	title: String,
	message: String,
	type: { type: String as () => `info`|`error`|`warning`|`protect`|`success`, default: '' },
});

const iconName = computed(() => {
	switch (props.type) {
		case 'info':
			return 'mdi-information';
		case 'warning':
			return 'mdi-alert-circle';
		case 'error':
			return 'mdi-alert';
		case 'protect':
			return 'mdi-shield-lock';
		case 'success':
			return 'mdi-check-circle';
		default:
			return '';
	}
});
</script>

<style lang="scss">
.info-box {
	display: flex;
	align-items: center;
	gap: 1em;
	font-size:.8em;
	background:#e9effd;
	padding:1em;
	margin:1em 0 0 0;
	border:1px solid #acc1ee;
	border-radius:12px;

	h2 {
		font-size:1.1em;
		margin:.4em 0 .2em 0;
	}
	p {
		font-size:.94em;
		margin:.4em 0 .2em 0;
		white-space: pre-wrap;
	}

	&.error {
		background: #fef2f2;
		border-color: #fba5a4;
		color: #a33a3a;
		.icon-area {
			color: #ee4444;	
		}
		.content-area {
			h2 {
				color: #b81c1d;
			}
			p {
				color: #dc2625;
			}
		}
	}
	&.info, &.protect {
		background: #e9effd;
		border-color: #acc1ee;
		color: #2563ea;
		.icon-area {	
			color: #2563ea;
		}
		.content-area {
			h2 {
				color: #0d3895;
			}
			p {
				color: #124bc8;
			}
		}
	}
	&.warning {
		background: #fff4e5;
		border-color: #f5c6a5;
		color: #d97706;
		.icon-area {	
			color: #d87706;
		}
		.content-area {
			h2 {
				color: #a44f05;
			}
			p {
				color: #9a3412;
			}
		}
	}
	&.success {
		background: #ecfdf5;
		border-color: #a3d9b0;
		color: #157f3d;
		.icon-area {	
			color: #157f3d;
		}
		.content-area {
			h2 {
				color: #157f3d;
			}
			p {
				color: #157f3d;
			}
		}
	}
}
</style>