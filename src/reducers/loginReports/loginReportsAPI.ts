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
