import type { Ref } from 'vue';

export const useBottomSheet = (isMobile: Ref<boolean>, close: (event: Event) => void) => {
	const offset = ref(0);
	const dragStart = ref<number | null>(null);

	const style = computed(() => isMobile.value && offset.value
		? { transform: `translateY(${offset.value}px)` }
		: undefined
	);

	function start(event: PointerEvent) {
		if (!isMobile.value) return;

		dragStart.value = event.clientY;
		window.addEventListener('pointermove', drag);
		window.addEventListener('pointerup', stop);
		window.addEventListener('pointercancel', stop);
	}

	function drag(event: PointerEvent) {
		if (dragStart.value === null) return;

		offset.value = Math.max(event.clientY - dragStart.value, 0);
	}

	function stop(event: PointerEvent) {
		window.removeEventListener('pointermove', drag);
		window.removeEventListener('pointerup', stop);
		window.removeEventListener('pointercancel', stop);

		if (offset.value > 90) {
			close(event);
		}

		reset();
	}

	function reset() {
		offset.value = 0;
		dragStart.value = null;
	}

	onBeforeUnmount(() => {
		window.removeEventListener('pointermove', drag);
		window.removeEventListener('pointerup', stop);
		window.removeEventListener('pointercancel', stop);
	});

	return {
		style,
		start,
		reset,
	};
};
