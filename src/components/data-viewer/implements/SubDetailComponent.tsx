import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "devextreme-react";
import { Column, MasterDetail } from "devextreme-react/data-grid";
import { FC, useCallback, useEffect, useState } from "react";

type rowStatus = {
    rIdx: number;
    cIdx: number;
    value: boolean;
}

type Selected = {
    rIdx: number;
    cIdx: number;
}

const SubDetailComponent: FC = (props: any) => {

    const detailData = props.data.key;
    const [title, setTitle] = useState<string>('');
    const [columns, setColumns] = useState<string[]>([]);
    const [selected, setSelected] = useState<Selected>({ rIdx: 0, cIdx: 0 });
    const [dataSource, setDataSource] = useState<any>([]);
    const [rowStatus, setrowStatus] = useState<rowStatus[]>([]);
    const selectedCellIdx = props.selectedCellIdx;

    useEffect(() => {

        if (selectedCellIdx > -1) {
            const dData: any = Object.values(detailData)[selectedCellIdx];
            setTitle(Object.keys(detailData)[selectedCellIdx]);

            let dataSource: any = [];

            if (dData === null) {
                dataSource = [];
            } else {
                if (Array.isArray(dData)) {
                    dataSource = dData;
                } else {

                    const keys = Object.keys(dData);

                    // Check SubObject or not
                    if (Array.isArray(dData[keys[0]])) {
                        keys.forEach(key => {
                            dataSource = [...dataSource, ...dData[key]];
                        });
                    } else {
                        dataSource = [dData];
                    }
                }
            }

            const detailColumns = dataSource.length > 0 ? Object.keys(dataSource[0]) : [];
            setColumns(detailColumns);
            setDataSource(dataSource);
        }

        setrowStatus([]);

    }, [props]);

    /**
     * Get Object Cell
     * @param props 
     * @returns 
     */
    const renderCustomCell = useCallback((props: any) => {
        const myStatus = getRowStatus(props.row.rowIndex, props.column.index);
        const text = myStatus ? "Hide" : "Show";

        const detailClick = () => {
            setSelected({ rIdx: props.row.rowIndex, cIdx: props.column.index });
            if (myStatus) {
                updateCellStatus(props.row.rowIndex, props.column.index, false);
                props.component.collapseRow(props.key);
            } else {
                // Update RowStatus
                updateCellStatus(props.row.rowIndex, props.column.index, true);
                props.component.expandRow(props.key);
            }
        };

        if (selectedCellIdx < 0) {
            props.component.collapseRow(props.key);
        }

        return (
            <Typography sx={{ cursor: 'pointer', textDecoration: 'underline' }} fontSize={14} onClick={detailClick}>{text}</Typography>
        );
    }, [rowStatus, selectedCellIdx]);

    /**
     * Get Row Status by index
     * @param rIdx 
     * @param cIdx 
     * @returns 
     */
    const getRowStatus = useCallback((rIdx: number, cIdx: number): boolean => {

        const r = rowStatus.filter((s: rowStatus) => s.rIdx === rIdx && s.cIdx === cIdx);

        if (r.length > 0) {
            return r[0].value;
        } else {
            return false;
        }
    }, [rowStatus]);

    /**
     * Update Cell Status
     * @param rIdx 
     * @param cIdx 
     * @param value 
     */
    const updateCellStatus = useCallback((rIdx: number, cIdx: number, value: boolean) => {

        const r = rowStatus.filter((s: rowStatus) => s.rIdx === rIdx && s.cIdx === cIdx);
        let nStatus: rowStatus[] = rowStatus.map((s: rowStatus) => {
            return s.rIdx === rIdx ? { ...s, value: false } : s;
        });

        if (r.length < 1) {
            nStatus = [...nStatus, { rIdx, cIdx, value }];
        } else {
            nStatus = nStatus.map((s: rowStatus) => {
                return s.rIdx === rIdx && s.cIdx === cIdx ? { rIdx, cIdx, value: value } : s;
            });
        }

        setrowStatus(nStatus);
    }, [rowStatus]);

    /**
     * Render SubDetails
     * @param props 
     * @returns 
     */
    const renderDetail = (props: any) => {

        const subDetailData = props.data.key;
        const subData: any = Object.values(subDetailData)[selected.cIdx];
        const subTitle = Object.keys(subDetailData)[selected.cIdx];

        let subDataSource: any = [];

        if (subData === null) {
            subDataSource = [];
        } else {
            if (Array.isArray(subData)) {
                subDataSource = subData;
            } else {

                const keys = Object.keys(subData);

                // Check SubObject or not
                if (Array.isArray(subData[keys[0]])) {
                    keys.forEach(key => {
                        subDataSource = [...subDataSource, ...subData[key]];
                    });
                } else {
                    subDataSource = [subData];
                }
            }
        }

        const detailColumns = subDataSource.length > 0 ? Object.keys(subDataSource[0]) : [];

        return <Box p={2} pt={0}>
            <Typography sx={{ mb: 1 }}>{subTitle.charAt(0).toUpperCase() + subTitle.slice(1)}</Typography>
            <DataGrid
                dataSource={subDataSource}
                showBorders={true}
                columnAutoWidth={true}
            >
                {detailColumns.map((column: string, idx: number) => {

                    let dataType: string = 'string';
                    if (dataSource.length > 0 && dataSource[0][column] !== undefined) {
                        const value = dataSource[0][column];
                        if (typeof value === 'number') {
                            dataType = 'number';
                        } else if (typeof value === 'boolean') {
                            dataType = 'boolean';
                        }
                    }

                    if (typeof subDataSource[0][column] === 'string' || typeof subDataSource[0][column] === 'number' || subDataSource[0][column] == null) {
                        return <Column dataField={column} key={idx} />
                    } else {
                        return <Column caption={column.charAt(0).toUpperCase() + column.slice(1)}
                            cellRender={renderCustomCell} key={idx} />
                    }
                })}
            </DataGrid>
        </Box>
    }

    return (
        <>
            <Box p={2} pt={0}>
                <Typography sx={{ mb: 1 }}>{title.charAt(0).toUpperCase() + title.slice(1)}</Typography>
                <DataGrid
                    dataSource={dataSource}
                    showBorders={true}
                    columnAutoWidth={true}
                    allowColumnResizing={true}
                >
                    {columns.map((column: string, idx: number) => {

                        let dataType: string = 'string';
                        if (dataSource.length > 0 && dataSource[0][column] !== undefined) {
                            const value = dataSource[0][column];
                            if (typeof value === 'number') {
                                dataType = 'number';
                            } else if (typeof value === 'boolean') {
                                dataType = 'boolean';
                            }
                        }

                        if (typeof dataSource[0][column] === 'string' || typeof dataSource[0][column] === 'number' || dataSource[0][column] == null) {
                            return <Column dataField={column} key={idx} />
                        } else {
                            return <Column caption={column.charAt(0).toUpperCase() + column.slice(1)}
                                cellRender={renderCustomCell} key={idx} />
                        }
                    })}

                    <MasterDetail
                        enabled={true}
                        component={renderDetail}
                    />
                </DataGrid>
            </Box>
        </>
    )
}

export default SubDetailComponent;