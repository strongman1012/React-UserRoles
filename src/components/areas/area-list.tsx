import React, { FC, useEffect, useState, useCallback } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager, Selection
} from 'devextreme-react/data-grid';
import { Stack, Grid, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchAreas, deleteAreaByIds } from '../../reducers/areas/areasSlice'; // Make sure you have these actions in your areasSlice
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface AreaListsProps {
    onRowClick: (areaId: number) => void;
    onAddNewClick: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const searchEditorOptions = { placeholder: 'Search column' };

const AreaLists: FC<AreaListsProps> = ({ onRowClick, onAddNewClick }) => {
    const dispatch = useAppDispatch();
    const areas = useSelector((state: RootState) => state.areas.allAreas);
    const editable = useSelector((state: RootState) => state.areas.editable);
    const [selectedAreaIds, setSelectedAreaIds] = useState<number[]>([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        dispatch(fetchAreas());
    }, [dispatch]);

    const handleRowClick = (e: any) => {
        const areaId = e.data.id;
        onRowClick(areaId);
    };

    const onSelectionChanged = useCallback((data: any) => {
        setSelectedAreaIds(data.selectedRowKeys as number[]);
    }, []);

    const onDelete = async () => {
        if (selectedAreaIds.length > 0) {
            dispatch(deleteAreaByIds(selectedAreaIds));
            setOpenConfirmDialog(false);
        } else {
            setOpenConfirmDialog(false);
            setOpenSnackbar(true);
        }
    };

    const handleDeleteClick = () => {
        if (selectedAreaIds.length > 0) {
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
            <Typography variant='h5' color="primary">Area Lists</Typography>
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
            </Grid>
            <DataGrid
                id="areas"
                dataSource={areas}
                keyExpr="id"
                columnAutoWidth={true}
                showRowLines={true}
                showBorders={true}
                onRowClick={handleRowClick}
                selectedRowKeys={selectedAreaIds}
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
                <Column dataField='id' caption='Area ID' allowHiding={false} alignment='left' />
                <Column dataField='name' caption='Area Name' allowHiding={false} />
                <Column dataField='description' caption='Description' allowHiding={false} />
                <Column dataField='application_name' caption='Application Name' allowHiding={false} />

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
                        Are you sure you want to delete the selected areas?
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
                    No areas selected for deletion.
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default AreaLists;
