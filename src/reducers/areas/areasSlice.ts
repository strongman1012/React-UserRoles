import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchAreasAPI, fetchAreaByIdAPI, createAreaAPI, updateAreaAPI, deleteAreaAPI, Area } from './areasAPI';

interface AreaState {
    allAreas: Area[];
    currentArea?: Area;
}

const initialState: AreaState = {
    allAreas: [],
};

const areasSlice = createSlice({
    name: 'areas',
    initialState,
    reducers: {
        setAreas: (state, action: PayloadAction<Area[]>) => {
            state.allAreas = action.payload;
        },
        setCurrentArea: (state, action: PayloadAction<Area>) => {
            state.currentArea = action.payload;
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
            state.allAreas = state.allAreas.filter(area => area.id !== action.payload);
        },
    },
});

export const { setAreas, setCurrentArea, addArea, updateArea, removeArea } = areasSlice.actions;

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

export const createArea = (name: string, description: string, application_id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await createAreaAPI(name, description, application_id);
        dispatch(addArea(response));
    } catch (error: any) {
        console.error('Error creating area:', error.response?.data?.message || error.message);
    }
};

export const updateAreaById = (id: number, name: string, description: string, application_id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateAreaAPI(id, name, description, application_id);
        dispatch(updateArea(response));
    } catch (error: any) {
        console.error('Error updating area:', error.response?.data?.message || error.message);
    }
};

export const deleteAreaById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        await deleteAreaAPI(id);
        dispatch(removeArea(id));
    } catch (error: any) {
        console.error('Error deleting area:', error.response?.data?.message || error.message);
    }
};

export default areasSlice.reducer;
