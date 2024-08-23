import { apiClient } from '../../utills/config';

export interface AreaList {
    id: number;
    role_id: number;
    area_id: number;
    data_access_id: number;
    permission: boolean;
    application_name: string;
    area_name: string;
    level?: number;
    read?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
}

export interface ApplicationAreaList {
    application_name: string;
    application_id: number;
    data: AreaList[];
}

export const fetchAreaListsAPI = async (): Promise<ApplicationAreaList[]> => {
    const response = await apiClient.get<ApplicationAreaList[]>(`/areaList/getUserAreas`);
    return response.data;
};
export const getAreaListsAPI = async (roleId: number): Promise<any> => {
    const response = await apiClient.get<any>(`/areaList/getSelectedAreas/${roleId}`);
    return response.data;
};

export const saveAreaListAPI = async (roleId: number, areaList: { area_id: number; permission?: boolean; data_access_id?: number }): Promise<ApplicationAreaList[]> => {
    const response = await apiClient.post<ApplicationAreaList[]>(`/areaList/save`, { role_id: roleId, ...areaList });
    return response.data;
};
