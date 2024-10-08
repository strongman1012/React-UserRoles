import { apiClient } from '../../utills/config';

export interface Setting {
    id: number;
    user_id: number;
    rowsPerPage: number;
}

export const saveSettingsAPI = async (rowsPerPage: number): Promise<any> => {
    const response = await apiClient.post<Setting>(`/settings`, { rowsPerPage });
    return response.data;
};
