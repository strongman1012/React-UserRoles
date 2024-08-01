import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store/store';
import { fetchChildBusinessUnitsAPI, fetchBusinessUnitsAPI, fetchBusinessUnitByIdAPI, createBusinessUnitAPI, updateBusinessUnitAPI, deleteBusinessUnitAPI, BusinessUnit } from './businessUnitsAPI';

interface BusinessUnitState {
    allBusinessUnits: BusinessUnit[];
    currentBusinessUnit?: BusinessUnit;
    childBusinessUnits?: BusinessUnit[];
}

const initialState: BusinessUnitState = {
    allBusinessUnits: [],
};

const businessUnitsSlice = createSlice({
    name: 'businessUnits',
    initialState,
    reducers: {
        setChildBusinessUnits: (state, action: PayloadAction<BusinessUnit[]>) => {
            state.childBusinessUnits = action.payload;
        },
        resetChildBusinessUnits: (state) => {
            state.childBusinessUnits = [];
        },
        setBusinessUnits: (state, action: PayloadAction<BusinessUnit[]>) => {
            state.allBusinessUnits = action.payload;
        },
        setCurrentBusinessUnit: (state, action: PayloadAction<BusinessUnit>) => {
            state.currentBusinessUnit = action.payload;
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

export const { setChildBusinessUnits, resetChildBusinessUnits, setBusinessUnits, setCurrentBusinessUnit, addBusinessUnit, updateBusinessUnit, removeBusinessUnits } = businessUnitsSlice.actions;

export const fetchChildBusinessUnits = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchChildBusinessUnitsAPI(id);
        dispatch(setChildBusinessUnits(response));
    } catch (error: any) {
        console.error('Error fetching child business units:', error.response?.data?.message || error.message);
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

export const createBusinessUnit = (user_role_id: number, businessUnit: Omit<BusinessUnit, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const response = await createBusinessUnitAPI(user_role_id, businessUnit);
        dispatch(addBusinessUnit(response));
    } catch (error: any) {
        console.error('Error creating business unit:', error.response?.data?.message || error.message);
    }
};

export const updateBusinessUnitById = (user_role_id: number, id: number, businessUnit: Partial<BusinessUnit>) => async (dispatch: AppDispatch) => {
    try {
        const response = await updateBusinessUnitAPI(user_role_id, id, businessUnit);
        dispatch(updateBusinessUnit(response));
    } catch (error: any) {
        console.error('Error updating business unit:', error.response?.data?.message || error.message);
    }
};

export const deleteBusinessUnitsByIds = (ids: number[], user_role_id: number) => async (dispatch: AppDispatch) => {
    try {
        await deleteBusinessUnitAPI(ids, user_role_id);
        dispatch(removeBusinessUnits(ids));
    } catch (error: any) {
        console.error('Error deleting business units:', error.response?.data?.message || error.message);
    }
};

export default businessUnitsSlice.reducer;
