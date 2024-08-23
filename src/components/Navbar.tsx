import React, { FC, useState, MouseEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import { useNavigate } from 'react-router-dom';
import { Box, Toolbar, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { AccountCircle, MenuOutlined } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../reducers/auth/authSlice';

interface DashboardNavbarProps {
    open: boolean;
    toggleSidebar: () => void;
}

const DashboardNavbar: FC<DashboardNavbarProps> = ({ open, toggleSidebar }) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar elevation={0}>
                <Toolbar variant="dense">
                    <IconButton
                        color='inherit'
                        aria-label='open sidebar'
                        size='large'
                        edge="start"
                        sx={{ mr: 2 }}
                        onClick={toggleSidebar}
                    >
                        <MenuOutlined />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/')}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            color={'primary.contrastText'}
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            System
                        </Typography>
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => { }}>Profile</MenuItem>
                            <MenuItem onClick={() => dispatch(logout())}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default DashboardNavbar;
