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
import { setSidebarVisible } from 'src/reducers/areaList/areaListSlice';
import { logout } from 'src/reducers/auth/authSlice';
import { DecodedToken } from './utills/getUserFromToken';
import { jwtDecode } from 'jwt-decode';
import AlertModal from 'src/components/Basic/Alert';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [confirmTitle, setConfirmTitle] = useState<string>('');
  const [confirmDescription, setConfirmDescription] = useState<string>('');
  const localStorageToken = useSelector((state: RootState) => state.auth.token) || localStorage.getItem('token');

  // get current URL
  const currentUrl = window.location.href;
  // extra token from this url
  const token = currentUrl.split('token=')[1];

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
    dispatch(setSidebarVisible(true));
    if (localStorageToken) {
      dispatch(initializeAuth());
      setIsLoading(false);
    } else {
      if (token) {
        loginToken(token);
      } else {
        setIsLoading(false);
      }
    }
  }, [dispatch, loginToken, localStorageToken, token]);

  // Notifiction & logout after expiration time
  useEffect(() => {
    if (localStorageToken) {
      const decoded = jwtDecode<DecodedToken>(localStorageToken as string);
      const tokenExpiration = decoded.exp * 1000;

      if (tokenExpiration) {
        const currentTime = Date.now();
        const timeUntilExpiration = tokenExpiration - currentTime;

        if (timeUntilExpiration > 0) {
          const timeoutId = setTimeout(() => {
            setConfirmTitle("Your session was expired!");
            setConfirmDescription('You will be logout after 3s.');
            setConfirmModalOpen(true);
            setTimeout(() => {
              dispatch(logout());
              setConfirmModalOpen(false)
            }, 3000);

          }, timeUntilExpiration);
          return () => clearTimeout(timeoutId);
        } else {
          // If the token has already expired
          setConfirmTitle("Your session was expired!");
          setConfirmDescription('You will be logout after 3s.');
          setConfirmModalOpen(true);
          setTimeout(() => {
            dispatch(logout());
            setConfirmModalOpen(false)
          }, 3000);
        }
      }
    }

  }, [dispatch, localStorageToken]);

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
      <AlertModal
        show={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={confirmTitle}
        description={confirmDescription}
      />
    </ThemeProvider>
  );
};

export default App;
