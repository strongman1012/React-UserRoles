import { RouteObject, Navigate } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import { FC } from 'react';

import Home from './pages/Dashboard/Home';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import SecurityRoles from './pages/Dashboard/SecurityRoles';
import Users from './pages/Dashboard/Users';
import BusinessUnits from './pages/Dashboard/BusinessUnits';
import Teams from './pages/Dashboard/Teams';
import Applications from './pages/Dashboard/Applications';
import Areas from './pages/Dashboard/Areas';
import DataAccess from './pages/Dashboard/DataAccess';
import LoginReports from './pages/Dashboard/LoginReports';
import ApplicationMetrics from './pages/Dashboard/ApplicationMetrics';
import OrganizationChart from './pages/Dashboard/OrgChart';

const routes: RouteObject[] = [
    {
        path: '/login',
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: '/register',
        element: (
            <PublicRoute>
                <Register />
            </PublicRoute>
        ),
    },
    {
        path: '/forgot-password',
        element: (
            <PublicRoute>
                <ForgotPassword />
            </PublicRoute>
        ),
    },
    {
        path: '/',
        element: <Navigate to="/dashboard/home" replace />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '',
                element: <Navigate to="home" replace />,
            },
            {
                path: 'home',
                element: <Home />
            },
            {
                path: 'security-roles',
                element: <SecurityRoles />,
            },
            {
                path: 'users',
                element: <Users />,
            },
            {
                path: 'organizational-units',
                element: <BusinessUnits />,
            },
            {
                path: 'teams',
                element: <Teams />,
            },
            {
                path: 'applications',
                element: <Applications />,
            },
            {
                path: 'areas',
                element: <Areas />,
            },
            {
                path: 'data-access',
                element: <DataAccess />,
            },
            {
                path: 'login-reports',
                element: <LoginReports />,
            },
            {
                path: 'application-metrics',
                element: <ApplicationMetrics />,
            },
            {
                path: 'organization-chart',
                element: <OrganizationChart />
            }
        ],
    },
];

const Router: FC = () => {
    return useRoutes(routes);
};

export default Router;
