import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchAreasAPI, fetchAreaByIdAPI, createAreaAPI, updateAreaAPI, deleteAreaAPI, Area } from './areasAPI';

interface AreaState {
    allAreas: Area[];
    currentArea?: Area;
    editable?: boolean;
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
            state.editable = false;
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
        removeAreas: (state, action: PayloadAction<number[]>) => {
            state.allAreas = state.allAreas.filter(
                area => !action.payload.includes(area.id)
            );
        },
    },
});

export const { resetAreas, setAreas, setCurrentArea, addArea, updateArea, removeAreas } = areasSlice.actions;

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
        dispatch(addArea(response));
    } catch (error: any) {
        console.error('Error creating area:', error.response?.data?.message || error.message);
    }
};

export const updateAreaById = (id: number, formData: { name: string, description: string, application_id: number }) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateAreaAPI(id, formData);
        dispatch(updateArea(response));
    } catch (error: any) {
        console.error('Error updating area:', error.response?.data?.message || error.message);
    }
};

export const deleteAreaByIds = (ids: number[]) => async (dispatch: AppDispatch) => {
    try {
        await deleteAreaAPI(ids);
        dispatch(removeAreas(ids));
    } catch (error: any) {
        console.error('Error deleting area:', error.response?.data?.message || error.message);
    }
};

export default areasSlice.reducer;
