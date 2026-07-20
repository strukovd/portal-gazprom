export type UserRoles = `ADMIN` | `CONTRACTOR` | `CONTROLLER` | `CALLCENTER` | `CALLCENTER_MANAGER` | `CALLCENTER_COMPLAINT_ASSIGNEE`;
export type AuthBody = {
	login: string;
	password: string;
}
export type AuthResponse = {
	success: boolean;
	token: string;
	userData: {
		contractorId: number;
		id: number;
		login: string;
		role: string;
	};
}
export type UserBody = {
	login: string;
	password: string;
	name: string;
	phone: string;
	role: UserRoles;
	isActive: boolean;
}
export type UsersQuery = {
	isActive: boolean;
	role: UserRoles;
	size: number;
	page: number;
}
export type UserPayload = {
	id: number;
	login: string;
	name?: string;
	phone?: string;
	role: UserRoles | string;
	isActive: boolean;
	contractorId: null;
	created: string;
}
export type UserResponse = {
    success: true;
    data: UserPayload;
}
export type UsersResponse = {
    success: true;
    data: UserPayload[];
	pagination: {
		page: number;
		size: number;
		total: number;
		totalPages: number;
	}
}
export type IssuePayload = {
	summary: string;
    date: string; // 22.09.2025
    issueStatus: string;
    issueKey: string;
    address: string;
    invoices: [{
        id: number;
        amount: string;
        payed: boolean;
        created: string;
        service: string;
        createdBy: string;
    }];
}
export type IssueListResponse = {
	success: boolean;
	data: IssuePayload[];
	pagination: {
		page: number;
		size: number;
		total: string;
		totalPages: number;
	};
}



export const portal = {
	auth(body: Partial<AuthBody> = {}): Promise<AuthResponse> {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<AuthResponse>('/v1/portal/auth', {
			method: 'POST',
			body
		});
	},

	createUser(body: UserBody) {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<{ success: boolean; }>('/v1/portal/users', {
			method: 'POST',
			body
		});
	},

	fetchUserList(query: Partial<UsersQuery> = {}) {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<UsersResponse>('/v1/portal/users', {
			method: 'GET',
			query
		});
	},

	fetchUser(query: { id: number }) {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<UserResponse>('/v1/portal/users', {
			method: 'GET',
			query
		});
	},

	updateUser(id: number, body: Omit<UserBody, 'login' | 'password'>) {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<unknown>(`/v1/portal/users/${id}`, {
			method: 'PATCH',
			body
		});
	},

	deleteUser(id: number) {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<{ success: boolean }>(`/v1/portal/users/${id}`, {
			method: 'DELETE'
		});
	},

	changePassword(id: number, body: { oldPassword: string; newPassword: string }) {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<{ success: boolean }>(`/v1/portal/users/${id}`, {
			method: 'PATCH',
			body
		});
	},

	setPassword(id: number, body: { newPassword: string }) {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<{ success: boolean }>(`/v1/portal/users/${id}`, {
			method: 'PUT',
			body
		});
	},

	fetchIssues(id: number, query: { page: number; size: number; search?: string }) {
		const { $fetchApi } = useNuxtApp();

		return $fetchApi<IssueListResponse>(`/v1/portal/issues`, {
			method: 'GET',
			query
		});
	},
};
