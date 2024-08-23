import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { loginAPI, registerAPI, forgotPasswordAPI, logoutAPI } from './authAPI';
import getUserFromToken from '../../utills/getUserFromToken';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../utills/getUserFromToken';

import { resetRoles } from '../roles/rolesSlice';
import { resetBusinessUnits } from '../businessUnits/businessUnitsSlice';
import { resetUsers } from '../users/usersSlice';
import { resetTeams } from '../teams/teamsSlice';
import { resetAreaLists } from '../areaList/areaListSlice';
import { resetApplications } from '../applications/applicationsSlice';
import { resetDataAccesses } from '../dataAccesses/dataAccessesSlice';
import { resetAreas } from '../areas/areasSlice';
import { resetLoginReports } from '../loginReports/loginReportsSlice';

export const initializeAuth = () => (dispatch: AppDispatch) => {
    const token = localStorage.getItem('token');
    const user = getUserFromToken(token, dispatch);

    if (user) {
        dispatch(loginSuccess({ token: token as string }));
    }
};

interface AuthState {
    user: any | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null, // Initial state starts with null
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
            state.user = jwtDecode<DecodedToken>(action.payload.token).user;
            localStorage.setItem('token', action.payload.token);
        },
        loginFailure: (state) => {
            state.user = null;
            state.token = null;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
});

export const {
    loginSuccess,
    loginFailure,
    logoutSuccess,
} = authSlice.actions;

export const login = (credentials: { email: string; password: string }) => async (dispatch: AppDispatch) => {
    try {
        const response = await loginAPI(credentials);
        dispatch(loginSuccess({ token: response.token }));
        return response.message;
    } catch (error: any) {
        dispatch(loginFailure());
        const err_message = error.response?.data?.message || error.message;
        return err_message;
    }
};

export const register = (userInfo: { userName: string; email: string; password: string }) => async (dispatch: AppDispatch) => {
    try {
        const response = await registerAPI(userInfo);
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        return err_message;
    }
};

export const forgotPassword = (info: { email: string }) => async (dispatch: AppDispatch) => {
    try {
        await forgotPasswordAPI(info);
        return null;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        return err_message;
    }
};

export const logout = () => async (dispatch: AppDispatch) => {
    const response = await logoutAPI();
    if (response) {
        dispatch(logoutSuccess());
        dispatch(resetUsers());
        dispatch(resetTeams());
        dispatch(resetRoles());
        dispatch(resetBusinessUnits());
        dispatch(resetAreaLists());
        dispatch(resetApplications());
        dispatch(resetDataAccesses());
        dispatch(resetAreas());
        dispatch(resetLoginReports());
    }
    return response.message;
};

export default authSlice.reducer;
