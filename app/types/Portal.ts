export type ReadingsResponse = {
	data: ReadingPayload[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
export type ReadingsQuery = {
	success?: boolean;
	date?: string;
	sortOrder?: 'ASC' | 'DESC';
	page?: number;
	size?: number;
};
export type ReadingPayload = {
	id: number;
	readingId: number;
	reading: number;
	created: string;
	success: boolean;
	facility: {
		name: string;
		account: string;
	};
};
