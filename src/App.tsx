import React, { FC } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import TestDashboard from './components/TestDashboard';
import 'devextreme/dist/css/dx.light.css';

const App: FC = () => {

  return (
    <Router>
      <Switch>
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />
        <PublicRoute path="/forgot-password" component={ForgotPassword} />
        <ProtectedRoute
          path="/"
          component={() => <TestDashboard />}
        />
      </Switch>
    </Router>
  );
};

export default App;
