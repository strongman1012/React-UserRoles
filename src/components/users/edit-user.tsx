import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, FormControlLabel, Switch, Grid, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, Checkbox, Autocomplete } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchUserById, updateUserById } from '../../reducers/users/usersSlice';
import { fetchRoles } from 'src/reducers/roles/rolesSlice';
import { fetchBusinessUnits } from 'src/reducers/businessUnits/businessUnitsSlice';
import { fetchTeams } from 'src/reducers/teams/teamsSlice';
import { User } from '../../reducers/users/usersAPI';

interface EditUserProps {
    userId: number;
    onClose: () => void;
}

const EditUser: FC<EditUserProps> = ({ userId, onClose }) => {
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.users.currentUser);
    const editable = useSelector((state: RootState) => state.users.editable);
    const roles = useSelector((state: RootState) => state.roles.allRoles);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);
    const allTeams = useSelector((state: RootState) => state.teams.allTeams);

    const [formData, setFormData] = useState<User | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [rolesModalOpen, setRolesModalOpen] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<any | null>(null);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
            dispatch(fetchRoles());
            dispatch(fetchBusinessUnits());
            dispatch(fetchTeams());
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (user) {
            setFormData(user);
            setSelectedRoleId(user.role_id || null);
            setSelectedTeam(allTeams.find(team => team.id === user.team_id) || null);
            setSelectedBusinessUnit(allBusinessUnits.find(unit => unit.id === user.business_unit_id) || null);
        }
    }, [user, allTeams, allBusinessUnits]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData!,
            status: e.target.checked,
        }));
    };

    const validateForm = () => {
        if (!formData?.userName) {
            setSnackbarMessage('User Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData.fullName) {
            setSnackbarMessage('Full Name is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        if (!formData.email) {
            setSnackbarMessage('Primary Email is required');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (formData && validateForm()) {
            try {
                await dispatch(updateUserById(userId, formData));
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
            await dispatch(updateUserById(userId, { ...formData, role_id: roleId }));
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

    const handleBusinessUnitChange = (event: any, value: any) => {
        setSelectedBusinessUnit(value);
        setFormData((prevData) => ({
            ...prevData!,
            business_unit_id: value?.id || null,
        }));
    };

    const handleTeamChange = (event: any, value: any) => {
        setSelectedTeam(value);
        setFormData((prevData) => ({
            ...prevData!,
            team_id: value?.id || null,
        }));
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Stack spacing={3} padding={3} width="100%">
            <Typography variant="h4">Users Form</Typography>
            <Stack direction="row" spacing={2}>
                {editable && (
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                )}
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                {editable && (
                    <Button variant="outlined" color="primary" onClick={handleManageRolesClick}>
                        Manage Roles
                    </Button>
                )}
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
                    <Autocomplete
                        options={allBusinessUnits}
                        getOptionLabel={(option) => option.name}
                        value={selectedBusinessUnit}
                        onChange={handleBusinessUnitChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Business Unit" fullWidth />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Autocomplete
                        options={allTeams}
                        getOptionLabel={(option) => option.name}
                        value={selectedTeam}
                        onChange={handleTeamChange}
                        renderInput={(params) => (
                            <TextField {...params} label="Team" fullWidth />
                        )}
                    />
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
