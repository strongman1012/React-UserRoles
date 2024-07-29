import React from 'react';
import { useSelector } from 'react-redux';
import { logout } from '../reducers/auth/authSlice';
import { Button, Stack, Typography } from '@mui/material';
import { RootState } from '../store/store';
import { useAppDispatch } from '../store/hooks';

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useAppDispatch();

    return (
        <Stack width="100%" padding={5}>
            <Typography variant="h4">Home</Typography>
            {user ? (
                <>
                    <Typography variant="body1">Welcome, {user.userName}</Typography>
                    <Button variant="contained" style={{ width: '150px' }} color="secondary" onClick={() => dispatch(logout())}>
                        Logout
                    </Button>
                </>
            ) : (
                <Typography variant="body1">You are not logged in.</Typography>
            )}
        </Stack>
    );
};

export default Home;
