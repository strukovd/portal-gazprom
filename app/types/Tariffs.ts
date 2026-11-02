export type TariffItem = {
	type: string;
	value: number;
	nds: number | null;
	nsp: number | null;
};

export type TariffPayload = {
	date: string;
	items: TariffItem[];
};

