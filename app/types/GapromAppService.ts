// export type OfficesResponse = {
// 	// data: NewsPayload[];
// 	total: number;
// 	page: number;
// 	limit: number;
// 	totalPages: number;
// };
export type OfficesPayload = {
	id: number;
	name: string;
	description: string;
	workDays: string;
	openTime: string;
	closeTime: string;
	city: string;
	branch: number;
	address: string;
	contacts: string;
	latitude: number;
	longitude: number;
	isPublished: boolean;
	order: number;
	created: string;
	createdBy: {
		id: number;
		username: string;
		fullname: string;
		image_key: string;
		default_lang: string;
		groups: Record<string, any>;
	},
	updated: string;
	updatedBy: {
		id: number;
		username: string;
		fullname: string;
		image_key: string;
		default_lang: string;
		groups: Record<string, any>;
	},
	removed: string;
	images: string[];
};
