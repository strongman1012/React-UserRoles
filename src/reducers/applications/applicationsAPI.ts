import { apiClient } from '../../utills/config';

// Define the Application interface
export interface Application {
    id: number;
    name: string;
    description: string;
}

// Fetch all applications
export const fetchApplicationsAPI = async (): Promise<any> => {
    try {
        const response = await apiClient.get<any>('/applications');
        return response.data;
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Fetch an application by ID
export const fetchApplicationByIdAPI = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.get<any>(`/applications/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching application with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Create a new application
export const createApplicationAPI = async (formData: { name: string, description: string }): Promise<Application> => {
    try {
        const response = await apiClient.post<Application>('/applications', { ...formData });
        return response.data;
    } catch (error) {
        console.error('Error creating application:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Update an application by ID
export const updateApplicationAPI = async (id: number, formData: { name: string, description: string }): Promise<Application> => {
    try {
        const response = await apiClient.put<Application>(`/applications/${id}`, { ...formData });
        return response.data;
    } catch (error) {
        console.error(`Error updating application with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Delete applications by IDs
export const deleteApplicationsAPI = async (ids: number[]): Promise<void> => {
    try {
        await apiClient.delete('/applications', { data: { ids } });
    } catch (error) {
        console.error(`Error deleting applications with IDs ${ids}:`, error);
        throw error; // Re-throw the error after logging it
    }
};
