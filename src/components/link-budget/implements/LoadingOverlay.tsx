import React from 'react';
import { FC, useEffect, useState } from 'react';
import {
	makeStyles,
	Theme
} from '@material-ui/core';
import { Paper, Backdrop, LinearProgress, colors, Grid, Typography, Box, Button } from '@mui/material';

interface LoadingOverlayProps {
	isLoading: boolean;
	status: string;
	subtextStatus?: string;
	progress: number;
	className?: string;
	showCancelButton?: boolean;
	cancelAction?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
	},
	progressBar: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
		borderRadius: 5
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	text: {
		color: colors.grey[100],
		fontWeight: 'bold',
		fontSize: theme.typography.pxToRem(15),
		marginLeft: theme.spacing(4)
	},
	paper: {
		padding: theme.spacing(3),
		textAlign: 'center',
		color: theme.palette.text.primary,
		borderRadius: '5px'
	},
	paperComment: {
		padding: theme.spacing(1),
		fontStyle: 'italic',
		fontSize: 12,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		borderRadius: 0
	},
	dialogCloseBtn: {
		color: theme.palette.grey[500],
		zIndex: 100,
	},
}));


const LinearProgressWithLabel = (props: any) => {
	return (
		<Box display="flex" alignItems="center">
			<Box width="100%" mr={1}>
				<LinearProgress variant="determinate" {...props} />
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2" color="textSecondary">{`${Math.round(
					props.value,
				)}%`}</Typography>
			</Box>
		</Box>
	);
};

const LoadingOverlay: FC<LoadingOverlayProps> = ({
	isLoading,
	status,
	subtextStatus,
	progress,
	showCancelButton,
	cancelAction
}) => {
	const classes = useStyles();

	const [progressPercent, setProgressPercent] = useState(0);

	useEffect(() => {
		setProgressPercent(progress);
	}, [progress]);

	useEffect(() => {
		if (isLoading) {
			setProgressPercent(0);
		}
	}, [isLoading]);

	return (
		<>
			<Backdrop className={classes.backdrop} open={isLoading}>
				<Grid container spacing={3} justifyContent="center">
					<Grid item xs={4}>
						<Paper className={classes.paper}>
							{status.length > 0 ? status : 'Loading...'}
							<div className={classes.progressBar} style={{ marginTop: '4px' }}>
								{progressPercent > 0 ? (
									<LinearProgressWithLabel value={progressPercent} />
								) : (
									<LinearProgress />
								)}
								<div style={{ display: 'flex', flexDirection: 'row', marginTop: '0px' }}>

									{subtextStatus && subtextStatus.length > 0 &&
										<div style={showCancelButton ? { flex: 'auto', paddingLeft: '5vw' } : { flex: 'auto' }}>
											<Typography
												variant="subtitle2"
												component="span"
												style={{ fontWeight: 'lighter', fontStyle: 'oblique', flex: 'auto' }}
											>
												{subtextStatus}
											</Typography>
										</div>
									}
									{showCancelButton && (
										<div style={(!subtextStatus || subtextStatus.length <= 0) ? { flex: 'auto', marginTop: '2vh' } : { marginTop: '4vh' }}>
											<Button
												style={{ marginRight: '1vw', borderRadius: 8, paddingTop: '2px', paddingBottom: '2px', width: '4vw', float: 'right' }}
												onClick={cancelAction}
												variant="contained"
												color="primary">
												Cancel
											</Button>
										</div>
									)}
								</div>
							</div>
						</Paper>
					</Grid>
				</Grid>
			</Backdrop>
		</>
	);
};

export default LoadingOverlay;