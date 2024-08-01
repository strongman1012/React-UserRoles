import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, FormControlLabel, Switch, Grid, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { createUser } from '../../reducers/users/usersSlice';
import { fetchBusinessUnits } from '../../reducers/businessUnits/businessUnitsSlice';
import { fetchTeams } from '../../reducers/teams/teamsSlice';
import { User } from '../../reducers/users/usersAPI';

const initialFormData: Omit<User, 'id'> = {
    userName: '',
    email: '',
    password: '',
    fullName: '',
    mobilePhone: '',
    mainPhone: '',
    status: false,
    role_id: 0,
    business_unit_id: 0,
    team_id: 0,
};

const NewUser: FC<{ onClose: () => void }> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const auth = useSelector((state: RootState) => state.auth.user);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);
    const allTeams = useSelector((state: RootState) => state.teams.allTeams);

    const [formData, setFormData] = useState<Omit<User, 'id'>>(initialFormData);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        dispatch(fetchBusinessUnits());
        dispatch(fetchTeams());
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
            await dispatch(createUser(auth.role_id, formData));
            setSnackbarMessage('User created successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setFormData(initialFormData); // Reset form data after successful save
        } catch (error: any) {
            setSnackbarMessage('Error creating user');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Stack spacing={3} padding={3}>
            <Typography variant="h4">New User</Typography>
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
                        <InputLabel id="business-unit-select-label">Business Unit</InputLabel>
                        <Select
                            labelId="business-unit-select-label"
                            name="business_unit_id"
                            value={formData.business_unit_id}
                            onChange={handleSelectChange}
                        >
                            {allBusinessUnits.map((unit) => (
                                <MenuItem key={unit.id} value={unit.id}>
                                    {unit.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel id="team-select-label">Team</InputLabel>
                        <Select
                            labelId="team-select-label"
                            name="team_id"
                            value={formData.team_id}
                            onChange={handleSelectChange}
                        >
                            {allTeams.map((team) => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.status}
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

export default NewUser;
