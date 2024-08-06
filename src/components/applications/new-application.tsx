import React, { FC, useState } from 'react';
import { TextField, Stack, Typography, Button, Snackbar, Alert } from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { createApplication } from '../../reducers/applications/applicationsSlice'; // Ensure you have this action in your applicationsSlice
import { Application } from '../../reducers/applications/applicationsAPI'; // Ensure you have Application type defined in applicationsAPI
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';

interface NewApplicationProps {
    onClose: () => void;
}

const NewApplication: FC<NewApplicationProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.applications.editable);
    const [formData, setFormData] = useState<Application>({
        id: 0, // Assuming id will be set by backend
        name: '',
        description: '',
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.name) {
            setSnackbarMessage('Application Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (validateForm()) {
            try {
                await dispatch(createApplication(formData));
                setSnackbarMessage('Application created successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setFormData({ id: 0, name: '', description: '' }); // Reset form data after successful save
            } catch (error: any) {
                setSnackbarMessage('Error creating application');
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
            <Typography variant="h4">New Application</Typography>
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
                rows={4} // Set the number of rows for the multiline text field
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default NewApplication;
