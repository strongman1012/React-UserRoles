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
            <Box p={2} sx={{ display: 'flex', alignItems: 'center', background: (theme) => `${theme.palette.primary.main}` }}>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                        border: 1,
                        mr: 2,
                        color: '#f7f7f7'
                    }}
                >
                    <ArrowForwardIcon />
                </IconButton>
                <Typography variant="h4" sx={{ margin: 0, color: '#f7f7f7' }}>
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
