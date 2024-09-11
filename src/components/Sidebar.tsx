import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
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
import TableChartIcon from '@mui/icons-material/TableChart';
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
        width: `calc(${theme.spacing(12)} + 1px)`,
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
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState<boolean>(true);
    const [systemMenus, setSystemMenus] = useState<string[]>([]);
    const [collapse, setCollapse] = useState<CollapseState>({ 'metrics': true, 'users': true, 'organizations': true, 'assets': true });
    const areaList = useSelector((state: RootState) => state.areaList.areaLists);

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

    const getPathnameMatch = (pathname: string) => {
        return pathname.split('/').pop();
    };

    const isActive = (menuItem: string) => {
        return getPathnameMatch(location.pathname) === getPathnameMatch(menuItem);
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
                            border: (theme) => `1px solid ${theme.palette.primary.main}`,
                            position: 'absolute',
                            zIndex: 1
                        }
                    }}
                    open={open}>
                    <List>
                        {(systemMenus.includes('Login Reports') || systemMenus.includes('Application Metrics')) && (
                            <>
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
                                                color: (theme) => `${theme.palette.primary.main}`
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
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('login-reports') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/login-reports')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <SummarizeIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Login Reports" />
                                            </ListItemButton>
                                        )}
                                        {systemMenus.includes('Application Metrics') && (
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('application-metrics') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/application-metrics')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <AutoGraphIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Application Metrics" />
                                            </ListItemButton>
                                        )}
                                    </List>
                                </Collapse>
                                <Divider sx={{ background: (theme) => `${theme.palette.primary.main}` }} />
                            </>
                        )}

                        {(systemMenus.includes('Users') || systemMenus.includes('Security Roles')) && (
                            <>
                                <ListItem disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                        onClick={() => handleClick('users')}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                                color: (theme) => `${theme.palette.primary.main}`
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
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('users') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/users')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <RecentActorsIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Users" />
                                            </ListItemButton>
                                        )}
                                        {systemMenus.includes('Security Roles') && (
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('security-roles') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/security-roles')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <AddModeratorIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Security Roles" />
                                            </ListItemButton>
                                        )}
                                    </List>
                                </Collapse>
                                <Divider sx={{ background: (theme) => `${theme.palette.primary.main}` }} />
                            </>
                        )}

                        {(systemMenus.includes('Business Units') || systemMenus.includes('Teams') || systemMenus.includes('Organization Chart')) && (
                            <>
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
                                                color: (theme) => `${theme.palette.primary.main}`
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
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('business-units') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/business-units')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <AddBusinessIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Business Units" />
                                            </ListItemButton>
                                        )}
                                        {systemMenus.includes('Teams') && (
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('teams') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/teams')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <GroupsIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Teams" />
                                            </ListItemButton>
                                        )}
                                        {systemMenus.includes('Organization Chart') && (
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('organization-chart') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/organization-chart')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <TableChartIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Organization Chart" />
                                            </ListItemButton>
                                        )}
                                    </List>
                                </Collapse>
                                <Divider sx={{ background: (theme) => `${theme.palette.primary.main}` }} />
                            </>
                        )}

                        {(systemMenus.includes('Applications') || systemMenus.includes('Areas') || systemMenus.includes('Data Accesses')) && (
                            <>
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
                                                color: (theme) => `${theme.palette.primary.main}`
                                            }}
                                        >
                                            <AccountBalanceOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Applications" sx={{ opacity: open ? 1 : 0 }} />
                                        {collapse['assets'] ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={collapse['assets']} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {systemMenus.includes('Applications') && (
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('applications') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/applications')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <AppsIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Applications" />
                                            </ListItemButton>
                                        )}
                                        {systemMenus.includes('Areas') && (
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('areas') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/areas')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <BorderOuterIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Areas/Modules" />
                                            </ListItemButton>
                                        )}
                                        {systemMenus.includes('Data Accesses') && (
                                            <ListItemButton
                                                sx={{ pl: 4, bgcolor: (theme) => isActive('data-access') ? `${theme.palette.secondary.main}` : 'inherit' }}
                                                onClick={() => navigate('/dashboard/data-access')}
                                            >
                                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                                    <SettingsAccessibilityIcon />
                                                </ListItemIcon>
                                                <ListItemText primary="Data Accesses" />
                                            </ListItemButton>
                                        )}
                                    </List>
                                </Collapse>
                            </>
                        )}
                    </List>
                </Drawer>
            )}
        </Box>
    );
};

export default DashboardSidebar;
