import React, { FC, useState } from 'react';
import { TextField, Stack, Typography, Button, Snackbar, Alert, Grid } from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { createDataAccess } from '../../reducers/dataAccesses/dataAccessesSlice'; // Ensure you have this action in your dataAccessesSlice
import { DataAccess } from '../../reducers/dataAccesses/dataAccessesAPI'; // Ensure you have DataAccess type defined in dataAccessesAPI
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';

interface NewDataAccessProps {
    onClose: () => void;
}

const initialFormData: Omit<DataAccess, 'id'> = {
    name: '',
    level: '',
};

const NewDataAccess: FC<NewDataAccessProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.dataAccesses.editable);
    const [formData, setFormData] = useState<Omit<DataAccess, 'id'>>(initialFormData);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        if (!formData.name) {
            setSnackbarMessage('Data Access Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData.level) {
            setSnackbarMessage('Access Level is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (validateForm()) {
            try {
                await dispatch(createDataAccess(formData));
                setSnackbarMessage('Data Access created successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setFormData(initialFormData); // Reset form data after successful save
            } catch (error: any) {
                setSnackbarMessage('Error creating data access');
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
            <Typography variant="h4">New Data Access</Typography>
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
                    <Typography variant="h6">Data Access Information</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="Data Access Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="Access Level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        type="number"
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

export default NewDataAccess;
