export type SubscribersResponse = {
	success: boolean;
	data: Array<SubscriberLite>;
	page: number;
	limit: number;
	total: string;
	totalPages: number;
}


export type SubscriberLite = {
	account: string,
	name: string,
	address: string,
	created: string
}


export type SubscriberDetails = {
	account: string,
	name: string,
	address: string,
	district: string,
	balance: number,
	readings: Array<{
		reading: number,
		created: string,
		consumption: number,
		sender: string
	}>,
	applications: Array<{
		id: number,
		issueKey: string,
		summary: string,
		assignee: string,
		created: string,
		project: {
			key: string,
			name: string
		},
		status: {
			id: string,
			name: string
		}
	}>
}

export type PaymentsResponse = {
	data: Payment[];
	limit: number;
	page: number;
	total: number;
	totalPages: number;
}
export  type Payment = {
	amount: number;
	created: string;
	id: number;
	service: {id: 2, name: 'Газоснабжение природным газом'};
	txnId: string;
	type: string;
}

export type Subscriber = SubscriberLite & Partial<SubscriberDetails> & { payments?: Payment[] };
