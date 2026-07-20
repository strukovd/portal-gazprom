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
export type ComplaintsStatsQuery = Pick<ComplaintsQuery, 'createdDateFrom' | 'createdDateTo' | 'status' | 'description' | 'subject'>;
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
export type AssigneePayload = {
	id: number;
	login: string;
	name: string;
	role: string;
};
export type AssigneesResponse = AssigneePayload[];
export type ResponsibilityMatrix = {
  [branchKey: string]: {
    [complaintType: string]: {
      id: number;
      login: string;
      name: string;
    }[]
  }
};


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

	resolveComplaintName(key: string): string {
		const complaintNames: Record<string, string> = {
			BSG_COMPLAINT: 'Жалоба на БСГ',
			EMPLOYEE_COMPLAINT: 'Жалоба на сотрудника',
			OTHER: 'Прочее',
			TARIFFS_PRICE_LIST: 'Тарифы/Прейскурант цен',
			ROAD_NOT_RESTORED: 'Не восстановили дорожное покрытие после газификации',
			WRONG_CHARGES: 'Некорректные начисления',
			NO_RECEIPTS: 'Не приносят квитанции',
			RECALCULATION_CHARGES: 'Перерасчет начислений',
			DAMAGED_GAS_PIPELINE: 'Повредили газопровод',
			SERVICE_DEVELOPMENT_ECH: 'Предоставление услуг:Разработка ЭЧ',
			INSTALL_REMOVE_REPLACE_BSG: 'Установка/Снятие/Замена БСГ',
			SERVICE_CONSTRUCTION_INSTALLATION_COMMISSIONING_REPLACE_BSG: 'Предоставление услуг СМР, ПНР, Замена БСГ',
			LEAK_ACCIDENT: 'Утечка/ Авария',
		};
		return complaintNames[key] || 'Неизвестная жалоба';
	},

	resolveBranchName(key: string): string {
		const branchNames: Record<string, string> = {
			"OSH": "Ош",
			"CHUI": "Чуй",
			"JALALABAD": "Джалал-Абад",
			"BISHKEK": "Бишкек"
		};
		return branchNames[key] || 'Неизвестный филиал';
	},

	fetchAssignees(): Promise<AssigneesResponse> {
		const { $fetchApi } = useNuxtApp();
		return $fetchApi<AssigneesResponse>('/v1/call-gas/complaints/assignees');
	},

	fetchResponsibilityMatrix(): Promise<ResponsibilityMatrix> {
		const { $fetchApi } = useNuxtApp();
		return $fetchApi<ResponsibilityMatrix>('/v1/call-gas/complaints/responsibilities');
	},

	updateResponsibilityMatrix(body: ResponsibilityMatrix): Promise<void> {
		const { $fetchApi } = useNuxtApp();
		return $fetchApi<void>(`/v1/call-gas/complaints/responsibilities`, {
			method: 'PUT',
			body
		});
	},

	downloadExcelReport(query: Partial<ComplaintsQuery> = {}): Promise<Blob> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<Blob>('/v1/call-gas/complaints/export/excel', {
			method: 'GET',
			query,
			responseType: 'blob'
		});
	},

};
