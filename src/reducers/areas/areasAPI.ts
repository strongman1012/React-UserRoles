import { apiClient } from '../../utills/config';

export interface Area {
    id: number;
    name: string;
    description: string;
    application_id: number;
}

export const fetchAreasAPI = async (): Promise<Area[]> => {
    const response = await apiClient.get<Area[]>('/areas');
    return response.data;
};

export const fetchAreaByIdAPI = async (id: number): Promise<Area> => {
    const response = await apiClient.get<Area>(`/areas/${id}`);
    return response.data;
};

export const createAreaAPI = async (name: string, description: string, application_id: number): Promise<Area> => {
    const response = await apiClient.post<Area>('/areas', { name, description, application_id });
    return response.data;
};

export const updateAreaAPI = async (id: number, name: string, description: string, application_id: number): Promise<Area> => {
    const response = await apiClient.put<Area>(`/areas/${id}`, { name, description, application_id });
    return response.data;
};

export const deleteAreaAPI = async (id: number): Promise<void> => {
    await apiClient.delete(`/areas/${id}`);
};
