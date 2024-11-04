import React, { useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Container, Typography, Card, CardHeader, CardContent, Divider, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import LoadingScreen from '../Basic/LoadingScreen';
import AlertModal from '../Basic/Alert';
import { login, loginSuccess } from '../../reducers/auth/authSlice';
import { useAppDispatch } from '../../store/hooks';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from 'src/utills/config';
import { LOCAL_SERVER_URL } from 'src/utills/config';

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    const msalInstance = new PublicClientApplication(msalConfig);

    // Validation schema
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is Required'),
        password: Yup.string().required('Password is Required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const message = await dispatch(login(values));
                if (message) {
                    setConfirmTitle(message);
                    setConfirmDescription('');
                    setConfirmModalOpen(true);
                }
            } catch (error: any) {
                setConfirmTitle(error.message);
                setConfirmDescription('');
                setConfirmModalOpen(true);
            } finally {
                setIsLoading(false);
            }
        },
    });

    // Handle SSO login
    const handleSSOLogin = async () => {
        setIsLoading(true);
        try {
            // Trigger MSAL login with popup
            await msalInstance.initialize();
            const loginResponse = await msalInstance.loginPopup(loginRequest);
            const token = loginResponse.idToken; // Get ID token from Azure
            const application = 1;

            const response = await fetch(`${LOCAL_SERVER_URL}/api/v0/loginWithSSO`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ application })
            });
            const message = await response.json();
            if (response.ok) {
                dispatch(loginSuccess({ token: message.token }));
                setConfirmTitle(message.message);
                setConfirmDescription('');
                setConfirmModalOpen(true);
            } else {
                setConfirmTitle('SSO Login Failed');
                setConfirmDescription(message.message);
                setConfirmModalOpen(true);
            }
        } catch (error: any) {
            setConfirmTitle('SSO Login Failed');
            setConfirmDescription(error.message);
            setConfirmModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Container
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90vh',
                    boxSizing: 'border-box'
                }}
            >
                <LoadingScreen show={isLoading} />
                <Card>
                    <CardHeader title="Login" sx={{ textAlign: 'center' }} />
                    <Divider />
                    <CardContent>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                size='small'
                                margin="normal"
                                id="email"
                                name="email"
                                label="Email address"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                fullWidth
                                size='small'
                                margin="normal"
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={!formik.values.email || !formik.values.password}
                                sx={{ mt: 2, '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}
                            >
                                Login
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                onClick={handleSSOLogin}
                                sx={{ mt: 2, '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}
                            >
                                Login with Azure SSO
                            </Button>
                        </form>
                        <Typography align="center" sx={{ mt: 2, fontStyle: 'oblique' }}>
                            <MuiLink component={Link} to="/forgot-password"
                                sx={{
                                    textDecoration: 'none',
                                    color: (theme) => `${theme.palette.primary.main}`,
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    }
                                }}>Forgot password?</MuiLink>
                        </Typography>
                        <Typography align="center" sx={{ mt: 1, fontStyle: 'oblique', color: (theme) => `${theme.palette.primary.main}` }}>
                            Don't have an account? <MuiLink component={Link} to="/register"
                                sx={{
                                    textDecoration: 'none',
                                    color: (theme) => `${theme.palette.primary.main}`,
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    }
                                }}>Register</MuiLink>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
            <AlertModal
                show={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title={confirmTitle}
                description={confirmDescription}
            />
        </>
    );
};

export default Login;
