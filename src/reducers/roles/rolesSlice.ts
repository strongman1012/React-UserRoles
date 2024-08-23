import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchRolesAPI, fetchRoleByIdAPI, createRoleAPI, updateRoleAPI, deleteRoleAPI, Role } from './rolesAPI';

interface RoleState {
    allRoles: Role[];
    currentRole?: Role;
    editable?: boolean;
}

const initialState: RoleState = {
    allRoles: [],
};

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        resetRoles: (state) => {
            state.allRoles = [];
            state.currentRole = undefined;
            state.editable = false;
        },
        setRoles: (state, action: PayloadAction<any>) => {
            state.allRoles = action.payload.result;
            state.editable = action.payload.editable;
        },
        setCurrentRole: (state, action: PayloadAction<any>) => {
            state.currentRole = action.payload.result;
            state.editable = action.payload.editable;
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
            state.allRoles = state.allRoles.filter(
                role => action.payload !== role.id
            );
        },
    },
});

export const { resetRoles, setRoles, setCurrentRole, addRole, updateRole, removeRole } = rolesSlice.actions;

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
        dispatch(addRole(response.role));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const updateRoleById = (id: number, name: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateRoleAPI(id, name);
        dispatch(updateRole(response.role));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const deleteRoleById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await deleteRoleAPI(id);
        dispatch(removeRole(id));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export default rolesSlice.reducer;
