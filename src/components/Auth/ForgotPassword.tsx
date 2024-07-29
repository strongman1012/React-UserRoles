import React, { useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { forgotPassword } from '../../reducers/auth/authSlice';
import { useAppDispatch } from '../../store/hooks';

const ForgotPassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Validation schema
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await dispatch(forgotPassword(values));
                setSnackbarMessage('Password reset link sent to your email');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error: any) {
                setSnackbarMessage(error);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
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
            <Box
                sx={{
                    width: '100%',
                    padding: 3,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    boxSizing: 'border-box',
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Forgot Password
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
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
                        disabled={formik.isSubmitting}
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </form>
                <Typography align="center" sx={{ mt: 2 }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>Back to Login</Link>
                </Typography>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ForgotPassword;
