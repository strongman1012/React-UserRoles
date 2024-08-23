import React, { FC, useEffect } from 'react';
import Router from './routes';
import 'devextreme/dist/css/dx.light.css';
import { useAppDispatch } from 'src/store/hooks';
import { initializeAuth } from 'src/reducers/auth/authSlice';

const App: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  return (
    <div>
      <Router />
    </div>
  );
};

export default App;
