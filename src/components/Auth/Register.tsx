import React, { useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Container, Typography, Card, CardHeader, CardContent, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from '../Basic/LoadingScreen';
import AlertModal from '../Basic/Alert';
import * as Yup from 'yup';
import { register } from '../../reducers/auth/authSlice';
import { useAppDispatch } from '../../store/hooks';

const Register: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');
    const navigate = useNavigate();

    // Validation schema
    const validationSchema = Yup.object({
        userName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().min(5, 'Password should be of minimum 8 characters length').required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), ''], 'Passwords must match')
            .required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const message = await dispatch(register(values));
                if (message) {
                    setConfirmTitle(message);
                    setConfirmDescription('');
                    setConfirmModalOpen(true);
                    navigate('/login');
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
                    minHeight: '90vh',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                }}
            >
                <LoadingScreen show={isLoading} />
                <Card>
                    <CardHeader title="Register" sx={{ textAlign: 'center' }} />
                    <Divider />
                    <CardContent>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                size='small'
                                margin="normal"
                                id="userName"
                                name="userName"
                                label="User Name"
                                value={formik.values.userName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.userName && Boolean(formik.errors.userName)}
                                helperText={formik.touched.userName && formik.errors.userName}
                            />
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
                            <TextField
                                fullWidth
                                size='small'
                                margin="normal"
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={!formik.values.userName || !formik.values.email || !formik.values.password || !formik.values.confirmPassword}
                                sx={{ mt: 2, '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}
                            >
                                Register
                            </Button>
                        </form>
                        <Typography align="center" sx={{ mt: 2, fontStyle: 'oblique', color: (theme) => `${theme.palette.primary.main}` }}>
                            Already have an account? <Link to="/login" style={{ textDecoration: 'none', color: '#e34747' }}>Login</Link>
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

export default Register;
