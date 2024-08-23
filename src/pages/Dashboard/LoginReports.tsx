import React, { FC, useState, useEffect } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager, Export, DataGridTypes
} from 'devextreme-react/data-grid';
import { Container, Box, Divider, Card, CardHeader, CardContent } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchLoginReports } from '../../reducers/loginReports/loginReportsSlice';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';

const searchEditorOptions = { placeholder: 'Search column' };

const onExporting = (e: DataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Login Reports');

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'LoginReports.xlsx');
        });
    });
};

const LoginReports: FC = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const loginReports = useAppSelector((state: RootState) => state.loginReports.allLoginReports);

    useEffect(() => {
        dispatch(fetchLoginReports());
    }, [dispatch]);

    useEffect(() => {
        if (loginReports.length > 0)
            setIsLoading(false);
    }, [loginReports]);

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

    const renderUserNameCell = (cellData: any) => {
        const userName = cellData.value;
        return userName && userName.trim() !== '' ? userName : 'Deleted user';
    };

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Login Reports" />
                    <Divider />
                    <CardContent>
                        <DataGrid
                            id="loginReports"
                            dataSource={loginReports}
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
                            <Column dataField='user_id' caption='User ID' alignment='left' allowHiding={false} />
                            <Column
                                dataField='userName'
                                caption='User Name'
                                allowHiding={false}
                                cellRender={renderUserNameCell}
                            />
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
                    </CardContent>
                </Card>
            </Box>
        </Container>

    );
};

export default LoginReports;
