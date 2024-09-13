import React, { FC, useEffect, useState, useMemo, useCallback } from 'react';
import Router from './routes';
import 'devextreme/dist/css/dx.light.css';
import { useAppDispatch } from 'src/store/hooks';
import { initializeAuth, loginWithToken } from 'src/reducers/auth/authSlice';
import LoadingScreen from './components/Basic/LoadingScreen';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './utills/theme';
import ThemeSwitcher from 'src/components/Basic/ThemeSwitcher';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState(false);

  const loginToken = useCallback(async (token: string) => {
    setIsLoading(true);
    try {
      await dispatch(loginWithToken(token));
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Check if token exists in localStorage
    const localStorageToken = localStorage.getItem('token');

    if (localStorageToken) {
      dispatch(initializeAuth());
      setIsLoading(false);
    } else {
      // If no token in localStorage, check URL params for token
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        loginToken(token);
      } else {
        setIsLoading(false);
      }
    }
  }, [dispatch, loginToken]);

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  if (isLoading) {
    return <LoadingScreen show={true} />;
  }

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
