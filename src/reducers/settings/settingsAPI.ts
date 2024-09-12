import { apiClient } from '../../utills/config';

export interface Setting {
    id: number;
    user_id: number;
    rowsPerPage: number;
}

export const fetchSettingsAPI = async (): Promise<Setting> => {
    const response = await apiClient.get<Setting>(`/settings`);
    return response.data;
};

export const saveSettingsAPI = async (rowsPerPage: number): Promise<any> => {
    const response = await apiClient.post<Setting>(`/settings`, { rowsPerPage });
    return response.data;
};
