import { apiClient } from '../../utills/config';

// Define the BusinessUnit interface
export interface BusinessUnit {
    id: number;
    name: string;
    parent_id?: number | null;
    website?: string;
    mainPhone?: string;
    otherPhone?: string;
    fax?: string;
    email?: string;
    street1?: string;
    street2?: string;
    street3?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    region?: string;
    status?: boolean;
    parent_name?: string;
}

// Fetch business units list
export const fetchBusinessUnitsListAPI = async (): Promise<BusinessUnit[]> => {
    try {
        const response = await apiClient.get<BusinessUnit[]>('/businessUnitsList');
        return response.data;
    } catch (error) {
        console.error('Error fetching business units:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Fetch all business units
export const fetchBusinessUnitsAPI = async (): Promise<any> => {
    try {
        const response = await apiClient.get<any>('/businessUnits');
        return response.data;
    } catch (error) {
        console.error('Error fetching business units:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Fetch a business unit by ID
export const fetchBusinessUnitByIdAPI = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.get<any>(`/businessUnits/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching business unit with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Create a new business unit
export const createBusinessUnitAPI = async (businessUnit: Omit<BusinessUnit, 'id'>): Promise<any> => {
    try {
        const response = await apiClient.post<BusinessUnit>('/businessUnits', { ...businessUnit });
        return response.data;
    } catch (error) {
        console.error('Error creating business unit:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Update a business unit by ID
export const updateBusinessUnitAPI = async (id: number, businessUnit: Partial<BusinessUnit>): Promise<any> => {
    try {
        const response = await apiClient.put<BusinessUnit>(`/businessUnits/${id}`, { ...businessUnit });
        return response.data;
    } catch (error) {
        console.error(`Error updating business unit with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Delete a business unit by ID
export const deleteBusinessUnitAPI = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.delete(`/businessUnits/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting business unit with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};
