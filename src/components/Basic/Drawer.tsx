import React from 'react';
import { SwipeableDrawer, Box, IconButton, Typography, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ReusableDrawerProps {
    open: boolean;
    onClose: () => void;
    onOpen?: () => void;
    children: React.ReactNode;
}

const ReusableDrawer: React.FC<ReusableDrawerProps> = ({ open, onClose, onOpen, children }) => {
    return (
        <SwipeableDrawer
            anchor="right"
            open={open}
            onClose={onClose}
            onOpen={onOpen || (() => { })}
        >
            <Box p={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                        border: 1,
                        mr: 2,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <ArrowForwardIcon />
                </IconButton>
                <Typography variant="h6" component="b" sx={{ margin: 0 }}>
                    Close
                </Typography>
            </Box>

            <Divider />

            <Box sx={{ width: 1000, p: 3 }}>
                {children}
            </Box>
        </SwipeableDrawer>
    );
};

export default ReusableDrawer;
