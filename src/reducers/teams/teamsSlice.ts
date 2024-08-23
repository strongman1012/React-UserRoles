import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchTeamsListAPI, fetchTeamsAPI, fetchTeamByIdAPI, createTeamAPI, updateTeamAPI, deleteTeamAPI, Team } from './teamsAPI';

interface TeamState {
    allTeams: Team[];
    teamsList: Team[];
    currentTeam?: Team;
    editable?: boolean;
}

const initialState: TeamState = {
    allTeams: [],
    teamsList: []
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
        setTeamsList: (state, action: PayloadAction<Team[]>) => {
            state.teamsList = action.payload;
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
        removeTeam: (state, action: PayloadAction<number>) => {
            state.allTeams = state.allTeams.filter(
                team => action.payload !== team.id
            );
        },
    },
});

export const { resetTeams, setTeamsList, setTeams, setCurrentTeam, addTeam, updateTeam, removeTeam } = teamsSlice.actions;

export const fetchTeamsList = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchTeamsListAPI();
        dispatch(setTeamsList(response));
    } catch (error: any) {
        console.error('Error fetching teams:', error.response?.data?.message || error.message);
    }
};

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
        dispatch(addTeam(response.team));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const updateTeamById = (id: number, team: Partial<Team>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateTeamAPI(id, team); console.log(response, 'response')
        dispatch(updateTeam(response.team));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const deleteTeamById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await deleteTeamAPI(id);
        dispatch(removeTeam(id));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export default teamsSlice.reducer;
