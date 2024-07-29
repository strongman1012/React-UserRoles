import { apiClient } from '../../utills/config';

export interface AreaList {
    id: number;
    role_id: number;
    area_id: number;
    permission: boolean;
    application_name: string;
    area_name: string;
}

export const fetchAreaListsAPI = async (roleId: number): Promise<AreaList[]> => {
    const response = await apiClient.post<AreaList[]>(`/areaList/getAll`, { role_id: roleId });
    return response.data;
};
export const getAreaListsAPI = async (roleId: number): Promise<AreaList[]> => {
    const response = await apiClient.post<AreaList[]>(`/areaList/getAll`, { role_id: roleId });
    return response.data;
};

export const saveAreaListAPI = async (user_roleId: number, roleId: number, areaList: { area_id: number; permission: boolean }): Promise<AreaList[]> => {
    const response = await apiClient.post<AreaList[]>(`/areaList/save`, { user_role_id: user_roleId, role_id: roleId, ...areaList });
    return response.data;
};
