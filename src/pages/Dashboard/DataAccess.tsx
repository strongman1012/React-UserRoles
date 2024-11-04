import React, { FC, useEffect, useState, useMemo } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager,
    Export, DataGridTypes, Button as GridButton, FilterRow
} from 'devextreme-react/data-grid';
import {
    Button, Container, Box, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchDataAccesses, deleteDataAccessesById } from '../../reducers/dataAccesses/dataAccessesSlice'; // Make sure you have these actions in your dataAccessesSlice
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AddIcon from '@mui/icons-material/Add';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { ModalTypes } from 'src/utills/Global';
import AlertModal from 'src/components/Basic/Alert';
import EditDataAccess from 'src/components/Dashboard/data-access/EditDataAccess';
import NewDataAccess from 'src/components/Dashboard/data-access/NewDataAccess';
import Drawer from 'src/components/Basic/Drawer';

const searchEditorOptions = { placeholder: 'Search column' };

const onExporting = (e: DataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('DataAccess');

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataAccess.xlsx');
        });
    });
};

const DataAccess: FC = () => {
    const dispatch = useAppDispatch();
    const dataAccesses = useSelector((state: RootState) => state.dataAccesses.allDataAccesses);
    const editable = useSelector((state: RootState) => state.dataAccesses.editable);
    const setting = useSelector((state: RootState) => state.settings.setting);
    const [selectedDataAccessId, setSelectedDataAccessId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modalType, setModalType] = useState<string>(ModalTypes.new);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchDataAccesses());
    }, [dispatch]);

    useEffect(() => {
        if (dataAccesses.length > 0)
            setIsLoading(false);
    }, [dataAccesses]);

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
        setSelectedDataAccessId(e.row.data.id);
        setEditModalOpen(true);
    }

    const handleDelete = async (e: any) => {
        setSelectedDataAccessId(e.row.data.id);
        setDeleteModalOpen(true);
    }

    /**
     * Delete Selected Data access
     */
    const doDelete = async () => {
        setDeleteModalOpen(false);
        if (selectedDataAccessId)
            dispatch(deleteDataAccessesById(selectedDataAccessId))
    }

    const memorizedDataGrid = useMemo(() => (
        <DataGrid
            id="dataAccesses"
            key={defaultPageSize}
            dataSource={dataAccesses}
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
            <Column dataField='id' caption='Data Access ID' allowHiding={false} alignment='left' />
            <Column dataField='name' caption='Data Access Name' allowHiding={false} />
            <Column dataField='level' caption='Access Level' alignment='left' allowHiding={false} />
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
    ), [dataAccesses, editable, defaultPageSize, allowedPageSizes]);

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Data Accesses"
                        action={
                            <Button startIcon={<AddIcon />} variant="contained" color="primary" sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}
                                onClick={handleCreate} disabled={!editable?.create}>
                                New
                            </Button>
                        }
                    />
                    <Divider />
                    <CardContent>
                        {memorizedDataGrid}
                    </CardContent>
                </Card>
            </Box>

            {/* EditDataaccess Drawer */}
            <Drawer
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onOpen={() => { }}>
                {
                    modalType === "new" ? <NewDataAccess onClose={() => setEditModalOpen(false)} /> : <EditDataAccess dataAccessId={selectedDataAccessId as number} onClose={() => setEditModalOpen(false)} />
                }
            </Drawer>
            <AlertModal
                show={deleteModalOpen}
                onConfirm={doDelete}
                onClose={() => setDeleteModalOpen(false)}
                title={'Remove a selected data access!'}
                description={'You are not able to revert after removed! Please confirm.'}
            />
        </Container>
    );
};

export default DataAccess;
