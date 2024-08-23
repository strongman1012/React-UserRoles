import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchDataAccessesAPI, fetchDataAccessByIdAPI, createDataAccessAPI, updateDataAccessAPI, deleteDataAccessAPI, DataAccess } from './dataAccessesAPI';

interface DataAccessState {
    allDataAccesses: DataAccess[];
    currentDataAccess?: DataAccess;
    editable?: boolean;
}

const initialState: DataAccessState = {
    allDataAccesses: [],
};

const dataAccessesSlice = createSlice({
    name: 'dataAccesses',
    initialState,
    reducers: {
        resetDataAccesses: (state) => {
            state.allDataAccesses = [];
            state.currentDataAccess = undefined;
            state.editable = false;
        },
        setDataAccesses: (state, action: PayloadAction<any>) => {
            state.allDataAccesses = action.payload.result;
            state.editable = action.payload.editable;
        },
        setCurrentDataAccess: (state, action: PayloadAction<any>) => {
            state.currentDataAccess = action.payload.result;
            state.editable = action.payload.editable;
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
        removeDataAccesses: (state, action: PayloadAction<number>) => {
            state.allDataAccesses = state.allDataAccesses.filter(
                dataAccess => action.payload !== dataAccess.id
            );
        },
    },
});

export const { resetDataAccesses, setDataAccesses, setCurrentDataAccess, addDataAccess, updateDataAccess, removeDataAccesses } = dataAccessesSlice.actions;

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
        dispatch(addDataAccess(response.data_access));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const updateDataAccessById = (id: number, dataAccess: Partial<DataAccess>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateDataAccessAPI(id, dataAccess);
        dispatch(updateDataAccess(response.data_access));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const deleteDataAccessesById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await deleteDataAccessAPI(id);
        dispatch(removeDataAccesses(id));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export default dataAccessesSlice.reducer;
