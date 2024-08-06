import React, { FC, useMemo } from "react";
import { Box, Divider, Drawer, IconButton, ListItemButton, ListItemText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface MenuProps {
    open: boolean;
    handleClose: () => void;
    handleChange: (key: string) => void;
}

const DrawerMenu: FC<MenuProps> = (props: MenuProps) => {
    const areaLists = useSelector((state: RootState) => state.areaList.areaLists);

    // Filter and map the area lists based on the required conditions
    const filteredMenuItems = useMemo(() => {
        return areaLists.filter(area => area.application_name === "Application A")
    }, [areaLists]);

    return (
        <Drawer
            anchor="left"
            open={props.open}
            onClose={props.handleClose}
        >
            <Box
                sx={{
                    p: 2,
                    height: 1,
                    minWidth: 250
                }}
            >
                <IconButton
                    sx={{ mb: 2 }}
                    onClick={props.handleClose}
                >
                    <CloseIcon />
                </IconButton>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                    {filteredMenuItems[0]?.data.length > 0 && filteredMenuItems[0].data.map((item, idx: number) => (
                        <ListItemButton
                            key={idx}
                            onClick={() => {
                                props.handleClose();
                                props.handleChange(item.area_name);
                            }}
                        >
                            <ListItemText primary={item.area_name} />
                        </ListItemButton>
                    ))}
                </Box>
            </Box>
        </Drawer>
    );
};

export default DrawerMenu;
