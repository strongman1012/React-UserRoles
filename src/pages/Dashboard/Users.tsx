import React, { FC, useEffect, useState, useMemo } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection,
    Position, SearchPanel, Paging, Pager, Export, DataGridTypes, Button as GridButton, FilterRow
} from 'devextreme-react/data-grid';
import {
    Box, Container, Button, MenuItem, Select, FormControl,
    SelectChangeEvent, Card, CardHeader, CardContent, Divider, Typography
} from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { User } from 'src/reducers/users/usersAPI';
import { fetchUsers, deleteUserById } from '../../reducers/users/usersSlice';
import { fetchTeamsList } from 'src/reducers/teams/teamsSlice';
import { fetchRoles } from 'src/reducers/roles/rolesSlice';
import { fetchUserMetricsById, resetLoginReports } from 'src/reducers/loginReports/loginReportsSlice';
import { Chart, Series, Legend, ArgumentAxis, ValueAxis } from 'devextreme-react/chart';
import { makeStyles } from '@mui/styles';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AddIcon from '@mui/icons-material/Add';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { ModalTypes } from 'src/utills/Global';
import AlertModal from 'src/components/Basic/Alert';
import EditUser from 'src/components/Dashboard/users/EditUser';
import NewUser from 'src/components/Dashboard/users/NewUser';
import Drawer from 'src/components/Basic/Drawer';

const useStyles = makeStyles({
    dataGrid: {
        '& .dx-row > td': {
            verticalAlign: 'middle !important',
        },
    },
});

const searchEditorOptions = { placeholder: 'Search column' };

const onExporting = (e: DataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Users');

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Users.xlsx');
        });
    });
};

