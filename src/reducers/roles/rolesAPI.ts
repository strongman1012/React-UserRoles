import { apiClient } from '../../utills/config';

export interface Role {
    id: number;
    name: string;
}
// Fetch area data access level
export const fetchAreaAccessLevelAPI = async (user_role_id: number, area_name: string): Promise<number> => {
    try {
        const response = await apiClient.get<number>(`/areaAccessLevel/${user_role_id}/${area_name}`,);
        return response.data;
    } catch (error) {
        console.error('Error fetching area access level:', error);
        throw error; // Re-throw the error after logging it
    }
};
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
