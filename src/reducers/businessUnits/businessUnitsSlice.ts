import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchBusinessUnitsAPI, fetchBusinessUnitByIdAPI, createBusinessUnitAPI, updateBusinessUnitAPI, deleteBusinessUnitAPI, BusinessUnit } from './businessUnitsAPI';

interface BusinessUnitState {
    allBusinessUnits: BusinessUnit[];
    currentBusinessUnit?: BusinessUnit;
    editable?: boolean;
}

const initialState: BusinessUnitState = {
    allBusinessUnits: [],
};

const businessUnitsSlice = createSlice({
    name: 'businessUnits',
    initialState,
    reducers: {
        resetBusinessUnits: (state) => {
            state.allBusinessUnits = [];
            state.currentBusinessUnit = undefined;
            state.editable = false;
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
        updateBusinessUnit: (state, action: PayloadAction<BusinessUnit>) => {
            const updatedBusinessUnit = action.payload;
            const existingIndex = state.allBusinessUnits.findIndex(businessUnit => businessUnit.id === updatedBusinessUnit.id);
            if (existingIndex >= 0) {
                state.allBusinessUnits[existingIndex] = updatedBusinessUnit;
            }
        },
        removeBusinessUnits: (state, action: PayloadAction<number[]>) => {
            state.allBusinessUnits = state.allBusinessUnits.filter(
                businessUnit => !action.payload.includes(businessUnit.id)
            );
        },
    },
});

export const { resetBusinessUnits, setBusinessUnits, setCurrentBusinessUnit, addBusinessUnit, updateBusinessUnit, removeBusinessUnits } = businessUnitsSlice.actions;

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
        dispatch(addBusinessUnit(response));
    } catch (error: any) {
        console.error('Error creating business unit:', error.response?.data?.message || error.message);
    }
};

export const updateBusinessUnitById = (id: number, businessUnit: Partial<BusinessUnit>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateBusinessUnitAPI(id, businessUnit);
        dispatch(updateBusinessUnit(response));
    } catch (error: any) {
        console.error('Error updating business unit:', error.response?.data?.message || error.message);
    }
};

export const deleteBusinessUnitsByIds = (ids: number[]) => async (dispatch: AppDispatch) => {
    try {
        await deleteBusinessUnitAPI(ids);
        dispatch(removeBusinessUnits(ids));
    } catch (error: any) {
        console.error('Error deleting business units:', error.response?.data?.message || error.message);
    }
};

export default businessUnitsSlice.reducer;
