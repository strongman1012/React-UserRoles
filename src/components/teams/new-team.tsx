import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Stack, Typography, Button, FormControlLabel, Switch, Grid, Snackbar, Alert, Autocomplete, Checkbox, Chip
} from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchBusinessUnits } from '../../reducers/businessUnits/businessUnitsSlice';
import { fetchUsers } from '../../reducers/users/usersSlice';
import { fetchAreaAccessLevel } from '../../reducers/roles/rolesSlice';
import { createTeam } from '../../reducers/teams/teamsSlice';
import { Team } from '../../reducers/teams/teamsAPI';
import { User } from '../../reducers/users/usersAPI';
import { DataGrid, Column, SearchPanel, Paging, Pager } from 'devextreme-react/data-grid';

interface NewTeamProps {
    onClose: () => void;
}

const NewTeam: FC<NewTeamProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const auth = useSelector((state: RootState) => state.auth.user);
    const userAccessLevel = useSelector((state: RootState) => state.roles.getAreaAccessLevel);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);
    const allUsers = useSelector((state: RootState) => state.users.allUsers);

    const initialFormData: Omit<Team, 'id'> = {
        name: '',
        description: '',
        business_unit_id: null,
        admin_id: null,
        is_default: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        dispatch(fetchBusinessUnits());
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (auth) {
            dispatch(fetchAreaAccessLevel(auth.role_id, "Teams"));
        }
    }, [dispatch, auth]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
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
            ...formData,
            is_default: e.target.checked,
        });
    };

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};
        if (!formData.name) tempErrors.name = "Team name is required";
        if (!formData.business_unit_id) tempErrors.business_unit_id = "Business unit is required";
        if (!formData.admin_id) tempErrors.admin_id = "Administrator is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setSnackbarMessage('Please fill in the required fields');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const newTeamData = {
                ...formData,
                ids: selectedMembers.map(member => member.id),
            };
            await dispatch(createTeam(auth.role_id, newTeamData));
            setSnackbarMessage('Team created successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setFormData(initialFormData); // Reset form data after successful save
            setSelectedMembers([]);
        } catch (error: any) {
            setSnackbarMessage('Error creating team');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleMemberChange = (event: any, value: any) => {
        setSelectedMembers(value);
    };

    return (
        <Stack spacing={3} padding={3} width="100%">
            <Typography variant="h4">New Team</Typography>
            <Stack direction="row" spacing={2}>
                {userAccessLevel !== 5 && (
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
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={allBusinessUnits}
                                getOptionLabel={(option) => option.name}
                                value={allBusinessUnits.find(unit => unit.id === formData.business_unit_id) || null}
                                onChange={(event, value) => handleAutocompleteChange(event, value, 'business_unit_id')}
                                renderInput={(params) => (
                                    <TextField {...params} label="Business Unit" fullWidth error={!!errors.business_unit_id} helperText={errors.business_unit_id} />
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
                                    <TextField {...params} label="Administrator" fullWidth error={!!errors.admin_id} helperText={errors.admin_id} />
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
        </Stack>
    );
};

export default NewTeam;
