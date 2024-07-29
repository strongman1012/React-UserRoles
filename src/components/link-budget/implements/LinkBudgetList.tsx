import React from 'react';
import DataGrid, {
    Column, Grouping, RowDragging, Scrolling, Sorting,
    Toolbar, Item
} from "devextreme-react/data-grid";
import { FC, useEffect, useState } from "react";
import { DatasetName, IColWidth, ParamGroup, Row } from "../types/LinkBudgetTypes";
import { Theme, makeStyles } from "@material-ui/core";
import { initWidths } from "./initData";
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

interface LinkBudgetListProps {
    isEngineer: boolean,
    isGroupedEnabled: boolean,
    isUpdateTemplateEnabled: boolean,
    dataSource: Row[],
    colWidths: IColWidth,
    externalSource: ParamGroup | null,
    datasetName: DatasetName,
    onOpenDataset: () => void,
    onRefresh: (rowsData: Row[] | null, sourceData: ParamGroup | null) => void,
    onSetTemplateAsDefault: () => void,
    onLoadEditMode: () => void,
}

const LinkBudgetList: FC<LinkBudgetListProps> = ({
    isEngineer,
    isGroupedEnabled,
    isUpdateTemplateEnabled,
    dataSource,
    colWidths,
    externalSource,
    datasetName,
    onOpenDataset,
    onRefresh,
    onSetTemplateAsDefault,
    onLoadEditMode
}: LinkBudgetListProps) => {

    const classes = useStyles();
    const [rowsData, setRowsData] = useState<Row[]>([]);

    useEffect(() => {
        setRowsData(dataSource);
    }, [dataSource]);

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
            className={classes.table}
        >
            <Grouping />
            <Scrolling mode="infinite" />
            <Sorting mode="single" />

            <RowDragging
                allowReordering={true}
                onReorder={HandleOnDragReorder}
                showDragIcons={false}
            />

            <Column
                caption=""
                dataField="order"
                width={colWidths?.collapse[0] ?? initWidths.collapse[0]}
                allowSorting={false}
                allowGrouping={false}
            />

            {isGroupedEnabled ? (
                <Column
                    dataField="group"
                    visible={true}
                    width={colWidths?.collapse[1] ?? initWidths.collapse[1]}
                    allowSorting={false}
                    groupIndex={0}
                />
            ) : (
                <Column
                    dataField="group"
                    visible={true}
                    width={colWidths?.collapse[1] ?? initWidths.collapse[1]}
                    allowSorting={false}
                />
            )}
            <Column
                caption="Item Title"
                dataField="title"
                width={colWidths?.collapse[3] ?? initWidths.collapse[3]}
                allowSorting={false}
                allowGrouping={false}
            />
            <Column
                caption="Value"
                dataField="value"
                calculateCellValue={doCellValueFormat}
                width={colWidths?.collapse[4] ?? initWidths.collapse[4]}
                allowSorting={false}
                allowGrouping={false}
            />
            <Column
                caption="Notes"
                dataField="notes"
                width={'auto'}
                allowSorting={false}
                allowGrouping={false}
                cssClass="wrappedColumnClass"
            />

            <Toolbar>
                <Item location="before" visible={true}>
                    <Button
                        icon="newfolder"
                        onClick={onOpenDataset}
                        hint="Other Templates"
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
                        onClick={onLoadEditMode}
                        hint={'Edit'}
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

export default LinkBudgetList;