import React, { useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import LoadingScreen from '../Basic/LoadingScreen';
import AlertModal from '../Basic/Alert';
import { login } from '../../reducers/auth/authSlice';
import { useAppDispatch } from '../../store/hooks';

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    // Validation schema
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
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
                <Box
                    sx={{
                        width: '100%',
                        padding: 4,
                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 1,
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        boxSizing: 'border-box',
                        background: (theme) => `${theme.palette.primary.light}`,
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
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
                            sx={{ mt: 2 }}
                        >
                            Login
                        </Button>
                    </form>
                    <Typography align="center" sx={{ mt: 2, fontStyle: 'oblique' }}>
                        <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#e34747' }}>Forgot password?</Link>
                    </Typography>
                    <Typography align="center" sx={{ mt: 1, fontStyle: 'oblique', color: (theme) => `${theme.palette.primary.main}` }}>
                        Don't have an account? <Link to="/register" style={{ textDecoration: 'none', color: '#e34747' }}>Register</Link>
                    </Typography>
                </Box>
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
