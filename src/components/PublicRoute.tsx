import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PublicRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.user);

  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated?.status ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PublicRoute;
