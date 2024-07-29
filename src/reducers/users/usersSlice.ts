import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchUsersAPI, fetchUserByIdAPI, createUserAPI, updateUserAPI, deleteUserAPI, User } from './usersAPI';

interface UserState {
    allUsers: User[];
    currentUser?: User;
}

const initialState: UserState = {
    allUsers: [],
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.allUsers = action.payload;
        },
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.currentUser = action.payload;
        },
        addUser: (state, action: PayloadAction<User>) => {
            state.allUsers.push(action.payload);
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const updatedUser = action.payload;
            const existingIndex = state.allUsers.findIndex(user => user.id === updatedUser.id);
            if (existingIndex >= 0) {
                state.allUsers[existingIndex] = updatedUser;
            }
        },
        removeUser: (state, action: PayloadAction<number>) => {
            state.allUsers = state.allUsers.filter(user => user.id !== action.payload);
        },
    },
});

export const { setUsers, setCurrentUser, addUser, updateUser, removeUser } = usersSlice.actions;

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
        dispatch(addUser(response));
    } catch (error: any) {
        console.error('Error creating user:', error.response?.data?.message || error.message);
    }
};

export const updateUserById = (user_role_id: number, id: number, user: Partial<User>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateUserAPI(user_role_id, id, user);
        dispatch(updateUser(response));
    } catch (error: any) {
        console.error('Error updating user:', error.response?.data?.message || error.message);
    }
};

export const deleteUserById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        await deleteUserAPI(id);
        dispatch(removeUser(id));
    } catch (error: any) {
        console.error('Error deleting user:', error.response?.data?.message || error.message);
    }
};

export default usersSlice.reducer;
