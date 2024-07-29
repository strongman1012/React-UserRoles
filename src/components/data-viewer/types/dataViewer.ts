export type Data = {
	_id: string;
	company: string;
	name: string;
	country: string;
	state: string;
	city: string;
	email: string;
	phone: string;
}

export type Query = {
	isExternal: boolean
	url: string;
	name: string;
	file?: string;
}

export type DVEvent = {
	query: string | undefined;
	cellIdx: number;
	subCellIdx: number;
}

export interface IDataResponse {
	data: Data[]
}

export interface IQueriesResponse {
	data: Query[]
}

export interface IStoreData {
	data: Data[]
}

export interface IStoreResult {
	success: boolean;
	message: string;
}

export interface IDeleteResult {
	success: boolean;
}

export type rowStatus = {
	rIdx: number;
	cIdx: number;
	value: boolean;
}
