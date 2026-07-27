<template>
	<div class="base-avatar">
		<div class="initials">{{ initials }}</div>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	src: String,
	name: { type: [String, null], default: '' },
	size: { type: String, default: '2em' }
});


const initials = computed(() => {
	if(typeof props.name === 'string' && props.name.trim() !== '') {
		return props.name.split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();
	}
	return '';
});

const backgroundColor = computed(() => {
	const name = String(props.name).trim();
	if(typeof props.name !== 'string' || !name) return '#2563ea';

	const colors = ['#2563ea', '#17a34a', '#ee4444', '#d87706', '#06b1d8', '#f1569e', '#8a2be2'];
	const charCode = name.charCodeAt(0);
	return colors[charCode % colors.length];
});
</script>

<style lang="scss">
.base-avatar {
	width:v-bind(size);
	min-width:v-bind(size);
	aspect-ratio:1/1;
	display: flex;
	align-items: center;
	justify-content: center;
	background: v-bind(backgroundColor);
	border-radius: 50%;
	.initials {
		color:#feffff;
		font-weight:700;
		font-size:calc(v-bind(size) / 2.4);
		user-select:none;
	}
}
</style>