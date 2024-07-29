import { IApiClient } from "./ApiClient";
import { IDataResponse, IStoreData, IStoreResult, IDeleteResult, IQueriesResponse } from "../components/data-viewer/types/dataViewer";

export interface IDataClient {
    getData(query: string): Promise<IDataResponse>;
    getFileData(query: string): Promise<any>;
    getQueries(): Promise<IQueriesResponse>;
    store(data: IStoreData): Promise<IStoreResult>;
    delete(name: string): Promise<IDeleteResult>;
}

export class DataApiClient implements IDataClient {
    apiBase: string;
    dataApiClient: IApiClient;

    constructor(dataApiClient: IApiClient) {
        this.apiBase = "/api/v0";
        this.dataApiClient = dataApiClient;
    }

    async getData(query: string): Promise<IDataResponse> {
        try {
            const response = await this.dataApiClient.get<IDataResponse>(
                `${this.apiBase}/get/${query}`,
            );

            return response as IDataResponse;
        } catch (exception) {
            console.error(exception);
            return {} as IDataResponse;
        }
    }

    async getFileData(query: string): Promise<IDataResponse> {
        try {
            const response = await this.dataApiClient.get<IDataResponse>(
                `${this.apiBase}/dataviewer/file/${query}`,
            );

            return response as IDataResponse;
        } catch (exception) {
            console.error(exception);
            return {} as IDataResponse;
        }
    }

    async getQueries(): Promise<IQueriesResponse> {
        try {
            const response = await this.dataApiClient.get<IQueriesResponse>(
                `${this.apiBase}/dataviewer/query`,
            );
            return response as IQueriesResponse;
        } catch (exception) {
            console.error(exception);
            return {} as IQueriesResponse;
        }
    }

    async store(data: IStoreData): Promise<IStoreResult> {
        try {
            const response = await this.dataApiClient.post<IStoreData, IStoreResult>(
                `${this.apiBase}/store`, data
            );

            return response as IStoreResult;
        } catch (exception) {
            console.error(exception);
            return {
                success: false,
                message: 'API connection error'
            }
        }
    }

    async delete(name: string): Promise<IDeleteResult> {
        try {
            const response = await this.dataApiClient.post<{name: string}, IDeleteResult>(
                `${this.apiBase}/delete`, {name: name}
            );

            return response as IDeleteResult;
        } catch (exception) {
            console.error(exception);
            return {success: false}
        }
    }

}

export default class DataApiService {
    dataApiClient: IDataClient;

    constructor(dataApiClient: IDataClient) {
        this.dataApiClient = dataApiClient;
    }

    async getData(query: string): Promise<IDataResponse> {
        return this.dataApiClient.getData(query);
    }

    async getFileData(query: string): Promise<any> {
        return this.dataApiClient.getFileData(query);
    }

    async getQueries(): Promise<IQueriesResponse> {
        return this.dataApiClient.getQueries();
    }

    async store(data: IStoreData): Promise<IStoreResult> {
        return this.dataApiClient.store(data);
    }

    async delete(name: string): Promise<IDeleteResult> {
        return this.dataApiClient.delete(name);
    }
}
