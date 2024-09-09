import React, { FC, useState, useMemo, useEffect } from 'react';
import Router from './routes';
import 'devextreme/dist/css/dx.light.css';
import { useAppDispatch } from 'src/store/hooks';
import { initializeAuth } from 'src/reducers/auth/authSlice';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './utills/theme';
import ThemeSwitcher from 'src/components/Basic/ThemeSwitcher';

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeSwitcher darkMode={darkMode} onToggle={handleThemeChange} />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
