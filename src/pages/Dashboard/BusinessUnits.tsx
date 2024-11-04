import React, { FC, useState, useEffect, useMemo } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position,
    SearchPanel, Paging, Pager, Export, DataGridTypes, Button as GridButton, FilterRow
} from 'devextreme-react/data-grid';
import {
    Button, Container, Box, Divider, Card, CardHeader, CardContent
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
    const setting = useSelector((state: RootState) => state.settings.setting);
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

    // Memoizing defaultPageSize based on the setting
    const defaultPageSize = useMemo(() => {
        return setting?.rowsPerPage ? setting.rowsPerPage : 20;
    }, [setting]);

    // Memoizing allowedPageSizes based on defaultPageSize
    const allowedPageSizes = useMemo(() => {
        return [defaultPageSize, 2 * defaultPageSize, 3 * defaultPageSize];
    }, [defaultPageSize]);

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

    const memorizedDataGrid = useMemo(() => (
        <DataGrid
            id="businessUnits"
            key={defaultPageSize}
            dataSource={businessUnits}
            keyExpr="id"
            columnAutoWidth={true}
            showRowLines={true}
            showBorders={true}
            allowColumnResizing={true}
            rowAlternationEnabled={true}
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
            <Column dataField='name' caption='Name' allowHiding={false} />
            <Column dataField='website' caption='Website' />
            <Column dataField='mainPhone' caption='Main Phone' />
            <Column dataField='parent_name' caption='Parent Organization' />
            <Column dataField='admin_name' caption='Administrator' />
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
            <Column caption="Actions" type="buttons" alignment="center" allowHiding={false}>
                <GridButton icon="edit" text="Edit" onClick={handleEdit} cssClass="text-secondary" disabled={!editable?.update} />
                <GridButton icon="trash" text="Delete" onClick={handleDelete} cssClass="text-secondary" disabled={!editable?.delete} />
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
    ), [businessUnits, editable, defaultPageSize, allowedPageSizes]);

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Organizational Units"
                        action={
                            <>
                                <Button startIcon={<AddIcon />} variant="contained" color="primary" sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}
                                    onClick={handleCreate} disabled={!editable?.create}>
                                    New
                                </Button>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        {memorizedDataGrid}
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
