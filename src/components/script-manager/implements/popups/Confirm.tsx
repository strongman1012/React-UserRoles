import React from 'react';
import { FC } from 'react';
import { Button, makeStyles, Grid, Typography, Theme } from '@material-ui/core';
import DialogBox from '../../../global/DialogBox';

interface IConfirmProps {
	open: boolean;
	message: string;
	onOpen: () => void;
	onConfirm: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
	dialog: {
		width: '25vw'
	}
}));

/**
 * Confirmation Dialog
 *
 * @param {*} { open, onOpen, onConfirm }
 */
const Confirm: FC<IConfirmProps> = ({ open, message, onOpen, onConfirm }: IConfirmProps) => {
	const classes = useStyles();

	const handleClose = () => onOpen();

	const handleConfirm = () => {
		onOpen();
		onConfirm();
	};

	return (
		<DialogBox
			title={`Confirm`}
			isOpen={open}
			onClose={() => {
				handleClose();
			}}
			className={{ paper: classes.dialog }}
		>
			<Grid container justifyContent="center" alignItems="center" spacing={2}>
				<Grid item md={12}>
					<Typography>{message}</Typography>
				</Grid>
				<Grid item md={12}>
					<Button
						onClick={handleConfirm}
						color="primary"
						variant="contained"
						style={{ float: 'right', marginRight: '5px' }}
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

export default Confirm;
