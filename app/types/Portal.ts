export type ReadingsResponse = {
	data: ReadingPayload[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

export type ControllerGroup = {
	id: number;
	name: string;
	groupName: string | null;
	children: ControllerGroup[];
};
export type ControllerGroupsResponse = ControllerGroup[];
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

// ---

export type ControllerAreasResponse = ControllerAreasPayload;
export type ControllerAreasPayload = {
	controllers: Controller[];
	overallStatistics: {
		collectedReadings: number;
		remainingReadings: number;
		collectionPercentage: number;
	};
	lastUpdated: string;
};
export type Controller = {
	controllerId: string;
	controllerName: string;
	controllerPosition: string;
	areas: ControllerArea[];
	statistics: {
		areaCount: number;
		routeCount: number;
		totalSubscribers: number;
		totalCollectedReadings: number;
		collectedBySubscriber: number;
		collectedByController: number;
		totalRemainingReadings: number;
		totalCollectionPercentage: number;
	};
};

export type ControllerArea = {
	areaCode: string;
	routes: ControllerRoute[];
	statistics: {
		collectedReadings: number;
		remainingReadings: number;
		collectionPercentage: number;
	};
};

export type ControllerRoute = {
	routeCode: string;
	streets: ControllerStreet[];
	statistics: {
		subscriberCount: number;
		streetCount: number;
		collectedReadings: number;
		collectionPercentage: number;
	};
};

export type ControllerStreet = {
	street: string;
	subscriberCount: number;
};

export type ControllerSubscriber = Record<string, unknown> & {
	subscriberId: string;
	accountNo: string;
	fullName: string;
	addressText: string;
	house: string;
	apartment: string;
	region: string;
	city: string;
	street: string;
	houseNo: string;
	building: string;
	block: string;
	flat: string;
	routeCode: string;
	meterSerial: string;
	meterModel: string;
	reading?: number;
	debtGas?: number;
	penalty?: number;
	lastPayment?: string;
	status: string;
};

// ---



// ---


export type RouteDetailsResponse = RouteDetailsPayload;
export type RouteDetailsPayload = {
	routeCode: string;
	streets: RouteDetailsStreet[];
	statistics: ControllerRoute['statistics'];
};
export type RouteDetailsStreet = {
	street: string;
	subscribers: ControllerSubscriber[]; 
};
