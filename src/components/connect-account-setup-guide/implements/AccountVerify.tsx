import React from "react";
import { FC } from "react";
import AwsAccountVerify from "./AwsAccountVerify";
import AzureAccountVerify from "./AzureAccountVerify";

interface AccountProps {
    service: string;
    onCompleted: () => void;
}

const ResourceSetup: FC<AccountProps> = (props: AccountProps) => {

    const handleAccount = () => {
        props.onCompleted();
    }

    return (
        <>
            {props.service === 'aws' && <AwsAccountVerify onCompleted={handleAccount} />}
            {props.service === 'azure' && <AzureAccountVerify onCompleted={handleAccount} />}
        </>
    )
}

export default ResourceSetup;