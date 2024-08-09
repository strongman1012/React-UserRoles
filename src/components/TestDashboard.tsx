import React, { FC, ReactNode, useState } from "react";
import { styled } from '@mui/system';
import DashboardNavbar from "./Navbar";
import SecurityRoles from "./security-roles";
import SecurityRolesForm from "./security-roles/SecurityRolesForm";
import UserLists from "./users/user-list";
import EditUser from "./users/edit-user";
import NewUser from "./users/new-user";
import BusinessUnitLists from "./business-units/business-unit-list";
import EditBusinessUnit from "./business-units/edit-business-unit";
import NewBusinessUnit from "./business-units/new-business-unit";
import TeamLists from "./teams/team-list";
import EditTeam from "./teams/edit-team";
import NewTeam from "./teams/new-team";
import Home from "src/pages/Home";
import RoleLists from "./roles/role-list";
import EditRole from "./roles/edit-role";
import NewRole from "./roles/new-role";
import ApplicationLists from "./applications/application-list";
import EditApplication from "./applications/edit-application";
import NewApplication from "./applications/new-application";
import AreaLists from "./areas/area-list"; // Assuming you have an AreaLists component
import EditArea from "./areas/edit-area"; // Assuming you have an EditArea component
import NewArea from "./areas/new-area"; // Assuming you have a NewArea component
import DataAccessLists from "./data-access/data-access-list"; // Assuming you have a DataAccessLists component
import EditDataAccess from "./data-access/edit-data-access"; // Assuming you have an EditDataAccess component
import NewDataAccess from "./data-access/new-data-access"; // Assuming you have a NewDataAccess component
import LoginReportLists from "./loginReports/login-report-list";

interface TestDashboardProps {
    children?: ReactNode;
}

const DashboardContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    height: '90vh'
});

const DashboardMainArea = styled('div')({
    marginTop: '48px',
    paddingBottom: '12px',
    display: 'flex',
    flexGrow: 1
});

