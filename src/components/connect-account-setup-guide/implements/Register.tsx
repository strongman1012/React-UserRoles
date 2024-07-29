import React from "react";
import { Box, Typography } from "@mui/material";
import { FC } from "react";
import AwsRegisterForm from "./AwsRegister";
import AzureRegisterForm from "./AzureRegister";
import { serviceProviders } from "../../../config/app";

interface RegisterProps {
    service: string,
}

const RegisterAccount: FC<RegisterProps> = (props: RegisterProps) => {

    const accountUrl = serviceProviders.find(p => p.key === props.service)?.accountUrl;

    return (
        <>
            <Box p={2}>
                <Typography color={'primary.main'} mb={2}>
                    Do you have an account? If not then create an account from <a href={accountUrl} target="blank">here</a>.
                </Typography>

                <Box>
                    {props.service === 'aws' && <AwsRegisterForm />}
                    {props.service === 'azure' && <AzureRegisterForm />}
                </Box>
            </Box>
        </>
    )
}

export default RegisterAccount;