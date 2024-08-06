import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchTeamsAPI, fetchTeamByIdAPI, createTeamAPI, updateTeamAPI, deleteTeamAPI, Team } from './teamsAPI';

interface TeamState {
    allTeams: Team[];
    currentTeam?: Team;
    editable?: boolean;
}

const initialState: TeamState = {
    allTeams: [],
};

const teamsSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        resetTeams: (state) => {
            state.allTeams = [];
            state.currentTeam = undefined;
            state.editable = false;
        },
        setTeams: (state, action: PayloadAction<any>) => {
            state.allTeams = action.payload.result;
            state.editable = action.payload.editable;
        },
        setCurrentTeam: (state, action: PayloadAction<any>) => {
            state.currentTeam = action.payload.result;
            state.editable = action.payload.editable;
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

export const { resetTeams, setTeams, setCurrentTeam, addTeam, updateTeam, removeTeams } = teamsSlice.actions;

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

export const createTeam = (team: Omit<Team, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const response = await createTeamAPI(team);
        dispatch(addTeam(response));
    } catch (error: any) {
        console.error('Error creating team:', error.response?.data?.message || error.message);
    }
};

export const updateTeamById = (id: number, team: Partial<Team>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateTeamAPI(id, team);
        dispatch(updateTeam(response));
    } catch (error: any) {
        console.error('Error updating team:', error.response?.data?.message || error.message);
    }
};

export const deleteTeamsByIds = (ids: number[]) => async (dispatch: AppDispatch) => {
    try {
        await deleteTeamAPI(ids);
        dispatch(removeTeams(ids));
    } catch (error: any) {
        console.error('Error deletingteams:', error.response?.data?.message || error.message);
    }
};

export default teamsSlice.reducer;
