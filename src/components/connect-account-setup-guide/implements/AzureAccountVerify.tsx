import React from "react";
import { Box, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ServerApi from "../../../utills/serverApi";
import { pink } from "@mui/material/colors";
import LoadingScreen from "../../../components/LoadingScreen";

interface VerifyProps {
    onCompleted: () => void;
}

const initState = {
    register: false,
    vnet: false,
    vm: false
}

const AzureAccountVerify: FC<VerifyProps> = (props: VerifyProps) => {

    const apiObj = new ServerApi();
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState(initState);

    useEffect(() => {
        setIsLoading(true);
        verifyAwsAccounts();
    }, []);

    useEffect(() => {
        const allTrue = Object.values(state).every(value => value === true);
        allTrue && props.onCompleted();
    }, [state]);

    /**
     * Verify Onboarding
     */
    const verifyAwsAccounts = async () => {

        setIsLoading(true);

        try {
            const resSpacecraft = await apiObj.getData('azure/spacecrafts');
            const resVnet = await apiObj.getData('azure/resources/vnet');
            const resVm = await apiObj.getData('azure/resources/vm');

            setState({
                ...state,
                register: resSpacecraft.status === 200 && resSpacecraft.data.success,
                vnet: resVnet.status === 200 && resVnet.data.success,
                vm: resVm.status === 200 && resVm.data.success
            });

            setIsLoading(false);

        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    return (
        <>
            <LoadingScreen show={isLoading} />
            <Box sx={{ p: 3 }}>
                <Box display={'flex'} sx={{ justifyContent: 'space-between' }} mb={2}>
                    <Typography fontWeight={600} mr={1}>1. Register Spacecraft</Typography>
                    {state.register ? <CheckCircleIcon /> : <CancelIcon sx={{ color: pink[500] }} />}
                </Box>

                <Box display={'flex'} sx={{ justifyContent: 'space-between' }} mb={2}>
                    <Typography fontWeight={600} mr={1}>2. Create a Virtual Network (VNET)</Typography>
                    {state.vnet ? <CheckCircleIcon /> : <CancelIcon sx={{ color: pink[500] }} />}
                </Box>

                <Box display={'flex'} sx={{ justifyContent: 'space-between' }} mb={2}>
                    <Typography fontWeight={600} mr={1}>3. Create a Virtual Machine (VM)</Typography>
                    {state.vm ? <CheckCircleIcon /> : <CancelIcon sx={{ color: pink[500] }} />}
                </Box>
            </Box>
        </>
    )
}

export default AzureAccountVerify;