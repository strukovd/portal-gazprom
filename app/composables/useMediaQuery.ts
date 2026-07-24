export const useMediaQuery = (query: string) => {
	const matches = ref(false);
	if (!import.meta.client) {
		return matches;
	}

	const mediaQuery = window.matchMedia(query);
	matches.value = mediaQuery.matches;

	const updateMatches = (event: MediaQueryListEvent) => {
		matches.value = event.matches;
	};

	mediaQuery.addEventListener('change', updateMatches);
	onScopeDispose(() => {
		mediaQuery.removeEventListener('change', updateMatches);
	});

	return matches;
};
