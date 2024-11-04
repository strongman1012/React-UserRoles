import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchUsersListAPI, fetchUsersAPI, fetchUserByIdAPI, createUserAPI, updateUserAPI, deleteUserAPI, User } from './usersAPI';

interface UserState {
    allUsers: User[];
    usersList: User[];
    currentUser?: User;
    editable?: { read: boolean, create: boolean, update: boolean, delete: boolean };
}

const initialState: UserState = {
    allUsers: [],
    usersList: []
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetUsers: (state) => {
            state.allUsers = [];
            state.currentUser = undefined;
            state.editable = { read: false, create: false, update: false, delete: false };
        },
        setUsersList: (state, action: PayloadAction<User[]>) => {
            state.usersList = action.payload;
        },
        setUsers: (state, action: PayloadAction<any>) => {
            state.allUsers = action.payload.result;
            state.editable = action.payload.editable;
        },
        setCurrentUser: (state, action: PayloadAction<any>) => {
            state.currentUser = action.payload.result;
            state.editable = action.payload.editable;
        },
        addUser: (state, action: PayloadAction<User>) => {
            state.allUsers.push(action.payload);
        },
        updateUser: (state, action: PayloadAction<any>) => {
            const updatedUser = action.payload.user;
            const existingIndex = state.allUsers.findIndex(user => user.id === updatedUser.id);
            if (existingIndex >= 0) {
                state.allUsers[existingIndex] = updatedUser;
            }
        },
        removeUser: (state, action: PayloadAction<number>) => {
            state.allUsers = state.allUsers.filter(
                user => action.payload !== user.id
            );
        },
    },
});

export const { resetUsers, setUsersList, setUsers, setCurrentUser, addUser, updateUser, removeUser } = usersSlice.actions;

export const fetchUsersList = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchUsersListAPI();
        dispatch(setUsersList(response));
    } catch (error: any) {
        console.error('Error fetching users:', error.response?.data?.message || error.message);
    }
};

export const fetchUsers = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchUsersAPI();
        dispatch(setUsers(response));
    } catch (error: any) {
        console.error('Error fetching users:', error.response?.data?.message || error.message);
    }
};

export const fetchUserById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchUserByIdAPI(id);
        dispatch(setCurrentUser(response));
    } catch (error: any) {
        console.error('Error fetching user:', error.response?.data?.message || error.message);
    }
};

export const createUser = (user: Omit<User, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const response = await createUserAPI(user);
        dispatch(addUser(response.user));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const updateUserById = (id: number, user: Partial<User>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateUserAPI(id, user);
        dispatch(updateUser(response));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

// New action to handle delete
export const deleteUserById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await deleteUserAPI(id);
        dispatch(removeUser(id));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export default usersSlice.reducer;
