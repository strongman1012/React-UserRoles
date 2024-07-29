import React from 'react';
import { useState, FC } from 'react';
import {
	makeStyles,
	Theme
} from '@material-ui/core';
import { Grid, FormControl, Select, MenuItem, Button, Typography, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogBox from '../../../components/global/DialogBox';
import { THEMES } from '../../../utills/constatnts/general';
import { NewEbNo, AttrValue } from '../types/msTypes';

interface EbNoModalProps {
	open: boolean;
	onOpen: () => void;
	codingTypeOptions: AttrValue[];
	codingRateOptions: AttrValue[];
	modulationOptions: AttrValue[];
	handleCreateEbNo: (data: NewEbNo) => void;
}

const initData: NewEbNo = {
	codingType: '',
	modulation: '',
	codingRate: '',
	ebno: ''
};

const customStyles = makeStyles((theme: Theme) => ({
	popup: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.primary,
		width: '20vw'
	},
	text: {
		color: `${theme.palette.text.primary} !important`,
		fontFamily: 'Roboto',
		fontStyle: 'normal',
		fontSize: '12px',
		lineHeight: '16px',
		letterSpacing: ' 0.05em'
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
	noOutline: {
		'& .MuiOutlinedInput-notchedOutline': {
			border: '0px'
		}
	},
	input: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'left',
		alignItems: 'left',
		padding: '5px',
		gap: '1px',

		background: theme.palette.type === THEMES.LIGHT ? '#FFFFFF' : '#4c4c4c',
		boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
		borderRadius: '8px',

		minHeight: '3vh',
		paddingLeft: '14px'
	}
}));

const EbNoModalOld: FC<EbNoModalProps> = ({
	open,
	onOpen,
	codingTypeOptions,
	codingRateOptions,
	modulationOptions,
	handleCreateEbNo
}) => {
	const classes = customStyles();
	const [data, setData] = useState<NewEbNo>(initData);

	const handleChange = (event: any) => {
		const { name, value } = event.target;

		// Ensure only positive numbers are allowed
		const newValue = Math.max(0, parseFloat(value));

		// Ensure the value is within the range of 0 to 100
		const clampedValue = Math.min(newValue, 100);
		setData({ ...data, [name]: clampedValue });
	};

	const handleConfirm = () => {
		if (
			!data.codingType ||
			!data.modulation ||
			!data.codingRate ||
			!data.ebno
		) {
			alert('Please fill in all required fields.');
			return;
		}

		try {
			handleCreateEbNo(data);
			setData(initData);
			onOpen();
		} catch (error) {
			console.log('error');
		}
	};


	return (
		<DialogBox
			title="New Eb/No"
			isOpen={open}
			onClose={onOpen}
		// className={classes.popup}
		>
			<DialogContent>
				{/* Coding Type */}
				<Grid container justifyContent="center" alignItems="center" spacing={2}>
					<Grid item md={6}>
						<Typography className={classes.text} >{'Coding Type'}</Typography>
					</Grid>
					<Grid item md={6}>
						<FormControl
							variant="filled"
							size="small"
							fullWidth
							className={classes.select}
						>
							<Select
								className={`${classes.noOutline}`}
								name="codingType"
								variant="outlined"
								color="primary"
								value={data?.codingType}
								fullWidth
								onChange={handleChange}
								required
								data-testid='test_id_coding_type'
							>
								{codingTypeOptions.map((codingType, idx) => {
									return (
										<MenuItem key={codingType.id} value={codingType.id}>
											{codingType.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</Grid>
					{/* Modulation */}
					<Grid item md={6}>
						<Typography className={classes.text}>{'Modulation:'}</Typography>
					</Grid>
					<Grid item md={6}>
						<FormControl
							variant="filled"
							size="small"
							fullWidth
							className={classes.select}
						>
							<Select
								className={`${classes.noOutline}`}
								name="modulation"
								color="primary"
								variant="outlined"
								value={data?.modulation}
								fullWidth
								onChange={handleChange}
								required
								data-testid='test_id_modulation'
							>
								{modulationOptions.map((modulation, idx) => {
									return (
										<MenuItem key={modulation.id} value={modulation.id}>
											{modulation.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</Grid>
					{/* Coding Rate */}
					<Grid item md={6}>
						<Typography className={classes.text}>{'Coding Rate'}</Typography>
					</Grid>
					<Grid item md={6}>
						<FormControl
							variant="filled"
							size="small"
							fullWidth
							className={classes.select}
						>
							<Select
								className={`${classes.noOutline}`}
								name="codingRate"
								color="primary"
								variant="outlined"
								value={data?.codingRate}
								fullWidth
								onChange={handleChange}
								required
								data-testid='test_id_coding_rate'
							>
								{codingRateOptions.map((codingRate, idx) => {
									return (
										<MenuItem key={codingRate.id} value={codingRate.id}>
											{codingRate.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</Grid>
					{/* Eb/No */}
					<Grid item md={6}>
						<Typography className={classes.text}>{'Eb/No'}</Typography>
					</Grid>
					<Grid item md={6}>
						<TextField
							name={'ebno'}
							value={data?.ebno}
							fullWidth
							onChange={handleChange}
							type="number"
							required
							data-testid="test_id_ebno"
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					type="button"
					color="primary"
					variant="outlined"
					onClick={() => onOpen()}
					data-testid="test_id_cancel"
				>
					{'Cancel'}
				</Button>
				<Button
					type="button"
					color="primary"
					variant="contained"
					onClick={handleConfirm}
					data-testid="test_id_ok"
				>
					{'Ok'}
				</Button>
			</DialogActions>
		</DialogBox>
	);
};

export default EbNoModalOld;
