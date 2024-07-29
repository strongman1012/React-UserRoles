import React from 'react';
import { FC, useEffect, useState } from 'react';
import {
	Button, makeStyles, Grid, Typography,
	FormControl, MenuItem, Select, TextField, Theme
} from '@material-ui/core';
import DialogBox from '../../../global/DialogBox';

interface ICreateProps {
	open: boolean;
	extOptions: string[];
	closeDialog: () => void;
	onConfirm: (filename: string, ext: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
	select: {
		background: theme.palette.background.default,
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
		justifyContent: 'center',
		alignItems: 'center',
		padding: '5px',
		gap: '1px',
		background: theme.palette.background.default,
		boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
		borderRadius: '8px',
		minHeight: '3vh',
		paddingLeft: '14px'
	},
}));

/**
 * Confirmation Dialog for removing DTE object
 *
 * @param {*} { open, onOpen, onConfirm }
 */
const CreateScript: FC<ICreateProps> = (
	{ open, extOptions, closeDialog, onConfirm }: ICreateProps
) => {
	const classes = useStyles();
	const [filename, setFilename] = useState<string>('');
	const [ext, setExt] = useState<string>(extOptions[0]);
	const [extId, setExtId] = useState<number>(0);

	useEffect(() => {
		setExt(extOptions[0]);
	}, [extOptions]);

	const handleClose = () => {
		closeDialog();
		setFilename('');
	}

	const handleConfirm = () => {
		closeDialog();
		onConfirm(filename, ext);
		setFilename('');
	};

	return (
		<DialogBox
			title={`Create a script`}
			isOpen={open}
			onClose={handleClose}
		>
			<Grid container justifyContent="center" alignItems="center" spacing={2}>
				<Grid item md={12} />
				<Grid item md={3}>
					<Typography>Script Name</Typography>
				</Grid>
				<Grid item md={6}>
					<TextField
						name={'scriptName'}
						value={filename}
						InputProps={{
							className: classes.input,
							disableUnderline: true,
						}}
						onChange={(e) => { if (/^(([a-zA-Z0-9_-]\s?)*)+$/.test(e.target.value)) setFilename(e.target.value) }}
						fullWidth
						placeholder='Please add Script Name'
					/>
				</Grid>
				<Grid item md={2}>
					<FormControl
						variant="filled"
						size="small"
						fullWidth
						className={classes.select}
					>
						<Select
							name="type"
							variant="outlined"
							data-filter-network="true"
							value={extId}
							color="primary"
							className={classes.noOutline}
							onChange={(e) => {
								const { value } = e.target;
								setExtId(value as number);
								setExt(extOptions[value as number]);
							}}
							fullWidth
						>
							{extOptions.map((ext, idx) =>
								<MenuItem value={idx} key={idx}>{ext}</MenuItem>
							)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item md={1} />
				<Grid item md={12} />
				<Grid item md={12}>
					<Button
						onClick={handleConfirm}
						color="primary"
						variant="contained"
						style={{ float: 'right', marginRight: '5px' }}
						disabled={filename.length === 0}
						aria-label='Button Ok'
					>
						OK
					</Button>
					<Button
						onClick={() => {
							handleClose();
						}}
						color="primary"
						variant="outlined"
						style={{ float: 'right', marginRight: '5px' }}
					>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</DialogBox>
	);
};

export default CreateScript;
