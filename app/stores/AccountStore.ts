import { defineStore } from 'pinia';

export type FindResponse = {
	data: Array<FindPayload>,
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
export type FindPayload = {
	account: string;
	name: string;
	address: string;
	created: string;
	updated: string;
}
export type AccountData = {
    account: string;
    name: string;
    address: string;
    district: string;
    balance: number;
    type: string;
    contacts: never[];
    readings: { // показания
        id: number;
        reading: number;
        created: string;
        consumption: number;
        corrected: boolean;
        removed: boolean | null;
        supplier: {
            name: string;
            iconLight: string | null;
            iconDark: string | null;
        };
    }[];
    applications: { // заявки
        id: number;
        issueKey: string;
        created: string;
        project: {
            key: string;
            name: string;
        };
        status: {
            id: number;
            name: string;
        };
        summary: string;
        assignee: string;
    }[];
	payments?: PaymentsPayload[];
    ul?: { // юр. лицо
		agreementDate?: string;
		agreementNumber?: string;
		typeOfActivity: string;
	};
    equipment: null;
    bill: null;
};
type PaymentsResponse = {
    data: PaymentsPayload[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
type PaymentsPayload = {
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


export const useAccountStore = defineStore('account', () => {
	const STORAGE_ACCOUNT_KEY = 'currentAccount';

	const loading = ref(false);
	const account = ref<string | null>(import.meta.browser ? localStorage.getItem(STORAGE_ACCOUNT_KEY) : null);
	const accountData = ref<AccountData | null>(null);
	const accountPayments = ref<PaymentsPayload[] | null>(null);
	const error = ref<any>(null);


	const prettyType = computed(() => {
		const accType = String(accountData.value?.type);
		switch( accType ) {
			case "FL":
				return "Физ. лицо";
			case "UL":
				return "Юр. лицо";
			case "":
			case "null":
			case "undefined":
				return "Не указан";
			default:
				return "Не распознан";
		}
	});


	function setActiveAccount(value: string, options: { fetch?: boolean } = { fetch: true }) {
		account.value = value;
		error.value = null;

		if (import.meta.browser) localStorage.setItem(STORAGE_ACCOUNT_KEY, value);

		if (accountData.value?.account === value) {
			if (options.fetch !== false) fetchAccountData({ force: true });
			return;
		}

		accountData.value = null;
		if (options.fetch !== false) fetchAccountData({ force: true });
	}

	function clearAccount() {
		account.value = null;
		accountData.value = null;
		error.value = null;
		if (import.meta.browser) localStorage.removeItem(STORAGE_ACCOUNT_KEY);
	}

	// Поиск
	async function find(text: string): Promise<FindPayload[]> {
		const searchText = String(text || '').trim().toLowerCase();
		if (searchText.length < 2) return [];

		const response = await useNuxtApp().$fetchApi<FindResponse>(`/v2/facility/find`, {
			method: 'GET',
			query: {
				search: text,
				limit: 12
			}
		});

		return response.data;
	}

	async function fetchAccountData(options: { force?: boolean } = {}) {
		// Убедимся что лс известен
		if (!account.value) {
			accountData.value = null;
			return null;
		}
		// ?
		if (!options.force && accountData.value?.account === account.value) {
			return accountData.value;
		}
		// Получаем данные
		loading.value = true;
		error.value = null;
		try {
			const response = await useNuxtApp().$fetchApi<AccountData>(`/v2/facility/account`, {
				method: 'GET',
				query: {
					account: account.value,
					showApplications: true,
					showReadings: true,
					showContacts: true,
					showBills: true,
					showAgreementData: true,
				}
			});

			if (account.value !== response.account) return null;
			accountData.value = response;
			fetchPayments();
			return accountData.value;
		}
		catch (fetchError) {
			error.value = fetchError;
			console.error('Ошибка при загрузке данных аккаунта:', fetchError);
			return null;
		}
		finally {
			loading.value = false;
		}
	}

	async function fetchPayments() {
		useNuxtApp().$fetchApi<PaymentsResponse>(`/v1/payments/history`, {
			method: 'GET',
			query: {
				account: account.value,
				// startDate: ``,
				// endDate: ``,
				page: 1,
				limit: 12,
				type: `gas` as `gas` | `service`,
				// supplierIcons: false,
			}
		})
			.then((resp) => {
				accountData.value!.payments = resp.data;
				return resp;
			})
			.catch((error: any) => {
				console.error('Ошибка при загрузке платежей:', error);
			});
	}

	return {
		account,
		loading,
		accountData,
		error,
		prettyType,
		setActiveAccount,
		clearAccount,
		fetchAccountData,
		find
	};
});
