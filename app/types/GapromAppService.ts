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



export type TariffPayload = {
	id: number;
	fizValue: number;
	fizNds: number;
	fizNsp: number;
	ulValue: number;
	ulNds: number;
	ulNsp: number;
	exchangeRate: number;
	showExchangeRate: boolean;
	clientQty: number;
	areaQty: number;
	mainGasPipelineLength: number;
	streetNetworkLength: number;
	created: string;
}