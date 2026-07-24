const MOBILE_UA_REGEXP = /android|blackberry|iemobile|iphone|ipod|opera mini|webos/i;

const useDevice = () => {
	const isMobile = useState('device:isMobile', () => {
		if (import.meta.server) {
			const userAgent = useRequestHeader('user-agent') ?? '';

			return MOBILE_UA_REGEXP.test(userAgent);
		}

		const userAgent = navigator.userAgent;

		return userAgent
			? MOBILE_UA_REGEXP.test(userAgent)
			: window.matchMedia('(max-width: 768px)').matches;
	});

	const isDesktop = computed(() => !isMobile.value);

	return {
		isMobile,
		isDesktop,
	};
};

export default useDevice;