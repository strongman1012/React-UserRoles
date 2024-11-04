import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchBusinessUnitsListAPI, fetchBusinessUnitsAPI, fetchBusinessUnitByIdAPI, createBusinessUnitAPI, updateBusinessUnitAPI, deleteBusinessUnitAPI, BusinessUnit } from './businessUnitsAPI';

interface BusinessUnitState {
    allBusinessUnits: BusinessUnit[];
    businessUnitsList: BusinessUnit[];
    currentBusinessUnit?: BusinessUnit;
    editable?: { read: boolean, create: boolean, update: boolean, delete: boolean };
}

const initialState: BusinessUnitState = {
    allBusinessUnits: [],
    businessUnitsList: [],
};

const businessUnitsSlice = createSlice({
    name: 'businessUnits',
    initialState,
    reducers: {
        resetBusinessUnits: (state) => {
            state.allBusinessUnits = [];
            state.currentBusinessUnit = undefined;
            state.editable = { read: false, create: false, update: false, delete: false };
        },
        setBusinessUnitsList: (state, action: PayloadAction<BusinessUnit[]>) => {
            state.businessUnitsList = action.payload;
        },
        setBusinessUnits: (state, action: PayloadAction<any>) => {
            state.allBusinessUnits = action.payload.result;
            state.editable = action.payload.editable;
        },
        setCurrentBusinessUnit: (state, action: PayloadAction<any>) => {
            state.currentBusinessUnit = action.payload.result;
            state.editable = action.payload.editable;
        },
        addBusinessUnit: (state, action: PayloadAction<BusinessUnit>) => {
            state.allBusinessUnits.push(action.payload);
        },
        updateBusinessUnit: (state, action: PayloadAction<any>) => {
            const updatedBusinessUnit = action.payload.businessUnit;
            const existingIndex = state.allBusinessUnits.findIndex(businessUnit => businessUnit.id === updatedBusinessUnit.id);
            if (existingIndex >= 0) {
                state.allBusinessUnits[existingIndex] = updatedBusinessUnit;
            }
        },
        removeBusinessUnit: (state, action: PayloadAction<number>) => {
            state.allBusinessUnits = state.allBusinessUnits.filter(
                businessUnit => action.payload !== businessUnit.id
            );
        },
    },
});

export const { resetBusinessUnits, setBusinessUnitsList, setBusinessUnits, setCurrentBusinessUnit, addBusinessUnit, updateBusinessUnit, removeBusinessUnit } = businessUnitsSlice.actions;

export const fetchBusinessUnitsList = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchBusinessUnitsListAPI();
        dispatch(setBusinessUnitsList(response));
    } catch (error: any) {
        console.error('Error fetching business units:', error.response?.data?.message || error.message);
    }
};

export const fetchBusinessUnits = () => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchBusinessUnitsAPI();
        dispatch(setBusinessUnits(response));
    } catch (error: any) {
        console.error('Error fetching business units:', error.response?.data?.message || error.message);
    }
};

export const fetchBusinessUnitById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchBusinessUnitByIdAPI(id);
        dispatch(setCurrentBusinessUnit(response));
    } catch (error: any) {
        console.error('Error fetching business unit:', error.response?.data?.message || error.message);
    }
};

export const createBusinessUnit = (businessUnit: Omit<BusinessUnit, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const response = await createBusinessUnitAPI(businessUnit);
        dispatch(addBusinessUnit(response.businessUnit));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const updateBusinessUnitById = (id: number, businessUnit: Partial<BusinessUnit>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateBusinessUnitAPI(id, businessUnit);
        dispatch(updateBusinessUnit(response));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export const deleteBusinessUnitsById = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await deleteBusinessUnitAPI(id);
        dispatch(removeBusinessUnit(id));
        return response.message;
    } catch (error: any) {
        const err_message = error.response?.data?.message || error.message;
        console.error('Error deleting users:', err_message);
        return err_message;
    }
};

export default businessUnitsSlice.reducer;
