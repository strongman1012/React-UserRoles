import React, { FC, useState, MouseEvent, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import { useNavigate } from 'react-router-dom';
import {
    Box, Toolbar, IconButton, Typography, Menu, MenuItem, ListItemIcon,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { AccountCircle, MenuOutlined, Settings, ExitToApp } from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../reducers/auth/authSlice';
import { fetchUserAccess } from 'src/reducers/areaList/areaListSlice';
import { saveSettings } from 'src/reducers/settings/settingsSlice';
import { RootState } from "src/store/store";
import { useSelector } from "react-redux";
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface DashboardNavbarProps {
    open: boolean;
    toggleSidebar: () => void;
}

const DashboardNavbar: FC<DashboardNavbarProps> = ({ open, toggleSidebar }) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const sidebarVisible = useSelector((state: RootState) => state.areaList.sidebarVisible);
    const setting = useSelector((state: RootState) => state.settings.setting);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [rowsPerPage, setRowsPerPage] = useState<number>();
    const [error, setError] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {
        dispatch(fetchUserAccess());
    }, [dispatch]);

    useEffect(() => {
        setting?.rowsPerPage ? setRowsPerPage(setting.rowsPerPage) : setRowsPerPage(20);
    }, [setting]);

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOk = async () => {
        // Check for valid input (non-empty, a number, and greater than 0)
        if (!rowsPerPage || isNaN(rowsPerPage) || Number(rowsPerPage) <= 0) {
            setError(true);
        } else {
            setError(false);
            setIsLoading(true);
            try {

                const message = await dispatch(saveSettings(rowsPerPage));
                if (message) {
                    setConfirmTitle(message);
                    setConfirmDescription('');
                    setConfirmModalOpen(true);
                }
            } catch (error: any) {
                setConfirmTitle(error.message);
                setConfirmDescription('');
                setConfirmModalOpen(true);
            }
            finally {
                setIsLoading(false);
                setSettingsOpen(false);
            }
        }
    };

    const handleChange = (event: any) => {
        setRowsPerPage(event.target.value);
        setError(false);
    };

    return (
        <>
            <LoadingScreen show={isLoading} />
            <AppBar elevation={0} sx={{ border: 0 }}>
                <Toolbar variant="dense">
                    {sidebarVisible && (
                        <IconButton
                            color='inherit'
                            aria-label='open sidebar'
                            size='large'
                            edge="start"
                            sx={{ mr: 1, color: (theme) => `${theme.palette.primary.main}` }}
                            onClick={toggleSidebar}
                        >
                            <MenuOutlined />
                        </IconButton>
                    )}
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/')}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ color: (theme) => `${theme.palette.primary.dark}` }}
                        >
                            System
                        </Typography>
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            sx={{ color: (theme) => `${theme.palette.primary.main}` }}
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
                            <MenuItem onClick={() => { }}>
                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                    <AccountCircle />
                                </ListItemIcon>
                                <Typography>Account Settings</Typography>
                            </MenuItem>

                            <MenuItem onClick={() => setSettingsOpen(true)}>
                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                    <Settings />
                                </ListItemIcon>
                                <Typography>Settings</Typography>
                            </MenuItem>

                            <MenuItem onClick={() => dispatch(logout())}>
                                <ListItemIcon sx={{ color: (theme) => `${theme.palette.primary.main}` }}>
                                    <ExitToApp />
                                </ListItemIcon>
                                <Typography>Log Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
                <DialogTitle
                    sx={{
                        width: '475px',
                        background: (theme) => `${theme.palette.primary.main}`,
                        color: '#f7f7f7',
                        height: '45px',
                    }}
                >
                    Settings
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        id="rows-per-page"
                        label="Rows Per Page"
                        type="number"
                        value={rowsPerPage}
                        onChange={handleChange}
                        error={error}
                        helperText={error ? "Please enter a valid number greater than 0" : ''}
                        variant="outlined"
                        size="small"
                        sx={{ mt: 5 }}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOk} variant="contained" sx={{ '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}>
                        OK
                    </Button>
                    <Button onClick={() => setSettingsOpen(false)} variant="contained" sx={{ mr: 2, '&:hover': { background: (theme) => `${theme.palette.secondary.dark}` } }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <AlertModal
                show={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title={confirmTitle}
                description={confirmDescription}
            />
        </>
    );
};

export default DashboardNavbar;
