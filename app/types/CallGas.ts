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
	categoryType: string;
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
	categoryType: `` | `EMERGENCY` | `PLANNED` | `STANDARD` | `OZP` | `HOLIDAY` | `WHITE_DOTS` | `INVESTMENT_PROGRAM` | `FAQ_ANY`;
	branch: `` | `BISHKEK` | `CHUI` | `OSH` | `JALALABAD`;
	urgencyLevel: `` | `NORMAL` | `MIDDLE` | `HIGH`;
	startDate: string;
	endDate: string;
};
export type NewsGetQuery = {
	title: string;
	categoryFilter: `DISCONNECTION` | `OFFICES` | `GASIFICATION` | `FAQ`;
	categoryTypeFilter: `EMERGENCY` | `PLANNED` | `STANDARD` | `OZP` | `HOLIDAY` | `WHITE_DOTS` | `INVESTMENT_PROGRAM` | `FAQ_ANY`;
	branchFilter: `BISHKEK` | `CHUI` | `OSH` | `JALALABAD`;
	urgencyLevelFilter: `NORMAL` | `MIDDLE` | `HIGH` | Array<`NORMAL` | `MIDDLE` | `HIGH`>;
	createdFilter: string;
	startDateFilter: string;
	endDateFilter: string;
	sortField: `created` | `updated` | `startDate` | `endDate`;
	sortOrder: `ASC` | `DESC`;
	page: number;
	size: number
};