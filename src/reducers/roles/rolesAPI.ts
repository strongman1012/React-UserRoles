import { apiClient } from '../../utills/config';

export interface Role {
    id: number;
    name: string;
}

export const fetchRolesAPI = async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>('/roles');
    return response.data;
};

export const fetchRoleByIdAPI = async (id: number): Promise<Role> => {
    const response = await apiClient.get<Role>(`/roles/${id}`);
    return response.data;
};

export const createRoleAPI = async (name: string): Promise<Role> => {
    const response = await apiClient.post<Role>('/roles', { name });
    return response.data;
};

export const updateRoleAPI = async (id: number, name: string): Promise<Role> => {
    const response = await apiClient.put<Role>(`/roles/${id}`, { name });
    return response.data;
};

export const deleteRoleAPI = async (id: string): Promise<void> => {
    await apiClient.delete(`/roles/${id}`);
};
