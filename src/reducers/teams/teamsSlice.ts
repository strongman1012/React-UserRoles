import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchTeamsAPI, fetchTeamByIdAPI, createTeamAPI, updateTeamAPI, deleteTeamAPI, Team } from './teamsAPI';

interface TeamState {
    allTeams: Team[];
    currentTeam?: Team;
}

const initialState: TeamState = {
    allTeams: [],
};

const teamsSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        setTeams: (state, action: PayloadAction<Team[]>) => {
            state.allTeams = action.payload;
        },
        setCurrentTeam: (state, action: PayloadAction<Team>) => {
            state.currentTeam = action.payload;
        },
        addTeam: (state, action: PayloadAction<Team>) => {
            state.allTeams.push(action.payload);
        },
        updateTeam: (state, action: PayloadAction<Team>) => {
            const updatedTeam = action.payload;
            const existingIndex = state.allTeams.findIndex(team => team.id === updatedTeam.id);
            if (existingIndex >= 0) {
                state.allTeams[existingIndex] = updatedTeam;
            }
        },
        removeTeams: (state, action: PayloadAction<number[]>) => {
            state.allTeams = state.allTeams.filter(
                team => !action.payload.includes(team.id)
            );
        },
    },
});

export const { setTeams, setCurrentTeam, addTeam, updateTeam, removeTeams } = teamsSlice.actions;

export const fetchTeams = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchTeamsAPI();
        dispatch(setTeams(response));
    } catch (error: any) {
        console.error('Error fetching teams:', error.response?.data?.message || error.message);
    }
};

export const fetchTeamById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchTeamByIdAPI(id);
        dispatch(setCurrentTeam(response));
    } catch (error: any) {
        console.error('Error fetching team:', error.response?.data?.message || error.message);
    }
};

export const createTeam = (user_role_id: number, team: Omit<Team, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const response = await createTeamAPI(user_role_id, team);
        dispatch(addTeam(response));
    } catch (error: any) {
        console.error('Error creating team:', error.response?.data?.message || error.message);
    }
};

export const updateTeamById = (user_role_id: number, id: number, team: Partial<Team>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateTeamAPI(user_role_id, id, team);
        dispatch(updateTeam(response));
    } catch (error: any) {
        console.error('Error updating team:', error.response?.data?.message || error.message);
    }
};

export const deleteTeamsByIds = (ids: number[], user_role_id: number) => async (dispatch: AppDispatch) => {
    try {
        await deleteTeamAPI(ids, user_role_id);
        dispatch(removeTeams(ids));
    } catch (error: any) {
        console.error('Error deletingteams:', error.response?.data?.message || error.message);
    }
};

export default teamsSlice.reducer;
