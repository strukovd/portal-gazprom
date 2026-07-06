import { acceptHMRUpdate, defineStore } from 'pinia';
import type { FlagsModel } from '~/plugins/flag';
import type { ModalModel } from '~/plugins/modal';
import { tariffs as tariffsService } from '~/services/tariffs';
import type { TariffPayload } from '~/types/GapromAppService';

type Invoice = {
	amount: string;
	created: string;
	createdBy: string;
	id: number,
	payed: boolean;
	service: string;
};

type Issue = {
	address: string;
	date: string;
	id: number;
	issueKey: string;
	issueStatus: string;
	summary: string;

	payments?: Invoice[];

	showInvoices?: boolean;
	color?: string;
};

export const useAppStore = defineStore('app', {
	state: () => ({
		issues: [] as Issue[],
		modals: [] as ModalModel[],
		flags: [] as FlagsModel[],
		tariffs: null as TariffPayload | null,
	}),
	actions: {
		getTariff(account?: string) {
			if( !account ) return null;
			if( !this.tariffs ) return null;

			return '56789'.includes(String(account).charAt(0))
				? this.tariffs.ulValue
				: this.tariffs.fizValue;
		},
		async ensureTariffs() {
			if (this.tariffs) return this.tariffs;

			const response = await tariffsService.fetch();
			if (response) this.tariffs = response;

			return this.tariffs;
		}
	}
});

// if(import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
// }
