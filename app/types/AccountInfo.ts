export type AccountInfo = {
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
