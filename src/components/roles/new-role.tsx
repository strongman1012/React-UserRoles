import React, { FC, useState } from 'react';
import { TextField, Stack, Typography, Button, Snackbar, Alert } from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { createRole } from '../../reducers/roles/rolesSlice';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';

interface NewRoleProps {
    onClose: () => void;
}

const NewRole: FC<NewRoleProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.roles.editable);
    const [roleName, setRoleName] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoleName(e.target.value);
    };

    const validateForm = () => {
        if (!roleName) {
            setSnackbarMessage('Role Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (validateForm()) {
            try {
                await dispatch(createRole(roleName));
                setSnackbarMessage('Role created successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setRoleName(''); // Reset form data after successful save
            } catch (error: any) {
                setSnackbarMessage('Error creating role');
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
            <Typography variant="h4">New Role</Typography>
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
                label="Role Name"
                name="name"
                value={roleName}
                onChange={handleInputChange}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default NewRole;
