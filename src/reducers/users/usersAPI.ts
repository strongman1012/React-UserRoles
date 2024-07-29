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
    role_id?: number;
    role_name?: string;
    business_unit_id?: number;
    team_id?: number;
}

// Fetch all users
export const fetchUsersAPI = async (): Promise<User[]> => {
    try {
        const response = await apiClient.get<User[]>('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Fetch a user by ID
export const fetchUserByIdAPI = async (id: number): Promise<User> => {
    try {
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Create a new user
export const createUserAPI = async (user: Omit<User, 'id'>): Promise<User> => {
    try {
        const response = await apiClient.post<User>('/users', user);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Update a user by ID
export const updateUserAPI = async (user_role_id: number, id: number, user: Partial<User>): Promise<User> => {
    try {
        const response = await apiClient.put<User>(`/users/${id}`, { user_role_id: user_role_id, ...user });
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Delete a user by ID
export const deleteUserAPI = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/users/${id}`);
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};