const TestDashboard: FC<TestDashboardProps> = (props: TestDashboardProps) => {
    const handleRowSecurityRoleClick = (roleId: number) => {
        setActiveComponent(<SecurityRolesForm roleId={roleId} />);
    };
    const handleRowRoleClick = (roleId: number) => {
        setActiveComponent(<EditRole roleId={roleId} onClose={() => setActiveComponent(<RoleLists onRowClick={handleRowRoleClick} onAddNewClick={handleAddNewRoleClick} />)} />);
    };
    const handleAddNewRoleClick = () => {
        setActiveComponent(<NewRole onClose={() => setActiveComponent(<RoleLists onRowClick={handleRowRoleClick} onAddNewClick={handleAddNewRoleClick} />)} />);
    };
    const handleRowUserClick = (userId: number) => {
        setActiveComponent(<EditUser userId={userId} onClose={() => setActiveComponent(<UserLists onRowClick={handleRowUserClick} onAddNewClick={handleAddNewUserClick} />)} />);
    };
    const handleAddNewUserClick = () => {
        setActiveComponent(<NewUser onClose={() => setActiveComponent(<UserLists onRowClick={handleRowUserClick} onAddNewClick={handleAddNewUserClick} />)} />);
    };
    const handleRowBusinessClick = (businessUnitId: number) => {
        setActiveComponent(<EditBusinessUnit businessUnitId={businessUnitId} onClose={() => setActiveComponent(<BusinessUnitLists onRowClick={handleRowBusinessClick} onAddNewClick={handleAddNewBusinessClick} />)} />);
    };
    const handleAddNewBusinessClick = () => {
        setActiveComponent(<NewBusinessUnit onClose={() => setActiveComponent(<BusinessUnitLists onRowClick={handleRowBusinessClick} onAddNewClick={handleAddNewBusinessClick} />)} />);
    };
    const handleRowTeamClick = (teamId: number) => {
        setActiveComponent(<EditTeam teamId={teamId} onClose={() => setActiveComponent(<TeamLists onRowClick={handleRowTeamClick} onAddNewClick={handleAddNewTeamClick} />)} />);
    };
    const handleAddNewTeamClick = () => {
        setActiveComponent(<NewTeam onClose={() => setActiveComponent(<TeamLists onRowClick={handleRowTeamClick} onAddNewClick={handleAddNewTeamClick} />)} />);
    };
    const handleRowApplicationClick = (applicationId: number) => {
        setActiveComponent(<EditApplication applicationId={applicationId} onClose={() => setActiveComponent(<ApplicationLists onRowClick={handleRowApplicationClick} onAddNewClick={handleAddNewApplicationClick} />)} />);
    };
    const handleAddNewApplicationClick = () => {
        setActiveComponent(<NewApplication onClose={() => setActiveComponent(<ApplicationLists onRowClick={handleRowApplicationClick} onAddNewClick={handleAddNewApplicationClick} />)} />);
    };
    const handleRowAreaClick = (areaId: number) => {
        setActiveComponent(<EditArea areaId={areaId} onClose={() => setActiveComponent(<AreaLists onRowClick={handleRowAreaClick} onAddNewClick={handleAddNewAreaClick} />)} />);
    };
    const handleAddNewAreaClick = () => {
        setActiveComponent(<NewArea onClose={() => setActiveComponent(<AreaLists onRowClick={handleRowAreaClick} onAddNewClick={handleAddNewAreaClick} />)} />);
    };
    const handleRowDataAccessClick = (dataAccessId: number) => {
        setActiveComponent(<EditDataAccess dataAccessId={dataAccessId} onClose={() => setActiveComponent(<DataAccessLists onRowClick={handleRowDataAccessClick} onAddNewClick={handleAddNewDataAccessClick} />)} />);
    };
    const handleAddNewDataAccessClick = () => {
        setActiveComponent(<NewDataAccess onClose={() => setActiveComponent(<DataAccessLists onRowClick={handleRowDataAccessClick} onAddNewClick={handleAddNewDataAccessClick} />)} />);
    };

    const components = [
        {
            name: 'Security Roles',
            component: <SecurityRoles onRowClick={handleRowSecurityRoleClick} />
        },
        {
            name: 'Users',
            component: <UserLists onRowClick={handleRowUserClick} onAddNewClick={handleAddNewUserClick} />
        },
        {
            name: 'Business Units',
            component: <BusinessUnitLists onRowClick={handleRowBusinessClick} onAddNewClick={handleAddNewBusinessClick} />
        },
        {
            name: 'Teams',
            component: <TeamLists onRowClick={handleRowTeamClick} onAddNewClick={handleAddNewTeamClick} />
        },
        {
            name: 'Roles',
            component: <RoleLists onRowClick={handleRowRoleClick} onAddNewClick={handleAddNewRoleClick} />
        },
        {
            name: 'Applications',
            component: <ApplicationLists onRowClick={handleRowApplicationClick} onAddNewClick={handleAddNewApplicationClick} />
        },
        {
            name: 'Areas',
            component: <AreaLists onRowClick={handleRowAreaClick} onAddNewClick={handleAddNewAreaClick} />
        },
        {
            name: 'Data Accesses',
            component: <DataAccessLists onRowClick={handleRowDataAccessClick} onAddNewClick={handleAddNewDataAccessClick} />
        },
        {
            name: "Login Reports",
            component: <LoginReportLists />
        }
    ];

    const [activeComponent, setActiveComponent] = useState<any>(
        <Home />
    );

    const handleChangeComponent = (name: string) => {
        const selectedComponent = components.find((c) => c.name === name)
        setActiveComponent(selectedComponent?.component);
    };

    return (
        <>
            <DashboardContainer>
                <DashboardNavbar onSelectComponent={handleChangeComponent} />
                <DashboardMainArea>
                    {activeComponent}
                </DashboardMainArea>
            </DashboardContainer>
        </>
    )
};

export default TestDashboard;
