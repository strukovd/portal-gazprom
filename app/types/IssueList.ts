export type IssueList = {
	success: boolean;
	data: any[];
	pagination: {
		page: number;
		size: number;
		total: string;
		totalPages: number;
	};
}
