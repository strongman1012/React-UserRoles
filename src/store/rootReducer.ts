import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth/authSlice';
import areaListReducer from '../reducers/areaList/areaListSlice';
import rolesReducer from '../reducers/roles/rolesSlice';
import applicationsSlice from 'src/reducers/applications/applicationsSlice';
import areasSlice from 'src/reducers/areas/areasSlice';
import usersSlice from 'src/reducers/users/usersSlice';
import businessUnitsSlice from 'src/reducers/businessUnits/businessUnitsSlice';
import teamsSlice from 'src/reducers/teams/teamsSlice';
import dataAccessesSlice from 'src/reducers/dataAccesses/dataAccessesSlice';
import loginReportsSlice from 'src/reducers/loginReports/loginReportsSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    areaList: areaListReducer,
    roles: rolesReducer,
    applications: applicationsSlice,
    areas: areasSlice,
    users: usersSlice,
    businessUnits: businessUnitsSlice,
    teams: teamsSlice,
    dataAccesses: dataAccessesSlice,
    loginReports: loginReportsSlice
});

export default rootReducer;
