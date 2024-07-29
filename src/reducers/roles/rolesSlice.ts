import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchRolesAPI, fetchRoleByIdAPI, createRoleAPI, updateRoleAPI, deleteRoleAPI, Role } from './rolesAPI';

interface RoleState {
    allRoles: Role[];
    currentRole?: Role;
}

const initialState: RoleState = {
    allRoles: [],
};

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<Role[]>) => {
            state.allRoles = action.payload;
        },
        setCurrentRole: (state, action: PayloadAction<Role>) => {
            state.currentRole = action.payload;
        },
        addRole: (state, action: PayloadAction<Role>) => {
            state.allRoles.push(action.payload);
        },
        updateRole: (state, action: PayloadAction<Role>) => {
            const updatedRole = action.payload;
            const existingIndex = state.allRoles.findIndex(role => role.id === updatedRole.id);
            if (existingIndex >= 0) {
                state.allRoles[existingIndex] = updatedRole;
            }
        },
        removeRole: (state, action: PayloadAction<number>) => {
            state.allRoles = state.allRoles.filter(role => role.id !== action.payload);
        },
    },
});

export const { setRoles, setCurrentRole, addRole, updateRole, removeRole } = rolesSlice.actions;

export const fetchRoles = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchRolesAPI();
        dispatch(setRoles(response));
    } catch (error: any) {
        console.error('Error fetching roles:', error.response?.data?.message || error.message);
    }
};

export const fetchRoleById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchRoleByIdAPI(id);
        dispatch(setCurrentRole(response));
    } catch (error: any) {
        console.error('Error fetching role:', error.response?.data?.message || error.message);
    }
};

export const createRole = (name: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await createRoleAPI(name);
        dispatch(addRole(response));
    } catch (error: any) {
        console.error('Error creating role:', error.response?.data?.message || error.message);
    }
};

export const updateRoleById = (id: number, name: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateRoleAPI(id, name);
        dispatch(updateRole(response));
    } catch (error: any) {
        console.error('Error updating role:', error.response?.data?.message || error.message);
    }
};

export const deleteRoleById = (id: string) => async (dispatch: AppDispatch) => {
    try {
        await deleteRoleAPI(id);
        dispatch(removeRole(parseInt(id)));
    } catch (error: any) {
        console.error('Error deleting role:', error.response?.data?.message || error.message);
    }
};

export default rolesSlice.reducer;