const Users: FC = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const users = useSelector((state: RootState) => state.users.allUsers);
    const teams = useSelector((state: RootState) => state.teams.teamsList);
    const roles = useSelector((state: RootState) => state.roles.allRoles);
    const editable = useSelector((state: RootState) => state.users.editable);
    const setting = useSelector((state: RootState) => state.settings.setting);
    const loginMetrics = useSelector((state: RootState) => state.loginReports.currentLoginMetrics);
    const [statusFilter, setStatusFilter] = useState('All');
    const [openMetricsDialog, setOpenMetricsDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modalType, setModalType] = useState<string>(ModalTypes.new);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchTeamsList());
        dispatch(fetchRoles());
    }, [dispatch]);

    useEffect(() => {
        if (users.length > 0)
            setIsLoading(false);
    }, [users]);

    // Memoizing defaultPageSize based on the setting
    const defaultPageSize = useMemo(() => {
        return setting?.rowsPerPage ? setting.rowsPerPage : 20;
    }, [setting]);

    // Memoizing allowedPageSizes based on defaultPageSize
    const allowedPageSizes = useMemo(() => {
        return [defaultPageSize, 2 * defaultPageSize, 3 * defaultPageSize];
    }, [defaultPageSize]);

    const renderStatusCell = (cellData: any) => {
        const isSuccessful = cellData.value;
        const statusText = isSuccessful ? "✔" : "X";
        const statusStyle = {
            color: isSuccessful ? 'green' : 'red'
        };

        return (
            <span style={statusStyle}>{statusText}</span>
        );
    };

    const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(event.target.value);
    };

    const handleMetricsClick = async (e: any) => {
        setIsLoading(true);
        setSelectedUser(e.row.data);
        setOpenMetricsDialog(true);
        const response = await dispatch(fetchUserMetricsById(e.row.data.id));
        if (response)
            setIsLoading(false)
    };

    const handleCloseMetricsDialog = () => {
        dispatch(resetLoginReports());
        setOpenMetricsDialog(false);
    };

    const getRoleNames = (roleIds: string) => {
        if (!roleIds) return '';
        const ids = roleIds.split(',').map(id => parseInt(id, 10));
        return ids.map(id => roles.find(role => role.id === id)?.name).filter(name => name).join(', ');
    };

    const getTeamNames = (teamIds: string) => {
        if (!teamIds) return '';
        const ids = teamIds.split(',').map(id => parseInt(id, 10));
        return ids.map(id => teams.find(team => team.id === id)?.name).filter(name => name).join(', ');
    };

    const filteredUsers = users.filter(user => {
        if (statusFilter === 'All') return true;
        return statusFilter === 'Active' ? user.status === true : user.status === false;
    });

    const handleCreate = () => {
        setModalType(ModalTypes.new);
        setEditModalOpen(true);
    }

    const handleEdit = (e: any) => {
        setModalType(ModalTypes.edit);
        setSelectedUser(e.row.data);
        setEditModalOpen(true);
    }

    const handleDelete = async (e: any) => {
        setSelectedUser(e.row.data);
        setDeleteModalOpen(true);
    }

    /**
     * Delete Selected User
     */
    const doDelete = async () => {
        setDeleteModalOpen(false);
        if (selectedUser)
            dispatch(deleteUserById(selectedUser.id))
    }

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Users"
                        action={
                            <>
                                <Button startIcon={<AddIcon />} variant="contained" sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}
                                    onClick={handleCreate} disabled={editable ? false : true}>
                                    New
                                </Button>
                                <FormControl style={{ minWidth: 200 }}>
                                    <Select value={statusFilter} onChange={handleStatusFilterChange} size='small' sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                        <MenuItem value="All">All</MenuItem>
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        {setting && defaultPageSize && allowedPageSizes && (<DataGrid
                            id="users"
                            key={defaultPageSize}
                            dataSource={filteredUsers}
                            keyExpr="id"
                            columnAutoWidth={true}
                            showRowLines={true}
                            showBorders={true}
                            allowColumnResizing={true}
                            rowAlternationEnabled={true}
                            className={classes.dataGrid}
                            onExporting={onExporting}
                        >
                            <FilterRow visible={true} />
                            <SearchPanel
                                visible={true}
                                width={240}
                                placeholder="Search..." />
                            <Export enabled={true} />
                            <Paging defaultPageSize={defaultPageSize} />
                            <Pager
                                showPageSizeSelector={true}
                                allowedPageSizes={allowedPageSizes}
                                showInfo={true} />
                            <Column dataField='userName' caption='Username' allowHiding={false} />
                            <Column dataField='email' caption='Email' allowHiding={false} />
                            <Column dataField='fullName' caption='Full Name' />
                            <Column dataField='mobilePhone' caption='Mobile Phone' />
                            <Column dataField='mainPhone' caption='Main Phone' />
                            <Column
                                dataField='role_ids'
                                caption='Roles'
                                cellRender={(cellData) => getRoleNames(cellData.value)}
                            />
                            <Column
                                dataField='business_name'
                                caption='Business Unit'
                            />
                            <Column
                                dataField='team_ids'
                                caption='Teams'
                                cellRender={(cellData) => getTeamNames(cellData.value)}
                            />
                            <Column
                                dataField='status'
                                caption='Status'
                                cellRender={renderStatusCell}
                            />
                            <Column caption="Actions" type="buttons" alignment="center" allowHiding={false}>
                                <GridButton icon="eyeopen" text="Metrics" onClick={handleMetricsClick} cssClass="text-secondary" />
                                <GridButton icon="edit" text="Edit" onClick={handleEdit} cssClass="text-secondary" disabled={editable ? false : true} />
                                <GridButton icon="trash" text="Delete" onClick={handleDelete} cssClass="text-secondary" disabled={editable ? false : true} />
                            </Column>
                            <ColumnChooser
                                height='340px'
                                enabled={true}
                                mode="select"
                            >
                                <Position
                                    my="right top"
                                    at="right bottom"
                                    of=".dx-datagrid-column-chooser-button"
                                />
                                <ColumnChooserSearch
                                    enabled={true}
                                    editorOptions={searchEditorOptions} />
                                <ColumnChooserSelection
                                    allowSelectAll={true}
                                    selectByClick={true}
                                    recursive={true} />
                            </ColumnChooser>
                        </DataGrid>)}
                    </CardContent>
                </Card>
            </Box>
            {/* Metrics Drawer */}
            <Drawer
                open={openMetricsDialog}
                onClose={handleCloseMetricsDialog}
                onOpen={() => { }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h6'>
                        {selectedUser?.userName}{"'s Logins Per Day"}
                    </Typography>
                </Box>
                <Chart id="chart" dataSource={loginMetrics}>
                    <ArgumentAxis title="Date" />
                    <ValueAxis title="Count" />
                    <Series
                        valueField="login_count"
                        argumentField="login_date"
                        type="bar"
                    />
                    <Legend visible={false} />
                </Chart>
            </Drawer>
            {/* EditUser Drawer */}
            <Drawer
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onOpen={() => { }}>
                {
                    modalType === "new" ? <NewUser onClose={() => setEditModalOpen(false)} /> : <EditUser userId={selectedUser?.id as number} onClose={() => setEditModalOpen(false)} />
                }
            </Drawer>

            <AlertModal
                show={deleteModalOpen}
                onConfirm={doDelete}
                onClose={() => setDeleteModalOpen(false)}
                title={'Remove a selected user!'}
                description={'You are not able to revert after removed! Please confirm.'}
            />
        </Container>
    );
};

export default Users;
