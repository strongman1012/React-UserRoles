import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchApplicationsAPI, fetchApplicationByIdAPI, createApplicationAPI, updateApplicationAPI, deleteApplicationAPI, Application } from './applicationsAPI';

interface ApplicationState {
    allApplications: Application[];
    currentApplication?: Application;
}

const initialState: ApplicationState = {
    allApplications: [],
};

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        setApplications: (state, action: PayloadAction<Application[]>) => {
            state.allApplications = action.payload;
        },
        setCurrentApplication: (state, action: PayloadAction<Application>) => {
            state.currentApplication = action.payload;
        },
        addApplication: (state, action: PayloadAction<Application>) => {
            state.allApplications.push(action.payload);
        },
        updateApplication: (state, action: PayloadAction<Application>) => {
            const updatedApplication = action.payload;
            const existingIndex = state.allApplications.findIndex(application => application.id === updatedApplication.id);
            if (existingIndex >= 0) {
                state.allApplications[existingIndex] = updatedApplication;
            }
        },
        removeApplication: (state, action: PayloadAction<number>) => {
            state.allApplications = state.allApplications.filter(application => application.id !== action.payload);
        },
    },
});

export const { setApplications, setCurrentApplication, addApplication, updateApplication, removeApplication } = applicationsSlice.actions;

export const fetchApplications = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchApplicationsAPI();
        dispatch(setApplications(response));
    } catch (error: any) {
        console.error('Error fetching applications:', error.response?.data?.message || error.message);
    }
};

export const fetchApplicationById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchApplicationByIdAPI(id);
        dispatch(setCurrentApplication(response));
    } catch (error: any) {
        console.error('Error fetching application:', error.response?.data?.message || error.message);
    }
};

export const createApplication = (name: string, description: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await createApplicationAPI(name, description);
        dispatch(addApplication(response));
    } catch (error: any) {
        console.error('Error creating application:', error.response?.data?.message || error.message);
    }
};

export const updateApplicationById = (id: number, name: string, description: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateApplicationAPI(id, name, description);
        dispatch(updateApplication(response));
    } catch (error: any) {
        console.error('Error updating application:', error.response?.data?.message || error.message);
    }
};

export const deleteApplicationById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        await deleteApplicationAPI(id);
        dispatch(removeApplication(id));
    } catch (error: any) {
        console.error('Error deleting application:', error.response?.data?.message || error.message);
    }
};

export default applicationsSlice.reducer;
