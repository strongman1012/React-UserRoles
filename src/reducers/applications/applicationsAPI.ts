import { apiClient } from '../../utills/config';

export interface Application {
    id: number;
    name: string;
    description: string;
}

export const fetchApplicationsAPI = async (): Promise<Application[]> => {
    const response = await apiClient.get<Application[]>('/applications');
    return response.data;
};

export const fetchApplicationByIdAPI = async (id: number): Promise<Application> => {
    const response = await apiClient.get<Application>(`/applications/${id}`);
    return response.data;
};

export const createApplicationAPI = async (name: string, description: string): Promise<Application> => {
    const response = await apiClient.post<Application>('/applications', { name, description });
    return response.data;
};

export const updateApplicationAPI = async (id: number, name: string, description: string): Promise<Application> => {
    const response = await apiClient.put<Application>(`/applications/${id}`, { name, description });
    return response.data;
};

export const deleteApplicationAPI = async (id: number): Promise<void> => {
    await apiClient.delete(`/applications/${id}`);
};
