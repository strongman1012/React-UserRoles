import React from 'react';
import DataGrid, {
    Column, Editing, Grouping, RowDragging, Scrolling, Sorting,
    Button as GridButton, Toolbar, Item
} from "devextreme-react/data-grid";
import { FC, useEffect, useState } from "react";
import { DatasetName, IColWidth, ParamGroup, Row } from "../types/LinkBudgetTypes";
import { Theme, makeStyles } from "@material-ui/core";
import { initRow, initWidths } from "./initData";
import { UniqueId } from '../../../utills/functions';
import { LinkbudgetApi } from "../../../services/link-budget/api-linkbudget";
import { calculateRowsData } from "../../../utills/link-budget";
import * as excelJS from 'exceljs';
import { saveAs as saveAsFile } from 'file-saver';
import { Button } from "devextreme-react";

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

interface LinkBudgetGridProps {
    isEngineer: boolean,
    isGroupedEnabled: boolean,
    isUpdateTemplateEnabled: boolean,
    dataSource: Row[],
    initColWidths: IColWidth,
    externalSource: ParamGroup | null,
    datasetName: DatasetName,
    onAddNewRow: (rowsData: Row[]) => void,
    onNewDataset: () => void,
    onSaveData: (rowsData: Row[]) => void,
    onOpenDataset: () => void,
    onSaveAs: () => void,
    onRefresh: (rowsData: Row[] | null, sourceData: ParamGroup | null) => void,
    onSetTemplateAsDefault: () => void,
    onDoneEditMode: () => void,
    onRowEdit: (rowdata: Row) => void,
    onShowErrorMessage: (errMsg: string) => void,
}

const LinkBudgetEdit: FC<LinkBudgetGridProps> = ({
    isEngineer,
    isGroupedEnabled,
    isUpdateTemplateEnabled,
    dataSource,
    initColWidths,
    externalSource,
    datasetName,
    onAddNewRow,
    onNewDataset,
    onSaveData,
    onOpenDataset,
    onSaveAs,
    onRefresh,
    onSetTemplateAsDefault,
    onDoneEditMode,
    onRowEdit,
    onShowErrorMessage,
}: LinkBudgetGridProps) => {

    const classes = useStyles();
    const [rowsData, setRowsData] = useState<Row[]>([]);
    const [colWidths, setColWidths] = useState<IColWidth>(initColWidths);

    useEffect(() => {
        setRowsData(dataSource);
    }, [dataSource]);

    /**
     * Calculate after Row Updated
     * @param e
     */
    const handleRowUpdated = async (e: any) => {
        if (externalSource !== null) {
            const refreshedRowsData = await calculateRowsData(rowsData, externalSource);
            setRowsData(refreshedRowsData);
        }
    };

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
            newColWidth.expanded[colIdx] = e.value;
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
     * Handle New Row add to DataGrid
     * @param e 
     * @param type 0: above, 1: below
     */
    const handleAddNewRow = async (e: any, type: number) => {

        const rowData = isGroupedEnabled ?
            { ...initRow, id: UniqueId(10), group: e.row.data.group } :
            { ...initRow, id: UniqueId(10) };

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

        onAddNewRow(newRowsData);
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
            } else {
                const errMsg = storeResponse.message;
                onShowErrorMessage(errMsg);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const isGrouped = (): boolean => {
        const groupRows = document.getElementsByClassName('dx-group-row');
        return groupRows.length > 0;
    }

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

    return (
        <DataGrid
            id='linkBudgetTable'
            dataSource={rowsData}
            showBorders={true}
            showRowLines={true}
            rowAlternationEnabled={false}
            columnAutoWidth={true}
            allowColumnResizing={true}
            columnResizingMode="nextColumn"
            onOptionChanged={handleOptionChanged}
            onRowUpdated={handleRowUpdated}
            className={classes.table}
        >
            <Grouping contextMenuEnabled={true} />
            <Scrolling mode="infinite" />
            <Sorting mode="single" />

            <Editing
                mode="cell"
                allowUpdating={true}
                allowAdding={true}
            />

            <RowDragging
                allowReordering={true}
                onReorder={HandleOnDragReorder}
                showDragIcons={true}
            />

            <Column
                caption=""
                dataField="order"
                width={colWidths?.expanded[0] ?? initWidths.expanded[0]}
                allowSorting={false}
                allowGrouping={false}
            />

            {isGroupedEnabled ? (
                <Column
                    dataField="group"
                    visible={true}
                    width={colWidths?.expanded[1] ?? initWidths.expanded[1]}
                    allowSorting={false}
                    groupIndex={0}
                />
            ) : (
                <Column
                    dataField="group"
                    visible={true}
                    width={colWidths?.expanded[1] ?? initWidths.expanded[1]}
                    allowSorting={false}
                />
            )}

            <Column
                caption="Item Name"
                dataField="name"
                width={colWidths?.expanded[2] ?? initWidths.expanded[2]}
                allowSorting={false}
                allowGrouping={false}
            />
            <Column
                caption="Item Title"
                dataField="title"
                width={colWidths?.expanded[3] ?? initWidths.expanded[3]}
                allowSorting={false}
                allowGrouping={false}
            />
            <Column
                caption="Value"
                dataField="value"
                calculateCellValue={doCellValueFormat}
                width={colWidths?.expanded[4] ?? initWidths.expanded[4]}
                allowSorting={false}
                allowGrouping={false}
            />
            <Column
                caption="JSONata Equation"
                dataField="user_exp"
                width={colWidths?.expanded[5] ?? initWidths.expanded[5]}
                allowSorting={false}
                allowGrouping={false}
                cssClass="wrappedColumnClass"
            />
            <Column
                caption="Notes"
                dataField="notes"
                width={colWidths?.expanded[6] ?? initWidths.expanded[6]}
                allowSorting={false}
                allowGrouping={false}
                cssClass="wrappedColumnClass"
            />
            <Column
                caption="Actions"
                type="buttons"
                width="auto"
                allowSorting={false}
                allowGrouping={false}
            >
                <GridButton
                    icon="edit"
                    onClick={(e: any) => onRowEdit(e.row.data)}
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
                <Item location="before">
                    <Button
                        icon="add"
                        onClick={onNewDataset}
                        text="New"
                    />
                </Item>
                <Item location="before" visible={true}>
                    <Button
                        icon="newfolder"
                        onClick={onOpenDataset}
                        hint="Other Templates"
                    />
                </Item>
                <Item location="before">
                    <Button
                        icon="save"
                        text="Save"
                        onClick={() => onSaveData(rowsData)}
                    />
                </Item>
                <Item location="before">
                    <Button
                        icon="box"
                        text="Save As"
                        onClick={onSaveAs}
                    />
                </Item>
                <Item location="before" visible={true}>
                    <Button
                        icon="refresh"
                        onClick={() => onRefresh(rowsData, externalSource)}
                        hint="Refresh"
                    />
                </Item>
                <Item location="before" visible={isEngineer}>
                    <Button
                        icon="tableproperties"
                        onClick={onDoneEditMode}
                        text={'Done Editing'}
                    />
                </Item>
                <Item location="before">
                    <Button
                        icon="exportxlsx"
                        onClick={exportExcel}
                        hint="Export Excel"
                    />
                </Item>
                <Item location="before" visible={true}>
                    <Button
                        icon="save"
                        disabled={!isUpdateTemplateEnabled}
                        onClick={onSetTemplateAsDefault}
                        hint="Save Template as Default"
                    />
                </Item>
            </Toolbar>

        </DataGrid>
    );
}

export default LinkBudgetEdit;