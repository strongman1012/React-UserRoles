import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { fetchAreaLists } from 'src/reducers/areaList/areaListSlice';
import { useAppDispatch } from 'src/store/hooks';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { Box, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import AddchartOutlinedIcon from '@mui/icons-material/AddchartOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import GroupsIcon from '@mui/icons-material/Groups';
import AppsIcon from '@mui/icons-material/Apps';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import LoadingScreen from './Basic/LoadingScreen';

const drawerWidth = 250;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

interface DashboardSidebarProps {
    open: boolean;
}

interface CollapseState {
    [key: string]: boolean;
}

const DashboardSidebar: FC<DashboardSidebarProps> = ({ open }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [systemMenus, setSystemMenus] = useState<string[]>([]);
    const [collapse, setCollapse] = useState<CollapseState>({ 'metrics': false, 'users': false, 'organizations': false, 'assets': false });
    const areaList = useSelector((state: RootState) => state.areaList.areaLists);

    useEffect(() => {
        dispatch(fetchAreaLists());
    }, [dispatch]);

    useEffect(() => {
        if (areaList.length > 0) {
            setLoading(false);
            const items = areaList.filter(area => area.application_name === "System")[0].data.map(item => item.area_name);
            setSystemMenus(items);
        }
    }, [areaList]);

    const handleClick = (name: string) => {
        setCollapse((prevState) => ({ ...prevState, [name]: !prevState[name] }));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <LoadingScreen show={loading} />
            {!loading && systemMenus.length > 0 && (
                <Drawer variant="permanent"
                    PaperProps={{
                        sx: {
                            height: 'calc(100% - 48px) !important',
                            top: '48px !Important',
                            borderRight: '1px solid #ddd',
                            position: 'absolute',
                            zIndex: 1
                        }
                    }}
                    open={open}>
                    <List>
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => handleClick('metrics')}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AddchartOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Metrics & Logs" sx={{ opacity: open ? 1 : 0 }} />
                                {collapse['metrics'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={collapse['metrics']} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {systemMenus.includes('Login Reports') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/login-reports')}>
                                        <ListItemIcon>
                                            <SummarizeIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Login Reports" />
                                    </ListItemButton>
                                )}
                                {systemMenus.includes('Application Metrics') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/application-metrics')}>
                                        <ListItemIcon>
                                            <AutoGraphIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Application Metrics" />
                                    </ListItemButton>
                                )}
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => handleClick('users')}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <PeopleAltOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Users & Roles" sx={{ opacity: open ? 1 : 0 }} />
                                {collapse['users'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={collapse['users']} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {systemMenus.includes('Users') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/users')}>
                                        <ListItemIcon>
                                            <RecentActorsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Users" />
                                    </ListItemButton>
                                )}
                                {systemMenus.includes('Security Roles') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/security-roles')}>
                                        <ListItemIcon>
                                            <AddModeratorIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Security Roles" />
                                    </ListItemButton>
                                )}
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => handleClick('organizations')}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CorporateFareOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Organizations" sx={{ opacity: open ? 1 : 0 }} />
                                {collapse['organizations'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={collapse['organizations']} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {systemMenus.includes('Business Units') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/business-units')}>
                                        <ListItemIcon>
                                            <AddBusinessIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Business Units" />
                                    </ListItemButton>
                                )}
                                {systemMenus.includes('Teams') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/teams')}>
                                        <ListItemIcon>
                                            <GroupsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Teams" />
                                    </ListItemButton>
                                )}
                            </List>
                        </Collapse>
                        <Divider />
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => handleClick('assets')}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AccountBalanceOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Assets" sx={{ opacity: open ? 1 : 0 }} />
                                {collapse['assets'] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={collapse['assets']} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {systemMenus.includes('Applications') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/applications')}>
                                        <ListItemIcon>
                                            <AppsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Applications" />
                                    </ListItemButton>
                                )}
                                {systemMenus.includes('Areas') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/areas')}>
                                        <ListItemIcon>
                                            <BorderOuterIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Areas/Modules" />
                                    </ListItemButton>
                                )}
                                {systemMenus.includes('Data Accesses') && (
                                    <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/dashboard/data-access')}>
                                        <ListItemIcon>
                                            <SettingsAccessibilityIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Data Access" />
                                    </ListItemButton>
                                )}
                            </List>
                        </Collapse>
                    </List>
                </Drawer>
            )}
        </Box>
    );
}

export default DashboardSidebar;
