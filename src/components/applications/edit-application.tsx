import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, Snackbar, Alert } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchApplicationById, updateApplicationById } from '../../reducers/applications/applicationsSlice'; // Ensure you have these actions in your applicationsSlice
import { Application } from '../../reducers/applications/applicationsAPI'; // Ensure you have Application type defined in applicationsAPI

interface EditApplicationProps {
    applicationId: number;
    onClose: () => void;
}

const EditApplication: FC<EditApplicationProps> = ({ applicationId, onClose }) => {
    const dispatch = useAppDispatch();
    const application = useSelector((state: RootState) => state.applications.currentApplication);
    const editable = useSelector((state: RootState) => state.applications.editable);

    const [formData, setFormData] = useState<Application | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (applicationId) {
            dispatch(fetchApplicationById(applicationId));
        }
    }, [dispatch, applicationId]);

    useEffect(() => {
        if (application) {
            setFormData(application);
        }
    }, [application]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData?.name) {
            setSnackbarMessage('Application Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData?.description) {
            setSnackbarMessage('Application Description is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (formData && validateForm()) {
            try {
                await dispatch(updateApplicationById(applicationId, formData));
                setSnackbarMessage('Application updated successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error: any) {
                setSnackbarMessage('Error updating application');
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
            <Typography variant="h4">Edit Application</Typography>
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
            <TextField
                fullWidth
                required
                label="Application Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
            />
            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default EditApplication;
