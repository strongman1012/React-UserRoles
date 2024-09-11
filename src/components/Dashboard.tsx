import React, { FC, useState, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { styled } from '@mui/system';
import DashboardNavbar from "./Navbar";
import DashboardSidebar from "./Sidebar";
import { RootState } from "src/store/store";
import { useSelector } from "react-redux";

interface DashboardProps {
    children?: ReactNode;
}

const DashboardContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
});

const DashboardMainArea = styled('div', {
    shouldForwardProp: (prop) => prop !== 'open' && prop !== 'sidebarVisible'
})<{ open: boolean, sidebarVisible: boolean }>(({ theme, open, sidebarVisible }) => ({
    marginTop: '48px',
    paddingBottom: '12px',
    display: 'flex',
    flexGrow: 1,
    marginLeft: !sidebarVisible ? 0 : (open ? 250 : `calc(${theme.spacing(7)} + 1px)`),
    [theme.breakpoints.up('sm')]: {
        marginLeft: !sidebarVisible ? 0 : (open ? 250 : `calc(${theme.spacing(12)} + 1px)`),
    }
}));

const Dashboard: FC<DashboardProps> = () => {
    const [open, setOpen] = useState<boolean>(true);
    const sidebarVisible = useSelector((state: RootState) => state.areaList.sidebarVisible);

    const toggleSidebar = () => {
        setOpen(!open);
    };

    return (
        <>
            <DashboardContainer>
                <DashboardNavbar open={open} toggleSidebar={toggleSidebar} />
                {sidebarVisible === true && <DashboardSidebar open={open} />}
                <DashboardMainArea open={open} sidebarVisible={sidebarVisible}>
                    <Outlet />
                </DashboardMainArea>
            </DashboardContainer>
        </>
    )
};

export default Dashboard;
