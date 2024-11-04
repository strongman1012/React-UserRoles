import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
    TextField, Button, Container, Typography, Card, CardHeader, CardContent, Divider, Link as MuiLink,
    Box, FormControlLabel, Checkbox
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from '../Basic/LoadingScreen';
import AlertModal from '../Basic/Alert';
import * as Yup from 'yup';
import { register } from '../../reducers/auth/authSlice';
import { useAppDispatch } from '../../store/hooks';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useTheme } from '@mui/material/styles';

const Register: React.FC = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');
    const [step, setStep] = useState<number>(1);
    const [openTermsModal, setOpenTermsModal] = useState<boolean>(false);
    const navigate = useNavigate();

    // Validation schema
    const validationSchema = Yup.object({
        firstName: Yup.string().required('FirstName is Required'),
        lastName: Yup.string().required('LastName is Required'),
        phone: Yup.string().required('Phone Number is Required'),
        organization: Yup.string().required('Organization is Required'),
        organization_website: Yup.string().required('Organization Website URL is Required'),
        userName: Yup.string().required('UserName Required'),
        email: Yup.string().email('Invalid email address').required('Email is Required'),
        password: Yup.string().min(5, 'Password should be of minimum 8 characters length').required('Password is Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), ''], 'Passwords must match')
            .required('ConfirmPassword is Required'),
        termsAccepted: Yup.boolean().oneOf([true], 'You must accept the Terms and Conditions')
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            phone: '',
            organization: '',
            organization_website: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false
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
    const handleNext = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePrevious = () => {
        setStep((prevStep) => prevStep - 1);
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
                            {step === 1 && (
                                <>
                                    <Typography variant="h6" sx={{ mb: 3, color: (theme) => `${theme.palette.primary.main}` }}>
                                        Personal & Organization Information
                                    </Typography>
                                    <Typography sx={{ color: (theme) => `${theme.palette.primary.dark}` }}>
                                        Personal Information
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size='small'
                                        margin="dense"
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                    />
                                    <TextField
                                        fullWidth
                                        size='small'
                                        margin="dense"
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                        helperText={formik.touched.lastName && formik.errors.lastName}
                                    />
                                    <Box sx={{ mt: 2 }}>
                                        <PhoneInput
                                            specialLabel={'Phone'}
                                            placeholder={'Mobile Number'}
                                            value={formik.values.phone}
                                            onBlur={formik.handleBlur}
                                            onChange={(value) => formik.setFieldValue('phone', value)}
                                            country="us"
                                            inputStyle={{
                                                width: '100%',
                                                fontSize: '12px',
                                                padding: '9.5px 14px 9.5px 58px',
                                                backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f0f1f3',
                                                border: `1px solid ${theme.palette.mode === 'dark' ? '#616161' : 'rgba(0, 0, 0, 0.23)'}`,
                                                color: theme.palette.mode === 'dark' ? '#f7f7f7' : '#000',
                                                borderRadius: '4px',
                                            }}
                                            buttonStyle={{
                                                backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f0f1f3',
                                                border: `1px solid ${theme.palette.mode === 'dark' ? '#616161' : 'rgba(0, 0, 0, 0.23)'}`,
                                                color: theme.palette.mode === 'dark' ? '#f7f7f7' : '#000',
                                            }}
                                            dropdownStyle={{
                                                backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f0f1f3',
                                                color: theme.palette.mode === 'dark' ? '#616161' : '#000',
                                            }}
                                            isValid
                                            enableSearch
                                            autoFormat={true}
                                            countryCodeEditable={false}
                                            inputProps={{
                                                required: true,
                                                name: 'phone'
                                            }}
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <Typography color="error" variant="caption">
                                                {formik.errors.phone}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Typography sx={{ mt: 3 }}>
                                        Company/Organization Information
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size='small'
                                        margin="dense"
                                        id="organization"
                                        name="organization"
                                        label="Organization Name"
                                        value={formik.values.organization}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.organization && Boolean(formik.errors.organization)}
                                        helperText={formik.touched.organization && formik.errors.organization}
                                    />
                                    <TextField
                                        fullWidth
                                        size='small'
                                        margin="dense"
                                        id="organization_website"
                                        name="organization_website"
                                        label="Organization Website URL"
                                        value={formik.values.organization_website}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.organization_website && Boolean(formik.errors.organization_website)}
                                        helperText={formik.touched.organization_website && formik.errors.organization_website}
                                    />
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        fullWidth
                                        onClick={handleNext}
                                        disabled={!formik.values.firstName || !formik.values.lastName || !formik.values.phone || !formik.values.organization || !formik.values.organization_website}
                                        sx={{ mt: 2, '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}
                                    >
                                        Next
                                    </Button>
                                </>

                            )}
                            {step === 2 && (
                                <>
                                    <Typography variant="h6" sx={{ mb: 3, color: (theme) => `${theme.palette.primary.main}` }}>
                                        Account Login Information
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size='small'
                                        margin="dense"
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
                                        margin="dense"
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
                                        margin="dense"
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
                                        margin="dense"
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
                                    <FormControlLabel
                                        sx={{ padding: '0 9px 0 0' }}
                                        control={
                                            <Checkbox
                                                checked={formik.values.termsAccepted}
                                                onChange={formik.handleChange}
                                                name="termsAccepted"
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <Typography>
                                                I have read the{' '}
                                                <MuiLink component='a' onClick={() => setOpenTermsModal(true)}
                                                    sx={{
                                                        textDecoration: 'none',
                                                        color: (theme) => `${theme.palette.primary.dark}`,
                                                        '&:hover': {
                                                            textDecoration: 'underline',
                                                        }
                                                    }}>
                                                    Terms and Conditions
                                                </MuiLink>
                                            </Typography>
                                        }
                                    />
                                    <br />
                                    {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                                        <Typography color="error" variant="caption" sx={{ marginLeft: '14px' }}>
                                            {formik.errors.termsAccepted}
                                        </Typography>
                                    )}
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
                                    <Button
                                        color='primary'
                                        variant='contained'
                                        fullWidth
                                        onClick={handlePrevious}
                                        sx={{ mt: 2, '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}
                                    >
                                        &lt;&lt; Previous
                                    </Button>
                                </>
                            )}
                        </form>
                        <Typography align="center" sx={{ mt: 2, fontStyle: 'oblique', color: (theme) => `${theme.palette.primary.main}` }}>
                            Already have an account? <MuiLink to="/login" component={Link}
                                sx={{
                                    textDecoration: 'none',
                                    color: (theme) => `${theme.palette.primary.main}`,
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    }
                                }}>Login</MuiLink>
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
            <AlertModal
                show={openTermsModal}
                onClose={() => setOpenTermsModal(false)}
                title={'Terms and Conditions'}
                description={`TERMS AND CONDITIONS Acceptance of Terms: These Terms and Conditions (hereinafter referred to as the “Terms” or “Terms and Conditions”) govern your use of this website and LedgeRock Logic’s technology engine (hereinafter referred to as the “Imma”) in addition to all its content`}
            />
        </>
    );
};

export default Register;
