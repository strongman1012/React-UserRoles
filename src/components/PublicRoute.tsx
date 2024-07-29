import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

interface PublicRouteProps {
    children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.token);

    return isAuthenticated ? <Navigate to="/" /> : children;
};

export default PublicRoute;
