import { apiClient } from '../../utills/config';
import { Setting } from '../settings/settingsAPI';

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
    application_url: string;
    permission: boolean;
    data: AreaList[];
}

export interface ApplicationRoleList {
    id: number;
    role_id: number;
    application_id: number;
    permission: boolean;
}

export interface ApplicationAccess {
    application_areas: ApplicationAreaList[];
    setting: Setting;
}

export const fetchUserAccessAPI = async (): Promise<ApplicationAccess> => {
    const response = await apiClient.get<ApplicationAccess>(`/areaList/getUserAccess`);
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

export const getApplicationRolesAPI = async (roleId: number): Promise<ApplicationRoleList[]> => {
    const response = await apiClient.get<ApplicationRoleList[]>(`/applicationRoles/${roleId}`);
    return response.data;
};

export const saveApplicationRoleAPI = async (roleId: number, applicationId: number, permission: boolean): Promise<ApplicationRoleList[]> => {
    const response = await apiClient.post<ApplicationRoleList[]>(`/applicationRoles/save`, { role_id: roleId, application_id: applicationId, permission: permission });
    return response.data;
};