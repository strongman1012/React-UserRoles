import React from "react";
import { Box, Container, Typography } from "@mui/material";
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
    onboard: false,
    vpc: false,
    ec2: false,
    stack: false
}

const AwsAccountVerify: FC<VerifyProps> = (props: VerifyProps) => {

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
            const resSat = await apiObj.getData('aws/satellites');
            const resVpc = await apiObj.getData('aws/resources/vpc');
            const resEc2 = await apiObj.getData('aws/resources/ec2');
            const resStack = await apiObj.getData('aws/resources/stack');

            setState({
                ...state,
                onboard: resSat.status === 200 && resSat.data.success,
                vpc: resVpc.status === 200 && resVpc.data.success,
                ec2: resEc2.status === 200 && resEc2.data.success,
                stack: resStack.status === 200 && resStack.data.success
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
                    <Typography fontWeight={600} mr={1}>1. Onboarding Satellites</Typography>
                    {state.onboard ? <CheckCircleIcon /> : <CancelIcon sx={{ color: pink[500] }} />}
                </Box>

                <Box display={'flex'} sx={{ justifyContent: 'space-between' }} mb={2}>
                    <Typography fontWeight={600} mr={1}>2. Create a VPC (Virtual Private Network)</Typography>
                    {state.vpc ? <CheckCircleIcon /> : <CancelIcon sx={{ color: pink[500] }} />}
                </Box>

                <Box display={'flex'} sx={{ justifyContent: 'space-between' }} mb={2}>
                    <Typography fontWeight={600} mr={1}>3. Create a EC2 instance (Elastic Compute Cloud)</Typography>
                    {state.ec2 ? <CheckCircleIcon /> : <CancelIcon sx={{ color: pink[500] }} />}
                </Box>

                <Box display={'flex'} sx={{ justifyContent: 'space-between' }} mb={2}>
                    <Typography fontWeight={600} mr={1}>4. Create a CloudFormation</Typography>
                    {state.stack ? <CheckCircleIcon /> : <CancelIcon sx={{ color: pink[500] }} />}
                </Box>
            </Box>
        </>
    )
}

export default AwsAccountVerify;