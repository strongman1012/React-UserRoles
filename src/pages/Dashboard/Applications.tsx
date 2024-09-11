import React, { FC, useEffect, useState } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager,
    Export, DataGridTypes, Button as GridButton
} from 'devextreme-react/data-grid';
import {
    Button, Container, Box, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchApplications, deleteApplicationById } from '../../reducers/applications/applicationsSlice';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AddIcon from '@mui/icons-material/Add';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { ModalTypes } from 'src/utills/Global';
import AlertModal from 'src/components/Basic/Alert';
import EditApplication from 'src/components/Dashboard/applications/EditApplication';
import NewApplication from 'src/components/Dashboard/applications/NewApplication';
import Drawer from 'src/components/Basic/Drawer';

const searchEditorOptions = { placeholder: 'Search column' };

const onExporting = (e: DataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Applications.xlsx');
        });
    });
};

const Applications: FC = () => {
    const dispatch = useAppDispatch();
    const applications = useSelector((state: RootState) => state.applications.allApplications);
    const editable = useSelector((state: RootState) => state.applications.editable);
    const [selectedApplicationId, setSelectedApplicationId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modalType, setModalType] = useState<string>(ModalTypes.new);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchApplications());
    }, [dispatch]);

    useEffect(() => {
        if (applications.length > 0)
            setIsLoading(false);
    }, [applications]);

    const handleCreate = () => {
        setModalType(ModalTypes.new);
        setEditModalOpen(true);
    }

    const handleEdit = (e: any) => {
        setModalType(ModalTypes.edit);
        setSelectedApplicationId(e.row.data.id);
        setEditModalOpen(true);
    }

    const handleDelete = async (e: any) => {
        setSelectedApplicationId(e.row.data.id);
        setDeleteModalOpen(true);
    }

    /**
     * Delete Selected Application
     */
    const doDelete = async () => {
        setDeleteModalOpen(false);
        if (selectedApplicationId)
            dispatch(deleteApplicationById(selectedApplicationId))
    }

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined" sx={{ border: (theme) => `1px solid ${theme.palette.primary.main}` }}>
                    <CardHeader title="Applications"
                        sx={{ background: (theme) => `${theme.palette.primary.main}`, color: '#f7f7f7' }}
                        action={
                            <Button startIcon={<AddIcon />} variant="contained" sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}
                                onClick={handleCreate} disabled={editable ? false : true}>
                                New
                            </Button>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <DataGrid
                            id="applications"
                            dataSource={applications}
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
                            <Column dataField='id' caption='Application ID' allowHiding={false} alignment='left' />
                            <Column dataField='name' caption='Application Name' allowHiding={false} />
                            <Column dataField='description' caption='Description' allowHiding={false} />
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

            {/* EditApplication Drawer */}
            <Drawer
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onOpen={() => { }}>
                {
                    modalType === "new" ? <NewApplication onClose={() => setEditModalOpen(false)} /> : <EditApplication applicationId={selectedApplicationId as number} onClose={() => setEditModalOpen(false)} />
                }
            </Drawer>

            <AlertModal
                show={deleteModalOpen}
                onConfirm={doDelete}
                onClose={() => setDeleteModalOpen(false)}
                title={'Remove a selected application!'}
                description={'You are not able to revert after removed! Please confirm.'}
            />
        </Container>
    );
};

export default Applications;
