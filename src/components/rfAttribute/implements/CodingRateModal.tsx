import React from 'react';
import { FC } from 'react';
import {
    makeStyles,
    FormHelperText,
    Theme
} from '@material-ui/core';
import { Grid, Button, Typography, TextField, Box } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogBox from '../../global/DialogBox';
import { THEMES } from '../../../utills/constatnts/general';
import { Formik } from 'formik';
import * as Yup from 'yup';

interface Props {
    codingRates: any[];
    open: boolean;
    onOpen: () => void;
    handleCreateCodingRate: (value: any) => void;
}

const customStyles = makeStyles((theme: Theme) => ({
    popup: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        width: '20vw'
    },
    text: {
        color: `${theme.palette.text.primary} !important`,
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: ' 0.05em'
    },
    select: {
        background: theme.palette.type === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        gap: '1px',
        border: '0px'
    },
    noOutline: {
        '& .MuiOutlinedInput-notchedOutline !important': {
            border: '0px'
        }
    },
    input: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
        alignItems: 'left',
        padding: '5px',
        gap: '1px',

        background: theme.palette.type === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',

        minHeight: '3vh',
        paddingLeft: '14px'
    }
}));

const CodingRateModal: FC<Props> = ({
    codingRates,
    open,
    onOpen,
    handleCreateCodingRate
}) => {
    const classes = customStyles();
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{
                    name: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(10).required('Name is required')
                        .test('uniqueName', 'Name already exists', (value) => {
                            return !codingRates.some((codingRate) => codingRate.name === value);
                        }
                        )
                })}
                onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting, resetForm }
                ) => {
                    try {
                        await handleCreateCodingRate(values);
                        setStatus({ success: true });
                        setSubmitting(true);
                        resetForm();
                        onOpen();
                    } catch (err: any) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    handleReset,
                    isSubmitting,
                    touched,
                    values
                }) => (
                    <DialogBox
                        title="New Coding Rate"
                        isOpen={open}
                        onClose={onOpen}
                    // className={classes.popup}
                    >
                        <Box sx={{ px: 4, py: 2 }}>
                            <form onSubmit={handleSubmit} onReset={handleReset}>
                                <DialogContent>
                                    <Grid
                                        container
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        spacing={2}
                                    >
                                        <Grid item md={6}>
                                            <Typography className={classes.text}>{'Name'}</Typography>
                                        </Grid>
                                        <Grid item md={6}>
                                            <TextField
                                                name="name"
                                                error={Boolean(touched.name && errors.name)}
                                                fullWidth
                                                size="small"
                                                helperText={touched.name && errors.name}
                                                type="string"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.name}
                                                InputProps={{
                                                    disableUnderline: true,
                                                    inputProps: {
                                                        className: classes.input
                                                    }
                                                }}
                                            />
                                            {errors.submit && (
                                                <Box mt={3}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        type="button"
                                        color="primary"
                                        variant="outlined"
                                        onClick={() => onOpen()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                    >
                                        Ok
                                    </Button>
                                </DialogActions>
                            </form>
                        </Box>
                    </DialogBox>
                )}
            </Formik>
        </>
    );
};

export default CodingRateModal;
