import React, { FC } from 'react';
import {
    CssBaseline,
    useTheme,
    makeStyles,
    Theme
} from '@material-ui/core';
import { TransitionProps } from '@mui/material/transitions';
import {
    Dialog,
    DialogContent,
    DialogTitle as MuiDialogTitle,
    Typography,
    IconButton
} from "@mui/material";
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import useStyles from '../../utills/styles/styles';

/********************************************************************************/
// PLEASE DO NOT CHANGE THIS FILE! Changes here affect all instances of DialogBox.
/********************************************************************************/

const newStyles = makeStyles((theme: Theme) => ({
    dialogBox: {
        '& > div > div': {
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: '8px',
            maxWidth: 'none'
        }
    }
}))

interface DialogBoxProps {
    id?: string;
    isOpen: boolean;
    title: string;
    className?: any;
    children?: any;
    style?: any;
    classes?: any;
    onClose: (event?: any) => void;
    hideX?: boolean;
    disableBackdropClick?: boolean;
    contentStyles?: React.CSSProperties;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const DialogBox: FC<DialogBoxProps> = ({
    id,
    title,
    isOpen,
    className,
    classes,
    children,
    style,
    onClose,
    hideX,
    disableBackdropClick,
    contentStyles
}) => {
    const styles = useStyles();
    const newClasses = newStyles();
    const theme: Theme = useTheme();

    const hideClose = hideX ?? false;

    return (
        <Dialog
            id={id ?? ''}
            open={isOpen}
            TransitionComponent={Transition}
            onClose={(event, reason) => {
                disableBackdropClick
                    ? ((reason !== 'backdropClick' && reason !== 'escapeKeyDown') && onClose(event))
                    : onClose(event);
            }}
            classes={classes ?? className}
            className={newClasses.dialogBox}
            style={style}
        >
            <CssBaseline />
            <MuiDialogTitle
                style={{
                    margin: 0,
                    padding: '8px 16px',
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <Typography component="strong" variant="h4">
                    {title}
                </Typography>
                {!hideClose &&
                    <IconButton
                        aria-label="Close"
                        className={styles.dialogCloseBtn}
                        style={{ color: theme.palette.background.default }}
                        onClick={onClose}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                }
            </MuiDialogTitle>
            <DialogContent
                // style={{ backgroundColor: '#FFFFFF' }}
                className={className}
                classes={classes}
                dividers={true}
                style={contentStyles}
            >
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default DialogBox;