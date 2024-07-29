import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, FormControlLabel, Switch, Grid, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
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
    const auth = useSelector((state: RootState) => state.auth.user);
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

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as string]: value,
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            status: e.target.checked,
        });
    };

    const handleSave = async () => {
        try {
            await dispatch(createBusinessUnit(auth.role_id, formData));
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

    return (
        <Stack spacing={3} padding={3}>
            <Typography variant="h4">New Business Unit</Typography>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="parent-select-label">Parent Business</InputLabel>
                                <Select
                                    labelId="parent-select-label"
                                    name="parent_id"
                                    value={formData.parent_id || ''}
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {allBusinessUnits.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                                label="Email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
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
