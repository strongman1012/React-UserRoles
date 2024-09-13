import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { saveSettingsAPI, Setting } from './settingsAPI';

interface SettingState {
    setting: Setting | undefined;
}

const initialState: SettingState = {
    setting: undefined,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        resetSetting: (state) => {
            state.setting = undefined;
        },
        setSetting: (state, action: PayloadAction<Setting>) => {
            state.setting = action.payload;
        },
        updateSetting: (state, action: PayloadAction<Setting>) => {
            state.setting = action.payload;
        },
    },
});

export const { setSetting, updateSetting, resetSetting } = settingsSlice.actions;

export const saveSettings = (rowsPerpage: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await saveSettingsAPI(rowsPerpage);
        dispatch(updateSetting(response.setting));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export default settingsSlice.reducer;
