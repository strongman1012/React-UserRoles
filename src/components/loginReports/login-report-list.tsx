import React, { FC, useEffect } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager
} from 'devextreme-react/data-grid';
import { Stack, Typography } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchLoginReports } from '../../reducers/loginReports/loginReportsSlice';

const searchEditorOptions = { placeholder: 'Search column' };

const LoginReportLists: FC = () => {
    const dispatch = useAppDispatch();
    const loginReports = useAppSelector((state: RootState) => state.loginReports.allLoginReports);

    useEffect(() => {
        dispatch(fetchLoginReports());
    }, [dispatch]);

    const renderStatusCell = (cellData: any) => {
        const isSuccessful = cellData.value;
        const statusText = isSuccessful ? "Success" : "Denied";
        const statusStyle = {
            color: isSuccessful ? 'green' : 'red'
        };

        return (
            <span style={statusStyle}>{statusText}</span>
        );
    };

    return (
        <Stack width="100%" padding={5}>
            <Typography variant='h5' color="primary">Login Report Lists</Typography>
            <DataGrid
                id="loginReports"
                dataSource={loginReports}
                keyExpr="id"
                columnAutoWidth={true}
                showRowLines={true}
                showBorders={true}
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
                <Column dataField='user_id' caption='User ID' alignment='left' allowHiding={false} />
                <Column dataField='userName' caption='User Name' allowHiding={false} />
                <Column dataField='date' caption='Date' />
                <Column dataField='type' caption='Type' />
                <Column dataField='application_name' caption='Application' />
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
        </Stack>
    );
};

export default LoginReportLists;
