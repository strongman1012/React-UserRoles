import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchDataAccessesAPI, fetchDataAccessByIdAPI, createDataAccessAPI, updateDataAccessAPI, deleteDataAccessAPI, DataAccess } from './dataAccessesAPI';

interface DataAccessState {
    allDataAccesses: DataAccess[];
    currentDataAccess?: DataAccess;
}

const initialState: DataAccessState = {
    allDataAccesses: [],
};

const dataAccessesSlice = createSlice({
    name: 'dataAccesses',
    initialState,
    reducers: {
        setDataAccesses: (state, action: PayloadAction<DataAccess[]>) => {
            state.allDataAccesses = action.payload;
        },
        setCurrentDataAccess: (state, action: PayloadAction<DataAccess>) => {
            state.currentDataAccess = action.payload;
        },
        addDataAccess: (state, action: PayloadAction<DataAccess>) => {
            state.allDataAccesses.push(action.payload);
        },
        updateDataAccess: (state, action: PayloadAction<DataAccess>) => {
            const updatedDataAccess = action.payload;
            const existingIndex = state.allDataAccesses.findIndex(dataAccess => dataAccess.id === updatedDataAccess.id);
            if (existingIndex >= 0) {
                state.allDataAccesses[existingIndex] = updatedDataAccess;
            }
        },
        removeDataAccesses: (state, action: PayloadAction<number[]>) => {
            state.allDataAccesses = state.allDataAccesses.filter(
                dataAccess => !action.payload.includes(dataAccess.id)
            );
        },
    },
});

export const { setDataAccesses, setCurrentDataAccess, addDataAccess, updateDataAccess, removeDataAccesses } = dataAccessesSlice.actions;

export const fetchDataAccesses = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchDataAccessesAPI();
        dispatch(setDataAccesses(response));
    } catch (error: any) {
        console.error('Error fetching data accesses:', error.response?.data?.message || error.message);
    }
};

export const fetchDataAccessById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchDataAccessByIdAPI(id);
        dispatch(setCurrentDataAccess(response));
    } catch (error: any) {
        console.error('Error fetching data access:', error.response?.data?.message || error.message);
    }
};

export const createDataAccess = (dataAccess: Omit<DataAccess, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const response = await createDataAccessAPI(dataAccess);
        dispatch(addDataAccess(response));
    } catch (error: any) {
        console.error('Error creating data access:', error.response?.data?.message || error.message);
    }
};

export const updateDataAccessById = (id: number, dataAccess: Partial<DataAccess>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateDataAccessAPI(id, dataAccess);
        dispatch(updateDataAccess(response));
    } catch (error: any) {
        console.error('Error updating data access:', error.response?.data?.message || error.message);
    }
};

export const deleteDataAccessesByIds = (ids: number[]) => async (dispatch: AppDispatch) => {
    try {
        await deleteDataAccessAPI(ids);
        dispatch(removeDataAccesses(ids));
    } catch (error: any) {
        console.error('Error deleting data accesses:', error.response?.data?.message || error.message);
    }
};

export default dataAccessesSlice.reducer;
