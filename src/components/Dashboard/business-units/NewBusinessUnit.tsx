import React, { FC, useEffect, useState, useMemo } from 'react';
import {
    TextField, Typography, Button, Grid, Autocomplete,
    Container, Box, Divider, Card, CardHeader, CardContent, Tabs, Tab
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchBusinessUnitsList, createBusinessUnit } from '../../../reducers/businessUnits/businessUnitsSlice';
import { BusinessUnit } from '../../../reducers/businessUnits/businessUnitsAPI';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';
import { fetchUsersList } from 'src/reducers/users/usersSlice';
import { fetchTeamsList } from 'src/reducers/teams/teamsSlice';
import { DataGrid, Column, SearchPanel, Paging, Pager, FilterRow } from 'devextreme-react/data-grid';

interface NewBusinessUnitProps {
    onClose: () => void;
}

const NewBusinessUnit: FC<NewBusinessUnitProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.businessUnits.editable);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.businessUnitsList);
    const allUsers = useSelector((state: RootState) => state.users.usersList);
    const teams = useSelector((state: RootState) => state.teams.teamsList);
    const setting = useSelector((state: RootState) => state.settings.setting);

    const initialFormData: Omit<BusinessUnit, 'id'> = {
        name: '',
        parent_id: null,
        admin_id: null,
        website: '',
        mainPhone: '',
        otherPhone: '',
        fax: '',
        email: '',
        street1: '',
        street2: '',
        street3: '',
        city: '',
        state: '',
        zipCode: '',
        region: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedParentBusinessUnit, setSelectedParentBusinessUnit] = useState<any | null>(null);
    const [selectedAdministrator, setSelectedAdministrator] = useState<any | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');
    const [tabValue, setTabValue] = useState<number>(0);

    useEffect(() => {
        dispatch(fetchBusinessUnitsList());
        dispatch(fetchTeamsList());
        dispatch(fetchUsersList());
    }, [dispatch]);

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
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        if (!formData?.parent_id) tempErrors.parent_id = "Parent Organization is required";
        if (!formData?.admin_id) tempErrors.admin_id = "Administrator is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                const message = await dispatch(createBusinessUnit(formData));
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
                setFormData(initialFormData);
                setSelectedParentBusinessUnit(null);
                setSelectedAdministrator(null);
                setIsLoading(false);
            }
        }
    };

    const handleAdministratorChange = (event: any, value: any) => {
        setSelectedAdministrator(value);
        setFormData((prevData) => ({
            ...prevData!,
            admin_id: value?.id || null,
        }));
    };

    const handleParentBusinessUnitChange = (event: any, value: any) => {
        setSelectedParentBusinessUnit(value);
        setFormData((prevData) => ({
            ...prevData,
            parent_id: value?.id || null,
        }));
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getTeamNames = (teamIds: string) => {
        if (!teamIds) return '';
        const ids = teamIds.split(',').map(id => parseInt(id, 10));
        return ids.map(id => teams.find(team => team.id === id)?.name).filter(name => name).join(', ');
    };

    const memorizedDataGrid = useMemo(() => (
        <DataGrid
            dataSource={[]}
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
            <Column
                dataField='team_ids'
                caption='Teams'
                cellRender={(cellData) => getTeamNames(cellData.value)}
            />
        </DataGrid>
    ), [defaultPageSize, allowedPageSizes]);

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="New Organizational Unit"
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={!editable?.create} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onClose} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}>
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
                                    <Typography variant="h6">Organizational Unit Information</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Name"
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
                                                value={selectedParentBusinessUnit}
                                                onChange={handleParentBusinessUnitChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Parent Organization" fullWidth error={!!errors.parent_id} helperText={errors.parent_id} />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Autocomplete
                                                options={allUsers}
                                                getOptionLabel={(option) => option.userName}
                                                value={selectedAdministrator}
                                                onChange={handleAdministratorChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Administrator" fullWidth error={!!errors.admin_id} helperText={errors.admin_id} />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Website"
                                                name="website"
                                                value={formData.website || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Main Phone"
                                                name="mainPhone"
                                                value={formData.mainPhone || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Other Phone"
                                                name="otherPhone"
                                                value={formData.otherPhone || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Fax"
                                                name="fax"
                                                value={formData.fax || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                required
                                                label="Email"
                                                name="email"
                                                value={formData.email || ''}
                                                onChange={handleInputChange}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Addresses</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Street 1"
                                                name="street1"
                                                value={formData.street1 || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Street 2"
                                                name="street2"
                                                value={formData.street2 || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Street 3"
                                                name="street3"
                                                value={formData.street3 || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                name="city"
                                                value={formData.city || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="State/Province"
                                                name="state"
                                                value={formData.state || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Zip/Postal Code"
                                                name="zipCode"
                                                value={formData.zipCode || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Country/Region"
                                                name="region"
                                                value={formData.region || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {memorizedDataGrid}
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

export default NewBusinessUnit;

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