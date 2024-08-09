import React, { FC, useState, MouseEvent, useEffect, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../reducers/auth/authSlice';
import { fetchAreaLists } from '../reducers/areaList/areaListSlice';

interface NavbarProps {
    onSelectComponent: (name: string) => void;
}

const DashboardNavbar: FC<NavbarProps> = (props: NavbarProps) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const auth = useSelector((state: RootState) => state.auth.user);
    const areaLists = useSelector((state: RootState) => state.areaList.areaLists);

    useEffect(() => {
        if (auth) {
            dispatch(fetchAreaLists(auth.role_id));
        }
    }, [dispatch, auth]);

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
        return areaLists.filter(area => area.application_name === "System");
    }, [areaLists]);

    return (
        <>
            <AppBar elevation={0}>
                <Toolbar variant="dense">
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        System
                    </Typography>
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
                            {systemMenuItems[0]?.data.length > 0 && systemMenuItems[0]?.data.map((item, idx: number) => (
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

        </>
    );
};

export default DashboardNavbar;
