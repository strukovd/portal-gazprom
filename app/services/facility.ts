import type { FacilityReadingsResponse } from '~/types/Facility';

export const facility = {
	fetchReadings(query: { account: string; page?: number; limit?: number; startDate?: string; endDate?: string; includePortalUser?: boolean }) {
		const { $fetchApi } = useNuxtApp();
		return $fetchApi<FacilityReadingsResponse>('/v1/facility/readings', {
			method: 'GET',
			query: { page: 1, limit: 5, ...query },
		});
	},
};
