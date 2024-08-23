import { apiClient } from '../../utills/config';

// Define the User interface
export interface User {
    id: number;
    userName: string;
    email: string;
    password: string;
    fullName?: string;
    mobilePhone?: string;
    mainPhone?: string;
    status?: boolean;
    photo?: string;
    role_ids?: string | null;
    business_unit_id?: number | null;
    team_ids?: string | null;
    business_name?: string;
}

// Fetch users list
export const fetchUsersListAPI = async (): Promise<User[]> => {
    try {
        const response = await apiClient.get<User[]>('/usersList');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Fetch all users
export const fetchUsersAPI = async (): Promise<any> => {
    try {
        const response = await apiClient.get<any>('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Fetch a user by ID
export const fetchUserByIdAPI = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.get<any>(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Create a new user
export const createUserAPI = async (user: Omit<User, 'id'>): Promise<any> => {
    try {
        const response = await apiClient.post<User>('/users', { ...user });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Update a user by ID
export const updateUserAPI = async (id: number, user: Partial<User>): Promise<any> => {
    try {
        const response = await apiClient.put<User>(`/users/${id}`, { ...user });
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Delete a user by IDs
export const deleteUserAPI = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting users with IDs ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

