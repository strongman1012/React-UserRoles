import React, { useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Container, Typography, Card, CardHeader, CardContent, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import LoadingScreen from '../Basic/LoadingScreen';
import AlertModal from '../Basic/Alert';
import * as Yup from 'yup';
import { forgotPassword } from '../../reducers/auth/authSlice';
import { useAppDispatch } from '../../store/hooks';

const ForgotPassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    // Validation schema
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const message = await dispatch(forgotPassword(values));
                if (message) {
                    setConfirmTitle('Password reset link sent to your email');
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
                    minHeight: '90vh',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                }}
            >
                <LoadingScreen show={isLoading} />
                <Card>
                    <CardHeader title="Forgot Password" sx={{ textAlign: 'center' }} />
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
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                                disabled={!formik.values.email}
                                sx={{ mt: 2, '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}
                            >
                                Forgot Password
                            </Button>
                        </form>
                        <Typography align="center" sx={{ mt: 2, fontStyle: 'oblique', color: (theme) => `${theme.palette.primary.main}` }}>
                            Back to <Link to="/login" style={{ textDecoration: 'none', color: '#e34747' }}>Login</Link>
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

export default ForgotPassword;
