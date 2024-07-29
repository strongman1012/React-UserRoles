import React, { FC, useEffect } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager
} from 'devextreme-react/data-grid';
import { Stack, Typography } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchUsers } from '../../reducers/users/usersSlice';

interface UserListsProps {
    onRowClick: (userId: number) => void;
}

const searchEditorOptions = { placeholder: 'Search column' };

const UserLists: FC<UserListsProps> = ({ onRowClick }) => {
    const dispatch = useAppDispatch();
    const users = useSelector((state: RootState) => state.users.allUsers);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleRowClick = (e: any) => {
        const userId = e.data.id;
        onRowClick(userId);
    };

    return (
        <Stack width="100%" padding={5}>
            <Typography variant='h5' color="primary">User Lists</Typography>
            <DataGrid
                id="users"
                dataSource={users}
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
                <Column dataField='id' caption='User ID' allowHiding={false} width={100} />
                <Column dataField='userName' caption='Username' allowHiding={false} />
                <Column dataField='email' caption='Email' allowHiding={false} />
                <Column dataField='fullName' caption='Full Name' />
                <Column dataField='mobilePhone' caption='Mobile Phone' />
                <Column dataField='mainPhone' caption='Main Phone' />
                <Column dataField='status' caption='Status' />
                <Column dataField='role_name' caption='Role Name' />
                <Column dataField='business_name' caption='Business Unit' />
                <Column dataField='team_id' caption='Team' />

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

export default UserLists;
