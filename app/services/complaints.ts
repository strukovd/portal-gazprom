import type { TariffPayload } from "~/types/GapromAppService";
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

export const complaints = {
	fetch(query: Partial<ComplaintsQuery> = {}): Promise<ComplaintsResponse | void> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<ComplaintsResponse>('/v1/call-gas/complaints', {
			method: 'GET',
			query
		})
			.then((resp) => {
				return resp;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке тарифов:', error);
			});
	}
};
