<template>
	<section class="fieldworks-layout">
		<main class="fieldworks-content"><slot/></main>
	</section>
</template>

<style lang="scss">
.fieldworks-layout {
	min-height: 100dvh;

	.fieldworks-content {
		min-width: 0;
	}

	@media (min-width: 769px) {
		.fieldworks-content {
			// padding: 2em;
		}
	}
}
</style>
