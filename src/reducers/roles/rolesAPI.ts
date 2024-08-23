import { apiClient } from '../../utills/config';

export interface Role {
    id: number;
    name: string;
}

export const fetchRolesAPI = async (): Promise<any> => {
    const response = await apiClient.get<any>('/roles');
    return response.data;
};

export const fetchRoleByIdAPI = async (id: number): Promise<any> => {
    const response = await apiClient.get<any>(`/roles/${id}`);
    return response.data;
};

export const createRoleAPI = async (name: string): Promise<any> => {
    const response = await apiClient.post<Role>('/roles', { name });
    return response.data;
};

export const updateRoleAPI = async (id: number, name: string): Promise<any> => {
    const response = await apiClient.put<Role>(`/roles/${id}`, { name });
    return response.data;
};

export const deleteRoleAPI = async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
};
