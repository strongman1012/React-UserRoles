import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, Snackbar, Alert, Grid, Autocomplete } from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchApplications } from '../../reducers/applications/applicationsSlice'; // Ensure you have this action in your applicationsSlice
import { createArea } from '../../reducers/areas/areasSlice'; // Ensure you have this action in your areasSlice
import { RootState } from '../../store/store';
import { Application } from '../../reducers/applications/applicationsAPI'; // Ensure you have Application type defined in applicationsAPI

interface NewAreaProps {
    onClose: () => void;
}

const NewArea: FC<NewAreaProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const applications = useSelector((state: RootState) => state.applications.allApplications);
    const editable = useSelector((state: RootState) => state.areas.editable);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        application_id: 0,
        application_name: '',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    useEffect(() => {
        dispatch(fetchApplications());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleApplicationChange = (event: any, value: Application | null) => {
        setSelectedApplication(value);
        setFormData((prevData) => ({
            ...prevData,
            application_id: value?.id || 0,
            application_name: value?.name || '',
        }));
    };

    const validateForm = () => {
        if (!formData.name) {
            setSnackbarMessage('Area Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData.description) {
            setSnackbarMessage('Description is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData.application_id) {
            setSnackbarMessage('Application is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (validateForm()) {
            try {
                await dispatch(createArea(formData));
                setSnackbarMessage('Area created successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setFormData({ name: '', description: '', application_id: 0, application_name: '' }); // Reset form data after successful save
                setSelectedApplication(null); // Reset selected application
            } catch (error: any) {
                setSnackbarMessage('Error creating area');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Stack spacing={3} padding={3} width="100%">
            <Typography variant="h4">New Area</Typography>
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
                    <Typography variant="h6">Area Information</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="Area Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        options={applications}
                        getOptionLabel={(option) => option.name}
                        value={selectedApplication}
                        onChange={handleApplicationChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Application" fullWidth required />
                        )}
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

export default NewArea;
