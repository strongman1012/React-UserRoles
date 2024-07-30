import React, { FC, useState } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import TestDashboard from './components/TestDashboard';
import { THEMES } from './utills/constatnts/general';
import 'devextreme/dist/css/dx.light.css';

const App: FC = () => {
  const [themeName, setThemeName] = useState<string>(THEMES.LIGHT);

  const handleChangeTheme = (name: string) => {
    setThemeName(name);
  };

  return (
    <Router>
      <Switch>
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />
        <PublicRoute path="/forgot-password" component={ForgotPassword} />
        <ProtectedRoute 
          path="/" 
          component={() => <TestDashboard themeName={themeName} onChangeTheme={handleChangeTheme} />}
        />
      </Switch>
    </Router>
  );
};

export default App;
