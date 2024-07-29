import axios, { AxiosInstance } from "axios";

const handleServiceError = (error: unknown) => {
    console.log(error);
};

export type HttpHeaders = {
    [key: string]: string;
};

export type RequestConfig = {
    headers: HttpHeaders;
};

export class ApiConfiguration {
    baseUrl!: string;
    token?: string;
}

export interface IApiClient {
    post<TRequest, TResponse>(
        path: string,
        object: TRequest,
        config?: RequestConfig
    ): Promise<TResponse>;
    patch<TRequest, TResponse>(
        path: string,
        object: TRequest
    ): Promise<TResponse>;
    put<TRequest, TResponse>(path: string, object: TRequest): Promise<TResponse>;
    get<TResponse>(path: string, config?: RequestConfig): Promise<TResponse>;
}

// export default class ApiClient implements IApiClient {
export default class ApiClient {
    private client: AxiosInstance;

    protected createAxiosClient(
        apiConfiguration: ApiConfiguration
    ): AxiosInstance {
        return axios.create({
            baseURL: apiConfiguration.baseUrl,
            responseType: "json" as const,
            headers: {
                "Content-Type": "application/json",
                ...(apiConfiguration.token && {
                    Authorization: `Bearer ${apiConfiguration.token}`,
                }),
            },
        });
    }

    constructor(apiConfiguration: ApiConfiguration) {
        this.client = this.createAxiosClient(apiConfiguration);
    }

    async post<TRequest, TResponse>(
        path: string,
        payload: TRequest,
        config?: RequestConfig
    ): Promise<TResponse> {
        try {
            const response = config
                ? await this.client.post<TResponse>(path, payload, config)
                : await this.client.post<TResponse>(path, payload);

            return response.data;
        } catch (error) {
            handleServiceError(error);
        }
        return {} as TResponse;
    }

    async patch<TRequest, TResponse>(
        path: string,
        payload: TRequest
    ): Promise<TResponse> {
        try {
            const response = await this.client.patch<TResponse>(path, payload);
            return response.data;
        } catch (error) {
            handleServiceError(error);
        }
        return {} as TResponse;
    }

    async put<TRequest, TResponse>(
        path: string,
        payload: TRequest
    ): Promise<TResponse> {
        try {
            const response = await this.client.put<TResponse>(path, payload);
            return response.data;
        } catch (error) {
            handleServiceError(error);
        }
        return {} as TResponse;
    }

    async get<TResponse>(
        path: string,
        config?: RequestConfig
    ): Promise<TResponse> {
        try {
            const response = config
                ? await this.client.get<TResponse>(path, config)
                : await this.client.get<TResponse>(path);
            return response.data;
        } catch (error) {
            handleServiceError(error);
        }
        return {} as TResponse;
    }
}
