import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchApplicationsAPI, fetchApplicationByIdAPI, createApplicationAPI, updateApplicationAPI, deleteApplicationsAPI, Application } from './applicationsAPI';

interface ApplicationState {
    allApplications: Application[];
    currentApplication?: Application;
    editable?: { read: boolean, create: boolean, update: boolean, delete: boolean };
}

const initialState: ApplicationState = {
    allApplications: [],
};

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        resetApplications: (state) => {
            state.allApplications = [];
            state.currentApplication = undefined;
            state.editable = { read: false, create: false, update: false, delete: false };
        },
        setApplications: (state, action: PayloadAction<any>) => {
            state.allApplications = action.payload.result;
            state.editable = action.payload.editable;
        },
        setCurrentApplication: (state, action: PayloadAction<any>) => {
            state.currentApplication = action.payload.result;
            state.editable = action.payload.editable;
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
            state.allApplications = state.allApplications.filter(
                application => action.payload !== application.id
            );
        },
    },
});

export const { resetApplications, setApplications, setCurrentApplication, addApplication, updateApplication, removeApplication } = applicationsSlice.actions;

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

export const createApplication = (formData: { name: string, url: string, description: string }) => async (dispatch: AppDispatch) => {
    try {
        const response = await createApplicationAPI(formData);
        dispatch(addApplication(response.application));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const updateApplicationById = (id: number, formData: { name: string, url: string, description: string }) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateApplicationAPI(id, formData);
        dispatch(updateApplication(response.application));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const deleteApplicationById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await deleteApplicationsAPI(id);
        dispatch(removeApplication(id));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export default applicationsSlice.reducer;
