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
        removeUsers: (state, action: PayloadAction<number[]>) => {
            state.allUsers = state.allUsers.filter(
                user => !action.payload.includes(user.id)
            );
        },
    },
});

export const { setUsers, setCurrentUser, addUser, updateUser, removeUsers } = usersSlice.actions;

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

export const createUser = (user_role_id: number,user: Omit<User, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const response = await createUserAPI(user_role_id, user);
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

// New action to handle multiple deletions
export const deleteUsersByIds = (ids: number[], user_role_id: number) => async (dispatch: AppDispatch) => {
    try {
        await deleteUserAPI(ids, user_role_id);
        ids.forEach(id => dispatch(removeUsers(ids)));
    } catch (error: any) {
        console.error('Error deleting users:', error.response?.data?.message || error.message);
    }
};

export default usersSlice.reducer;
