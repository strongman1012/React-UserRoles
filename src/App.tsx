import React from 'react';
import 'devextreme/dist/css/dx.light.css';
import { FC, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import TestDashboard from './components/TestDashboard';
import { THEMES } from './utills/constatnts/general';

const App: FC = () => {
  const [themeName, setThemeName] = useState<string>(THEMES.LIGHT);

  const handleChangeTheme = (name: string) => {
    setThemeName(name);
  }

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}
      />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>}
      />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>}
      />
      <Route path="/" element={<ProtectedRoute><TestDashboard themeName={themeName} onChangeTheme={handleChangeTheme} /></ProtectedRoute>}
      />
    </Routes>
  );
};

export default App;
