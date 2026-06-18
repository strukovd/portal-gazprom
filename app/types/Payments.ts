export type PaymentsResponse = {
	data: PaymentsPayload[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
export type PaymentsPayload = {
	id: number;
	txnId: string;
	service: {
		id: number;
		name: string;
	};
	created: string;
	amount: number;
	type: string;
	supplier: {
		iconLight?: string;
		iconDark?: string;
		name?: string;
	};
};