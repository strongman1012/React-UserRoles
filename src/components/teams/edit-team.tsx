import React, { FC, useEffect, useState } from 'react';
import { TextField, Stack, Typography, Button, FormControlLabel, Switch, Grid, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchTeamById, updateTeamById } from '../../reducers/teams/teamsSlice';
import { fetchBusinessUnits } from '../../reducers/businessUnits/businessUnitsSlice';
import { fetchUsers } from '../../reducers/users/usersSlice';
import { Team } from '../../reducers/teams/teamsAPI';
import { DataGrid, Column, SearchPanel, Paging, Pager } from 'devextreme-react/data-grid';

interface EditTeamProps {
    teamId: number;
    onClose: () => void;
}

const EditTeam: FC<EditTeamProps> = ({ teamId, onClose }) => {
    const dispatch = useAppDispatch();
    const auth = useSelector((state: RootState) => state.auth.user);
    const team = useSelector((state: RootState) => state.teams.currentTeam);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);
    const allUsers = useSelector((state: RootState) => state.users.allUsers);
    const [formData, setFormData] = useState<Team | null>(null);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (teamId) {
            dispatch(fetchTeamById(teamId));
            dispatch(fetchBusinessUnits());
            dispatch(fetchUsers());
        }
    }, [dispatch, teamId]);

    useEffect(() => {
        if (team) {
            setFormData(team);
        }
    }, [team]);

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

    const handleIsDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData!,
            is_default: e.target.checked,
        });
    };

    const handleSave = async () => {
        if (formData) {
            try {
                await dispatch(updateTeamById(auth.role_id, teamId, formData));
                setSnackbarMessage('Team updated successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error: any) {
                setSnackbarMessage('Error updating team');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleAddMember = () => {
        if (selectedUser !== null) {
            const user = allUsers.find(user => user.id === selectedUser);
            if (user) {
                setTeamMembers([...teamMembers, user]);
                setSelectedUser(null);
            }
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Stack spacing={3} padding={3}>
            <Typography variant="h4">Edit Team</Typography>
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
                    <Typography variant="h6">General</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Team Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="admin-select-label">Administrator</InputLabel>
                                <Select
                                    labelId="admin-select-label"
                                    name="admin_id"
                                    value={formData.admin_id}
                                    onChange={handleSelectChange}
                                >
                                    {allUsers.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.userName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.is_default}
                                        onChange={handleIsDefaultChange}
                                        name="is_default"
                                    />
                                }
                                label="Is Default"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Team Members</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Select
                                    labelId="add-member-select-label"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value as number)}
                                >
                                    {allUsers.map(user => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.userName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={handleAddMember} style={{ marginTop: 16 }}>
                                Add Member
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <DataGrid
                                dataSource={teamMembers}
                                keyExpr="id"
                                columnAutoWidth={true}
                                showRowLines={true}
                                showBorders={true}
                            >
                                <SearchPanel visible={true} />
                                <Paging defaultPageSize={5} />
                                <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} />
                                <Column dataField="fullName" caption="Full Name" />
                                <Column dataField="businessUnitName" caption="Business Unit" />
                            </DataGrid>
                        </Grid>
                    </Grid>
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

export default EditTeam;
