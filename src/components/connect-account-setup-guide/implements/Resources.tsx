import React from "react";
import { FC } from "react";
import AwsResources from "./AwsResources";
import AzureResources from "./AzureResources";

interface ResourcesProps {
    service: string;
    onCompleted: () => void;
}

const ResourceSetup: FC<ResourcesProps> = (props: ResourcesProps) => {

    const handleResourceDone = () => {
        props.onCompleted();
    }

    return (
        <>
            {props.service === 'aws' && <AwsResources onCompleted={handleResourceDone} />}
            {props.service === 'azure' && <AzureResources onCompleted={handleResourceDone} />}
        </>
    )
}

export default ResourceSetup;