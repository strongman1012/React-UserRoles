import React, { FC, useState, useEffect } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position,
    SearchPanel, Paging, Pager, Export, DataGridTypes, Button as GridButton
} from 'devextreme-react/data-grid';
import {
    Button, MenuItem, Select, FormControl, SelectChangeEvent,
    Container, Box, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchBusinessUnits, deleteBusinessUnitsById } from '../../reducers/businessUnits/businessUnitsSlice';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AddIcon from '@mui/icons-material/Add';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { ModalTypes } from 'src/utills/Global';
import AlertModal from 'src/components/Basic/Alert';
import EditBusinessUnit from 'src/components/Dashboard/business-units/EditBusinessUnit';
import NewBusinessUnit from 'src/components/Dashboard/business-units/NewBusinessUnit';
import Drawer from 'src/components/Basic/Drawer';

const searchEditorOptions = { placeholder: 'Search column' };

const onExporting = (e: DataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('BusinessUnits');

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'BusinessUnits.xlsx');
        });
    });
};

const BusinessUnits: FC = () => {
    const dispatch = useAppDispatch();
    const businessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);
    const editable = useSelector((state: RootState) => state.businessUnits.editable);
    const [statusFilter, setStatusFilter] = useState('All');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modalType, setModalType] = useState<string>(ModalTypes.new);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>();

    useEffect(() => {
        dispatch(fetchBusinessUnits());
    }, [dispatch]);

    useEffect(() => {
        if (businessUnits.length > 0)
            setIsLoading(false);
    }, [businessUnits]);

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

    const filteredBusinessUnits = businessUnits.filter(businessUnit => {
        if (statusFilter === 'All') return true;
        return statusFilter === 'Active Business Unit' ? businessUnit.status === true : businessUnit.status === false;
    });

    const handleCreate = () => {
        setModalType(ModalTypes.new);
        setEditModalOpen(true);
    }

    const handleEdit = (e: any) => {
        setModalType(ModalTypes.edit);
        setSelectedId(e.row.data.id);
        setEditModalOpen(true);
    }

    const handleDelete = async (e: any) => {
        setSelectedId(e.row.data.id);
        setDeleteModalOpen(true);
    }

    /**
     * Delete Selected BusinessUnit
     */
    const doDelete = async () => {
        setDeleteModalOpen(false);
        if (selectedId)
            dispatch(deleteBusinessUnitsById(selectedId))
    }

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Business Units"
                        action={
                            <>
                                <Button startIcon={<AddIcon />} variant="contained" color="primary" sx={{ mr: 2 }}
                                    onClick={handleCreate} disabled={editable ? false : true}>
                                    New
                                </Button>
                                <FormControl style={{ minWidth: 200, marginBottom: 16 }}>
                                    <Select value={statusFilter} onChange={handleStatusFilterChange} size='small'>
                                        <MenuItem value="All">All</MenuItem>
                                        <MenuItem value="Active Business Unit">Active Business Unit</MenuItem>
                                        <MenuItem value="Deactive Business Unit">Deactive Business Unit</MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <DataGrid
                            id="businessUnits"
                            dataSource={filteredBusinessUnits}
                            keyExpr="id"
                            columnAutoWidth={true}
                            showRowLines={true}
                            showBorders={true}
                            allowColumnResizing={true}
                            rowAlternationEnabled={true}
                            onExporting={onExporting}
                        >
                            <SearchPanel
                                visible={true}
                                width={240}
                                placeholder="Search..." />
                            <Export enabled={true} />
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
                            <Column caption="Actions" type="buttons" alignment="center" allowHiding={false}>
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
                        </DataGrid>
                    </CardContent>
                </Card>
            </Box>
            {/* EditBusinessUnit Drawer */}
            <Drawer
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onOpen={() => { }}>
                {
                    modalType === "new" ? <NewBusinessUnit onClose={() => setEditModalOpen(false)} /> : <EditBusinessUnit businessUnitId={selectedId as number} onClose={() => setEditModalOpen(false)} />
                }
            </Drawer>

            <AlertModal
                show={deleteModalOpen}
                onConfirm={doDelete}
                onClose={() => setDeleteModalOpen(false)}
                title={'Remove a selected business!'}
                description={'You are not able to revert after removed! Please confirm.'}
            />
        </Container>
    );
};

export default BusinessUnits;
