import React, { FC, useEffect, useState, useMemo } from 'react';
import {
    TextField, Typography, Button, FormControlLabel, Switch, Grid, Autocomplete,
    Checkbox, Chip, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, FormControlLabel as MuiFormControlLabel,
    Container, Box, Divider, Card, CardHeader, CardContent, Tabs, Tab
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchTeamById, updateTeamById } from '../../../reducers/teams/teamsSlice';
import { fetchBusinessUnitsList } from '../../../reducers/businessUnits/businessUnitsSlice';
import { fetchUsersList } from '../../../reducers/users/usersSlice';
import { fetchRoles } from '../../../reducers/roles/rolesSlice';
import { Team } from '../../../reducers/teams/teamsAPI';
import { User } from 'src/reducers/users/usersAPI';
import { DataGrid, Column, SearchPanel, Paging, Pager, FilterRow } from 'devextreme-react/data-grid';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface EditTeamProps {
    teamId: number;
    onClose: () => void;
}

const EditTeam: FC<EditTeamProps> = ({ teamId, onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.teams.editable);
    const team = useSelector((state: RootState) => state.teams.currentTeam);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.businessUnitsList);
    const allUsers = useSelector((state: RootState) => state.users.usersList);
    const roles = useSelector((state: RootState) => state.roles.allRoles);
    const setting = useSelector((state: RootState) => state.settings.setting);

    const [formData, setFormData] = useState<Team | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [initialMembers, setInitialMembers] = useState<User[]>([]);
    const [removeMembers, setRemoveMembers] = useState<User[]>([]);
    const [rolesModalOpen, setRolesModalOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');
    const [tabValue, setTabValue] = useState<number>(0);

    useEffect(() => {

        if (teamId) {
            dispatch(fetchTeamById(teamId));
            dispatch(fetchBusinessUnitsList());
            dispatch(fetchUsersList());
            dispatch(fetchRoles());
        }
    }, [dispatch, teamId]);

    useEffect(() => {
        if (teamId && allUsers && team) {
            const members = allUsers.filter(user =>
                user.team_ids ? user.team_ids.split(',').includes(String(teamId)) : false
            );
            setSelectedMembers(members);
            setInitialMembers(members);
            setFormData(team);
            setSelectedRoles(team.role_ids ? team.role_ids.split(',').map(id => parseInt(id, 10)) : []);
            setIsLoading(false);
        }
    }, [teamId, allUsers, team]);

    // Memoizing defaultPageSize based on the setting
    const defaultPageSize = useMemo(() => {
        return setting?.rowsPerPage ? setting.rowsPerPage : 20;
    }, [setting]);

    // Memoizing allowedPageSizes based on defaultPageSize
    const allowedPageSizes = useMemo(() => {
        return [defaultPageSize, 2 * defaultPageSize, 3 * defaultPageSize];
    }, [defaultPageSize]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const handleAutocompleteChange = (event: any, value: any, field: string) => {
        setFormData((prevData) => ({
            ...prevData!,
            [field]: value?.id || null,
        }));
    };

    const handleIsDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData!,
            is_default: e.target.checked,
        }));
    };

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};
        if (!formData?.name) tempErrors.name = "Team name is required";
        if (!formData?.business_unit_id) tempErrors.business_unit_id = "Business unit is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (formData && validateForm()) {
            setIsLoading(true);
            try {
                const updatedData = {
                    ...formData,
                    ids: selectedMembers.map(member => member.id),
                    removeIds: removeMembers.map(member => member.id),
                    role_ids: selectedRoles.length > 0 ? selectedRoles.join(',') : null,
                };
                const message = await dispatch(updateTeamById(teamId, updatedData));
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

    const handleMemberChange = (event: any, value: any) => {
        setSelectedMembers(value);
        const membersToRemove = initialMembers.filter(initialMember => !value.some((newMember: User) => newMember.id === initialMember.id));
        setRemoveMembers(membersToRemove);
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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Edit Team"
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={editable ? false : true} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onClose} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Cancel
                                </Button>
                                <Button variant="outlined" color="primary" onClick={handleManageRolesClick} disabled={editable ? false : true} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Manage Roles
                                </Button>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="General" value={0} />
                                <Tab label="Members" value={1} />
                            </Tabs>
                        </Box>
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Team Name"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={allBusinessUnits}
                                        getOptionLabel={(option) => option.name || ''}
                                        value={allBusinessUnits.find(unit => unit.id === formData.business_unit_id) || null}
                                        onChange={(event, value) => handleAutocompleteChange(event, value, 'business_unit_id')}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Business Unit" fullWidth error={!!errors.business_unit_id} helperText={errors.business_unit_id} />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={formData.description || ''}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.is_default || false}
                                                onChange={handleIsDefaultChange}
                                                name="is_default"
                                            />
                                        }
                                        label="Is Default"
                                    />
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Team Members</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        limitTags={3}
                                        options={allUsers}
                                        getOptionLabel={(option) => option.userName || ''}
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
                                    {setting && defaultPageSize && allowedPageSizes && (<DataGrid
                                        dataSource={selectedMembers}
                                        key={defaultPageSize}
                                        keyExpr="id"
                                        columnAutoWidth={true}
                                        showRowLines={true}
                                        showBorders={true}
                                        allowColumnResizing={true}
                                        rowAlternationEnabled={true}
                                    >
                                        <FilterRow visible={true} />
                                        <SearchPanel visible={true} />
                                        <Paging defaultPageSize={defaultPageSize} />
                                        <Pager showPageSizeSelector={true} allowedPageSizes={allowedPageSizes} />
                                        <Column dataField="userName" caption="User Name" />
                                        <Column dataField="fullName" caption="Full Name" />
                                        <Column dataField="business_name" caption="Business Unit" />
                                    </DataGrid>)}
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </CardContent>
                </Card>
            </Box>

            <Dialog open={rolesModalOpen} onClose={handleRolesModalClose}>
                <DialogTitle sx={{ width: '475px', background: (theme) => `${theme.palette.primary.main}`, color: '#f7f7f7', height: '45px' }}>Manage Team Roles</DialogTitle>
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
                    <Button onClick={handleRolesModalClose} variant="contained" sx={{ '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}>
                        OK
                    </Button>
                    <Button onClick={handleRolesModalClose} variant="contained" sx={{ '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}>
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

export default EditTeam;

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}