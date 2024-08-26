import { apiClient } from '../../utills/config';

// Define the type for LoginReport
export interface LoginReport {
    id: number;
    user_id: number;
    date: string;
    type: string;
    application_name: string;
    status: boolean;
    userName: string;
}

// Define the type for LoginMetrics
export interface LoginMetrics {
    login_date: string;
    login_count: number;
}

// Define the type for Application Metrics 1, 2, 3, 4
export interface Metrics {
    application_name?: string;
    usage_date?: string;
    usage_time?: number;
    usage_users?: number;
    usage_percent?: number;
}

// Fetch all login reports
export const fetchLoginReportsAPI = async (): Promise<LoginReport[]> => {
    const response = await apiClient.get<LoginReport[]>('/loginReports');
    return response.data;
};

// Fetch a login report by ID
export const fetchUserMetricsByIdAPI = async (id: number): Promise<LoginMetrics[]> => {
    const response = await apiClient.get<LoginMetrics[]>(`/loginReports/${id}`);
    return response.data;
};

// Fetch Total Application Usage Per Day (min) 
export const fetchApplicationPerDayMinAPI = async (): Promise<Metrics[]> => {
    const response = await apiClient.get<Metrics[]>('/metrics/perDayMin');
    return response.data;
};

// Total Users Per Day 
export const fetchApplicationPerDayNumberAPI = async (): Promise<Metrics[]> => {
    const response = await apiClient.get<Metrics[]>('/metrics/perDayNumber');
    return response.data;
};

// Total Application Usage (%)
export const fetchApplicationTotalPercentAPI = async (): Promise<Metrics[]> => {
    const response = await apiClient.get<Metrics[]>('/metrics/totalPercent');
    return response.data;
};

// Number of users under each application
export const fetchApplicationCategoryAPI = async (): Promise<any> => {
    const response = await apiClient.get<any>('/metrics/category');
    return response.data;
};
