import React from 'react';
import { Switch } from '@mui/material';
import { Typography, Container, Grid, Card, Box, Tabs, Tab } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';
import EbNo from './EbNo';
import CodingAndModulation from './CodingAndModulation';
import {
	EbNo as EbNoType, NewEbNo, AttrValue, DeleteEbNo,
	UpdateEbNo, NewEntry, CodingTypeUpdate, ModulationUpdate,
	DeleteCodingType, DeleteModulation
} from '../types/msTypes';

// const customStyles = makeStyles((theme: Theme) => ({
// 	dataTableStyle: {
// 		'& .dx-datagrid-header-panel': {
// 			order: 3
// 		},
// 		'& .dx-row.dx-header-row': {
// 			backgroundColor: theme.palette.type === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
// 			fontWeight: 'bold',
// 			color: '#333333'
// 		},
// 		'& .dx-command-edit.dx-command-edit-with-icons': {
// 			textAlign: 'right !important',
// 			'& *': {
// 				// color: `${theme.palette.border?.main} !important`
// 			}
// 		}
// 	},
// 	text: {
// 		color: `${theme.palette.text.primary} !important`,
// 		fontFamily: 'Roboto',
// 		fontStyle: 'normal',
// 		fontSize: '12px',
// 		lineHeight: '16px',
// 		letterSpacing: ' 0.05em',
// 		display: 'flex'
// 	},
// 	select: {
// 		background: theme.palette.type === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
// 		boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
// 		borderRadius: '8px',
// 		display: 'flex',
// 		flexDirection: 'column',
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		padding: '0px',
// 		gap: '1px',
// 		border: '0px'
// 	},
// 	popup: {
// 		backgroundColor: theme.palette.background.paper,
// 		color: theme.palette.text.primary
// 	}
// }));

interface RfAttributeProps {
	open: boolean;
	onOpen: () => void;
	isEngineer: boolean;
	ebnoData: EbNoType[];
	codingTypeOptions: AttrValue[];
	codingRateOptions: AttrValue[];
	modulationOptions: AttrValue[];
	handleUpdateEbNo: (data: UpdateEbNo) => void;
	handleRemoveEbNo: (data: DeleteEbNo) => void;
	handleCreateEbNo: (data: NewEbNo) => void;
	codingRates: any[];
	modulations: any[];
	handleCodingUpdate: (data: CodingTypeUpdate) => void;
	handleModulationUpdate: (data: ModulationUpdate) => void;
	handleCodingRemove: (data: DeleteCodingType) => void;
	handleModulationRemove: (data: DeleteModulation) => void;
	handleCreateCodingRate: (value: NewEntry) => void;
	handleCreateModulation: (value: NewEntry) => void;
}

const RfAttribute: FC<RfAttributeProps> = ({
	open,
	onOpen,
	isEngineer,
	ebnoData,
	codingTypeOptions,
	codingRateOptions,
	modulationOptions,
	handleUpdateEbNo,
	handleRemoveEbNo,
	handleCreateEbNo,
	codingRates,
	modulations,
	handleCodingUpdate,
	handleModulationUpdate,
	handleCodingRemove,
	handleModulationRemove,
	handleCreateCodingRate,
	handleCreateModulation
}) => {
	const [activeTab, setActiveTab] = useState<number>(1);
	const [editMode, setEditMode] = useState<boolean>(false);

	const tabs = [
		{
			id: 1,
			name: 'Eb/No Table',
			element: (
				<EbNo
					editMode={editMode}
					ebnoData={ebnoData}
					codingTypeOptions={codingTypeOptions}
					codingRateOptions={codingRateOptions}
					modulationOptions={modulationOptions}
					handleUpdateEbNo={handleUpdateEbNo}
					handleRemoveEbNo={handleRemoveEbNo}
					handleCreateEbNo={handleCreateEbNo}
				/>
			)
		}
	];

	if (isEngineer) {
		tabs.push({
			id: 2,
			name: 'Coding & Modulation Options',
			element: (
				<CodingAndModulation
					editMode={editMode}
					codingRates={codingRates}
					modulations={modulations}
					handleModulationUpdate={handleModulationUpdate}
					handleCodingUpdate={handleCodingUpdate}
					handleCodingRemove={handleCodingRemove}
					handleModulationRemove={handleModulationRemove}
					handleCreateCodingRate={handleCreateCodingRate}
					handleCreateModulation={handleCreateModulation}
				/>
			)
		});
	}

	// const classes = customStyles();
	const handleTabsChange = (event: ChangeEvent<any>, value: number): void => {
		setActiveTab(value);
	};

	return (
		<>
			<Container>
				<Card style={{ width: '50vw' }}>
					<Grid container>
						<Grid
							item
							md={10}
							style={{ display: 'flex', flexDirection: 'row' }}
						>
							<Tabs
								onChange={handleTabsChange}
								value={activeTab}
								indicatorColor="primary"
							>
								{tabs.map((tab, idx) => {
									return <Tab key={idx} label={tab.name} value={tab.id} />;
								})}
							</Tabs>
						</Grid>
						<Grid
							item
							md={2}
							style={{ display: 'flex', justifyContent: 'flex-end' }}
						>
							{isEngineer && (
								<>
									<Typography style={{ marginTop: '8px', marginRight: '8px' }}>
										{'Edit Mode'}
									</Typography>
									<Switch
										edge="start"
										name="editMode"
										checked={editMode}
										onChange={(event) => setEditMode(event.target.checked)}
									/>
								</>
							)}
						</Grid>
					</Grid>
					{activeTab <= tabs.length ? (<Box key={activeTab}>{tabs[activeTab - 1].element}</Box>) : null}
				</Card>
			</Container>
		</>
	);
};

export default RfAttribute;
