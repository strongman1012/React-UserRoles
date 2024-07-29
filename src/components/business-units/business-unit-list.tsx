import React, { FC, useEffect } from 'react';
import {
    DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, SearchPanel, Paging, Pager
} from 'devextreme-react/data-grid';
import { Stack, Typography, Button, Grid } from '@mui/material';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchBusinessUnits } from '../../reducers/businessUnits/businessUnitsSlice';

interface BusinessUnitListsProps {
    onRowClick: (businessUnitId: number) => void;
    onAddNewClick: () => void;
}

const searchEditorOptions = { placeholder: 'Search column' };

const BusinessUnitLists: FC<BusinessUnitListsProps> = ({ onRowClick, onAddNewClick }) => {
    const dispatch = useAppDispatch();
    const businessUnits = useSelector((state: RootState) => state.businessUnits.allBusinessUnits);

    useEffect(() => {
        dispatch(fetchBusinessUnits());
    }, [dispatch]);

    const handleRowClick = (e: any) => {
        const businessUnitId = e.data.id;
        onRowClick(businessUnitId);
    };

    return (
        <Stack width="100%" padding={5}>
            <Typography variant='h5' color="primary">Business Unit Lists</Typography>
            <Grid container justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={onAddNewClick} style={{ marginBottom: 16 }}>
                    New
                </Button>
            </Grid>
            <DataGrid
                id="businessUnits"
                dataSource={businessUnits}
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
                <Column dataField='id' caption='Business Unit ID' allowHiding={false} width={150} />
                <Column dataField='name' caption='Name' allowHiding={false} />
                <Column dataField='parent_name' caption='Parent Business' />
                <Column dataField='website' caption='Website' />
                <Column dataField='mainPhone' caption='Main Phone' />
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
                <Column dataField='status' caption='Status' />

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

export default BusinessUnitLists;
