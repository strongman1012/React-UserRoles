import React, { FC, ReactNode, useState } from "react";
import DashboardNavbar from "./Navbar";
import { styled } from '@mui/system';
import DashboardSidebar from "./Sidebar";
import LoadingScreen from "./LoadingScreen";
import ShellApi from "../utills/shellApi";
import { setOutputJson, setTestStatus } from "../reducers/testReducer";
import DashboardFooter from "./Footerbar";
import { useAppDispatch } from "../store/hooks";
import ConnectAccountSetupGuide from "./connect-account-setup-guide/implements/ConnectAccountSetupGuide";
import DataViewer from "./data-viewer/implements/DataViewer";
import ScriptManager from "./script-manager/implements/ScriptManager";
import LinkBudgetComponent from "./link-budget/implements";
import RenderEbNo from "./rfAttribute/implements/RenderEbNo";
import HeatMapSlider from './heatmap-slider/implements/HeatMapSlider';
import SecurityRoles from "./security-roles";
import SecurityRolesForm from "./security-roles/SecurityRolesForm";
import UserLists from "./users/user-list";
import EditUser from "./users/edit-user";
import BusinessUnitLists from "./business-units/business-unit-list";
import EditBusinessUnit from "./business-units/edit-business-unit";
import NewBusinessUnit from "./business-units/new-business-unit"; // import NewBusinessUnit component
import Home from "src/pages/Home";

interface TestDashboardProps {
    children?: ReactNode;
    themeName: string;
    onChangeTheme: (name: string) => void;
}

const DashboardContainer = styled('div')(
    {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
    }
)

const DashboardMainArea = styled('div')(
    {
        marginTop: '48px',
        paddingBottom: '12px',
        display: 'flex',
        flexGrow: 1
    }
)

const initOutput = {
    status: 200,
    data: {
        success: true,
        message: 'Success!'
    }
}

const TestDashboard: FC<TestDashboardProps> = (props: TestDashboardProps) => {
    const handleRowRoleClick = (roleId: number) => {
        setActiveComponent(<SecurityRolesForm roleId={roleId} />);
    }
    const handleRowUserClick = (userId: number) => {
        setActiveComponent(<EditUser userId={userId} onClose={() => setActiveComponent(<UserLists onRowClick={handleRowUserClick} />)} />);
    }
    const handleRowBusinessClick = (businessUnitId: number) => {
        setActiveComponent(<EditBusinessUnit businessUnitId={businessUnitId} onClose={() => setActiveComponent(<BusinessUnitLists onRowClick={handleRowBusinessClick} onAddNewClick={handleAddNewBusinessClick} />)} />);
    }
    const handleAddNewBusinessClick = () => {
        setActiveComponent(<NewBusinessUnit onClose={() => setActiveComponent(<BusinessUnitLists onRowClick={handleRowBusinessClick} onAddNewClick={handleAddNewBusinessClick} />)} />);
    }
    const components = [
        {
            name: 'Connect Account Setup',
            component: <ConnectAccountSetupGuide />
        },
        {
            name: 'Data Viewer',
            component: <DataViewer />
        },
        {
            name: 'Script Manager',
            component: <ScriptManager />
        },
        {
            name: 'RfAttribute',
            component: <RenderEbNo />
        },
        {
            name: 'Link Budget',
            component: <LinkBudgetComponent themeName={'light'} onChangeTheme={() => { }} />
        },
        {
            name: 'HeatMap Slider',
            component: <HeatMapSlider />
        },
        {
            name: 'Security Roles',
            component: <SecurityRoles onRowClick={handleRowRoleClick} />
        },
        {
            name: 'Users',
            component: <UserLists onRowClick={handleRowUserClick} />
        },
        {
            name: 'Business Units',
            component: <BusinessUnitLists onRowClick={handleRowBusinessClick} onAddNewClick={handleAddNewBusinessClick} />
        }
    ];
    const dispatch = useAppDispatch();
    const apiObj = new ShellApi();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeComponent, setActiveComponent] = useState<any>(
        <Home />
    );

    const handleTestStart = async () => {
        setIsLoading(true);

        try {
            const response = await apiObj.excuteTestShell();
            console.log('response', response)
            dispatch(setTestStatus(JSON.stringify(response.data)));
        } catch (err) {
            console.log('error', err);
            dispatch(setTestStatus(JSON.stringify(err)));
        }

        dispatch(setOutputJson(JSON.stringify(initOutput)));

        setIsLoading(false);
    }

    const handleChangeComponent = (name: string) => {
        const selectedComponent = components.find((c) => c.name === name)
        setActiveComponent(selectedComponent?.component);
    }

    return (
        <>
            <LoadingScreen show={isLoading} />
            <DashboardContainer>
                <DashboardNavbar onStart={handleTestStart} onSelectComponent={handleChangeComponent} />
                <DashboardMainArea>
                    {activeComponent}
                    <DashboardSidebar />
                </DashboardMainArea>
                <DashboardFooter result="" />
            </DashboardContainer>
        </>
    )
}

export default TestDashboard;
