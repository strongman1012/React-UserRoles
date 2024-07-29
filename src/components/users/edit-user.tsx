import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, FormControlLabel, Select, SelectChangeEvent, FormControl, InputLabel, MenuItem, Switch, Grid, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, Checkbox } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchUserById, updateUserById } from '../../reducers/users/usersSlice';
import { fetchRoles } from 'src/reducers/roles/rolesSlice';
import { fetchBusinessUnits } from 'src/reducers/businessUnits/businessUnitsSlice';
import { User } from '../../reducers/users/usersAPI';

interface EditUserProps {
    userId: number;
    onClose: () => void;
}

const EditUser: FC<EditUserProps> = ({ userId, onClose }) => {
    const dispatch = useAppDispatch();
    const auth = useSelector((state: RootState) => state.auth.user);
    const user = useSelector((state: RootState) => state.users.currentUser);
    const roles = useSelector((state: RootState) => state.roles.allRoles);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);
    const [formData, setFormData] = useState<User | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [rolesModalOpen, setRolesModalOpen] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
            dispatch(fetchRoles());
            dispatch(fetchBusinessUnits());
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (user) {
            setFormData(user);
            setSelectedRoleId(user.role_id || null);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData!,
            [name]: value,
        });
    };

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData!,
            [name as string]: value,
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData!,
            status: e.target.checked,
        });
    };

    const handleSave = async () => {
        if (formData) {
            try {
                await dispatch(updateUserById(auth.role_id, userId, formData));
                setSnackbarMessage('User updated successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error: any) {
                setSnackbarMessage('Error updating user');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleManageRolesClick = () => {
        setRolesModalOpen(true);
    };

    const handleRoleChange = async (roleId: number) => {
        setSelectedRoleId(roleId);
        try {
            await dispatch(updateUserById(auth.role_id, userId, { ...formData, role_id: roleId }));
            setSnackbarMessage('User updated successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error: any) {
            setSnackbarMessage('Error updating user');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleRolesModalClose = () => {
        setRolesModalOpen(false);
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Stack spacing={3} padding={3}>
            <Typography variant="h4">Users (Form)</Typography>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="outlined" color="primary" onClick={handleManageRolesClick}>
                    Manage Roles
                </Button>
            </Stack>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Account Information</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        required
                        label="User Name"
                        name="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">User Information</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName || ''}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        required
                        label="Primary Email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Mobile Phone"
                        name="mobilePhone"
                        value={formData.mobilePhone || ''}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Main Phone"
                        name="mainPhone"
                        value={formData.mainPhone || ''}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel id="parent-select-label">Parent Business</InputLabel>
                        <Select
                            labelId="parent-select-label"
                            name="business_unit_id"
                            value={formData.business_unit_id || ''}
                            onChange={handleSelectChange}
                        >
                            {allBusinessUnits
                                .map((unit) => (
                                    <MenuItem key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
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
            <Dialog open={rolesModalOpen} onClose={handleRolesModalClose}>
                <DialogTitle>Manage User Roles</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {roles.map((role) => (
                            <FormControlLabel
                                key={role.id}
                                control={
                                    <Checkbox
                                        checked={selectedRoleId === role.id}
                                        onChange={() => handleRoleChange(role.id)}
                                    />
                                }
                                label={`${role.name}`}
                            />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRolesModalClose} color="primary">
                        OK
                    </Button>
                    <Button onClick={handleRolesModalClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default EditUser;
