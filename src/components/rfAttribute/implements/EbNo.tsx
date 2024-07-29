import React from 'react';
import {
	makeStyles,
	Theme
} from '@material-ui/core';
import { Select, MenuItem, Button, Card, Box, Divider, CardContent, Grid } from '@mui/material';
import { DataGrid } from 'devextreme-react';
import { Column, Editing, FilterRow } from 'devextreme-react/data-grid';
import { FC, useState } from 'react';
import { THEMES } from '../../../utills/constatnts/general';
import AddIcon from '@mui/icons-material/Add';
import EbNoModal from './EbNoModal';
import { EbNo as EbNoType, NewEbNo, AttrValue, UpdateEbNo, DeleteEbNo } from '../types/msTypes';

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
	}
}));

interface EbnoProps {
	editMode: boolean;
	ebnoData: EbNoType[];
	codingTypeOptions: AttrValue[];
	codingRateOptions: AttrValue[];
	modulationOptions: AttrValue[];
	handleUpdateEbNo: (data: UpdateEbNo) => void;
	handleRemoveEbNo: (data: DeleteEbNo) => void;
	handleCreateEbNo: (data: NewEbNo) => void;
}

const EbNo: FC<EbnoProps> = ({
	editMode,
	ebnoData,
	codingTypeOptions,
	codingRateOptions,
	modulationOptions,
	handleUpdateEbNo,
	handleRemoveEbNo,
	handleCreateEbNo
}) => {
	const [manageNewEbNoVisible, setManageNewEbNoVisible] = useState<boolean>(false);
	const customClasses = customStyles();

	const handCreateNewEbNo = () => {
		setManageNewEbNoVisible(true);
	};

	const RenderModulationEditor: FC = (event: any) => {
		const [selectedItem, setSelectedItem] = useState<any>(event.data.value);
		return (
			<Select
				value={selectedItem}
				// color="primary"
				style={{ paddingLeft: '10px' }}
				onChange={(e) => {
					const { value } = e.target;
					setSelectedItem(value);
					event.data.setValue(value, value);
				}}
				fullWidth
			>
				{modulationOptions.map((alloc, index) => {
					return (
						<MenuItem key={index} value={alloc.name}>
							{alloc.name}
						</MenuItem>
					);
				})}
			</Select>
		);
	};

	const RenderCodingTypeEditor: FC = (event: any) => {
		const [selectedItem, setSelectedItem] = useState<any>(event.data.value);
		return (
			<Select
				value={selectedItem}
				// color="primary"
				style={{ paddingLeft: '10px' }}
				onChange={(e) => {
					const { value } = e.target;
					setSelectedItem(value);
					event.data.setValue(value, value);
				}}
				fullWidth
			>
				{codingTypeOptions.map((alloc, index) => {
					return (
						<MenuItem key={index} value={alloc.name}>
							{alloc.name}
						</MenuItem>
					);
				})}
			</Select>
		);
	};

	const RenderCodingRateEditor: FC = (event: any) => {
		const [selectedItem, setSelectedItem] = useState<any>(event.data.value);
		return (
			<Select
				value={selectedItem}
				// color="primary"
				style={{ paddingLeft: '10px' }}
				onChange={(e) => {
					const { value } = e.target;
					setSelectedItem(value);
					event.data.setValue(value, value);
				}}
				fullWidth
			>
				{codingRateOptions.map((alloc, index) => {
					return (
						<MenuItem key={index} value={alloc.name}>
							{alloc.name}
						</MenuItem>
					);
				})}
			</Select>
		);
	};

	return (
		<>
			<Card>
				<Box></Box>
				<Divider />
				<CardContent style={{ height: '49vh' }} data-testid='ebNoTable'>
					<DataGrid
						id={'ebNoTable'}
						dataSource={ebnoData}
						showBorders={true}
						allowColumnResizing={true}
						columnAutoWidth={true}
						showRowLines={false}
						allowColumnReordering={true}
						onRowUpdating={({ newData, key }) => handleUpdateEbNo({ newData, key })}
						onRowRemoved={({ key }) => handleRemoveEbNo({ key })}
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

						<Column
							caption="Modulation"
							dataField="modulation"
							editCellComponent={RenderModulationEditor}
						/>
						<Column
							caption="Coding Type"
							dataField="codingType"
							editCellComponent={RenderCodingTypeEditor}
						/>
						<Column
							caption="Coding Rate"
							dataField="codeRate"
							editCellComponent={RenderCodingRateEditor}
						/>
						<Column caption="Eb/No" dataField="EbNo_10E-5" />
					</DataGrid>
				</CardContent>
			</Card>
			{editMode && (
				<Grid container justifyContent="flex-start">
					<Grid item>
						<Button
							type="button"
							startIcon={<AddIcon />}
							variant="contained"
							color="primary"
							onClick={handCreateNewEbNo}
							style={{ margin: '10px' }}
						>
							{'New Eb/No'}
						</Button>
					</Grid>
				</Grid>
			)}
			<EbNoModal
				open={manageNewEbNoVisible}
				onOpen={() => setManageNewEbNoVisible(false)}
				codingTypeOptions={codingTypeOptions}
				codingRateOptions={codingRateOptions}
				modulationOptions={modulationOptions}
				handleCreateEbNo={handleCreateEbNo}
			/>
		</>
	);
};

export default EbNo;