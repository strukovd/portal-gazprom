import type { PaymentsPayload } from "~/types/Payments";

export type AccountData = {
	account: string;
	name: string;
	address: string;
	district: string;
	balance: number;
	type: string;
	contacts: {
		created: string;
		type: string;
		value: string;
	}[];
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
	equipment: {
		model: string;
		number: string;
	} | null;
	bill: {
		id: number;
		account: string;
		fullName: string;
		address: string;
		created: string;
		updated: string;
		removed: null;
		fileName: string;
		officeId: number;
		branchId: number;
		prevReadingsDate: string;
		prevReadingsValue: number;
		lastReadingsDate: string;
		lastReadingsValue: number;
		balanceAccrualGasValue: number;
		balanceAccrualFineValue: number;
		accrualGasValue: number;
		accrualRecalculationValue: number;
		accrualM3Value: number;
		accrualFineValue: number;
		tariff: number;
		lastPayDate: string;
		lastPayGasValue: number;
		lastPayFineValue: number;
		accrualMonth: string;
		payGasValue: number;
		payFineValue: number;
		payValue: number;
		payCurrentGasValue: number;
		payCurrentFineValue: number;
		overpayValue: number;
		houseType: string;
		section: string;
	} | null;
};




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