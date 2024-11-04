import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchAreasAPI, fetchAreaByIdAPI, createAreaAPI, updateAreaAPI, deleteAreaAPI, Area } from './areasAPI';

interface AreaState {
    allAreas: Area[];
    currentArea?: Area;
    editable?: { read: boolean, create: boolean, update: boolean, delete: boolean };
}

const initialState: AreaState = {
    allAreas: [],
};

const areasSlice = createSlice({
    name: 'areas',
    initialState,
    reducers: {
        resetAreas: (state) => {
            state.allAreas = [];
            state.currentArea = undefined;
            state.editable = { read: false, create: false, update: false, delete: false };
        },
        setAreas: (state, action: PayloadAction<any>) => {
            state.allAreas = action.payload.result;
            state.editable = action.payload.editable;
        },
        setCurrentArea: (state, action: PayloadAction<any>) => {
            state.currentArea = action.payload.result;
            state.editable = action.payload.editable;
        },
        addArea: (state, action: PayloadAction<Area>) => {
            state.allAreas.push(action.payload);
        },
        updateArea: (state, action: PayloadAction<Area>) => {
            const updatedArea = action.payload;
            const existingIndex = state.allAreas.findIndex(area => area.id === updatedArea.id);
            if (existingIndex >= 0) {
                state.allAreas[existingIndex] = updatedArea;
            }
        },
        removeArea: (state, action: PayloadAction<number>) => {
            state.allAreas = state.allAreas.filter(
                area => action.payload !== area.id
            );
        },
    },
});

export const { resetAreas, setAreas, setCurrentArea, addArea, updateArea, removeArea } = areasSlice.actions;

export const fetchAreas = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchAreasAPI();
        dispatch(setAreas(response));
    } catch (error: any) {
        console.error('Error fetching areas:', error.response?.data?.message || error.message);
    }
};

export const fetchAreaById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchAreaByIdAPI(id);
        dispatch(setCurrentArea(response));
    } catch (error: any) {
        console.error('Error fetching area:', error.response?.data?.message || error.message);
    }
};

export const createArea = (formData: { name: string, description: string, application_id: number }) => async (dispatch: AppDispatch) => {
    try {
        const response = await createAreaAPI(formData);
        dispatch(addArea(response.area));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const updateAreaById = (id: number, formData: { name: string, description: string, application_id: number }) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateAreaAPI(id, formData);
        dispatch(updateArea(response.area));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const deleteAreaById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await deleteAreaAPI(id);
        dispatch(removeArea(id));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export default areasSlice.reducer;
