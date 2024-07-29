import { AxiosResponse } from "axios";
import axios from "../config/axios";

// Define the types for your responses
export interface ResponseData<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

// Define your ServerApi class
export default class ServerApi {

    /**
     * Get Data from Api server
     * @param url 
     * @returns 
     */
    getData = async <T = any>(url: string): Promise<AxiosResponse<ResponseData<T>>> => {
        return await axios.get<ResponseData<T>>(url);
    }

    /**
     * Post data to Api Server
     * @param url 
     * @param data 
     * @returns 
     */
    postData = async <T = any>(url: string, data: any): Promise<AxiosResponse<ResponseData<T>>> => {
        return await axios.post<ResponseData<T>>(url, data);
    }

    /**
     * Delete Data from Api server
     * @param url 
     * @returns 
     */
    deleteData = async <T = any>(url: string): Promise<AxiosResponse<ResponseData<T>>> => {
        return await axios.delete<ResponseData<T>>(url);
    }
}