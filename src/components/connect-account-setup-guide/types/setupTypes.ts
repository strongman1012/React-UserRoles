import { ResponseData } from "../../../utills/serverApi";

export interface ActiveDirectoryValues {
    type: string,
    applicationId: string,
    applicationKey: string,
    tenantName: string,
    tenantId: string
}

export interface ActiveDirectoryResponse extends ResponseData<ActiveDirectoryValues> {
    success: boolean;
    data: ActiveDirectoryValues;
}

export interface AwsCredentialValues {
    type: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

export interface AwsCredentialValuesResponse extends ResponseData<AwsCredentialValues> {
    success: boolean;
    data: AwsCredentialValues;
}