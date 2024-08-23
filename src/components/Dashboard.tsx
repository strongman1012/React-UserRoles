import React, { FC, useState, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { styled } from '@mui/system';
import DashboardNavbar from "./Navbar";
import DashboardSidebar from "./Sidebar";

interface DashboardProps {
    children?: ReactNode;
}

const DashboardContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    height: '90vh',
});

const DashboardMainArea = styled('div', {
    shouldForwardProp: (prop) => prop !== 'open'
})<{ open: boolean }>(({ theme, open }) => ({
    marginTop: '48px',
    paddingBottom: '12px',
    display: 'flex',
    flexGrow: 1,
    marginLeft: open ? 250 : `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        marginLeft: open ? 250 : `calc(${theme.spacing(8)} + 1px)`,
    }
}));

const Dashboard: FC<DashboardProps> = () => {
    const [open, setOpen] = useState<boolean>(true);

    const toggleSidebar = () => {
        setOpen(!open);
    };

    return (
        <>
            <DashboardContainer>
                <DashboardNavbar open={open} toggleSidebar={toggleSidebar} />
                <DashboardSidebar open={open} />
                <DashboardMainArea open={open}>
                    <Outlet />
                </DashboardMainArea>
            </DashboardContainer>
        </>
    )
};

export default Dashboard;
