import { TFile, TFiles, TFileSaveRequest, TFileSaveResponse } from "../components/script-manager/types";

import { IApiClient } from "./ApiClient";

export interface ICodeFilesClient {
    getFiles(): Promise<TFile[]>;
    getFileContent(fileName: string): Promise<string>;
    saveFileContent(body: TFileSaveRequest): Promise<TFileSaveResponse>;
    deleteFile(fileName: string): Promise<boolean>;
    copyFile(fileName: string): Promise<boolean>;
}

interface IFilesResponse<T> {
    files: TFile[];
}

interface IFileContentResponse<T> {
    data: string;
}

interface IFileSaveResponse<T> {
    success: boolean;
}

export class CodeFilesApiClient implements ICodeFilesClient {
    apiBase: string;
    codeFilesApiClient: IApiClient;

    constructor(codeFilesApiClient: IApiClient) {
        this.apiBase = "/api/v0";
        this.codeFilesApiClient = codeFilesApiClient;
    }

    async getFiles(): Promise<TFile[]> {
        try {
            const response = await this.codeFilesApiClient.get<IFilesResponse<TFiles>>(
                `${this.apiBase}/files`,
            );

            return response.files as TFile[];
        } catch (exception) {
            console.error(exception);
            return [] as TFile[];
        }
    }

    async getFileContent(fileName: string): Promise<string> {
        try {
            const response = await this.codeFilesApiClient.get<IFileContentResponse<string>>(
                `${this.apiBase}/files/${fileName}`,
            );

            return response.data as string;
        } catch (exception) {
            console.error(exception);
            return '' as string;
        }
    }

    async saveFileContent(body: TFileSaveRequest): Promise<TFileSaveResponse> {
        try {
            const response = await this.codeFilesApiClient.post<TFileSaveRequest, IFileSaveResponse<TFileSaveResponse>>(
                `${this.apiBase}/files/store`, body
            );

            return response as TFileSaveResponse
        } catch (exception) {
            console.error(exception);
            return { success: false }
        }
    }

    async deleteFile(fileName: string): Promise<boolean> {
        try {
            const response = await this.codeFilesApiClient.post<{ fileName: string }, boolean>(
                `${this.apiBase}/files/delete`, { fileName: fileName }
            );

            return response as boolean
        } catch (exception) {
            console.error(exception);
            return false
        }
    }

    async copyFile(fileName: string): Promise<boolean> {
        try {
            const response = await this.codeFilesApiClient.post<{ fileName: string }, boolean>(
                `${this.apiBase}/files/copy`, { fileName: fileName }
            );

            return response as boolean
        } catch (exception) {
            console.error(exception);
            return false
        }
    }
}

export default class CodeFilesService {
    codeFilesApiClient: ICodeFilesClient;

    constructor(codeFilesApiClient: ICodeFilesClient) {
        this.codeFilesApiClient = codeFilesApiClient;
    }

    async getCodeFiles(): Promise<TFile[]> {
        return this.codeFilesApiClient.getFiles();
    }

    async getCodeFileContent(fileName: string): Promise<string> {
        return this.codeFilesApiClient.getFileContent(fileName);
    }

    async saveCodeFileContent(body: TFileSaveRequest) {
        return this.codeFilesApiClient.saveFileContent(body);
    }

    async deleteFile(fileName: string) {
        return this.codeFilesApiClient.deleteFile(fileName);
    }

    async copyFile(fileName: string) {
        return this.codeFilesApiClient.copyFile(fileName);
    }
}