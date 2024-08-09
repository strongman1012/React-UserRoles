import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager, Selection
} from 'devextreme-react/data-grid';
import { Stack, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Snackbar, MenuItem, Select, FormControl, SelectChangeEvent, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { User } from 'src/reducers/users/usersAPI';
import { fetchUsers, deleteUsersByIds } from '../../reducers/users/usersSlice';
import { fetchUserMetricsById, resetLoginReports } from 'src/reducers/loginReports/loginReportsSlice';
import { Chart, Series, Legend, ArgumentAxis, ValueAxis } from 'devextreme-react/chart';
import { makeStyles } from '@mui/styles';

interface UserListsProps {
    onRowClick: (userId: number) => void;
    onAddNewClick: () => void;
}

const useStyles = makeStyles({
    dataGrid: {
        '& .dx-row > td': {
            verticalAlign: 'middle !important',
        },
    },
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const searchEditorOptions = { placeholder: 'Search column' };

const UserLists: FC<UserListsProps> = ({ onRowClick, onAddNewClick }) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const users = useSelector((state: RootState) => state.users.allUsers);
    const editable = useSelector((state: RootState) => state.users.editable);
    const loginMetrics = useSelector((state: RootState) => state.loginReports.currentLoginMetrics);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [openMetricsDialog, setOpenMetricsDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const sortedLoginMetrics = useMemo(() => {
        if (loginMetrics && loginMetrics?.length > 0)
            return loginMetrics?.sort((a, b) => {
                const dateA: any = new Date(a.login_date);
                const dateB: any = new Date(b.login_date);
                return dateA - dateB;
            });
    }, [loginMetrics]);

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

    const renderMetricsCell = (cellData: any) => (
        <IconButton onClick={(e) => handleMetricsClick(e, cellData.data.id)}>
            <VisibilityIcon />
        </IconButton>
    );

    const handleRowClick = (e: any) => {
        const userId = e.data.id;
        onRowClick(userId);
    };

    const onSelectionChanged = useCallback((data: any) => {
        setSelectedUserIds(data.selectedRowKeys as number[]);
    }, []);

    const onDelete = async () => {
        if (selectedUserIds.length > 0) {
            dispatch(deleteUsersByIds(selectedUserIds));
            setOpenConfirmDialog(false);
        } else {
            setOpenConfirmDialog(false);
            setOpenSnackbar(true);
        }
    };

    const handleDeleteClick = () => {
        if (selectedUserIds.length > 0) {
            setOpenConfirmDialog(true);
        } else {
            setOpenSnackbar(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(event.target.value);
    };

    const handleMetricsClick = (e: React.MouseEvent, userId: number) => {
        e.stopPropagation(); // Prevent row click event
        const selectUser = users.filter(user => user.id === userId);
        setSelectedUser(selectUser[0]);
        dispatch(fetchUserMetricsById(userId));
        setOpenMetricsDialog(true);
    };

    const handleCloseMetricsDialog = () => {
        dispatch(resetLoginReports());
        setOpenMetricsDialog(false);
    };

    const filteredUsers = users.filter(user => {
        if (statusFilter === 'All') return true;
        return statusFilter === 'Active' ? user.status === true : user.status === false;
    });

    return (
        <Stack width="100%" padding={5}>
            <Typography variant='h5' color="primary">User Lists</Typography>
            <Grid container justifyContent="flex-end" alignItems="center">
                {editable && (
                    <>
                        <Button variant="contained" color="primary" onClick={onAddNewClick} style={{ marginBottom: 16, marginRight: 12 }}>
                            New
                        </Button>
                        <Button variant="contained" color="inherit" onClick={handleDeleteClick} style={{ marginBottom: 16, marginRight: 12 }}>
                            Delete
                        </Button>
                    </>
                )}
                <FormControl style={{ minWidth: 200, marginBottom: 16 }}>
                    <Select value={statusFilter} onChange={handleStatusFilterChange} size='small'>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <DataGrid
                id="users"
                dataSource={filteredUsers}
                keyExpr="id"
                columnAutoWidth={true}
                showRowLines={true}
                showBorders={true}
                onRowClick={handleRowClick}
                selectedRowKeys={selectedUserIds}
                onSelectionChanged={onSelectionChanged}
                className={classes.dataGrid}
            >
                <SearchPanel
                    visible={true}
                    width={240}
                    placeholder="Search..." />
                <Selection mode='multiple' />
                <Paging defaultPageSize={10} />
                <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[5, 10]}
                    showInfo={true} />
                <Column dataField='userName' caption='Username' allowHiding={false} />
                <Column dataField='email' caption='Email' allowHiding={false} />
                <Column dataField='fullName' caption='Full Name' />
                <Column dataField='mobilePhone' caption='Mobile Phone' />
                <Column dataField='mainPhone' caption='Main Phone' />
                <Column dataField='role_name' caption='Role Name' />
                <Column dataField='business_name' caption='Business Unit' />
                <Column dataField='team_name' caption='Team' />
                <Column
                    dataField='status'
                    caption='Status'
                    cellRender={renderStatusCell}
                />
                <Column
                    alignment='center'
                    dataField="metrics"
                    caption="Metrics"
                    cellRender={renderMetricsCell}
                    allowHiding={false}
                />

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
            </DataGrid>
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the selected users?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onDelete} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="warning">
                    No users selected for deletion.
                </Alert>
            </Snackbar>
            <Dialog
                open={openMetricsDialog}
                onClose={handleCloseMetricsDialog}
                aria-labelledby="metrics-dialog-title"
                aria-describedby="metrics-dialog-description"
                fullWidth
            >
                <DialogTitle id="metrics-dialog-title" style={{ textAlign: 'center' }}>
                    {selectedUser?.userName}{"'s Logins Per Day"}
                </DialogTitle>
                <DialogContent>
                    <Chart id="chart" dataSource={sortedLoginMetrics}>
                        <ArgumentAxis title="Date" />
                        <ValueAxis title="Count" tickInterval={1} label={{ format: { type: 'fixedPoint', precision: 0 } }} />
                        <Series
                            valueField="login_count"
                            argumentField="login_date"
                            type="bar"
                        />
                        <Legend visible={false} />
                    </Chart>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMetricsDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default UserLists;
