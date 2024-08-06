import { apiClient } from '../../utills/config';

// Define the Team interface
export interface Team {
    id: number;
    name: string;
    description?: string;
    business_unit_id?: number | null;
    admin_id?: number | null;
    is_default: boolean;
    business_name?: string;
    admin_name?: string;
    ids?: number[];
    removeIds?: number[];
    role_id?: number;
}

// Fetch all teams
export const fetchTeamsAPI = async (): Promise<any> => {
    try {
        const response = await apiClient.get<any>('/teams');
        return response.data;
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Fetch a team by ID
export const fetchTeamByIdAPI = async (id: number): Promise<any> => {
    try {
        const response = await apiClient.get<any>(`/teams/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching team with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Create a new team
export const createTeamAPI = async (team: Omit<Team, 'id'>): Promise<Team> => {
    try {
        const response = await apiClient.post<Team>('/teams', { ...team });
        return response.data;
    } catch (error) {
        console.error('Error creating team:', error);
        throw error; // Re-throw the error after logging it
    }
};

// Update a team by ID
export const updateTeamAPI = async (id: number, team: Partial<Team>): Promise<Team> => {
    try {
        const response = await apiClient.put<Team>(`/teams/${id}`, { ...team });
        return response.data;
    } catch (error) {
        console.error(`Error updating team with ID ${id}:`, error);
        throw error; // Re-throw the error after logging it
    }
};

// Delete teams by IDs
export const deleteTeamAPI = async (ids: number[]): Promise<void> => {
    try {
        await apiClient.delete(`/teams`, { data: { ids } });
    } catch (error) {
        console.error(`Error deleting teams with IDs ${ids}:`, error);
        throw error; // Re-throw the error after logging it
    }
};
