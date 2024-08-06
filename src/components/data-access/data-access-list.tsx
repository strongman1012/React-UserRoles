import React, { FC, useEffect, useState, useCallback } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager, Selection
} from 'devextreme-react/data-grid';
import { Stack, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchDataAccesses, deleteDataAccessesByIds } from '../../reducers/dataAccesses/dataAccessesSlice'; // Make sure you have these actions in your dataAccessesSlice
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface DataAccessListsProps {
    onRowClick: (dataAccessId: number) => void;
    onAddNewClick: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const searchEditorOptions = { placeholder: 'Search column' };

const DataAccessLists: FC<DataAccessListsProps> = ({ onRowClick, onAddNewClick }) => {
    const dispatch = useAppDispatch();
    const dataAccesses = useSelector((state: RootState) => state.dataAccesses.allDataAccesses);
    const editable = useSelector((state: RootState) => state.dataAccesses.editable);
    const [selectedDataAccessIds, setSelectedDataAccessIds] = useState<number[]>([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        dispatch(fetchDataAccesses());
    }, [dispatch]);

    const handleRowClick = (e: any) => {
        const dataAccessId = e.data.id;
        onRowClick(dataAccessId);
    };

    const onSelectionChanged = useCallback((data: any) => {
        setSelectedDataAccessIds(data.selectedRowKeys as number[]);
    }, []);

    const onDelete = async () => {
        if (selectedDataAccessIds.length > 0) {
            dispatch(deleteDataAccessesByIds(selectedDataAccessIds));
            setOpenConfirmDialog(false);
        } else {
            setOpenConfirmDialog(false);
            setOpenSnackbar(true);
        }
    };

    const handleDeleteClick = () => {
        if (selectedDataAccessIds.length > 0) {
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
            <Typography variant='h5' color="primary">Data Access Lists</Typography>
            <Grid container justifyContent="flex-end" alignItems="center">
                {
                    editable && (
                        <>
                            <Button variant="contained" color="primary" onClick={onAddNewClick} style={{ marginBottom: 16, marginRight: 12 }}>
                                New
                            </Button>
                            <Button variant="contained" color="inherit" onClick={handleDeleteClick} style={{ marginBottom: 16, marginRight: 12 }}>
                                Delete
                            </Button>
                        </>
                    )
                }
            </Grid>
            <DataGrid
                id="dataAccesses"
                dataSource={dataAccesses}
                keyExpr="id"
                columnAutoWidth={true}
                showRowLines={true}
                showBorders={true}
                onRowClick={handleRowClick}
                selectedRowKeys={selectedDataAccessIds}
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
                <Column dataField='id' caption='Data Access ID' allowHiding={false} alignment='left' />
                <Column dataField='name' caption='Data Access Name' allowHiding={false} />
                <Column dataField='level' caption='Access Level' allowHiding={false} />

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
                        Are you sure you want to delete the selected data accesses?
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
                    No data accesses selected for deletion.
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default DataAccessLists;
