import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Stack, Typography, Button, FormControlLabel, Switch, Grid, Snackbar, Alert, Autocomplete, Checkbox, Chip, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup
} from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchTeamById, updateTeamById } from '../../reducers/teams/teamsSlice';
import { fetchBusinessUnits } from '../../reducers/businessUnits/businessUnitsSlice';
import { fetchUsers } from '../../reducers/users/usersSlice';
import { fetchRoles } from '../../reducers/roles/rolesSlice';
import { Team } from '../../reducers/teams/teamsAPI';
import { User } from 'src/reducers/users/usersAPI';
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
    const roles = useSelector((state: RootState) => state.roles.allRoles);
    const [formData, setFormData] = useState<Team | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [initialMembers, setInitialMembers] = useState<User[]>([]);
    const [removeMembers, setRemoveMembers] = useState<User[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [rolesModalOpen, setRolesModalOpen] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

    useEffect(() => {
        if (teamId) {
            dispatch(fetchTeamById(teamId));
            dispatch(fetchBusinessUnits());
            dispatch(fetchUsers());
            dispatch(fetchRoles());
        }
    }, [dispatch, teamId]);

    useEffect(() => {
        if (teamId && allUsers) {
            const members = allUsers.filter(user => user.team_id === teamId);
            setSelectedMembers(members);
            setInitialMembers(members);
        }
    }, [teamId, allUsers]);

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

    const handleAutocompleteChange = (event: any, value: any, field: string) => {
        setFormData((prevData) => ({
            ...prevData!,
            [field]: value?.id || null,
        }));
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
                const updatedData = {
                    ...formData,
                    ids: selectedMembers.map(member => member.id),
                    removeIds: removeMembers.map(member => member.id),
                };
                await dispatch(updateTeamById(auth.role_id, teamId, updatedData));
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

    const handleMemberChange = (event: any, value: any) => {
        setSelectedMembers(value);
        const membersToRemove = initialMembers.filter(initialMember => !value.some((newMember: User) => newMember.id === initialMember.id));
        setRemoveMembers(membersToRemove);
    };

    const handleManageRolesClick = () => {
        setRolesModalOpen(true);
    };

    const handleRoleChange = async (roleId: number) => {
        setSelectedRoleId(roleId);
        try {
            await dispatch(updateTeamById(auth.role_id, teamId, { ...formData, role_id: roleId }));
            setSnackbarMessage('Team role updated successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error: any) {
            setSnackbarMessage('Error updating team role');
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
        <Stack spacing={3} padding={3} width="100%">
            <Typography variant="h4">Edit Team</Typography>
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
                            <Autocomplete
                                options={allBusinessUnits}
                                getOptionLabel={(option) => option.name}
                                value={allBusinessUnits.find(unit => unit.id === formData.business_unit_id) || null}
                                onChange={(event, value) => handleAutocompleteChange(event, value, 'business_unit_id')}
                                renderInput={(params) => (
                                    <TextField {...params} label="Business Unit" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={allUsers}
                                getOptionLabel={(option) => option.userName}
                                value={allUsers.find(user => user.id === formData.admin_id) || null}
                                onChange={(event, value) => handleAutocompleteChange(event, value, 'admin_id')}
                                renderInput={(params) => (
                                    <TextField {...params} label="Administrator" fullWidth />
                                )}
                            />
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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Team Members</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                limitTags={3}
                                options={allUsers}
                                getOptionLabel={(option) => option.userName}
                                value={selectedMembers}
                                onChange={handleMemberChange}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip label={option.fullName ? option.fullName : option.userName} {...getTagProps({ index })} />
                                    ))
                                }
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            checked={selected}
                                            style={{ marginRight: 8 }}
                                        />
                                        {option.fullName ? option.fullName : option.userName}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField {...params} label="Search Team Members" placeholder="Add members" fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <DataGrid
                                dataSource={selectedMembers}
                                keyExpr="id"
                                columnAutoWidth={true}
                                showRowLines={true}
                                showBorders={true}
                            >
                                <SearchPanel visible={true} />
                                <Paging defaultPageSize={10} />
                                <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10]} />
                                <Column dataField="userName" caption="User Name" />
                                <Column dataField="fullName" caption="Full Name" />
                                <Column dataField="business_name" caption="Business Unit" />
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
            <Dialog open={rolesModalOpen} onClose={handleRolesModalClose}>
                <DialogTitle>Manage Team Roles</DialogTitle>
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

export default EditTeam;
