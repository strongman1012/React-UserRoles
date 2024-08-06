import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, FormControlLabel, Switch, Grid, Snackbar, Alert, Autocomplete } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchBusinessUnits, createBusinessUnit } from '../../reducers/businessUnits/businessUnitsSlice';
import { BusinessUnit } from '../../reducers/businessUnits/businessUnitsAPI';

interface NewBusinessUnitProps {
    onClose: () => void;
}

const NewBusinessUnit: FC<NewBusinessUnitProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.businessUnits.editable);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);

    const initialFormData: Omit<BusinessUnit, 'id'> = {
        name: '',
        parent_id: null,
        website: '',
        mainPhone: '',
        otherPhone: '',
        fax: '',
        email: '',
        street1: '',
        street2: '',
        street3: '',
        city: '',
        state: '',
        zipCode: '',
        region: '',
        status: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [selectedParentBusinessUnit, setSelectedParentBusinessUnit] = useState<any | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        dispatch(fetchBusinessUnits());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            status: e.target.checked,
        });
    };

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setSnackbarMessage('Please fill in the required fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        try {
            await dispatch(createBusinessUnit(formData));
            setSnackbarMessage('Business Unit created successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setFormData(initialFormData); // Reset form data after successful save
        } catch (error: any) {
            setSnackbarMessage('Error creating Business Unit');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleParentBusinessUnitChange = (event: any, value: any) => {
        setSelectedParentBusinessUnit(value);
        setFormData((prevData) => ({
            ...prevData,
            parent_id: value?.id || null,
        }));
    };

    return (
        <Stack spacing={3} padding={3} width="100%">
            <Typography variant="h4">New Business Unit</Typography>
            <Stack direction="row" spacing={2}>
                {editable && (
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                )}
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Stack>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Business Unit Information</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={allBusinessUnits}
                                getOptionLabel={(option) => option.name}
                                value={selectedParentBusinessUnit}
                                onChange={handleParentBusinessUnitChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Parent Business" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Website"
                                name="website"
                                value={formData.website || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Main Phone"
                                name="mainPhone"
                                value={formData.mainPhone || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Other Phone"
                                name="otherPhone"
                                value={formData.otherPhone || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fax"
                                name="fax"
                                value={formData.fax || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Addresses</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Street 1"
                                name="street1"
                                value={formData.street1 || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Street 2"
                                name="street2"
                                value={formData.street2 || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Street 3"
                                name="street3"
                                value={formData.street3 || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="State/Province"
                                name="state"
                                value={formData.state || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Zip/Postal Code"
                                name="zipCode"
                                value={formData.zipCode || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Country/Region"
                                name="region"
                                value={formData.region || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.status || false}
                                onChange={handleStatusChange}
                                name="status"
                            />
                        }
                        label="Status"
                    />
                </Grid>
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default NewBusinessUnit;
