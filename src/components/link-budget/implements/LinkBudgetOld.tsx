import React from 'react';
import {
    DataGrid,
    Column,
    Item,
    Toolbar,
    Button as GridButton,
    RowDragging,
    Scrolling,
    Editing,
    Grouping,
    Sorting
} from 'devextreme-react/data-grid';
import ContextMenu from 'devextreme-react/context-menu';
import Button from 'devextreme-react/button';
import { FC, useCallback, useEffect, useState } from 'react';
import JSONataService, { createLossHolder } from '../../../services/link-budget/jsonata';
import { Box, Card, Switch, CardContent, CardHeader, Divider } from '@mui/material';
import {
    IDataResponse,
    Row,
    IColWidth,
    ParamGroup,
    LinkBudgetParams,
    DatasetName,
    menuItemPositions,
    actions,
    messages
} from '../types/LinkBudgetTypes';
import ParserService from '../../../services/link-budget/parser';
import RowEditModal from './popups/RowEdit';
import ConfirmModal from './popups/Confirm';
import SaveAsModal from './popups/SaveAs';
import OpenModal from './popups/Open';
import { UniqueId } from '../../../utills/functions';
import * as excelJS from 'exceljs';
import { saveAs as saveAsFile } from 'file-saver';
import { Grid, Theme, Typography, makeStyles, useTheme } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { THEMES } from '../../../utills/constatnts/general';
import { calculateRowsData } from '../../../utills/link-budget';
import LoadingOverlay from './LoadingOverlay';
import { LinkbudgetApi } from '../../../services/link-budget/api-linkbudget';
import { contextMenuItems, initNewData, initRow, initWidths } from './initData';

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        // backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary
    },
    root: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
    },
    table: {
        '& .dx-datagrid-header-panel, & .dx-toolbar-items-container': {
            background: theme.palette.background.default
        },
        '& .dx-button-content': {
            color: theme.palette.primary.light,
            backgroundColor: theme.palette.primary.main
        },
        '& .dx-datagrid, & .dx-gridbase-container, & .dx-datagrid-borders': {
            borderColor: 'black'
        },
        '& .dx-row, & .dx-data-row & .dx-row-lines': {
            color: theme.palette.text.primary
        },
        '& .dx-texteditor-input': {
            color: theme.palette.text.primary
        },
        '& .dx-datagrid-content, & .dx-datagrid-table.dx-datagrid-table-fixed': {
            maxWidth: '100%'
        },
        '& .dx-button-has-icon, & .dx-icon': {
            color: 'white'
        },
        '& .dx-button.dx-state-hover': {
            backgroundColor: theme.palette.grey[700]
        },
        '& .dx-datagrid .dx-link': {
            color: theme.palette.text.primary
        }
    },
    marginRow: {
        backgroundColor: theme.palette.background.default
    }
}));

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
    const [editMode, setEditMode] = useState(false);
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

    const classes = useStyles();
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
    const saveResult = async () => {

        setIsLoadPanelVisible(true);

        const sortedData = sortDataByGroup(rowsData);

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

        // const headerRows: any = document.querySelectorAll('td[role="columnheader"]');
        // const widthsArray: string[] = [];

        // if (editMode) {
        //     for (let i = 1; i < headerRows.length - 1; i++) {
        //         if(headerRows[i].style.width.length>0){
        //             widthsArray.push(headerRows[i].style.width)
        //         }
        //     }
        //     storeData.width.expanded = widthsArray;
        // } else {
        //     for (let i = 0; i < headerRows.length - 1; i++) {
        //         if(headerRows[i].style.width.length>0){
        //             widthsArray.push(headerRows[i].style.width)
        //         }
        //     }

        //     storeData.width.collapse = widthsArray
        // }

        // setColWidths(storeData.width);

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

    /**
     * When click Edit icon on Row
     * @param e
     */
    const handleEdit = (e: any) => {
        setSelectedRow(e.row.data);
        setErrMsg(undefined);
        setShowEditDialog(true);
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
     * Handle New Row add to DataGrid
     * @param e 
     * @param type 0: above, 1: below
     */
    const handleAddNewRow = async (e: any, type: number) => {

        const rowData = isGrouped() ?
            { ...newRowData, id: UniqueId(10), group: e.row.data.group } :
            { ...newRowData, id: UniqueId(10) };

        const selectedRowIndex = rowsData.findIndex(
            (item) => item.name === e.row.data.name
        );

        const newRowsData: Row[] = rowsData;
        const newRowIndex = type ? selectedRowIndex + 1 : selectedRowIndex;
        newRowsData.splice(newRowIndex, 0, rowData);

        // ReOrder
        newRowsData.forEach((item: Row, idx: number) => {
            item.order = idx + 1;
        });

        externalSource && setInit({ ...initNewData, items: newRowsData }, externalSource);
    };

    /**
     * Delete selected row
     * @param e
     */
    const deleteSelectedRow = async (e: any) => {
        // Delete item
        const deletedRows = rowsData.filter((row) => {
            return row.id !== e.row.data.id;
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
     * Process before Context Menu Display
     */
    const handleOnMenuPreparing = useCallback((e: any) => {

        if (e.row && e.row.rowType === 'data') {
            setSelectedRow(e.row.data);

            // Remove Ungroup Item from menu
            // e.items.splice(0, 1);
        }
    }, []);

    /**
     * New: Clears data set;
     * If current data set has not been saved and a change has been made,
     * asked if it should be saved.
     */
    const newDataSet = (source: ParamGroup | null) => async () => {

        if (isUpdated) {
            setShowConfirmDialog(true);
            setConfirmDialogMsg(messages.updated);
        } else {

            // Load New data from Server
            if (source !== null) {
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
                    setInit(newData, source);
                } else {
                    setInit(initNewData, source);
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
     * Hide or Show Computation Columns
     * @param e
     */
    // const switchComputations = (e: any) => {
    //     setShowComputations(!e.value);
    // }

    /**
     * Export data to Excel
     */
    const exportExcel = () => {
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');

        workbook.created = new Date();
        workbook.modified = new Date();

        worksheet.getRow(1).values = [
            '',
            'Item Name',
            'Item Title',
            'Value',
            'JSONata String',
            'Notes'
        ];
        worksheet.columns = [
            { key: 'order', width: 10 },
            { key: 'name', width: 30 },
            { key: 'title', width: 30 },
            { key: 'value', width: 20 },
            { key: 'user_exp', width: 50 },
            { key: 'notes', width: 50 }
        ];
        worksheet.addRows(rowsData);

        // Formatting First Row
        worksheet.getRow(1).eachCell((cell, colNumber) => {
            cell.alignment = {
                vertical: 'middle'
            };
            cell.font = { size: 11, bold: true };
        });

        workbook.xlsx.writeBuffer().then(function (buffer) {
            const blob = new Blob([buffer], { type: 'applicationi/xlsx' });
            saveAsFile(blob, `${datasetName.name}.xlsx`);
        });
    };

    /**
     * Export data to PDF
     */
    // const exportPdf = async () => {
    //     const blob = await pdf(
    //         <PdfReport rows={rowsData} />
    //     ).toBlob();

    //     saveAsFile(blob, datasetName);
    // }

    /**
     * Reorder
     * @param e
     */
    const HandleOnDragReorder = (e: any) => {
        const visibleRows = e.component.getVisibleRows();
        const newRowsData = [...rowsData];

        let toIndex = newRowsData.findIndex(
            (item) => item.id === visibleRows[e.toIndex].data.id
        );
        const fromIndex = newRowsData.findIndex(
            (item) => item.id === e.itemData.id
        );

        if (isGrouped()) {
            const movedRow = newRowsData[fromIndex];
            const fromGroupName = movedRow.group;
            let toGroupName = visibleRows[e.toIndex].data.group;

            if (toGroupName !== undefined && fromGroupName !== toGroupName) {
                movedRow.group = toGroupName;
            }

            // In the case moved last of group
            if (toGroupName === undefined) {

                toGroupName = visibleRows[e.toIndex].data.key;
                toIndex = newRowsData.findIndex(
                    (item) => item.id === visibleRows[e.toIndex - 1].data.id
                );

                if (toGroupName === fromGroupName) {
                    toGroupName = visibleRows[e.toIndex - 1].data.group;
                    console.log(visibleRows[e.toIndex - 1]);
                    toIndex = toIndex++;
                }

                movedRow.group = toGroupName;
            }
        }

        if (toIndex > -1) {
            newRowsData.splice(fromIndex, 1);
            newRowsData.splice(toIndex, 0, e.itemData);
        }

        // ReOrder
        newRowsData.forEach((item: Row, idx: number) => {
            item.order = idx + 1;
        });

        setRowsData(newRowsData);
    };

    /**
     * When Column size changed
     */
    const handleOptionChanged = (e: any) => {
        if (e.name === 'columns' && e.fullName.includes('width')) {
            const regExp = /\d+/g;
            const regRlt: any = regExp.exec(e.fullName);
            const colIdx = Number(regRlt[0]);
            const newColWidth: IColWidth = colWidths;
            if (editMode) {
                newColWidth.expanded[colIdx] = e.value;
            } else {
                newColWidth.collapse[colIdx] = e.value;
            }
            setColWidths({
                expanded: newColWidth.expanded,
                collapse: newColWidth.collapse
            });
        }
    };

    /**
     * Cell Format if value 0 then return empty string
     * @param rowData
     * @returns
     */
    const doCellValueFormat = (rowData: Row) => {
        const convertedVal =
            typeof rowData.value === 'string'
                ? rowData.value
                : Math.round(rowData.value * 100) / 100;
        // return rowData.value === 0 ? '' : convertedVal;
        return convertedVal;
    };

    /**
     * Calculate after Row Updated
     * @param e
     */
    const handleRowUpdated = async (e: any) => {

        if (externalSource !== null) {
            const refreshedRowsData = await calculateRowsData(rowsData, externalSource);
            setRowsData(refreshedRowsData);
        } else {
            ///////  Else case ///////////

        }
    };

    // const updateCellsForError = () => {
    //     setTimeout(() => {
    //         // Error display
    //         const cells = document.querySelectorAll(".dx-datagrid-table td");
    //         cells.forEach(function(cell) {
    //             if (cell.textContent?.trim() === "!ERROR") {
    //                 cell.classList.add("error");
    //             }
    //         });
    //     }, 1000);
    // }

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

    function onCellPrepared(e: any) {
        // const marginValue = resultLinkBudget.find(parameter => parameter.key === 'M')?.value;
        // console.log("ALL ROWS: ", e);

        if (
            !isLoadPanelVisible &&
            e.data?.title === 'Margin (dB)' &&
            props.linkBudgetLoaded
        ) {
            // e.cellElement.className = classes.marginRow;
        }
    }

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
                        <DataGrid
                            id='linkBudgetTable'
                            dataSource={editMode ? rowsData : filteredRowsData}
                            showBorders={true}
                            showRowLines={true}
                            rowAlternationEnabled={false}
                            columnAutoWidth={true}
                            allowColumnResizing={true}
                            columnResizingMode="nextColumn"
                            onContextMenuPreparing={handleOnMenuPreparing}
                            onOptionChanged={handleOptionChanged}
                            onRowUpdated={handleRowUpdated}
                            className={classes.table}
                            onCellPrepared={onCellPrepared}
                        >
                            <Grouping contextMenuEnabled={editMode} />
                            <Scrolling mode="infinite" />
                            <Sorting mode="single" />

                            <Editing mode="cell" allowUpdating={editMode ? true : false} />

                            <RowDragging
                                allowReordering={true}
                                onReorder={HandleOnDragReorder}
                                showDragIcons={editMode}
                            />

                            <Column
                                caption=""
                                dataField="order"
                                width={
                                    editMode
                                        ? colWidths?.expanded[0] ?? initWidths.expanded[0]
                                        : colWidths?.collapse[0] ?? initWidths.collapse[0]
                                }
                                allowSorting={false}
                                allowGrouping={false}
                            />

                            {groupEnabled ? (
                                <Column
                                    dataField="group"
                                    visible={true}
                                    width={
                                        editMode
                                            ? colWidths?.expanded[1] ?? initWidths.expanded[1]
                                            : colWidths?.collapse[1] ?? initWidths.collapse[1]
                                    }
                                    allowSorting={false}
                                    groupIndex={0}
                                />
                            ) : (
                                <Column
                                    dataField="group"
                                    visible={true}
                                    width={
                                        editMode
                                            ? colWidths?.expanded[1] ?? initWidths.expanded[1]
                                            : colWidths?.collapse[1] ?? initWidths.collapse[1]
                                    }
                                    allowSorting={false}
                                />
                            )}

                            <Column
                                caption="Item Name"
                                dataField="name"
                                visible={editMode}
                                width={colWidths?.expanded[2] ?? initWidths.expanded[2]}
                                allowSorting={false}
                                allowGrouping={false}
                            />
                            <Column
                                caption="Item Title"
                                dataField="title"
                                width={
                                    editMode
                                        ? colWidths?.expanded[3] ?? initWidths.expanded[3]
                                        : colWidths?.collapse[3] ?? initWidths.collapse[3]
                                }
                                allowSorting={false}
                                allowGrouping={false}
                            />
                            <Column
                                caption="Value"
                                dataField="value"
                                calculateCellValue={doCellValueFormat}
                                width={
                                    editMode
                                        ? colWidths?.expanded[4] ?? initWidths.expanded[4]
                                        : colWidths?.collapse[4] ?? initWidths.collapse[4]
                                }
                                allowSorting={false}
                                allowGrouping={false}
                            />
                            <Column
                                caption="JSONata Equation"
                                dataField="user_exp"
                                visible={editMode}
                                width={colWidths?.expanded[5] ?? initWidths.expanded[5]}
                                allowSorting={false}
                                allowGrouping={false}
                                cssClass="wrappedColumnClass"
                            />
                            <Column
                                caption="Notes"
                                dataField="notes"
                                width={
                                    editMode
                                        ? colWidths?.expanded[6] ?? initWidths.expanded[6]
                                        : 'auto'
                                }
                                allowSorting={false}
                                allowGrouping={false}
                                cssClass="wrappedColumnClass"
                            />
                            <Column
                                caption="Actions"
                                type="buttons"
                                visible={editMode}
                                width="auto"
                                allowSorting={false}
                                allowGrouping={false}
                            >
                                <GridButton
                                    icon="edit"
                                    onClick={handleEdit}
                                    hint="Edit Item"
                                    cssClass={classes.button}
                                />
                                <GridButton
                                    icon="insertrowabove"
                                    onClick={(e: any) => handleAddNewRow(e, 0)}
                                    hint="Insert new above"
                                />
                                <GridButton
                                    icon="insertrowbelow"
                                    onClick={(e: any) => handleAddNewRow(e, 1)}
                                    hint="Insert new below"
                                />
                                <GridButton
                                    icon="trash"
                                    onClick={deleteSelectedRow}
                                    hint="Delete Item"
                                />
                            </Column>

                            <Toolbar>
                                <Item location="before" visible={editMode}>
                                    <Button
                                        icon="add"
                                        onClick={newDataSet(externalSource)}
                                        text="New"
                                    />
                                </Item>

                                <Item location="before" visible={true}>
                                    <Button
                                        icon="newfolder"
                                        onClick={openDataset}
                                        hint="Other Templates"
                                    />
                                </Item>
                                <Item location="before" visible={editMode}>
                                    <Button icon="save" text="Save" onClick={saveResult} />
                                </Item>
                                <Item location="before" visible={editMode}>
                                    <Button
                                        icon="box"
                                        text="Save As"
                                        onClick={() => setShowSaveAsDialog(true)}
                                    />
                                </Item>
                                {/* <Item location="before"  visible={editMode}>
                                      <Box display="flex" 
                                          sx={{
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              columnGap: 1,
                                              marginLeft: 2
                                          }}>
                                          <Switch defaultValue={true} onValueChanged={handleSwitchItemGroup}/>
                                          <span>Item Group</span>
                                      </Box>
                                  </Item> */}
                                <Item location="before" visible={editMode}>
                                    <Button
                                        icon="tableproperties"
                                        onClick={() => {
                                            setEditMode(false);
                                        }}
                                        text="Done Editing"
                                    />
                                </Item>
                                <Item location="before" visible={true}>
                                    <Button
                                        icon="refresh"
                                        onClick={calculateAll(rowsData, externalSource)}
                                        hint="Refresh"
                                    />
                                </Item>
                                <Item location="before" visible={!editMode && props.isEngineer}>
                                    <Button
                                        icon="tableproperties"
                                        onClick={() => {
                                            setEditMode(true);
                                        }}
                                        hint="Edit"
                                    />
                                </Item>
                                {/* <Item location="before" location="before">
                                      <Button icon='exportpdf' onClick={exportPdf} hint="Export Pdf" />
                                  </Item> */}
                                <Item location="before">
                                    <Button
                                        icon="exportxlsx"
                                        onClick={exportExcel}
                                        hint="Export Excel"
                                    />
                                </Item>
                                <Item location="before" visible={!editMode && props.isEngineer}>
                                    <Button
                                        icon="pinright"
                                        onClick={saveResult}
                                        hint="Save Layout"
                                    />
                                </Item>
                                <Item location="before" visible={true}>
                                    <Button
                                        icon="save"
                                        disabled={!updateTemplateEnabled}
                                        onClick={setTemplateAsDefault}
                                        hint="Save Template as Default"
                                    />
                                </Item>
                            </Toolbar>
                        </DataGrid>
                    </CardContent>
                </Card>

                {/* Modal for Edit */}
                <RowEditModal
                    row={selectedRow}
                    visible={showEditDialog}
                    onChangeName={(e) => {
                        setSelectedRow({ ...selectedRow, name: e.target.value });
                    }}
                    onChangeTitle={(e) => {
                        setSelectedRow({ ...selectedRow, title: e.target.value });
                    }}
                    onChangeCode={(e) => {
                        setDialogType(actions.edit);
                        console.log(e.target.value);
                        setSelectedRow({ ...selectedRow, user_exp: e.target.value });
                    }}
                    onChangeNotes={(e) => {
                        setSelectedRow({ ...selectedRow, notes: e.target.value });
                    }}
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
                    disabled={!editMode}
                />
            </Box>
        </>
    );
};

export default LinkBudget;
