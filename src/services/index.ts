import ApiClient, { ApiConfiguration } from "./ApiClient";
import CodeFilesService, { CodeFilesApiClient } from "./CodeFiles";
import DataApiService, { DataApiClient } from "./DataApi";
import { REACT_APP_SERVER_URL } from "../utills/config";

export let dataApiService: DataApiService;
export let codeFileService: CodeFilesService;

export const initApiService = () => {
    const apiConfig = new ApiConfiguration();

    apiConfig.baseUrl = process.env.NODE_ENV === 'development'
        ? REACT_APP_SERVER_URL ? REACT_APP_SERVER_URL : 'http://localhost:5000'
        : '';
    const dataApiClient = new DataApiClient(
        new ApiClient(apiConfig)
    );
    dataApiService = new DataApiService(dataApiClient);

    const codeFileApiClient = new CodeFilesApiClient(
        new ApiClient(apiConfig)
    );
    codeFileService = new CodeFilesService(codeFileApiClient);
};