import React, { FC, useEffect, useState, useCallback } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager, Selection
} from 'devextreme-react/data-grid';
import { Stack, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, MenuItem, Select, FormControl, SelectChangeEvent } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchUsers, deleteUsersByIds } from '../../reducers/users/usersSlice';
import { fetchAreaAccessLevel } from '../../reducers/roles/rolesSlice';
import { fetchChildBusinessUnits } from 'src/reducers/businessUnits/businessUnitsSlice';
import { User } from 'src/reducers/users/usersAPI';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface UserListsProps {
    onRowClick: (userId: number) => void;
    onAddNewClick: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const searchEditorOptions = { placeholder: 'Search column' };

const UserLists: FC<UserListsProps> = ({ onRowClick, onAddNewClick }) => {
    const dispatch = useAppDispatch();
    const users = useSelector((state: RootState) => state.users.allUsers);
    const auth = useSelector((state: RootState) => state.auth.user);
    const userAccessLevel = useSelector((state: RootState) => state.roles.getAreaAccessLevel);
    const childBusinessUnits = useSelector((state: RootState) => state.businessUnits.childBusinessUnits);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [initialUsers, setInitialUsers] = useState<User[]>([]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (auth) {
            dispatch(fetchAreaAccessLevel(auth.role_id, "Users"));
            dispatch(fetchChildBusinessUnits(auth.business_unit_id));
        }
    }, [dispatch, auth]);

    useEffect(() => {
        if (users) {
            if (userAccessLevel === 1) {
                setInitialUsers(users);
            }
            else if (userAccessLevel === 2) {
                const usersInParentBusinessUnit = users.filter(user => user.business_unit_id === auth.business_unit_id);
                let usersInChildBusinessUnits: User[] = [];

                childBusinessUnits?.forEach(child => {
                    const childBusinessUnitUsers = users.filter(user => user.business_unit_id === child.id);
                    usersInChildBusinessUnits = usersInChildBusinessUnits.concat(childBusinessUnitUsers);
                });

                const totalUsersInBusinessUnit = usersInParentBusinessUnit.concat(usersInChildBusinessUnits);

                const teamIds = Array.from(new Set(totalUsersInBusinessUnit.map(user => user.team_id)));
                const filterData = users.filter(user => teamIds.includes(user.team_id));
                setInitialUsers(filterData);
            }
            else if (userAccessLevel === 3) {
                const usersInBusinessUnit = users.filter(user => user.business_unit_id === auth.business_unit_id);
                const teamIds = Array.from(new Set(usersInBusinessUnit.map(user => user.team_id)));
                const filterData = users.filter(user => teamIds.includes(user.team_id));
                setInitialUsers(filterData);
            }
            else if (userAccessLevel === 4) {
                const filterData = users.filter(user => { return user.team_id === auth.team_id });
                setInitialUsers(filterData);
            }
            else if (userAccessLevel === 5) {
                const filterData = users.filter(user => { return user.id === auth.id });
                setInitialUsers(filterData);
            }
        }
    }, [userAccessLevel, users, auth, childBusinessUnits]);

    const handleRowClick = (e: any) => {
        const userId = e.data.id;
        onRowClick(userId);
    };

    const onSelectionChanged = useCallback((data: any) => {
        setSelectedUserIds(data.selectedRowKeys as number[]);
    }, []);

    const onDelete = async () => {
        if (selectedUserIds.length > 0) {
            dispatch(deleteUsersByIds(selectedUserIds, auth.role_id));
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

    const filteredUsers = initialUsers.filter(user => {
        if (statusFilter === 'All') return true;
        return statusFilter === 'Active' ? user.status === true : user.status === false;
    });

    return (
        <Stack width="100%" padding={5}>
            <Typography variant='h5' color="primary">User Lists</Typography>
            <Grid container justifyContent="flex-end" alignItems="center">
                {userAccessLevel !== 5 && (
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
                <Column dataField='status' caption='Status' />

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
        </Stack>
    );
};

export default UserLists;
