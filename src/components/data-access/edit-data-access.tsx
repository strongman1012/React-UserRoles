import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, Snackbar, Alert, Grid } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchDataAccessById, updateDataAccessById } from '../../reducers/dataAccesses/dataAccessesSlice'; // Ensure you have these actions in your dataAccessesSlice
import { DataAccess } from '../../reducers/dataAccesses/dataAccessesAPI'; // Ensure you have DataAccess type defined in dataAccessesAPI

interface EditDataAccessProps {
    dataAccessId: number;
    onClose: () => void;
}

const EditDataAccess: FC<EditDataAccessProps> = ({ dataAccessId, onClose }) => {
    const dispatch = useAppDispatch();
    const dataAccess = useSelector((state: RootState) => state.dataAccesses.currentDataAccess);
    const editable = useSelector((state: RootState) => state.dataAccesses.editable);

    const [formData, setFormData] = useState<DataAccess | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (dataAccessId) {
            dispatch(fetchDataAccessById(dataAccessId));
        }
    }, [dispatch, dataAccessId]);

    useEffect(() => {
        if (dataAccess) {
            setFormData(dataAccess);
        }
    }, [dataAccess]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData?.name) {
            setSnackbarMessage('Data Access Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData?.level) {
            setSnackbarMessage('Access Level is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (formData && validateForm()) {
            try {
                await dispatch(updateDataAccessById(dataAccessId, formData));
                setSnackbarMessage('Data Access updated successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error: any) {
                setSnackbarMessage('Error updating data access');
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
            <Typography variant="h4">Edit Data Access</Typography>
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

export default EditDataAccess;
