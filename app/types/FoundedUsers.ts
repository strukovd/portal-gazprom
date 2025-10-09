export type FoundedUsers = {
	success: boolean;
	data: Array<{
		account: string,
		name: string,
		address: string,
		created: string
	}>;
	page: number;
	limit: number;
	total: string;
	totalPages: number;
}
