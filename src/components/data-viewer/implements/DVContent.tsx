import React from "react";
import { FC, useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import DataGrid, {
	Column, Export, FilterRow,
	Item, MasterDetail, SearchPanel, Toolbar
} from "devextreme-react/data-grid";
import { Typography, Tooltip } from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BuildIcon from '@mui/icons-material/Build';
import { exportDataGrid as exportPdfDataGrid } from 'devextreme/pdf_exporter';
import { exportDataGrid as exportExcelDataGrid } from 'devextreme/excel_exporter';
import { jsPDF } from 'jspdf';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import DetailComponent from "./DetailComponent";
import ColumnFilterModal, { ColumnFilter } from "./ColumnFilterModal";
import { useTheme, makeStyles, Theme } from "@material-ui/core";
import { dataApiService } from "../../../services";
import { Query, rowStatus } from "../types/dataViewer";

interface ContentProps {
	query: Query | undefined;
}

const useStyles = makeStyles((theme: Theme) => ({
	table: {
		'& .dx-datagrid-borders > .dx-datagrid-header-panel': theme.palette.background.default,
		'& .dx-toolbar .dx-toolbar-items-container': theme.palette.background.default,
		'& .dx-datagrid-search-panel': '#4c4c4c'
	},
}));

const DVContent: FC<ContentProps> = (props: ContentProps) => {
	const classes = useStyles();
	const [columns, setColumns] = useState<string[]>([]);
	const [data, setData] = useState<any>([]);
	const [rowStatus, setrowStatus] = useState<rowStatus[]>([]);
	const [selectedCellIdx, setSelectedCellIdx] = useState<number>(-1);
	const [showFilterRow, setShowFilterRow] = useState<boolean>(false);
	const [showFilterColumn, setShowFilterColumn] = useState<boolean>(false);
	const [arrowIcon, setArrowIcon] = useState<boolean>(false);
	const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
	const [columnsFilter, setColumnsFilter] = useState<ColumnFilter[]>([]);
	const theme = useTheme<Theme>();

	useEffect(() => {
		props.query && getFileData(props.query);
	}, [props.query]);

	/**
	 * Get Grid Data from Server (from text file of server)
	 */
	const getFileData = async (selectedQuery: Query) => {
		const getResponse = selectedQuery && await dataApiService.getFileData(selectedQuery.url);

		if (getResponse && getResponse.data) {

			let keys: string[] = [];
			let data: any = [];

			if (Array.isArray(getResponse.data)) {
				// Set columns from response
				keys = Object.keys(getResponse.data[0]);
				data = getResponse.data
			} else {
				const fakeKeys = Object.keys(getResponse.data);
				fakeKeys.forEach(key => {
					data = [...data, ...getResponse.data[key]];
				});
				keys = Object.keys(data[0]);
			}
			data && setArrowIcon(CheckToDisplayArrowIcon(data[0]))
			const columnsFilter: ColumnFilter[] = [];
			for (const key of keys) {
				const columnObj: ColumnFilter = { label: key, selected: true }
				columnsFilter.push(columnObj)
			}
			setColumnsFilter(columnsFilter)
			setData(data);
			setColumns(keys);
			setrowStatus([]);
		}
	}

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

	const handleShowFilterColumnClick = () => {
		setIsColumnSelectorOpen(!isColumnSelectorOpen)
		setShowFilterColumn(!showFilterColumn)
	}

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

	/**
	 * Exporting Excel and PDF
	 * @param e 
	 */
	const onExporting = (e: any) => {

		if (e.format === 'pdf') {

			const doc = new jsPDF();

			exportPdfDataGrid({
				jsPDFDocument: doc,
				component: e.component,
				indent: 5,
			}).then(() => {
				doc.save('data.pdf');
			});

		} else if (e.format === 'excel') {
			const workbook = new Workbook();
			const worksheet = workbook.addWorksheet('Main sheet');

			exportExcelDataGrid({
				component: e.component,
				worksheet,
				autoFilterEnabled: true,
			}).then(() => {
				workbook.xlsx.writeBuffer().then((buffer) => {
					saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'data.xlsx');
				});
			});
			e.cancel = true;
		}
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
			setSelectedCellIdx(props.column.index);
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
		return <DetailComponent {...props} selectedCellIdx={selectedCellIdx} />;
	}, [selectedCellIdx]);

	return (
		<>
			<Box sx={{ p: 1.5, overflow: 'auto', width: '100%' }} data-testid="datagrid">
				<DataGrid
					dataSource={data}
					showBorders={true}
					showRowLines={true}
					columnAutoWidth={true}
					onExporting={onExporting}
					style={{ height: '75vh' }}
					className={classes.table}
				>
					{columns.map((column: string, idx: number) => {

						let dataType: string = 'string';
						if (data.length > 0 && data[0][column] !== undefined) {
							const value = data[0][column];
							if (typeof value === 'number') {
								dataType = 'number';
							} else if (typeof value === 'boolean') {
								dataType = 'boolean';
							}
						}

						if (typeof data[0][column] === 'string' || typeof data[0][column] === 'number' || data[0][column] == null || typeof data[0][column] === 'boolean') {
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

					{/* <Scrolling mode={switchChecked ? 'paging' : 'infinite'}></Scrolling> */}

					<FilterRow visible={showFilterRow}
					/>

					<SearchPanel visible={true}
						width={240}
						placeholder="Search..."
					/>

					<Export enabled={true} formats={['pdf', 'excel']} />

					<Toolbar>
						<Item location="before" name="exportButton" />
						{/* <Item location="before">
							<Button icon='preferences'
								onClick={() => setShowOptionModal(true)}
								hint="Column Options"
							/>
						</Item> */}
						{/* <Item location="before">
							<FormControlLabel
								control={<Switch checked={switchChecked} onChange={handleOnScrollChange} />}
								label="Record Scroll"
								sx={{ marginLeft: '15px' }}
							/>
						</Item> */}

						<Item location="after">
							<Box sx={{ display: 'flex', flexDirection: 'row' }}>
								<Tooltip title="Filter" arrow>
									<FilterAltIcon role="button"
										sx={{ cursor: 'pointer', color: showFilterRow ? '#206C91' : '#ddd', paddingBottom: '5px' }}
										onClick={() => setShowFilterRow(!showFilterRow)} />
								</Tooltip>
								<Tooltip title='Column Options' arrow>
									<BuildIcon role="button"
										sx={{ cursor: 'pointer', color: showFilterColumn ? '#206C91' : '#ddd', paddingBottom: '5px' }}
										onClick={handleShowFilterColumnClick} />
								</Tooltip>
							</Box>
						</Item>
						<Item location="after" name="searchPanel" />
					</Toolbar>
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

export default DVContent;