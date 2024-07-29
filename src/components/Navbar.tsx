import React, { FC, useState, MouseEvent, useEffect, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import DrawerMenu from './Menu';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../reducers/auth/authSlice';
import { fetchAreaLists } from '../reducers/areaList/areaListSlice';

interface NavbarProps {
    onStart: () => void;
    onSelectComponent: (name: string) => void;
}

const DashboardNavbar: FC<NavbarProps> = (props: NavbarProps) => {
    const dispatch = useAppDispatch();
    const [open, setState] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const areaLists = useSelector((state: RootState) => state.areaList.areaLists) || [];

    useEffect(() => {
        if (user) {
            dispatch(fetchAreaLists(user.role_id));
        }
    }, [dispatch, user]);

    // Filter and map the area lists based on the required conditions
    const filteredMenuItems = useMemo(() => {
        return areaLists.filter(area => area.application_name === "Application A" && area.permission);
    }, [areaLists]);

    const handleClickStart = () => {
        props.onStart();
    };

    const toggleDrawer = (open: boolean) => {
        setState(open);
    };

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (name: string) => {
        handleClose();
        props.onSelectComponent(name);
    };

    const systemMenuItems = useMemo(() => {
        return areaLists.filter(area => area.application_name === "System" && area.permission);
    }, [areaLists]);

    return (
        <>
            <AppBar elevation={0}>
                <Toolbar variant="dense">
                    {filteredMenuItems.length > 0 && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            onClick={() => toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        Test Component
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            variant='outlined'
                            sx={{ color: 'white', border: '1px solid #ffffff8f' }}
                            onClick={handleClickStart}
                        >
                            Start Test
                        </Button>
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
                            {systemMenuItems.length > 0 && systemMenuItems.map((item, idx: number) => (
                                <MenuItem
                                    key={idx}
                                    onClick={() => handleMenuItemClick(item.area_name)}
                                >
                                    {item.area_name}
                                </MenuItem>
                            ))}
                            <MenuItem onClick={() => dispatch(logout())}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <DrawerMenu
                open={open}
                handleClose={() => toggleDrawer(false)}
                handleChange={(name: string) => props.onSelectComponent(name)}
            />
        </>
    );
};

export default DashboardNavbar;
