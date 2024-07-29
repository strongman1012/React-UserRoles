import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth/authSlice';
import areaListReducer from '../reducers/areaList/areaListSlice';
import rolesReducer from '../reducers/roles/rolesSlice';
import applicationsSlice from 'src/reducers/applications/applicationsSlice';
import areasSlice from 'src/reducers/areas/areasSlice';
import usersSlice from 'src/reducers/users/usersSlice';
import businessUnitsSlice from 'src/reducers/businessUnits/businessUnitsSlice';
import storage from 'redux-persist/lib/storage';
import testReducer from "../reducers/testReducer";
import { persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
    auth: authReducer,
    test: persistReducer({ key: 'testRedux', storage: storage }, testReducer),
    areaList: areaListReducer,
    roles: rolesReducer,
    application: applicationsSlice,
    area: areasSlice,
    users: usersSlice,
    businessUnits: businessUnitsSlice
});

export default rootReducer;
