import React, { FC, useEffect, useState, useMemo } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager,
    Export, DataGridTypes, Button as GridButton, FilterRow
} from 'devextreme-react/data-grid';
import {
    Button, Container, Box, Card, CardHeader, CardContent, Divider
} from '@mui/material';
import { RootState } from 'src/store/store';
import { useAppDispatch } from 'src/store/hooks';
import { useSelector } from 'react-redux';
import { fetchRoles, deleteRoleById } from 'src/reducers/roles/rolesSlice';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AddIcon from '@mui/icons-material/Add';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { ModalTypes } from 'src/utills/Global';
import AlertModal from 'src/components/Basic/Alert';
import EditRole from 'src/components/Dashboard/roles/EditRole';
import NewRole from 'src/components/Dashboard/roles/NewRole';
import Drawer from 'src/components/Basic/Drawer';
import SecurityRolesForm from 'src/components/Dashboard/security-roles/SecurityRolesForm';

const searchEditorOptions = { placeholder: 'Search column' };

const onExporting = (e: DataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Roles');

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Roles.xlsx');
        });
    });
};

const SecurityRoles: FC = () => {
    const dispatch = useAppDispatch();
    const roles = useSelector((state: RootState) => state.roles.allRoles);
    const editable = useSelector((state: RootState) => state.roles.editable);
    const setting = useSelector((state: RootState) => state.settings.setting);
    const [selectedRoleId, setSelectedRoleId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [modalType, setModalType] = useState<string>(ModalTypes.new);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [openSecurityRole, setOpenSecurityRole] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    useEffect(() => {
        if (roles.length > 0)
            setIsLoading(false);
    }, [roles]);

    // Memoizing defaultPageSize based on the setting
    const defaultPageSize = useMemo(() => {
        return setting?.rowsPerPage ? setting.rowsPerPage : 20;
    }, [setting]);

    // Memoizing allowedPageSizes based on defaultPageSize
    const allowedPageSizes = useMemo(() => {
        return [defaultPageSize, 2 * defaultPageSize, 3 * defaultPageSize];
    }, [defaultPageSize]);

    const handleSecurityRole = (e: any) => {
        setSelectedRoleId(e.row.data.id);
        setOpenSecurityRole(true);
    }

    const handleCreate = () => {
        setModalType(ModalTypes.new);
        setEditModalOpen(true);
    }

    const handleEdit = (e: any) => {
        setModalType(ModalTypes.edit);
        setSelectedRoleId(e.row.data.id);
        setEditModalOpen(true);
    }

    const handleDelete = async (e: any) => {
        setSelectedRoleId(e.row.data.id);
        setDeleteModalOpen(true);
    }

    /**
     * Delete Selected Role
     */
    const doDelete = async () => {
        setDeleteModalOpen(false);
        if (selectedRoleId)
            dispatch(deleteRoleById(selectedRoleId))
    }

    const memorizedDataGrid = useMemo(() => (
        <DataGrid
            id="roles"
            key={defaultPageSize}
            dataSource={roles}
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
            <Column dataField='id' caption='Role ID' allowHiding={false} alignment='left' />
            <Column dataField='name' caption='Role Name' allowHiding={false} />
            <Column caption="Actions" type="buttons" alignment="center" allowHiding={false}>
                <GridButton icon="key" text="Security Role" onClick={handleSecurityRole} cssClass="text-secondary" />
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
    ), [roles, editable, defaultPageSize, allowedPageSizes]);

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Roles"
                        action={
                            <Button startIcon={<AddIcon />} variant="contained" color="primary" sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}
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

            {/* SecurityRoles Drawer */}
            <Drawer
                open={openSecurityRole}
                onClose={() => setOpenSecurityRole(false)}
                onOpen={() => { }}>
                {openSecurityRole && selectedRoleId !== undefined && (
                    <SecurityRolesForm roleId={selectedRoleId as number} openStatus={true} />
                )}
            </Drawer>

            {/* EditRole Drawer */}
            <Drawer
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onOpen={() => { }}>
                {
                    modalType === "new" ? <NewRole onClose={() => setEditModalOpen(false)} /> : <EditRole roleId={selectedRoleId as number} onClose={() => setEditModalOpen(false)} />
                }
            </Drawer>

            <AlertModal
                show={deleteModalOpen}
                onConfirm={doDelete}
                onClose={() => setDeleteModalOpen(false)}
                title={'Remove a selected role!'}
                description={'You are not able to revert after removed! Please confirm.'}
            />
        </Container>
    );
};

export default SecurityRoles;
