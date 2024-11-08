import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Typography, Button, FormControlLabel, Switch, Grid, Autocomplete, Checkbox, Chip,
    Container, Box, Card, CardHeader, CardContent, Divider
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { createUser } from '../../../reducers/users/usersSlice';
import { fetchBusinessUnitsList } from '../../../reducers/businessUnits/businessUnitsSlice';
import { fetchTeamsList } from '../../../reducers/teams/teamsSlice';
import { User } from '../../../reducers/users/usersAPI';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

const initialFormData: Omit<User, 'id'> = {
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobilePhone: '',
    mainPhone: '',
    organization: '',
    organization_website: '',
    status: false,
    role_ids: '5', // default user
    business_unit_id: null,
    team_ids: null,
};

const NewUser: FC<{ onClose: () => void }> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.users.editable);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.businessUnitsList);
    const allTeams = useSelector((state: RootState) => state.teams.teamsList);

    const [formData, setFormData] = useState<Omit<User, 'id'>>(initialFormData);
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<any | null>(null);
    const [selectedTeams, setSelectedTeams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {
        dispatch(fetchBusinessUnitsList());
        dispatch(fetchTeamsList());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            status: e.target.checked,
        });
    };

    const validateForm = () => {
        if (!formData.userName) {
            setConfirmTitle('User Name is required');
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
        if (validateForm()) {
            setIsLoading(true);
            try {
                const updatedFormData = {
                    ...formData,
                    team_ids: selectedTeams.length > 0 ? selectedTeams.map(team => team.id).join(',') : null,
                };

                const message = await dispatch(createUser(updatedFormData));
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
                setFormData(initialFormData); // Reset form data after successful save
                setSelectedBusinessUnit(null);
                setSelectedTeams([]); // Reset selected teams
            }
        }
    };

    const handleBusinessUnitChange = (event: any, value: any) => {
        setSelectedBusinessUnit(value);
        setFormData((prevData) => ({
            ...prevData,
            business_unit_id: value?.id || null,
        }));
    };

    const handleTeamChange = (event: any, value: any) => {
        setSelectedTeams(value);
    };

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="New User"
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={!editable?.create} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onClose} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Cancel
                                </Button>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2} alignItems={'center'}>
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
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName || ''}
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
                                <TextField
                                    fullWidth
                                    label="Organization"
                                    name="organization"
                                    value={formData.organization || ''}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Organization Website"
                                    name="organization_website"
                                    value={formData.organization_website || ''}
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
                                        <TextField {...params} label="Organizational Unit" fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    multiple
                                    limitTags={3}
                                    options={allTeams}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedTeams}
                                    onChange={handleTeamChange}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip label={option.name} {...getTagProps({ index })} />
                                        ))
                                    }
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                checked={selected}
                                                style={{ marginRight: 8 }}
                                            />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Teams" placeholder="Select teams" fullWidth />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
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
                    </CardContent>
                </Card>
            </Box>
            <AlertModal
                show={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title={confirmTitle}
                description={confirmDescription}
            />
        </Container>
    );
};

export default NewUser;
