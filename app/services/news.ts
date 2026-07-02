// import type { NewsGetQuery, NewsPayload, NewsResponse } from '~/types/CallGas';
export type NewsCategory = `DISCONNECTION` | `OFFICES` | `GASIFICATION` | `FAQ`;
export type NewsTypes = `EMERGENCY` | `PLANNED` | `STANDARD` | `OZP` | `HOLIDAY` | `WHITE_DOTS` | `INVESTMENT_PROGRAM` | `FAQ_ANY`;
export type NewsBranch = `BISHKEK` | `CHUI` | `OSH` | `JALALABAD`;
export type NewsLevel = `NORMAL` | `MIDDLE` | `HIGH`;
export type NewsSortFields = `created` | `updated` | `startDate` | `endDate`;
export type NewsResponse = {
	data: NewsPayload[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
export type NewsPayload = {
	id: number;
	category: string;
	categoryType: NewsTypes;
	branch: string;
	urgencyLevel: string;
	title: string;
	text: string;
	textForClient: string;
	startDate: string;
	endDate: string;
	user: {
		id: number;
		login: string;
		name: string;
	};
	created: string;
	updated: string;
}
export type NewsCreatePayload = {
	title: string;
	text: string; // Основной текст
	textForClient: string; // Текст для озвучивания абоненту
	categoryType: `` | NewsTypes;
	branch: `` | NewsBranch;
	urgencyLevel: `` | NewsLevel;
	startDate: string;
	endDate: string;
};
export type NewsUpdatePayload = NewsCreatePayload; 
export type NewsGetQuery = {
	title: string;
	categoryFilter: NewsCategory;
	categoryTypeFilter: NewsTypes;
	branchFilter: NewsBranch;
	urgencyLevelFilter: NewsLevel | Array<NewsLevel>;
	createdFilter: string;
	startDateFilter: string;
	endDateFilter: string;
	sortField: NewsSortFields;
	sortOrder: `ASC` | `DESC`;
	page: number;
	size: number;
};


export const news = {
	fetch(query: Partial<NewsGetQuery> = {}): Promise<NewsPayload[] | void> {
		const { $fetchCallGas } = useNuxtApp();

		return $fetchCallGas<NewsResponse>('/news', {
			method: 'GET',
			query
		})
			.then((resp) => {
				return resp.data;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке новостей:', error);
			});
	},

	create(body: Partial<NewsCreatePayload>): Promise<NewsPayload | void> {
		const { $fetchCallGas } = useNuxtApp();

		return $fetchCallGas<NewsResponse>('/news', {
			method: 'POST',
			body
		})
			.then((resp) => {
				return resp.data[0];
			})
			.catch((error: any) => {
				console.error('Ошибка при создании новости:', error);
			});
	},

	update(id: number, body: Partial<NewsUpdatePayload>): Promise<NewsPayload | void> {
		const { $fetchCallGas } = useNuxtApp();

		return $fetchCallGas<NewsResponse>(`/news/${id}`, {
			method: 'PATCH',
			body
		})
			.then((resp) => {
				return resp.data[0];
			})
			.catch((error: any) => {
				console.error('Ошибка при обновлении новости:', error);
			});
	},

	delete(id: number): Promise<NewsPayload | void> {
		const { $fetchCallGas } = useNuxtApp();

		return $fetchCallGas<NewsResponse>(`/news/${id}`, {
			method: 'DELETE'
		})
			.then((resp) => {
				return resp.data[0];
			})
			.catch((error: any) => {
				console.error('Ошибка при удалении новости:', error);
			});
	}
};
