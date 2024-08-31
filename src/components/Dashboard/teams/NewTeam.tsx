import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Typography, Button, FormControlLabel, Switch, Grid, Autocomplete, Checkbox, Chip,
    Container, Box, Card, CardHeader, CardContent, Divider, Tabs, Tab
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchBusinessUnitsList } from '../../../reducers/businessUnits/businessUnitsSlice';
import { fetchUsersList } from '../../../reducers/users/usersSlice';
import { createTeam } from '../../../reducers/teams/teamsSlice';
import { Team } from '../../../reducers/teams/teamsAPI';
import { User } from '../../../reducers/users/usersAPI';
import { DataGrid, Column, SearchPanel, Paging, Pager } from 'devextreme-react/data-grid';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface NewTeamProps {
    onClose: () => void;
}

const NewTeam: FC<NewTeamProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.teams.editable);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.businessUnitsList);
    const allUsers = useSelector((state: RootState) => state.users.usersList);

    const initialFormData: Omit<Team, 'id'> = {
        name: '',
        description: '',
        business_unit_id: null,
        admin_id: null,
        is_default: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');
    const [tabValue, setTabValue] = useState<number>(0);

    useEffect(() => {
        dispatch(fetchBusinessUnitsList());
        dispatch(fetchUsersList());
    }, [dispatch]);

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
        if (validateForm()) {
            setIsLoading(true);
            try {
                const newTeamData = {
                    ...formData,
                    ids: selectedMembers.map(member => member.id),
                };
                const message = await dispatch(createTeam(newTeamData));
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
                setSelectedMembers([]);
            }
        }
    };

    const handleMemberChange = (event: any, value: any) => {
        setSelectedMembers(value);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (

        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="New Team"
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={editable ? false : true} sx={{ mr: 2 }}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onClose}>
                                    Cancel
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
                        </TabPanel>
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

export default NewTeam;

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
