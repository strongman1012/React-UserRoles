import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Box, Container, Divider, Card, CardHeader, CardContent, Typography, Button, FormControlLabel, Switch, Grid,
    Autocomplete, Checkbox, Chip, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup,
    FormControlLabel as MuiFormControlLabel
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchUserById, updateUserById } from '../../../reducers/users/usersSlice';
import { fetchRoles } from '../../../reducers/roles/rolesSlice';
import { fetchBusinessUnitsList } from '../../../reducers/businessUnits/businessUnitsSlice';
import { fetchTeamsList } from '../../../reducers/teams/teamsSlice';
import { User } from '../../../reducers/users/usersAPI';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface EditUserProps {
    userId: number;
    onClose: () => void
}

const EditUser: FC<EditUserProps> = ({ userId, onClose }) => {
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.users.currentUser);
    const editable = useSelector((state: RootState) => state.users.editable);
    const roles = useSelector((state: RootState) => state.roles.allRoles);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.businessUnitsList);
    const allTeams = useSelector((state: RootState) => state.teams.teamsList);

    const [formData, setFormData] = useState<User | null>(null);
    const [rolesModalOpen, setRolesModalOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<any[]>([]);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {

        if (userId) {
            dispatch(fetchUserById(userId));
            dispatch(fetchRoles());
            dispatch(fetchBusinessUnitsList());
            dispatch(fetchTeamsList());
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (user) {
            setFormData(user);
            setSelectedRoles(user.role_ids ? user.role_ids.split(',').map(id => parseInt(id, 10)) : []);
            setSelectedTeams(user.team_ids ? user.team_ids.split(',').map(id => allTeams.find(team => team.id === parseInt(id, 10))) : []);
            setSelectedBusinessUnit(allBusinessUnits.find(unit => unit.id === user.business_unit_id) || null);
            setIsLoading(false);
        }
    }, [user, roles, allTeams, allBusinessUnits]);

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
            setConfirmTitle('User Name is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        if (!formData.fullName) {
            setConfirmTitle('Full Name is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        if (!formData.email) {
            setConfirmTitle('Primary Email is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (formData && validateForm()) {
            setIsLoading(true);
            try {
                const updatedFormData = {
                    ...formData,
                    role_ids: selectedRoles.length > 0 ? selectedRoles.join(',') : null,
                    team_ids: selectedTeams.length > 0 ? selectedTeams.map(team => team?.id).join(',') : null,
                };

                const message = await dispatch(updateUserById(userId, updatedFormData)); console.log(message, 'mesage')
                if (message) {
                    setConfirmTitle(message);
                    setConfirmDescription('');
                    setConfirmModalOpen(true);
                }
            } catch (error: any) {
                setConfirmTitle(error.message);
                setConfirmDescription('');
                setConfirmModalOpen(true);
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    const handleBusinessUnitChange = (event: any, value: any) => {
        setSelectedBusinessUnit(value);
        setFormData((prevData) => ({
            ...prevData!,
            business_unit_id: value?.id || null,
        }));
    };

    const handleTeamChange = (event: any, value: any) => {
        setSelectedTeams(value);
    };

    const handleRoleChange = (roleId: number) => {
        setSelectedRoles(prevRoles =>
            prevRoles.includes(roleId)
                ? prevRoles.filter(id => id !== roleId)
                : [...prevRoles, roleId]
        );
    };

    const handleManageRolesClick = () => {
        setRolesModalOpen(true);
    };

    const handleRolesModalClose = () => {
        setRolesModalOpen(false);
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined" sx={{ border: (theme) => `1px solid ${theme.palette.primary.main}` }}>
                    <CardHeader title="Edit User"
                        sx={{ background: (theme) => `${theme.palette.primary.main}`, color: '#f7f7f7' }}
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={editable ? false : true} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onClose} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Cancel
                                </Button>
                                <Button variant="outlined" color="primary" onClick={handleManageRolesClick} disabled={editable ? false : true} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Manage Roles
                                </Button>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
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
                                    value={formData.userName || ''}
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
                                    value={formData.email || ''}
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
                                    getOptionLabel={(option) => option.name || ''}
                                    value={selectedBusinessUnit}
                                    onChange={handleBusinessUnitChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Business Unit" fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    multiple
                                    limitTags={3}
                                    options={allTeams}
                                    getOptionLabel={(option) => option?.name || ''}
                                    value={selectedTeams}
                                    onChange={handleTeamChange}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip label={option?.name} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                checked={selected}
                                                style={{ marginRight: 8 }}
                                            />
                                            {option?.name}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Teams" placeholder="Select teams" fullWidth />
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
                    </CardContent>
                </Card>
            </Box>

            <Dialog open={rolesModalOpen} onClose={handleRolesModalClose}>
                <DialogTitle>Manage User Roles</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        {roles.map((role) => (
                            <MuiFormControlLabel
                                key={role.id}
                                control={
                                    <Checkbox
                                        checked={selectedRoles.includes(role.id)}
                                        onChange={() => handleRoleChange(role.id)}
                                    />
                                }
                                label={role.name}
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
            <AlertModal
                show={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title={confirmTitle}
                description={confirmDescription}
            />
        </Container>
    );
};

export default EditUser;
