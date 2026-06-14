import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', () => {
	type AccountValue = string | number | Record<string, any> | null;
	type AccountData = Record<string, any> | null;

	const STORAGE_ACCOUNT_KEY = 'activeAccount';

	const account = ref<AccountValue>(null);
	const loading = ref(false);
	const accountData = ref<AccountData>(null);
	const restored = ref(false);
	const error = ref<any>(null);

	const activeAccountNumber = computed(() => {
		return getAccountNumber(account.value);
	});

	const activeAccountInfo = computed(() => {
		const data = (accountData.value || {}) as Record<string, any>;
		const accountSource = typeof account.value === 'object' && account.value ? account.value : {};
		const source = Object.keys(data).length ? getAccountDataSource(data) : accountSource;
		const accountNumber = getAccountNumber(source) || activeAccountNumber.value;

		return {
			account: accountNumber,
			name: formatDisplayValue(pickFirst(source, ['fullName', 'name', 'fio', 'ownerName', 'consumerName', 'subscriberName'])),
			address: formatDisplayValue(pickFirst(source, ['address', 'fullAddress', 'facilityAddress', 'objectAddress'])),
			status: formatDisplayValue(pickFirst(source, ['statusName', 'status', 'state', 'connectionStatus'])) || (accountNumber ? 'Активный абонент' : ''),
			balance: formatDisplayValue(pickFirst(source, ['balance', 'debt', 'saldo', 'currentBalance'])),
			tariff: formatDisplayValue(pickFirst(source, ['tariff', 'tariffName', 'currentTariff'])),
			phone: formatDisplayValue(pickFirst(source, ['phone', 'mobilePhone', 'contactPhone'])),
		};
	});

	function setActiveAccount(value: any, options: { fetch?: boolean } = { fetch: true }) {
		if (!restored.value) restoreAccount();

		account.value = value;
		error.value = null;
		persistAccount();

		const accountNumber = activeAccountNumber.value;
		if (accountData.value && getAccountNumber(getAccountDataSource(accountData.value)) === accountNumber) {
			if (options.fetch !== false) fetchAccountData({ force: true });
			return;
		}

		accountData.value = null;
		if (options.fetch !== false && accountNumber) fetchAccountData({ force: true });
	}

	function clearAccount() {
		account.value = null;
		accountData.value = null;
		error.value = null;
		removeStorageItem(STORAGE_ACCOUNT_KEY);
	}

	function find(text: string) {
		const searchText = String(text || '').trim().toLowerCase();
		if (searchText.length < 2) return [];

		// const response = await useNuxtApp().$fetchApi(`/v2/facility/find`, {
		// 	method: 'GET',
		// 	query: {
		// 		search: text,
		// 		limit: 12
		// 	}
		// });

		const response = {
			data: [
				{
					"account": "020000472",
					"name": "Test Test Test",
					"address": "Бишкек, Первомайский, ул. Челябинский, д. № 2",
					"created": "2023-08-16T05:04:34.662Z",
					"updated": "2026-04-27T09:15:29.836Z"
				},
				{
					"account": "800555115",
					"name": "Test",
					"address": "12312321ewq",
					"created": "2026-05-29T12:18:27.351Z",
					"updated": "2026-05-29T12:18:27.351Z"
				},
				{
					"account": "800555114",
					"name": "Test",
					"address": "eqwewqgfd",
					"created": "2026-05-29T12:17:18.877Z",
					"updated": "2026-05-29T12:17:18.877Z"
				},
				{
					"account": "800555113",
					"name": "Test",
					"address": "eqwewqxzc",
					"created": "2026-05-29T12:16:33.982Z",
					"updated": "2026-05-29T12:16:33.982Z"
				},
				{
					"account": "800555111",
					"name": "Test",
					"address": "ul pushkina dom kolotushkina",
					"created": "2026-05-29T12:12:55.385Z",
					"updated": "2026-05-29T12:12:55.385Z"
				},
				{
					"account": "030001839",
					"name": "Tet Test Test",
					"address": "Бишкек, Свердловский, ж/м Учкун, ул. Учкун-1, д. 89",
					"created": "2023-08-16T05:04:34.662Z",
					"updated": "2026-04-27T09:15:20.798Z"
				},
				{
					"account": "030003548",
					"name": "Test123 Test123",
					"address": "Бишкек, Свердловский, ул. Александровский, д. 999, кв. 999",
					"created": "2023-08-17T11:30:17.202Z",
					"updated": "2026-04-27T09:09:05.051Z"
				},
				{
					"account": "800555112",
					"name": "Test2",
					"address": "dasdsa",
					"created": "2026-05-29T12:16:10.012Z",
					"updated": "2026-05-29T12:16:10.012Z"
				}
			],
			"total": 8,
			"page": 1,
			"limit": 10,
			"totalPages": 1
		}

		return (response.data || []).filter((account) => {
			return [
				account.account,
				account.name,
				account.address,
			].some(value => String(value || '').toLowerCase().includes(searchText));
		});
	}

	async function fetchAccountData(options: { force?: boolean } = {}) {
		if (!restored.value && !account.value) restoreAccount();

		const accountNumber = activeAccountNumber.value;
		if (!accountNumber) {
			accountData.value = null;
			return null;
		}

		if (!options.force && accountData.value) {
			return accountData.value;
		}

		loading.value = true;
		error.value = null;

		try {
			const response = await useNuxtApp().$fetchApi(`/v2/facility/account`, {
				method: 'GET',
				query: {
					account: accountNumber,
					showApplications: true,
					showReadings: true,
					showContacts: true,
					showBills: true,
					showAgreementData: true,
				}
			});

			if (activeAccountNumber.value !== accountNumber) return null;

			accountData.value = normalizeAccountResponse(response);
			persistAccount();

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

	function restoreAccount() {
		if (!import.meta.browser) return;

		const savedAccount = readStorageItem(STORAGE_ACCOUNT_KEY) ?? readStorageItem('account');
		if (savedAccount) account.value = savedAccount;

		restored.value = true;
	}

	async function init() {
		restoreAccount();
		return await fetchAccountData();
	}

	function getAccountNumber(value: any) {
		if (!value) return '';
		if (typeof value === 'string' || typeof value === 'number') return String(value);
		return String(pickFirst(value, ['account', 'accountNumber', 'accountNo', 'personalAccount', 'ls', 'id']) || '');
	}

	function normalizeAccountResponse(response: any) {
		return response?.data || response?.result || response;
	}

	function getAccountDataSource(data: Record<string, any>) {
		return data.account || data.subscriber || data.client || data.facility || data;
	}

	function pickFirst(source: Record<string, any>, keys: string[]) {
		for (const key of keys) {
			const value = source?.[key];
			if (value !== undefined && value !== null && value !== '') return value;
		}

		return '';
	}

	function formatDisplayValue(value: any) {
		if (value === undefined || value === null) return '';
		if (typeof value === 'string' || typeof value === 'number') return String(value);
		if (typeof value === 'boolean') return value ? 'Да' : 'Нет';

		return String(pickFirst(value, ['name', 'title', 'value', 'amount', 'label']) || '');
	}

	function persistAccount() {
		if (!import.meta.browser) return;
		localStorage.setItem(STORAGE_ACCOUNT_KEY, JSON.stringify(activeAccountNumber.value));
	}

	function readStorageItem(key: string) {
		if (!import.meta.browser) return null;

		const value = localStorage.getItem(key);
		if (!value) return null;

		try {
			return JSON.parse(value);
		}
		catch {
			return value;
		}
	}

	function removeStorageItem(key: string) {
		if (!import.meta.browser) return;
		localStorage.removeItem(key);
	}

	return {
		account,
		loading,
		accountData,
		error,
		activeAccountNumber,
		activeAccountInfo,
		setActiveAccount,
		clearAccount,
		fetchAccountData,
		restoreAccount,
		init,
		find,
	};
});
