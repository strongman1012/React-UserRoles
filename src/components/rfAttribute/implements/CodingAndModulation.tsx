import React from 'react';
import {
    makeStyles,
    Theme
} from '@material-ui/core';
import { Button, Grid, Card, Divider, CardContent } from '@mui/material';
import { DataGrid } from 'devextreme-react';
import { Column, Editing, FilterRow } from 'devextreme-react/data-grid';
import { FC, useState } from 'react';
import { THEMES } from '../../../utills/constatnts/general';
import AddIcon from '@mui/icons-material/Add';
import CodingRateModal from './CodingRateModal';
import ModulationModal from './ModulationModal';
import { CodingTypeUpdate, ModulationUpdate } from '../types/msTypes';

const customStyles = makeStyles((theme: Theme) => ({
    dataTableStyle: {
        '& .dx-row.dx-header-row': {
            backgroundColor: theme.palette.background.paper,
            fontWeight: 'bold',
            color: '#333333'
        },
        '& .dx-command-edit.dx-command-edit-with-icons': {
            textAlign: 'right !important',
            '& *': {
                // color: `${theme.palette.border?.main} !important`
            }
        },
        height: '66vh',
        '& .dx-datagrid .dx-editor-with-menu .dx-menu-item-content .dx-icon.dx-icon-filter-operation-default': { color: theme.palette.text.primary },
        '& .dx-datagrid .dx-editor-with-menu .dx-texteditor .dx-texteditor-input': { color: theme.palette.text.primary },
        '& .dx-editor-container': { backgroundColor: theme.palette.type === THEMES.DARK ? '#333333' : `` },
        '& .dx-datagrid .dx-datagrid-content .dx-datagrid-table .dx-row:nth-child(2) > .dx-command-edit.dx-command-edit-with-icons': {
            backgroundColor: theme.palette.type === THEMES.DARK ? '#333333' : ''
        },
        '& .dx-editor-cell .dx-texteditor .dx-texteditor-input': { color: theme.palette.text.primary },
        // Change edit border bottom color of filter row
        '& .dx-datagrid-focus-overlay:after': {
            backgroundColor: 'rgb(227, 71, 72) !important',
        },
    },
    text: {
        color: `${theme.palette.text.primary} !important`,
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: ' 0.05em',
        display: 'flex'
    },
    select: {
        background: theme.palette.type === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px',
        gap: '1px',
        border: '0px'
    },
}));

interface Props {
    editMode: boolean;
    codingRates: any[];
    modulations: any[];
    handleCodingUpdate: (data: CodingTypeUpdate) => void;
    handleModulationUpdate: (data: ModulationUpdate) => void;
    handleCodingRemove: (data: any) => void;
    handleModulationRemove: (data: any) => void;
    handleCreateCodingRate: (value: any) => void;
    handleCreateModulation: (value: any) => void;
}

const CodingAndModulation: FC<Props> = ({
    handleCreateModulation,
    handleCreateCodingRate,
    editMode,
    codingRates,
    modulations,
    handleCodingUpdate,
    handleModulationUpdate,
    handleCodingRemove,
    handleModulationRemove,
}) => {
    const [manageNewModulationVisible, setManageNewModulationVisible] =
        useState<boolean>(false);
    const [manageNewCodingRateVisible, setManageNewCodingRateVisible] =
        useState<boolean>(false);

    const customClasses = customStyles();

    function handCreateNewModulation() {
        setManageNewModulationVisible(true);
    }

    function handCreateNewCodingRate() {
        setManageNewCodingRateVisible(true);
    }

    return (
        <>
            <Card>
                <Divider />
                <CardContent style={{ height: '49vh' }}>
                    <Grid container alignItems="flex-start">
                        <Grid item md={6} data-testid={'modulationTable'}>
                            <DataGrid
                                id={'modulationTable'}
                                dataSource={modulations}
                                showBorders={true}
                                allowColumnResizing={true}
                                columnAutoWidth={true}
                                allowColumnReordering={true}
                                showRowLines={true}
                                // @ts-expect-error because the library does not have the correct types for this feature
                                onRowUpdating={({ cancel, newData, oldData }) => handleModulationUpdate({ cancel, newData, oldData })}
                                onRowRemoved={({ key }) => handleModulationRemove({ key })}
                                className={customClasses.dataTableStyle}
                                paging={{ enabled: false }}
                                scrolling={{ mode: 'infinite' }}
                                wordWrapEnabled={true}
                            >
                                {editMode && (
                                    <Editing
                                        mode="row"
                                        allowUpdating={true}
                                        allowDeleting={true}
                                        confirmDelete={true}
                                    />
                                )}
                                <FilterRow
                                    visible={true}
                                />
                                <Column caption="Modulation" dataField="Name" />
                            </DataGrid>
                        </Grid>
                        <Grid item md={6} data-testid={'codingRateTable'}>
                            <DataGrid
                                id='codingRateTable'
                                dataSource={codingRates}
                                showBorders={true}
                                allowColumnResizing={true}
                                columnAutoWidth={true}
                                showRowLines={false}
                                allowColumnReordering={true}
                                // @ts-expect-error because the library does not have the correct types for this feature
                                onRowUpdating={({ cancel, newData, oldData }) => handleCodingUpdate({ cancel, newData, oldData })}
                                onRowRemoved={({ key }) => handleCodingRemove({ key })}
                                className={customClasses.dataTableStyle}
                                paging={{ enabled: false }}
                                scrolling={{ mode: 'infinite' }}
                                wordWrapEnabled={true}
                            >
                                {editMode && (
                                    <Editing
                                        mode="row"
                                        allowUpdating={true}
                                        allowDeleting={true}
                                        confirmDelete={true}
                                    />
                                )}
                                <FilterRow
                                    visible={true}
                                />
                                <Column caption="Coding Rate" dataField="name" />
                                {/* <Paging defaultPageSize={15} /> */}
                            </DataGrid>

                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {editMode &&
                <Grid container alignItems="flex-start">
                    <Grid item md={6}>
                        <Grid container justifyContent="flex-start">
                            <Grid item>
                                <Button
                                    type="button"
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    color="primary"
                                    onClick={handCreateNewModulation}
                                    style={{ margin: '10px' }}
                                >
                                    {'New Modulation'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6}>
                        <Grid container justifyContent="flex-start">
                            <Grid item>
                                <Button
                                    type="button"
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    color="primary"
                                    onClick={handCreateNewCodingRate}
                                    style={{ margin: '10px' }}
                                >
                                    {'New Coding Rate'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            <CodingRateModal
                codingRates={codingRates}
                open={manageNewCodingRateVisible}
                onOpen={() => setManageNewCodingRateVisible(false)}
                handleCreateCodingRate={handleCreateCodingRate}
            />
            <ModulationModal
                modulations={modulations}
                open={manageNewModulationVisible}
                onOpen={() => setManageNewModulationVisible(false)}
                handleCreateModulation={handleCreateModulation}
            />
        </>
    );
};

export default CodingAndModulation;
