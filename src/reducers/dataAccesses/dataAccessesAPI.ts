import { apiClient } from '../../utills/config';

// Define the DataAccess interface
export interface DataAccess {
    id: number;
    name: string;
    level: string;
}

// Fetch all data accesses
export const fetchDataAccessesAPI = async (): Promise<any> => {
    try {
        const response = await apiClient.get<any>('/dataAccesses');
        return response.data;
    } catch (error) {
        console.error('Error fetching data accesses:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Fetch a data access by ID
export const fetchDataAccessByIdAPI = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.get<any>(`/dataAccesses/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data access with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Create a new data access
export const createDataAccessAPI = async (dataAccess: Omit<DataAccess, 'id'>): Promise<any> => {
    try {
        const response = await apiClient.post<DataAccess>('/dataAccesses', dataAccess);
        return response.data;
    } catch (error) {
        console.error('Error creating data access:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Update a data access by ID
export const updateDataAccessAPI = async (id: number, dataAccess: Partial<DataAccess>): Promise<any> => {
    try {
        const response = await apiClient.put<DataAccess>(`/dataAccesses/${id}`, dataAccess);
        return response.data;
    } catch (error) {
        console.error(`Error updating data access with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Delete data accesses by ID
export const deleteDataAccessAPI = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.delete(`/dataAccesses/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting data accesses with IDs ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};
