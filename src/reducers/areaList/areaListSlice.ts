import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchAreaListsAPI, saveAreaListAPI, getAreaListsAPI, AreaList } from './areaListAPI';

interface AreaListState {
    areaLists: AreaList[];
    selectedAreaLists: AreaList[];
}

const initialState: AreaListState = {
    areaLists: [],
    selectedAreaLists: []
};

const areaListSlice = createSlice({
    name: 'areaList',
    initialState,
    reducers: {
        setAreaLists: (state, action: PayloadAction<AreaList[]>) => {
            state.areaLists = action.payload;
        },
        selectedAreaLists: (state, action: PayloadAction<AreaList[]>) => {
            state.selectedAreaLists = action.payload;
        },
        updateAreaList: (state, action: PayloadAction<AreaList[]>) => {
            state.selectedAreaLists = action.payload;
        },
    },
});

export const { setAreaLists, selectedAreaLists, updateAreaList } = areaListSlice.actions;

export const fetchAreaLists = (roleId: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchAreaListsAPI(roleId);
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

export const saveAreaList = (user_roleId: number, roleId: number, areaList: { area_id: number; permission: boolean }) => async (dispatch: AppDispatch) => {
    try {
        const response = await saveAreaListAPI(user_roleId, roleId, areaList);
        dispatch(updateAreaList(response));
    } catch (error: any) {
        console.error('Error saving area list:', error.response?.data?.message || error.message);
    }
};

export default areaListSlice.reducer;
