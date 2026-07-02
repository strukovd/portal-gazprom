export type ComplaintsQuery = {
		account: string;
		assigneeId: string;
		createdById: string;
		branch: `BISHKEK` | `CENTRAL` | `OSH` | `JALALABAD` | `CHUI`;
		subject: `Жалоба на БСГ` | `Жалоба на сотрудника` | `Прочее` | `Тарифы/Прейскурант цен` | `Не восстановили дорожное покрытие после газификации` | `Некорректные начисления` | `Не приносят квитанции` | `Перерасчет начислений` | `Повредили газопровод` | `Предоставление услуг:Разработка ЭЧ` | `Установка/Снятие/Замена БСГ` | `Предоставление услуг СМР, ПНР, Замена БСГ` | `Утечка/ Авария`;
		urgencyLevel: `Срочно` | `Очень срочно` | `Обычная`;
		status: `Новая` | `Просрочено` | `Закрыто` | `В работе`;
		description: string;
		createdDateFrom: string;
		createdDateTo: string;
		page: number;
		size: number;
};
export type ComplaintsStatsQuery = {
		createdDateFrom: string;
		createdDateTo: string;
};
export type ComplaintsBody = {
	account: string;
	subject: `Жалоба на БСГ` | `Жалоба на сотрудника` | `Прочее` | `Тарифы/Прейскурант цен` | `Не восстановили дорожное покрытие после газификации` | `Некорректные начисления` | `Не приносят квитанции` | `Перерасчет начислений` | `Повредили газопровод` | `Предоставление услуг:Разработка ЭЧ` | `Установка/Снятие/Замена БСГ` | `Предоставление услуг СМР, ПНР, Замена БСГ` | `Утечка/ Авария`;
	urgencyLevel: `Срочно` | `Очень срочно` | `Обычная`;
	description: string;
	contactNumber?: string;
};
export type ComplaintsPutBody = {
	urgencyLevel: `Срочно` | `Очень срочно` | `Обычная`;
	description: string;
	contactNumber?: string;
	files?: string[];
	status: string;
};
export type ComplaintsResponse = {
	data: ComplaintsPayload[];
	page: string;
	size: string;
	total: number;
};
export type ComplaintsPayload = {
	id: number;
	account: string;
	subject: string;
	status: string;
	urgencyLevel: string;
	description: string;
	userName: string;
	createdByName: string;
	contactNumber: string;
	subscriberName: string;
	created: string;
	updated: string;
	branchName: string;
	sla: number;
};
type StatsPayload = {
	total: number;
	new: number;
	inProgress: number;
	closed: number;
	expired: number;
	sla: number;
	subjects: {
		subject: string;
		count: number;
	}[]
}
export type StatsResponse = {
	all: StatsPayload,
	bishkek: StatsPayload,
	chui: StatsPayload,
	osh: StatsPayload,
	jalalabad: StatsPayload
}
export type CountsResponse = {
	total: number;
	new: number;
	inProgress: number;
	closed: number;
	expired: number;
	avgProcessingTime: number;
}
export type TimelineResponse = {
	data: TimelinePayload[];
	size: number;
}
export type TimelinePayload = {
	id: number;
	date: string;
	type: string;
	title: string;
	comment: string;
}


export const complaints = {
	fetch(query: Partial<ComplaintsQuery> = {}): Promise<ComplaintsResponse> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<ComplaintsResponse>('/v1/call-gas/complaints', {
			method: 'GET',
			query
		});
	},

	fetchStats(query: Partial<ComplaintsStatsQuery> = {}): Promise<StatsResponse> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<StatsResponse>('/v1/call-gas/complaints/statistics', {
			method: 'GET',
			query
		});
	},

	fetchCounts(query: Partial<Record<string, any>> = {}): Promise<CountsResponse> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<CountsResponse>('/v1/call-gas/complaints/counts', {
			method: 'GET',
			query
		});
	},

	fetchTimeline(query: Partial<Record<string, any>> = {}): Promise<TimelineResponse> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<TimelineResponse>('/v1/call-gas/complaints/timeline', {
			method: 'GET',
			query
		});
	},

	create(body: ComplaintsBody): Promise<ComplaintsResponse> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<ComplaintsResponse>('/v1/call-gas/complaints', {
			method: 'POST',
			body
		});
	},

	update(id: number, body: ComplaintsPutBody): Promise<ComplaintsResponse> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<ComplaintsResponse>(`/v1/call-gas/complaints/${id}`, {
			method: 'PUT',
			body
		});
	},

	delete(id: number): Promise<ComplaintsResponse> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<ComplaintsResponse>(`/v1/call-gas/complaints/${id}`, {
			method: 'DELETE'
		});
	},
};
