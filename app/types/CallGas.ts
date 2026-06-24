type NewsCategory = `DISCONNECTION` | `OFFICES` | `GASIFICATION` | `FAQ`;
type NewsTypes = `EMERGENCY` | `PLANNED` | `STANDARD` | `OZP` | `HOLIDAY` | `WHITE_DOTS` | `INVESTMENT_PROGRAM` | `FAQ_ANY`;
type NewsBranch = `BISHKEK` | `CHUI` | `OSH` | `JALALABAD`;
type NewsLevel = `NORMAL` | `MIDDLE` | `HIGH`;
type NewsSortFields = `created` | `updated` | `startDate` | `endDate`;
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