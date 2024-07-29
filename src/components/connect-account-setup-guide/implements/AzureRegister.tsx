import React from 'react';
import * as Yup from 'yup';
import { FC, useEffect, useRef, useState } from "react";
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { Formik } from 'formik';
import { FormControlStyled } from '../../../utills/styles/styled';
import { ActiveDirectoryValues } from '../types/setupTypes';
import LoadingScreen from '../../../components/LoadingScreen';
import ServerApi from '../../../utills/serverApi';

interface SubmitValues extends ActiveDirectoryValues {
    submit: any
}

const initData = {
    type: 'active-directory',
    applicationId: '',
    applicationKey: '',
    tenantName: '',
    tenantId: ''
}

const AzureRegisterForm: FC = () => {

    const apiObj = new ServerApi();
    const formikRef = useRef<any>(null);
    const [state, setState] = useState<ActiveDirectoryValues>(initData);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        getActiveDirectoryData();
    }, []);

    // Get Active Directory Data
    const getActiveDirectoryData = async () => {

        try {
            const response = await apiObj.getData('setting/active-directory');

            if (response.status === 200 && response.data.success) {
                const activeDirectoryValue: ActiveDirectoryValues = response.data.data;
                setState(activeDirectoryValue);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Submit Form
    const SubmitForm = () => {

        const initValue: SubmitValues = { ...state, submit: null };

        const validationSchema = Yup.object().shape({
            applicationId: Yup.string().required('Application Id is required'),
            applicationKey: Yup.string().required('Application Key is required'),
            tenantName: Yup.string().required('Tenant Name is required'),
            tenantId: Yup.string().required('Tenant Id is required')
        });

        return (
            <>
                <Formik
                    innerRef={formikRef}
                    initialValues={initValue}
                    validationSchema={validationSchema}
                    onSubmit={async (values: SubmitValues, { setErrors, setStatus, setSubmitting }) => {
                        setIsSubmitting(true);
                        setState(values);

                        try {
                            const saveResonse = await apiObj.postData('setting/active-directory', values);

                            if (saveResonse.status === 201 && saveResonse.data.success) {
                                setStatus({ success: true });
                                setSubmitting(false);
                            }

                            setIsSubmitting(false);
                        } catch (err: any) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                            setIsSubmitting(false);
                        }
                    }}
                >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        touched,
                        values,
                        setFieldValue
                    }): JSX.Element => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Box py={1}>
                                <FormControl  {...FormControlStyled} >
                                    <FormLabel component="legend" sx={{ px: 1 }}>
                                        Application ID:
                                    </FormLabel>
                                    <TextField
                                        error={Boolean(touched.applicationId && errors.applicationId)}
                                        fullWidth
                                        helperText={touched.applicationId && errors.applicationId}
                                        name="applicationId"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.applicationId}
                                        variant='filled'
                                        inputProps={{ inputMode: 'text' }}
                                        InputProps={{ disableUnderline: true }}
                                        label='Add application Id'
                                    />
                                </FormControl>
                            </Box>

                            <Box py={1} mt={2}>
                                <FormControl  {...FormControlStyled} >
                                    <FormLabel component="legend" sx={{ px: 1 }}>
                                        Secret Key:
                                    </FormLabel>
                                    <TextField
                                        error={Boolean(touched.applicationKey && errors.applicationKey)}
                                        fullWidth
                                        helperText={touched.applicationKey && errors.applicationKey}
                                        name="applicationKey"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.applicationKey}
                                        variant='filled'
                                        inputProps={{ inputMode: 'text' }}
                                        InputProps={{ disableUnderline: true }}
                                        label='Add application key'
                                    />
                                </FormControl>
                            </Box>

                            <Box py={1} mt={2}>
                                <FormControl  {...FormControlStyled} >
                                    <FormLabel component="legend" sx={{ px: 1 }}>
                                        Tenant Name:
                                    </FormLabel>
                                    <TextField
                                        error={Boolean(touched.tenantName && errors.tenantName)}
                                        fullWidth
                                        helperText={touched.tenantName && errors.tenantName}
                                        name="tenantName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.tenantName}
                                        variant='filled'
                                        inputProps={{ inputMode: 'text' }}
                                        InputProps={{ disableUnderline: true }}
                                        label='Add Tenant name'
                                    />
                                </FormControl>
                            </Box>

                            <Box py={1} mt={2}>
                                <FormControl  {...FormControlStyled} >
                                    <FormLabel component="legend" sx={{ px: 1 }}>
                                        Tenant Id:
                                    </FormLabel>
                                    <TextField
                                        error={Boolean(touched.tenantId && errors.tenantId)}
                                        fullWidth
                                        helperText={touched.tenantId && errors.tenantId}
                                        name="tenantId"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.tenantId}
                                        variant='filled'
                                        inputProps={{ inputMode: 'text' }}
                                        InputProps={{ disableUnderline: true }}
                                        label='Add Tenant Id'
                                    />
                                </FormControl>
                            </Box>

                            <Box mt={3} sx={{ textAlign: 'right' }}>
                                <Button type='submit' variant='contained'>Submit</Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </>
        )
    }

    return (
        <>
            <LoadingScreen show={isSubmitting} />
            <SubmitForm />
        </>
    )
}

export default AzureRegisterForm;