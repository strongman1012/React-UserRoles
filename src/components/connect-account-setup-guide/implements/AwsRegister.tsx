import React from 'react';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { Formik } from 'formik';
import { FormControlStyled } from '../../../utills/styles/styled';
import { AwsCredentialValues } from '../types/setupTypes';
import LoadingScreen from '../../../components/LoadingScreen';
import AlertModal from '../../../components/global/Alert';
import ServerApi from '../../../utills/serverApi';

interface SubmitValues extends AwsCredentialValues {
    submit: any
}

const initData = {
    type: 'awsCredential',
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
}

const AwsRegisterForm: FC = () => {

    const apiObj = new ServerApi();
    const formikRef = useRef<any>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [state, setState] = useState<AwsCredentialValues>(initData);
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');

    useEffect(() => {
        getSubscriptionData();
    }, []);

    /**
     * Get Credential Data
     */
    const getSubscriptionData = async () => {

        try {

            const response = await apiObj.getData('setting/aws/credential');

            if (response && response.status === 200 && response.data.success) {
                const awsCredentailValue: AwsCredentialValues = response.data.data;
                setState(awsCredentailValue);
            }

        } catch (err) {
            console.log(err);
        }
    }

    const SubmitForm = () => {

        const initValue: SubmitValues = { ...state, submit: null };

        const validationSchema = Yup.object().shape({
            accessKeyId: Yup.string().required('Account Id is required'),
            secretAccessKey: Yup.string().required('API Id is required'),
            region: Yup.string().required('Region is required')
        });

        return (
            <Formik
                innerRef={formikRef}
                initialValues={initValue}
                validationSchema={validationSchema}
                onSubmit={async (values: SubmitValues, { setErrors, setStatus, setSubmitting }) => {

                    setIsSubmitting(true);
                    setState(values);

                    try {
                        const saveResonse = await apiObj.postData('setting/aws/credential', values);

                        if (saveResonse.status === 201 && saveResonse.data.success) {
                            setStatus({ success: true });
                            setSubmitting(false);
                            setModalTitle('Form submitted successfully!');
                            setModalShow(true);
                        }

                        setIsSubmitting(false);
                    } catch (err: any) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                        setIsSubmitting(false);
                        setModalTitle('Form submitted failed!');
                        setModalShow(true);
                    }
                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                    setFieldValue
                }): JSX.Element => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Box py={1}>
                            <FormControl  {...FormControlStyled} >
                                <FormLabel component="legend" sx={{ px: 1 }}>
                                    AWS Access Key ID:
                                </FormLabel>
                                <TextField
                                    error={Boolean(touched.accessKeyId && errors.accessKeyId)}
                                    fullWidth
                                    helperText={touched.accessKeyId && errors.accessKeyId}
                                    name="accessKeyId"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.accessKeyId}
                                    variant='filled'
                                    inputProps={{ inputMode: 'text' }}
                                    InputProps={{ disableUnderline: true }}
                                    label='Add aws access key Id'
                                />
                            </FormControl>
                        </Box>

                        <Box py={1} mt={3}>
                            <FormControl  {...FormControlStyled} >
                                <FormLabel component="legend" sx={{ px: 1 }}>
                                    AWS Secret Access Key:
                                </FormLabel>
                                <TextField
                                    error={Boolean(touched.secretAccessKey && errors.secretAccessKey)}
                                    fullWidth
                                    helperText={touched.secretAccessKey && errors.secretAccessKey}
                                    name="secretAccessKey"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.secretAccessKey}
                                    variant='filled'
                                    inputProps={{ inputMode: 'text' }}
                                    InputProps={{ disableUnderline: true }}
                                    label='Add secret access key'
                                />
                            </FormControl>
                        </Box>

                        <Box py={1} mt={3}>
                            <FormControl  {...FormControlStyled} >
                                <FormLabel component="legend" sx={{ px: 1 }}>
                                    Region:
                                </FormLabel>
                                <TextField
                                    error={Boolean(touched.region && errors.region)}
                                    fullWidth
                                    helperText={touched.region && errors.region}
                                    name="region"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="text"
                                    value={values.region}
                                    variant='filled'
                                    inputProps={{ inputMode: 'text' }}
                                    InputProps={{ disableUnderline: true }}
                                    label='Add region'
                                />
                            </FormControl>
                        </Box>

                        <Box mt={3} sx={{ textAlign: 'right' }}>
                            <Button type='submit' variant='contained'>Submit</Button>
                        </Box>
                    </form>
                )}
            </Formik>
        )
    }

    return (
        <>
            <LoadingScreen show={isSubmitting} />
            <SubmitForm />

            <AlertModal
                show={modalShow}
                onClose={() => setModalShow(false)}
                title={modalTitle}
                description={''}
            />
        </>
    )
}

export default AwsRegisterForm;