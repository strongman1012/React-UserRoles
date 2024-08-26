import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchLoginReportsAPI, fetchUserMetricsByIdAPI, fetchApplicationPerDayMinAPI, fetchApplicationPerDayNumberAPI, 
    fetchApplicationTotalPercentAPI, fetchApplicationCategoryAPI, LoginReport, LoginMetrics, Metrics } from './loginReportsAPI';

interface LoginReportState {
    allLoginReports: LoginReport[];
    currentLoginMetrics?: LoginMetrics[];
    applicationPerDayMin: Metrics[];
    applicationPerDayNumber: Metrics[];
    applicationPercent: Metrics[];
    applicationRoles: any[];
    applicationUsers: any[];
}

const initialState: LoginReportState = {
    allLoginReports: [],
    applicationPerDayMin: [],
    applicationPerDayNumber: [],
    applicationPercent: [],
    applicationRoles: [],
    applicationUsers: []
};

const loginReportsSlice = createSlice({
    name: 'loginReports',
    initialState,
    reducers: {
        resetLoginReports: (state) => {
            state.allLoginReports = [];
            state.currentLoginMetrics = [];
        },
        setLoginReports: (state, action: PayloadAction<LoginReport[]>) => {
            state.allLoginReports = action.payload;
        },
        setCurrentLoginMetrics: (state, action: PayloadAction<LoginMetrics[]>) => {
            state.currentLoginMetrics = action.payload;
        },
        setApplicationPerDayMin: (state, action: PayloadAction<Metrics[]>) => {
            state.applicationPerDayMin = action.payload;
        },
        setApplicationPerDayNumber: (state, action: PayloadAction<Metrics[]>) => {
            state.applicationPerDayNumber = action.payload;
        },
        setApplicationPercent: (state, action: PayloadAction<Metrics[]>) => {
            state.applicationPercent = action.payload;
        },
        setApplicationCategory: (state, action: PayloadAction<any>) => {
            state.applicationRoles = action.payload.roles;
            state.applicationUsers = action.payload.users;
        },
    },
});

export const { resetLoginReports, setLoginReports, setCurrentLoginMetrics, setApplicationPerDayMin, setApplicationPerDayNumber, setApplicationPercent, setApplicationCategory } = loginReportsSlice.actions;

export const fetchLoginReports = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchLoginReportsAPI();
        dispatch(setLoginReports(response));
    } catch (error: any) {
        console.error('Error fetching login reports:', error.response?.data?.message || error.message);
    }
};

export const fetchUserMetricsById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchUserMetricsByIdAPI(id);
        dispatch(setCurrentLoginMetrics(response));
        return response;
    } catch (error: any) {
        console.error('Error fetching login report:', error.response?.data?.message || error.message);
    }
};
// Total Application Usage Per Day (min) 
export const fetchApplicationPerDayMin = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchApplicationPerDayMinAPI();
        dispatch(setApplicationPerDayMin(response));
    } catch (error: any) {
        console.error('Error fetching application metrics:', error.response?.data?.message || error.message);
    }
};
// Total Users Per Day 
export const fetchApplicationPerDayNumber = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchApplicationPerDayNumberAPI();
        dispatch(setApplicationPerDayNumber(response));
    } catch (error: any) {
        console.error('Error fetching application metrics:', error.response?.data?.message || error.message);
    }
};
// Total Application Usage (%)
export const fetchApplicationTotalPercent = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchApplicationTotalPercentAPI();
        dispatch(setApplicationPercent(response));
    } catch (error: any) {
        console.error('Error fetching application metrics:', error.response?.data?.message || error.message);
    }
};

// Number of users under each application
export const fetchApplicationCategory = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchApplicationCategoryAPI();
        dispatch(setApplicationCategory(response));
    } catch (error: any) {
        console.error('Error fetching application metrics:', error.response?.data?.message || error.message);
    }
};

export default loginReportsSlice.reducer;
