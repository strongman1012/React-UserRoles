import React, { FC, useState, useCallback, useEffect } from 'react';
import { DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager, Selection, DataGridTypes } from 'devextreme-react/data-grid';
import { Stack, Typography, Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, MenuItem, Select, FormControl, SelectChangeEvent } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchBusinessUnits, deleteBusinessUnitsByIds } from '../../reducers/businessUnits/businessUnitsSlice';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface BusinessUnitListsProps {
    onRowClick: (businessUnitId: number) => void;
    onAddNewClick: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const searchEditorOptions = { placeholder: 'Search column' };

const BusinessUnitLists: FC<BusinessUnitListsProps> = ({ onRowClick, onAddNewClick }) => {
    const dispatch = useAppDispatch();
    const businessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);
    const editable = useSelector((state: RootState) => state.businessUnits.editable);
    const [selectedBusinessIds, setSelectedBusinessIds] = useState<number[]>([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        dispatch(fetchBusinessUnits());
    }, [dispatch]);

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

    const handleRowClick = (e: any) => {
        const businessUnitId = e.data.id;
        onRowClick(businessUnitId);
    };

    const onSelectionChanged = useCallback((data: DataGridTypes.SelectionChangedEvent) => {
        setSelectedBusinessIds(data.selectedRowKeys as number[]);
    }, []);

    const onDelete = async () => {
        if (selectedBusinessIds.length > 0) {
            dispatch(deleteBusinessUnitsByIds(selectedBusinessIds));
            setOpenConfirmDialog(false);
        } else {
            setOpenConfirmDialog(false);
            setOpenSnackbar(true);
        }
    };

    const handleDeleteClick = () => {
        if (selectedBusinessIds.length > 0) {
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

    const filteredBusinessUnits = businessUnits.filter(businessUnit => {
        if (statusFilter === 'All') return true;
        return statusFilter === 'Active Business Unit' ? businessUnit.status === true : businessUnit.status === false;
    });

    return (
        <Stack width="100%" padding={5}>
            <Typography variant='h5' color="primary">Business Unit Lists</Typography>
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
                        <MenuItem value="Active Business Unit">Active Business Unit</MenuItem>
                        <MenuItem value="Deactive Business Unit">Deactive Business Unit</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <DataGrid
                id="businessUnits"
                dataSource={filteredBusinessUnits}
                keyExpr="id"
                columnAutoWidth={true}
                showRowLines={true}
                showBorders={true}
                onRowClick={handleRowClick}
                selectedRowKeys={selectedBusinessIds}
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
                <Column dataField='website' caption='Website' />
                <Column dataField='mainPhone' caption='Main Phone' />
                <Column dataField='parent_name' caption='Parent Business' />
                <Column dataField='otherPhone' caption='Other Phone' />
                <Column dataField='fax' caption='Fax' />
                <Column dataField='email' caption='Email' />
                <Column dataField='street1' caption='Street 1' />
                <Column dataField='street2' caption='Street 2' />
                <Column dataField='street3' caption='Street 3' />
                <Column dataField='city' caption='City' />
                <Column dataField='state' caption='State' />
                <Column dataField='zipCode' caption='Zip Code' />
                <Column dataField='region' caption='Region' />
                <Column
                    dataField='status'
                    caption='Status'
                    cellRender={renderStatusCell}
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
                        Are you sure you want to delete the selected business units?
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
                    No business units selected for deletion.
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default BusinessUnitLists;
