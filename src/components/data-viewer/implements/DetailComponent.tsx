import React from "react";
import { DataGrid } from "devextreme-react";
import { Column, MasterDetail } from "devextreme-react/data-grid";
import { FC, useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import SubDetailComponent from "./SubDetailComponent";
import ColumnFilterModal, { ColumnFilter } from "./ColumnFilterModal";
import { Tooltip } from "@mui/material";
import BuildIcon from '@mui/icons-material/Build';

type rowStatus = {
	rIdx: number;
	cIdx: number;
	value: boolean;
}

const DetailComponent: FC = (props: any) => {

	const detailData = props.data.key;
	const selectedCellIdx = props.selectedCellIdx;
	const [title, setTitle] = useState<string>('');
	const [columns, setColumns] = useState<string[]>([]);
	const [dataSource, setDataSource] = useState<any>([]);
	const [rowStatus, setrowStatus] = useState<rowStatus[]>([]);
	const [arrowIcon, setArrowIcon] = useState<boolean>(false);
	const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
	const [showFilterColumn, setShowFilterColumn] = useState<boolean>(false);
	const [columnsFilter, setColumnsFilter] = useState<ColumnFilter[]>([]);
	const [subCellIdx, setSubCellIdx] = useState<number>(-1);

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
			const columnsFilter: ColumnFilter[] = [];
			for (const key of detailColumns) {
				const columnObj: ColumnFilter = { label: key, selected: true }
				columnsFilter.push(columnObj)
			}
			setColumnsFilter(columnsFilter)
			setColumns(detailColumns);
			setDataSource(dataSource);
			dataSource && setArrowIcon(CheckToDisplayArrowIcon(dataSource[0]));
		}

		setrowStatus([]);
	}, [props]);

	useEffect(() => {
		if (columnsFilter?.length > 0) {
			const filteredColumn = columnsFilter.filter((column) => column.selected === true);
			const keys: string[] = filteredColumn.map((column) => column.label)
			setColumns(keys)
		}
	}, [columnsFilter]);

	const handleColumnToggle = (column: any) => {
		const updatedColumns = columnsFilter.map((c) =>
			c === column ? { ...c, selected: !c.selected } : c
		);
		setColumnsFilter(updatedColumns);
	};

	const handleSelectAll = (selectAll: any) => {
		const cloneColumnsFilter: ColumnFilter[] = [...columnsFilter]
		cloneColumnsFilter.forEach((filter) => {
			filter.selected = selectAll
		})
		setColumnsFilter((cloneColumnsFilter))
	};

	const handleClose = () => {
		setIsColumnSelectorOpen(!isColumnSelectorOpen)
		setShowFilterColumn(!showFilterColumn)
	}

	const CheckToDisplayArrowIcon = (datasource: any): boolean => {
		for (const key in datasource) {
			if (Array.isArray(datasource[key])) {
				return true
			}
		}
		return false
	}

	const handleShowFilterColumnClick = () => {
		setIsColumnSelectorOpen(!isColumnSelectorOpen)
		setShowFilterColumn(!showFilterColumn)
	}

	/**
	 * Get Object Cell
	 * @param props 
	 * @returns 
	 */
	const renderCustomCell = useCallback((props: any) => {
		const myStatus = getRowStatus(props.row.rowIndex, props.column.index);
		const text = myStatus ? "Hide" : "Show";

		const detailClick = () => {
			setSubCellIdx(props.column.index);
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

	/** Custom Detail Component render */
	const customDetailComponentRender = useCallback((props: any) => {
		return <SubDetailComponent {...props} selectedCellIdx={subCellIdx} />;
	}, [subCellIdx]);

	return (
		<>
			<Box p={2} pt={0}>
				<Box sx={{ display: 'flex', gap: '5px' }}>
					<Typography sx={{ mb: 1 }}>{title.charAt(0).toUpperCase() + title.slice(1)}</Typography>
					<Tooltip title='Column Options' arrow>
						<BuildIcon role="button"
							sx={{ cursor: 'pointer', color: showFilterColumn ? '#206C91' : '#ddd', paddingBottom: '5px' }}
							onClick={handleShowFilterColumnClick} />
					</Tooltip>
				</Box>
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

						if (typeof dataSource[0][column] === 'string' || typeof dataSource[0][column] === 'number' || dataSource[0][column] == null || typeof dataSource[0][column] === 'boolean') {
							return <Column dataField={column} key={idx} />
						} else {
							return <Column caption={column.charAt(0).toUpperCase() + column.slice(1)}
								cellRender={renderCustomCell} key={idx} />
						}
					})}

					{arrowIcon && <MasterDetail
						enabled={true}
						component={customDetailComponentRender}
					/>}

				</DataGrid>

				<ColumnFilterModal
					isOpen={isColumnSelectorOpen}
					columns={columnsFilter}
					onClose={handleClose}
					onColumnToggle={handleColumnToggle}
					onSelectAll={handleSelectAll}
				/>
			</Box>
		</>
	)
}

export default DetailComponent;