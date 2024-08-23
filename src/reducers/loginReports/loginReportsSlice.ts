import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchLoginReportsAPI, fetchUserMetricsByIdAPI, LoginReport, LoginMetrics } from './loginReportsAPI';

interface LoginReportState {
    allLoginReports: LoginReport[];
    currentLoginMetrics?: LoginMetrics[];
}

const initialState: LoginReportState = {
    allLoginReports: [],
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
    },
});

export const { resetLoginReports, setLoginReports, setCurrentLoginMetrics } = loginReportsSlice.actions;

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

export default loginReportsSlice.reducer;
