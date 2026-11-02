export type OfficesPayload = {
	id: number;
	name: string;
	city: string;
	branch: number;
	address: string;
	workDays: {
		name?: string;
		isOpen: boolean;
		workTime: string[];
		breakTime: string[];
	}[];
	openTime: string;
	closeTime: string;
	contacts: string;
	latitude: number;
	longitude: number;
	isPublished: boolean;
	created: string;
	createdBy: number;
	order: null;
};



