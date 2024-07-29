import React, { FC, useEffect } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager
} from 'devextreme-react/data-grid';
import { Stack, Typography } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchRoles } from '../../reducers/roles/rolesSlice';

interface SecurityRolesProps {
    onRowClick: (roleId: number) => void;
}

const searchEditorOptions = { placeholder: 'Search column' };

const SecurityRoles: FC<SecurityRolesProps> = ({ onRowClick }) => {
    const dispatch = useAppDispatch();
    const roles = useSelector((state: RootState) => state.roles.allRoles);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    const handleRowClick = (e: any) => {
        const roleId = e.data.id;
        onRowClick(roleId);
    };

    return (
        <Stack width="100%" padding={5}>
            <Typography variant='h5' color="primary">Security Roles</Typography>
            <DataGrid
                id="roles"
                dataSource={roles}
                keyExpr="id"
                columnAutoWidth={true}
                showRowLines={true}
                showBorders={true}
                onRowClick={handleRowClick}
            >
                <SearchPanel
                    visible={true}
                    width={240}
                    placeholder="Search..." />
                <Paging defaultPageSize={10} />
                <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={[5, 10]}
                    showInfo={true} />
                <Column dataField='id' caption='Role ID' allowHiding={false} width={100} />
                <Column dataField='name' caption='Role Name' allowHiding={false} />

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
        </Stack>
    );
};

export default SecurityRoles;
