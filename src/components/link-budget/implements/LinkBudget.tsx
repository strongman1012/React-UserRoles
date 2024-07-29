import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { FC, useCallback, useEffect, useState } from 'react';
import JSONataService, { createLossHolder } from '../../../services/link-budget/jsonata';
import { Box, Card, Switch, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material';
import {
    IDataResponse, Row, IColWidth, ParamGroup, LinkBudgetParams,
    DatasetName, menuItemPositions, actions, messages
} from '../types/LinkBudgetTypes';
import ParserService from '../../../services/link-budget/parser';
import RowEditModal from './popups/RowEdit';
import ConfirmModal from './popups/Confirm';
import SaveAsModal from './popups/SaveAs';
import OpenModal from './popups/Open';
import { UniqueId } from '../../../utills/functions';
import { Theme, useTheme } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { THEMES } from '../../../utills/constatnts/general';
import { calculateRowsData } from '../../../utills/link-budget';
import LoadingOverlay from './LoadingOverlay';
import { LinkbudgetApi } from '../../../services/link-budget/api-linkbudget';
import { contextMenuItems, initNewData, initRow, initWidths } from './initData';
import LinkBudgetList from './LinkBudgetList';
import LinkBudgetEdit from './LinkBudgetEdit';

const LinkBudget: FC<LinkBudgetParams> = (props: LinkBudgetParams) => {

    const jsonataService = new JSONataService();
    const parserService = new ParserService();
    const [datasetName, setDatasetName] = useState<DatasetName>({ id: props.templateId, name: 'Loading...' });
    const [rowsData, setRowsData] = useState<Row[]>([]);
    const [filteredRowsData, setFilteredRowsData] = useState<Row[]>([]);
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
    const [showNewDialog, setShowNewDialog] = useState<boolean>(false);
    const [dialogType, setDialogType] = useState<string>(actions.edit);
    const [selectedRow, setSelectedRow] = useState<Row>(initRow);
    const [errMsg, setErrMsg] = useState<string | undefined>(undefined);
    const [newRowPosition, setNewRowPosition] = useState<string>(menuItemPositions.above);
    const [newRowData, setNewRowData] = useState<Row>(initRow);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
    const [confirmDialogMsg, setConfirmDialogMsg] = useState<string>('');
    const [showSaveAsDialog, setShowSaveAsDialog] = useState<boolean>(false);
    const [showOpenDialog, setShowOpenDialog] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [colWidths, setColWidths] = useState<IColWidth>(initWidths);
    const [groupEnabled, setGroupEnabled] = useState<boolean>(false);
    const [isLoadPanelVisible, setIsLoadPanelVisible] = useState<boolean>(false);
    const [externalSource, setExternalSource] = useState<ParamGroup | null>(null);
    const [themeName, setThemeName] = useState<string>(props.themeName);

    useEffect(() => {
        const matchedName = props.linkBudgetDatasetNames.find(d => d.id === props.templateId);
        matchedName && setDatasetName(matchedName);
    }, [props.templateId]);

    useEffect(() => {
        setFilteredRowsData(rowsData.filter((row) => row.name !== 'zM'));
    }, [rowsData]);

    const getTemplatesDiff = () => {
        return (
            datasetName.id !== props.source?.service.getInfo().linkBudgetTemplateId
        );
    };

    const [updateTemplateEnabled, setUpdateTemplateEnabled] = useState<boolean>(
        getTemplatesDiff()
    );

    const { enqueueSnackbar } = useSnackbar();

    const theme = useTheme<Theme>();

    useEffect(() => {
        calculateAll(rowsData, props.source)();
    }, [props.source?.userCommsSpecs.commsPayloadSpecs.coding]);

    useEffect(() => {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }, []);

    useEffect(() => {

        if (props.source == undefined) return;
        // Set External Parameter from Parent
        setExternalSource(props.source);

        // Get Grid Data from Server
        getJsonDataFromServer(props.source, props.templateId);
    }, [props.source?.service.getId(), props.templateId]);

    //Update "use template" button
    useEffect(() => {
        setUpdateTemplateEnabled(true);
    }, [
        datasetName.id,
        externalSource?.service.getInfo().linkBudgetTemplateId,
        props.source?.service.getInfo().linkBudgetTemplateId
    ]);

    /**
     * Set Init status
     * @param data
     */
    const setInit = (data: IDataResponse, source: ParamGroup) => {
        const { id, name, items, status, width } = data;
        const { preRunResults } = props;

        // Set File name and ID
        setDatasetName({ id, name });

        // Set Rows Data
        if (preRunResults && preRunResults.length > 0) {
            const mappedRows = preRunResults.map(row => ({
                id: row.id,
                group: row.group || '',
                name: row.key,
                title: row.parameter,
                value: row.value,
                jsonata_exp: row.jsonata_exp || '=0',
                user_exp: row.user_exp || '0',
                order: row.location,
                notes: row.notes
            }));
            setRowsData(mappedRows);
        } else {
            calculateAll(items, source)();
        }

        // Set Group Enabled
        setGroupEnabled(status === 1);

        // Set Column Width
        const colWidth = width?.collapse?.length > 0 ? width : initWidths;
        setColWidths(colWidth);
    };

    /**
     * Getting JSON data from Server
     */
    const getJsonDataFromServer = async (
        source: ParamGroup,
        templateId?: number | string
    ) => {

        try {
            if (templateId && typeof templateId === 'string') {
                const data = await LinkbudgetApi.getLinkBudgetDataByName(templateId);
                !('error' in data) && setInit(data, source);
                if ('items' in data && data.items?.length > 0) {
                    return;
                } else {
                    console.log('Link Budget not found, retrieving default');
                }
            }

            if (templateId && typeof templateId === 'number' && templateId > 0) {
                const data = await LinkbudgetApi.getLinkBudgetDataById(templateId);

                if (data !== undefined) {
                    !('error' in data) && setInit(data, source);
                    if ('items' in data && data.items?.length > 0) {
                        return;
                    } else {
                        console.log('Link Budget not found, retrieving default');
                    }
                }
            }

            const data = await LinkbudgetApi.getLinkBudgetData();
            !('error' in data) && setInit(data, source);

        } catch (err) {
            console.log('An error occurred while fetching link budget data:', err);
        }
    };

    const setTemplateAsDefault = async () => {
        if (props.source == null || datasetName.name == null || datasetName.id == null) return;

        try {
            await LinkbudgetApi.setTemplateForService(
                props.source.service.getId(),
                datasetName.id
            );
            enqueueSnackbar('Saved template as default for service', {
                variant: 'success'
            });
            setUpdateTemplateEnabled(false);
        } catch (err) {
            enqueueSnackbar(`Failed to save template as default`, {
                variant: 'error'
            });
            console.warn(err);
        }
    };

    function sortDataByGroup(dataArray: Row[]): Row[] {
        // Group items by their group property
        const groupedData: { [group: string]: Row[] } = {};
        dataArray.forEach(item => {
            if (!groupedData[item.group]) {
                groupedData[item.group] = [];
            }
            groupedData[item.group].push(item);
        });

        // Sort groups by their keys
        const sortedGroups = Object.keys(groupedData).sort();

        // Flatten the grouped data back into a single array, preserving group order
        const sortedData: Row[] = [];
        sortedGroups.forEach(group => {
            sortedData.push(...groupedData[group]);
        });

        return sortedData;
    }

    /**
     * Save JSON data to Server
     */
    const saveResult = async (saveData: Row[]) => {

        setIsLoadPanelVisible(true);

        const sortedData = sortDataByGroup(saveData);

        // ReOrder
        sortedData.forEach((item: Row, idx: number) => {
            item.order = idx + 1;
        });

        setRowsData(sortedData);

        const storeData = {
            name: datasetName.name,
            id: datasetName.id,
            width: colWidths,
            items: sortedData,
            status: isGrouped() ? 1 : 0
        };

        try {
            const storeResponse = await LinkbudgetApi.storeLinkBudget(storeData);

            if (storeResponse.success) {
                await hideLoadPanel();
                setConfirmDialogMsg(messages.saved);
                setShowConfirmDialog(true);
                setIsUpdated(false);
            } else {
                const errMsg = storeResponse.message;
                setConfirmDialogMsg(errMsg);
                setShowConfirmDialog(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Calculate All JSONata
     */
    const calculateAll = (rowsData: Row[] | null, sourceData: ParamGroup | null) => async () => {
        if (!rowsData || rowsData.length === 0) return;
        if (sourceData === null) return;

        setIsLoadPanelVisible(true);
        const refreshedRowsData = await calculateRowsData(rowsData, sourceData);
        setRowsData(refreshedRowsData);
        setIsLoadPanelVisible(false);
    };

    const calculateValue = async () => {

        const rowData = dialogType === actions.edit ? selectedRow : newRowData;

        if (rowData.id === undefined || rowData.id === 'new_item_id') return;

        // Formula must start with equation
        if (!rowData.user_exp.startsWith('=')) {
            setErrMsg(messages.startSymbol);
            return;
        }

        const user_exp = rowData.user_exp;
        let jsonata_exp = '';
        let value: number = 0;

        const updatedRowsData: Row[] = rowsData.map(item => {
            if (item.id === rowData.id) {
                jsonata_exp = parserService.getJsonataExpression(user_exp);
                return { ...item, user_exp: user_exp, jsonata_exp: jsonata_exp };
            } else {
                return item;
            }
        });

        // In the case of New Row, jsonata expression is calculated from user expression
        if (dialogType === actions.new) {
            jsonata_exp = parserService.getJsonataExpression(user_exp);
        }

        // jsonata expression must not empty string
        if (jsonata_exp !== '' && externalSource !== null) {
            try {
                const lossHolder = createLossHolder(externalSource);
                const expression = await jsonataService.getExpression(
                    jsonata_exp,
                    externalSource,
                    lossHolder
                );
                const result: any = await expression.evaluate({ items: updatedRowsData });

                value = result === undefined ? '!ERROR' : result;
                setErrMsg(undefined);

                // if (typeof result === 'number') {
                //     value = result;
                //     setErrMsg(undefined);
                // } else {
                //     setErrMsg('Unknown String Added');
                // }
            } catch (err: any) {
                setErrMsg(err.message);
            }
        }

        // Set new data to Selected Row
        dialogType === actions.edit &&
            setSelectedRow({
                ...rowData,
                user_exp: user_exp,
                jsonata_exp: jsonata_exp,
                value: value
            });

        // Set new data to new row data
        dialogType === actions.new &&
            setNewRowData({
                ...rowData,
                user_exp: user_exp,
                jsonata_exp: jsonata_exp,
                value: value
            });

        // Set new Grid data
        setRowsData(updatedRowsData);
    };

    /**
     * When Change in Multi Text box
     */
    useEffect(() => {

        // User typing ended
        const delayCalcFn = setTimeout(async () => {
            await calculateValue();
        }, 1500);

        return () => {
            clearTimeout(delayCalcFn);
        };
    }, [selectedRow.user_exp, newRowData.user_exp, dialogType]);

    /**
     * When click Edit icon on Row
     * @param e
     */
    const handleRowEdit = (data: Row) => {
        setSelectedRow(data);
        setErrMsg(undefined);
        setShowEditDialog(true);
    };

    /**
     * Handle Row Edit Modal OK
     */
    const handleEditModalOk = () => {

        let canUpdate = true;

        // Check name is duplicated or not
        const itemWithSameName = rowsData.filter(
            (item) => item.name === selectedRow.name
        );

        if (selectedRow.name !== '' && itemWithSameName.length > 0) {
            if (itemWithSameName[0].id !== selectedRow.id) {
                canUpdate = false;
            }
        }

        if (canUpdate) {
            const updatedRowsData: Row[] = rowsData.map(item => {
                return item.id === selectedRow.id ? selectedRow : item;
            });

            setRowsData(updatedRowsData);
            setShowEditDialog(false);
            setIsUpdated(true);
        } else {
            alert('Name is duplicated. Please choose another');
        }
    };

    /**
     * Handle Row Edit Modal Cancel
     */
    const handleEditModalCancel = () => {
        setShowEditDialog(false);
    };

    /**
     * Handle New Row Modal Ok
     */
    const handleNewModalOk = async () => {
        const newRowsData: Row[] = rowsData;

        const rowData = { ...newRowData, id: UniqueId(10) };

        // Check name is duplicated or not
        const itemWithSameName = rowsData.filter(
            (item) => item.name === rowData.name
        );

        if (rowData.name !== '' && itemWithSameName.length > 0) {
            alert('Name is duplicated. Please choose another');
        } else {
            if (selectedRow) {
                // Get selected Row order from rowsData
                const selectedRowIndex = rowsData.findIndex(
                    (item) => item.name === selectedRow.name
                );

                // Insert new Data to above
                if (newRowPosition === menuItemPositions.above) {
                    newRowsData.splice(selectedRowIndex, 0, rowData);
                }

                // Insert new Data to below
                if (newRowPosition === menuItemPositions.below) {
                    newRowsData.splice(selectedRowIndex + 1, 0, rowData);
                }

                // ReOrder
                newRowsData.forEach((item: Row, idx: number) => {
                    item.order = idx + 1;
                });

                try {
                    const storeResponse = await LinkbudgetApi.storeLinkBudget({
                        name: datasetName.name,
                        id: datasetName.id,
                        items: newRowsData
                    });

                    if (storeResponse.success && externalSource !== null) {
                        getJsonDataFromServer(externalSource);
                    } else {
                        const errMsg = storeResponse.message;
                        setConfirmDialogMsg(errMsg);
                        setShowConfirmDialog(true);
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            setShowNewDialog(false);
            setIsUpdated(true);
        }
    };

    /**
     * Handle New Row Modal Cancel
     */
    const handleNewModalCancel = () => {
        setShowNewDialog(false);
    };

    /**
     * Context Menu Item Click action
     */
    const menuItemClick = useCallback(async (e: any) => {

        setNewRowPosition(e.itemData.position);

        if (e.itemData.position === menuItemPositions.delete) {
            // Delete item
            const deletedRows = rowsData.filter((row) => {
                return row.id !== selectedRow.id;
            });

            // ReOrder
            deletedRows.forEach((item: Row, idx: number) => {
                item.order = idx + 1;
            });

            try {
                const storeResponse = await LinkbudgetApi.storeLinkBudget({
                    name: datasetName.name,
                    id: datasetName.id,
                    items: deletedRows
                });

                if (storeResponse.success) {
                    setRowsData(deletedRows);
                    setIsUpdated(false);
                } else {
                    const errMsg = storeResponse.message;
                    setConfirmDialogMsg(errMsg);
                    setShowConfirmDialog(true);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            setShowNewDialog(true);
        }
    }, [selectedRow]);

    /**
     * New: Clears data set;
     * If current data set has not been saved and a change has been made,
     * asked if it should be saved.
     */
    const handleNewDataSet = () => {

        if (isUpdated) {
            setShowConfirmDialog(true);
            setConfirmDialogMsg(messages.updated);
        } else {

            // Load New data from Server
            if (externalSource !== null) {
                // const data = await LinkbudgetApi.getLinkBudgetNewData();

                const datasetName = initNewData.name;
                const duplicatedNames = props.linkBudgetDatasetNames.filter(d => d.name.startsWith(datasetName));

                if (duplicatedNames.length > 0) {
                    // Find the highest index
                    let highestIndex = 0;
                    duplicatedNames.forEach(name => {
                        const index = parseInt(name.name.slice(datasetName.length));
                        if (!isNaN(index) && index > highestIndex) {
                            highestIndex = index;
                        }
                    });
                    const newData = { ...initNewData, name: `${datasetName}${highestIndex + 1}` };
                    setInit(newData, externalSource);
                } else {
                    setInit(initNewData, externalSource);
                }
            }
        }
    };

    /**
     * Shows a dialog box to enter name of dataset.
     */
    const saveAs = async (name: string) => {
        if (name == null) return;

        setDatasetName({ ...datasetName, name: name });

        const storeData = {
            name: name,
            id: datasetName.id,
            width: colWidths,
            items: rowsData,
            status: isGrouped() ? 1 : 0
        };

        try {
            const storeResponse = await LinkbudgetApi.storeLinkBudget(storeData);

            if (storeResponse.success) {
                setIsUpdated(false);
                setShowSaveAsDialog(false);
            } else {
                const errMsg = storeResponse.message;
                setConfirmDialogMsg(errMsg);
                setShowConfirmDialog(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    /**
     * Open Open Dialog
     */
    const openDataset = () => {
        if (isUpdated) {
            setShowOpenDialog(true);
            setConfirmDialogMsg(messages.updated);
        } else {
            setShowOpenDialog(true);
        }
    };

    /**
     * Load saved dataset
     * @param name
     */
    const loadSelectedDataSet = (source: ParamGroup) => async (name: string, id: number) => {
        setIsLoadPanelVisible(true);
        // getLinkBudgetDataByName
        const responseData = await LinkbudgetApi.getLinkBudgetDataById(id);
        if (responseData && !('error' in responseData)) {
            setInit(responseData, source);
            setDatasetName({ name: name, id: id });
        }

        setShowOpenDialog(false);
        await hideLoadPanel();
    };

    /**
     * Hide Loading Panel
     * @returns Promise
     */
    const hideLoadPanel = async () => {
        setTimeout(() => {
            setIsLoadPanelVisible(false);
        }, 1000);
        return new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const isGrouped = (): boolean => {
        const groupRows = document.getElementsByClassName('dx-group-row');
        return groupRows.length > 0;
    }

    return (
        <>
            <Box width="100%">
                {isLoadPanelVisible && (
                    <LoadingOverlay
                        isLoading={true}
                        status={'Generating Link Budget'}
                        progress={0}
                    />
                )}

                <Card
                    style={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary
                    }}
                >
                    <CardHeader
                        title={datasetName.name}
                        action={
                            <Typography component="div" style={{ marginRight: '12px' }}>
                                <Grid component="label" container alignItems="center">
                                    <Grid item>Light</Grid>
                                    <Grid item>
                                        <Switch
                                            checked={themeName === THEMES.DARK}
                                            onChange={() => {
                                                const newTheme = themeName === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
                                                setThemeName(newTheme);
                                                props.onChangeTheme(newTheme);
                                            }}
                                            name="checkTheme"
                                        />
                                    </Grid>
                                    <Grid item>Dark</Grid>
                                </Grid>
                            </Typography>
                        }
                    />
                    <Divider />
                    <CardContent>
                        {isEditMode ?
                            <LinkBudgetEdit
                                isEngineer={props.isEngineer}
                                isGroupedEnabled={groupEnabled}
                                isUpdateTemplateEnabled={updateTemplateEnabled}
                                dataSource={rowsData}
                                initColWidths={colWidths}
                                externalSource={externalSource}
                                datasetName={datasetName}
                                onAddNewRow={(rowsData: Row[]) => calculateAll(rowsData, externalSource)()}
                                onNewDataset={handleNewDataSet}
                                onSaveData={saveResult}
                                onOpenDataset={openDataset}
                                onSaveAs={() => setShowSaveAsDialog(true)}
                                onRefresh={(rowsData, sourceData) => calculateAll(rowsData, sourceData)()}
                                onSetTemplateAsDefault={setTemplateAsDefault}
                                onDoneEditMode={() => setIsEditMode(false)}
                                onRowEdit={handleRowEdit}
                                onShowErrorMessage={(errMsg: string) => {
                                    setErrMsg(errMsg);
                                    setShowConfirmDialog(true);
                                }}
                            /> :
                            <LinkBudgetList
                                isEngineer={props.isEngineer}
                                isGroupedEnabled={groupEnabled}
                                isUpdateTemplateEnabled={updateTemplateEnabled}
                                dataSource={filteredRowsData}
                                colWidths={colWidths}
                                externalSource={externalSource}
                                datasetName={datasetName}
                                onOpenDataset={openDataset}
                                onRefresh={(rowsData, sourceData) => calculateAll(rowsData, sourceData)()}
                                onSetTemplateAsDefault={setTemplateAsDefault}
                                onLoadEditMode={() => setIsEditMode(true)}
                            />
                        }
                    </CardContent>
                </Card>

                {/* Modal for Edit */}
                <RowEditModal
                    row={selectedRow}
                    visible={showEditDialog}
                    onChangeName={(e) => setSelectedRow({ ...selectedRow, name: e.target.value })}
                    onChangeTitle={(e) => setSelectedRow({ ...selectedRow, title: e.target.value })}
                    onChangeCode={(e) => {
                        setDialogType(actions.edit);
                        setSelectedRow({ ...selectedRow, user_exp: e.target.value });
                    }}
                    onChangeNotes={(e) => setSelectedRow({ ...selectedRow, notes: e.target.value })}
                    onOk={handleEditModalOk}
                    onHide={handleEditModalCancel}
                    error={errMsg}
                />

                {/* Modal for New */}
                <RowEditModal
                    row={newRowData}
                    visible={showNewDialog}
                    onChangeName={(e) => {
                        setNewRowData({ ...newRowData, name: e.target.value });
                    }}
                    onChangeTitle={(e) => {
                        setNewRowData({ ...newRowData, title: e.target.value });
                    }}
                    onChangeCode={(e) => {
                        setDialogType(actions.new);
                        setNewRowData({ ...newRowData, user_exp: e.target.value });
                    }}
                    onChangeNotes={(e) => {
                        setNewRowData({ ...newRowData, notes: e.target.value });
                    }}
                    onOk={handleNewModalOk}
                    onHide={handleNewModalCancel}
                    error={errMsg}
                />

                {/* Confirm Modal */}
                <ConfirmModal
                    visible={showConfirmDialog}
                    message={confirmDialogMsg}
                    onOk={() => {
                        setShowConfirmDialog(false);
                    }}
                    onHide={() => {
                        setShowConfirmDialog(false);
                    }}
                />

                {/* Save as Modal */}
                <SaveAsModal
                    visible={showSaveAsDialog}
                    datasetName={datasetName}
                    onChange={(e) => {
                        e.target && setDatasetName({ id: -1, name: e.target.value });
                    }}
                    onOk={saveAs}
                    onHide={() => {
                        setShowSaveAsDialog(false);
                    }}
                />

                {/* Open Modal */}
                {externalSource !== null &&
                    <OpenModal
                        visible={showOpenDialog}
                        selected={datasetName}
                        datasetNames={props.linkBudgetDatasetNames}
                        loadLinkBudgetDatasetNames={props.loadLinkBudgetDatasetNames}
                        onOk={(name, id) => loadSelectedDataSet(externalSource)(name, id)}
                        onHide={() => setShowOpenDialog(false)}
                    />
                }

                {/* Right Click Menu */}
                <ContextMenu
                    dataSource={contextMenuItems}
                    width={200}
                    onItemClick={menuItemClick}
                    target=".dx-data-row"
                    disabled={!isEditMode}
                />
            </Box>
        </>
    );
};

export default LinkBudget;
