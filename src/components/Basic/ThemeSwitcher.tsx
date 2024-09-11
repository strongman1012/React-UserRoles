import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Switch, Typography, Box } from '@mui/material';
import { red } from '@mui/material/colors';

interface ThemeSwitcherProps {
    darkMode: boolean;
    onToggle: () => void;
}

const RedSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: red[600],
        '&:hover': {
            backgroundColor: alpha(red[600], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: red[600],
    },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ darkMode, onToggle }) => {
    return (
        <Box display="flex" alignItems="center" position="fixed" right="80px" top="7px" zIndex={1200}>
            <Typography variant="body1" color={darkMode ? 'textPrimary' : 'textPrimary'}>Light</Typography>
            <RedSwitch {...label} checked={darkMode} onChange={onToggle} />
            <Typography variant="body1" color={darkMode ? 'textPrimary' : 'textPrimary'}>Dark</Typography>
        </Box>
    );
};

export default ThemeSwitcher;
