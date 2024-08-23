import React from 'react';
import { useSelector } from 'react-redux';
import { logout } from '../../reducers/auth/authSlice';
import { Button, Box, Container, Card, CardHeader, CardContent, Divider, Typography } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useAppDispatch();

    return (
        <Container maxWidth={false}>
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Home" />
                    <Divider />
                    <CardContent>
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
                    </CardContent>
                </Card>
            </Box>
        </Container>

    );
};

export default Home;
