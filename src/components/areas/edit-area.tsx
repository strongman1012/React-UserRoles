import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, Snackbar, Alert, Grid, Autocomplete } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchAreaById, updateAreaById } from '../../reducers/areas/areasSlice'; // Ensure you have these actions in your areasSlice
import { fetchApplications } from '../../reducers/applications/applicationsSlice'; // Ensure you have this action in your applicationsSlice
import { Area } from '../../reducers/areas/areasAPI'; // Ensure you have Area type defined in areasAPI
import { Application } from '../../reducers/applications/applicationsAPI'; // Ensure you have Application type defined in applicationsAPI

interface EditAreaProps {
    areaId: number;
    onClose: () => void;
}

const EditArea: FC<EditAreaProps> = ({ areaId, onClose }) => {
    const dispatch = useAppDispatch();
    const area = useSelector((state: RootState) => state.areas.currentArea);
    const applications = useSelector((state: RootState) => state.applications.allApplications);
    const editable = useSelector((state: RootState) => state.areas.editable);

    const [formData, setFormData] = useState<Area | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    useEffect(() => {
        if (areaId) {
            dispatch(fetchAreaById(areaId));
        }
        dispatch(fetchApplications());
    }, [dispatch, areaId]);

    useEffect(() => {
        if (area) {
            setFormData(area);
            setSelectedApplication(applications.find(app => app.id === area.application_id) || null);
        }
    }, [area, applications]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const handleApplicationChange = (event: any, value: Application | null) => {
        setSelectedApplication(value);
        setFormData((prevData) => ({
            ...prevData!,
            application_id: value?.id || 0,
            application_name: value?.name || '',
        }));
    };

    const validateForm = () => {
        if (!formData?.name) {
            setSnackbarMessage('Area Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData?.description) {
            setSnackbarMessage('Area Description is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData?.application_id) {
            setSnackbarMessage('Application is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (formData && validateForm()) {
            try {
                await dispatch(updateAreaById(areaId, formData));
                setSnackbarMessage('Area updated successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error: any) {
                setSnackbarMessage('Error updating area');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Stack spacing={3} padding={3} width="100%">
            <Typography variant="h4">Edit Area</Typography>
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

export default EditArea;
