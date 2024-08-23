import { apiClient } from '../../utills/config';

export interface Area {
    id: number;
    name: string;
    description: string;
    application_id: number;
    application_name?: string;
}

export const fetchAreasAPI = async (): Promise<any> => {
    const response = await apiClient.get<any>('/areas');
    return response.data;
};

export const fetchAreaByIdAPI = async (id: number): Promise<any> => {
    const response = await apiClient.get<any>(`/areas/${id}`);
    return response.data;
};

export const createAreaAPI = async (formData: { name: string, description: string, application_id: number }): Promise<any> => {
    const response = await apiClient.post<Area>('/areas', { ...formData });
    return response.data;
};

export const updateAreaAPI = async (id: number, formData: { name: string, description: string, application_id: number }): Promise<any> => {
    const response = await apiClient.put<Area>(`/areas/${id}`, { ...formData });
    return response.data;
};

export const deleteAreaAPI = async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/areas/${id}`)
    return response.data
};
