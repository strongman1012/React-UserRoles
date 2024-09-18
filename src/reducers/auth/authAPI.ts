import { apiClient } from '../../utills/config';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterInfo {
    userName: string;
    email: string;
    password: string;
}

interface ForgotPasswordInfo {
    email: string;
}

interface AuthResponse {
    token: string;
    message: string;
}

export const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/login', { ...credentials, application: 1 });
    return response.data;
};

export const loginWithTokenAPI = async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/loginWithToken', { token: token, application: 1 });
    return response.data;
};

export const registerAPI = async (userInfo: RegisterInfo): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/register', userInfo);
    return response.data;
};

export const forgotPasswordAPI = async (email: ForgotPasswordInfo): Promise<void> => {
    await apiClient.post('/forgot-password', email);
};

export const logoutAPI = async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/logout', { application: 1 });
    return response.data;
};
