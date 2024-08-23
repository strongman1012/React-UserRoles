import React, { FC, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchRoleById } from '../../../reducers/roles/rolesSlice';
import { fetchApplications } from 'src/reducers/applications/applicationsSlice';
import { fetchAreas } from 'src/reducers/areas/areasSlice';
import { fetchDataAccesses } from 'src/reducers/dataAccesses/dataAccessesSlice';
import { getAreaLists, saveAreaList } from '../../../reducers/areaList/areaListSlice';
import {
    Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Select, MenuItem, Checkbox,
    Container, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface SecurityRolesFormProps {
    roleId: number;
}

const SecurityRolesForm: FC<SecurityRolesFormProps> = ({ roleId }) => {
    const dispatch = useAppDispatch();
    const role = useSelector((state: RootState) => state.roles.currentRole);
    const editable = useSelector((state: RootState) => state.areaList.editable);
    const selectedAreaLists = useSelector((state: RootState) => state.areaList.selectedAreaLists);
    const dataAccessLists = useSelector((state: RootState) => state.dataAccesses.allDataAccesses);
    const allApplications = useSelector((state: RootState) => state.applications.allApplications);
    const allAreas = useSelector((state: RootState) => state.areas.allAreas);
    const [tabValue, setTabValue] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {
        dispatch(fetchApplications());
        dispatch(fetchAreas());
        dispatch(fetchDataAccesses());
    }, [dispatch]);

    useEffect(() => {
        if (roleId) {
            dispatch(fetchRoleById(roleId));
            dispatch(getAreaLists(roleId));
        }
    }, [dispatch, roleId]);

    useEffect(() => {
        if (selectedAreaLists.length > 0 && dataAccessLists.length > 0 && allApplications.length > 0 && allAreas.length > 0)
            setIsLoading(false);
    }, [selectedAreaLists, dataAccessLists, allApplications, allAreas]);

    useEffect(() => {
        if (allApplications.length > 0) {
            setTabValue(allApplications[0]?.id);
        }
    }, [allApplications]);

    const filteredAreas = useMemo(() => {
        return allAreas.filter(area => area.application_id === tabValue);
    }, [allAreas, tabValue]);

    const filteredSelectedAreaLists = useMemo(() => {
        return selectedAreaLists.filter(areaList => areaList.application_id === tabValue)
    }, [selectedAreaLists, tabValue]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handlePermissionChange = async (areaId: number, newPermission: string) => {
        setIsLoading(true);
        const permission = newPermission === 'true';
        try {
            await dispatch(saveAreaList(roleId, { area_id: areaId, permission: permission }));
            setConfirmTitle('Permission updated successfully');
            setConfirmDescription('');
            setConfirmModalOpen(true);
        } catch (error: any) {
            setConfirmTitle(error.message);
            setConfirmDescription('');
            setConfirmModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDataAccessChange = async (areaId: number, data_access_id: number) => {
        setIsLoading(true);
        try {
            await dispatch(saveAreaList(roleId, { area_id: areaId, data_access_id: data_access_id }));
            setConfirmTitle('Data access updated successfully');
            setConfirmDescription('');
            setConfirmModalOpen(true);
        } catch (error: any) {
            setConfirmTitle(error.message);
            setConfirmDescription('');
            setConfirmModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const getPermission = (areaId: number) => {
        const area = filteredSelectedAreaLists[0]?.data.find(area => area.area_id === areaId);
        return area ? area.permission : false;
    };

    const getDataAccess = (areaId: number) => {
        const area = filteredSelectedAreaLists[0]?.data.find(area => area.area_id === areaId);
        return area ? area.data_access_id : '';
    };

    if (!role) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title={`Security Role: ${role.name}`} />
                    <Divider />
                    <CardContent>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                                {allApplications.map(application => (
                                    <Tab key={application.id} label={application.name} value={application.id} />
                                ))}
                            </Tabs>
                        </Box>
                        {allApplications.map(application => (
                            <TabPanel key={application.id} value={tabValue} index={application.id}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Area / Feature</TableCell>
                                                <TableCell>Application Access</TableCell>
                                                <TableCell colSpan={5} align="center">Data Access</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>Level</TableCell>
                                                <TableCell>Read</TableCell>
                                                <TableCell>Create</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>Delete</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredAreas.map(area => (
                                                <TableRow key={area.id}>
                                                    <TableCell>{area.name}</TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={getPermission(area.id).toString()}
                                                            onChange={(e) => handlePermissionChange(area.id, e.target.value as string)}
                                                            disabled={!editable}
                                                        >
                                                            <MenuItem value={'true'}>Yes</MenuItem>
                                                            <MenuItem value={'false'}>No</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={getDataAccess(area.id)}
                                                            onChange={(e) => handleDataAccessChange(area.id, e.target.value as number)}
                                                            disabled={!editable}
                                                        >
                                                            {dataAccessLists.map(data => (
                                                                <MenuItem key={data.id} value={data.id}>
                                                                    {data.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={filteredSelectedAreaLists[0]?.data.filter(row => row.area_id === area.id).map(row => row.read)[0] || false}
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={filteredSelectedAreaLists[0]?.data.filter(row => row.area_id === area.id).map(row => row.create)[0] || false}
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={filteredSelectedAreaLists[0]?.data.filter(row => row.area_id === area.id).map(row => row.update)[0] || false}
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={filteredSelectedAreaLists[0]?.data.filter(row => row.area_id === area.id).map(row => row.delete)[0] || false}
                                                            disabled
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        ))}
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

export default SecurityRolesForm;

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
