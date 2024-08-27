import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchAreaListsAPI, saveAreaListAPI, getAreaListsAPI, getApplicationRolesAPI, ApplicationAreaList, ApplicationRoleList, saveApplicationRoleAPI } from './areaListAPI';

interface AreaListState {
    areaLists: ApplicationAreaList[];
    selectedAreaLists: ApplicationAreaList[];
    applicationRoles: ApplicationRoleList[];
    editable?: boolean;
}

const initialState: AreaListState = {
    areaLists: [],
    selectedAreaLists: [],
    applicationRoles: []
};

const areaListSlice = createSlice({
    name: 'areaList',
    initialState,
    reducers: {
        resetAreaLists: (state) => {
            state.areaLists = [];
            state.selectedAreaLists = [];
            state.editable = false;
        },
        setAreaLists: (state, action: PayloadAction<ApplicationAreaList[]>) => {
            state.areaLists = action.payload;
        },
        selectedAreaLists: (state, action: PayloadAction<any>) => {
            state.selectedAreaLists = action.payload.result;
            state.editable = action.payload.editable
        },
        updateAreaList: (state, action: PayloadAction<ApplicationAreaList[]>) => {
            state.selectedAreaLists = action.payload;
        },
        setApplicationRoles: (state, action: PayloadAction<ApplicationRoleList[]>) => {
            state.applicationRoles = action.payload;
        },
        updateApplicationRole: (state, action: PayloadAction<ApplicationRoleList[]>) => {
            const updatedApplicationRole = action.payload;
            const existingIndex = state.applicationRoles.findIndex(area => area.id === updatedApplicationRole[0].id);
            if (existingIndex >= 0) {
                state.applicationRoles[existingIndex] = updatedApplicationRole[0];
            }
            else
                state.applicationRoles.push(updatedApplicationRole[0]);
        },
    },
});

export const { resetAreaLists, setAreaLists, selectedAreaLists, updateAreaList, setApplicationRoles, updateApplicationRole } = areaListSlice.actions;

export const fetchAreaLists = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchAreaListsAPI();
        dispatch(setAreaLists(response));
    } catch (error: any) {
        console.error('Error fetching area lists:', error.response?.data?.message || error.message);
    }
};
export const getAreaLists = (roleId: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await getAreaListsAPI(roleId);
        dispatch(selectedAreaLists(response));
    } catch (error: any) {
        console.error('Error fetching area lists:', error.response?.data?.message || error.message);
    }
};

export const saveAreaList = (roleId: number, areaList: { area_id: number; permission?: boolean, data_access_id?: number }) => async (dispatch: AppDispatch) => {
    try {
        const response = await saveAreaListAPI(roleId, areaList);
        dispatch(updateAreaList(response));
    } catch (error: any) {
        console.error('Error saving area list:', error.response?.data?.message || error.message);
    }
};

export const getApplicationRoles = (roleId: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await getApplicationRolesAPI(roleId);
        dispatch(setApplicationRoles(response));
    } catch (error: any) {
        console.error('Error fetching area lists:', error.response?.data?.message || error.message);
    }
};

export const saveApplicationRole = (roleId: number, applicationId: number, permission: boolean) => async (dispatch: AppDispatch) => {
    try {
        const response = await saveApplicationRoleAPI(roleId, applicationId, permission);
        dispatch(updateApplicationRole(response));
    } catch (error: any) {
        console.error('Error saving area list:', error.response?.data?.message || error.message);
    }
};

export default areaListSlice.reducer;
