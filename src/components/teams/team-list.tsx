import React, { FC, useState, useCallback, useEffect } from 'react';
import { DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager, Selection, DataGridTypes } from 'devextreme-react/data-grid';
import { Stack, Typography, Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchTeams, deleteTeamsByIds } from '../../reducers/teams/teamsSlice';
import { fetchAreaAccessLevel } from '../../reducers/roles/rolesSlice';
import { fetchChildBusinessUnits } from 'src/reducers/businessUnits/businessUnitsSlice';
import { Team } from 'src/reducers/teams/teamsAPI';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface TeamListsProps {
    onRowClick: (teamId: number) => void;
    onAddNewClick: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const searchEditorOptions = { placeholder: 'Search column' };

const TeamLists: FC<TeamListsProps> = ({ onRowClick, onAddNewClick }) => {
    const dispatch = useAppDispatch();
    const teams = useSelector((state: RootState) => state.teams.allTeams);
    const auth = useSelector((state: RootState) => state.auth.user);
    const userAccessLevel = useSelector((state: RootState) => state.roles.getAreaAccessLevel);
    const childBusinessUnits = useSelector((state: RootState) => state.businessUnits.childBusinessUnits);
    const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

    useEffect(() => {
        dispatch(fetchTeams());
    }, [dispatch]);

    useEffect(() => {
        if (auth) {
            dispatch(fetchAreaAccessLevel(auth.role_id, "Teams"));
            dispatch(fetchChildBusinessUnits(auth.business_unit_id));
        }
    }, [dispatch, auth]);

    useEffect(() => {
        if (teams) {
            if (userAccessLevel === 1) {
                setFilteredTeams(teams);
            }
            else if (userAccessLevel === 2) {
                const parentData = teams.filter(team => { return team.business_unit_id === auth.business_unit_id });
                let childrenData: Team[] = [];
                childBusinessUnits?.forEach(child => {
                    const teamsInChildBusinessUnit = teams.filter(team => { return team.business_unit_id === child.id });
                    childrenData = childrenData.concat(teamsInChildBusinessUnit);
                });
                setFilteredTeams(parentData.concat(childrenData));
            }
            else if (userAccessLevel === 3) {
                const filteredData = teams.filter(team => { return team.business_unit_id === auth.business_unit_id });
                setFilteredTeams(filteredData);
            }
            else {
                const filteredData = teams.filter(team => { return team.id === auth.team_id });
                setFilteredTeams(filteredData);
            }
        }
    }, [userAccessLevel, teams, auth, childBusinessUnits]);

    const handleRowClick = (e: any) => {
        const teamId = e.data.id;
        onRowClick(teamId);
    };

    const onSelectionChanged = useCallback((data: DataGridTypes.SelectionChangedEvent) => {
        setSelectedTeamIds(data.selectedRowKeys as number[]);
    }, []);

    const onDelete = async () => {
        if (selectedTeamIds.length > 0) {
            dispatch(deleteTeamsByIds(selectedTeamIds, auth.role_id));
            setOpenConfirmDialog(false);
        } else {
            setOpenConfirmDialog(false);
            setOpenSnackbar(true);
        }
    };

    const handleDeleteClick = () => {
        if (selectedTeamIds.length > 0) {
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

    return (
        <Stack width="100%" padding={5}>
            <Typography variant='h5' color="primary">Team Lists</Typography>
            <Grid container justifyContent="flex-end" alignItems="center">
                {userAccessLevel !== 5 && (
                    <>
                        <Button variant="contained" color="primary" onClick={onAddNewClick} style={{ marginBottom: 16, marginRight: 12 }}>
                            New
                        </Button>
                        <Button variant="contained" color="inherit" onClick={handleDeleteClick} style={{ marginBottom: 16 }}>
                            Delete
                        </Button>
                    </>
                )}
            </Grid>
            <DataGrid
                id="teams"
                dataSource={filteredTeams}
                keyExpr="id"
                columnAutoWidth={true}
                showRowLines={true}
                showBorders={true}
                onRowClick={handleRowClick}
                selectedRowKeys={selectedTeamIds}
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
                <Column dataField='name' caption='Name' allowHiding={false} />
                <Column dataField='description' caption='Description' />
                <Column dataField='business_name' caption='Business Unit' />
                <Column dataField='admin_name' caption='Team Administrator' />
                <Column dataField='is_default' caption='Default Team' />
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
                        Are you sure you want to delete the selected teams?
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
                    No teams selected for deletion.
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default TeamLists;
