import React from "react";
import {
    Box, Divider, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface AwsResourcesProps {
    onCompleted: () => void;
}

const initState = {
    onboard: false,
    vpc: false,
    ec2: false,
    stack: false
}

const AwsResources: FC<AwsResourcesProps> = (props: AwsResourcesProps) => {

    const [state, setState] = useState(initState);

    useEffect(() => {
        const stateStr = localStorage.getItem('casg_aws_state');
        stateStr && setState(JSON.parse(stateStr));
    }, []);

    useEffect(() => {
        const allTrue = Object.values(state).every(value => value === true);
        allTrue && props.onCompleted();
    }, [state]);

    const handleClick = (step: string) => {
        setState({ ...state, [step]: true });
        localStorage.setItem('casg_aws_state', JSON.stringify({ ...state, [step]: true }));
    }

    return (
        <>
            <Box color='primary.main' style={{ maxHeight: '50vh' }}>
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600} mr={1}>1. Onboarding Satellites</Typography>
                        {state.onboard && <CheckCircleIcon />}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography ml={2}>To start onboarding your satellite to AWS Ground Station,
                            please email aws-groundstation@amazon.com with a brief summary of your mission and satellite needs,
                            including your organization name, the frequencies required, when the satellites will be or were launched,
                            and the satellite's orbit type.
                            <a href="https://eu-north-1.console.aws.amazon.com/groundstation/home?region=eu-north-1#/resources" target="_blank">
                                More detail
                            </a>
                        </Typography>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleClick('onboard')}
                            disabled={state.onboard}
                        >Done</Button>
                    </AccordionActions>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                        <Typography fontWeight={600} mr={1}>2. Create a VPC (Virtual Private Network)</Typography>
                        {state.vpc && <CheckCircleIcon />}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography ml={2} mb={1}>VPC needed to contain at least one public subnet and an Internet Gateway
                            and must be located in the Region of the ground station you plan to use.</Typography>
                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>- Navigate to VPC resources and Use following Parameters:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Setting</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Resources to create</TableCell>
                                            <TableCell>Select "VPC and more"</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Name tag auto-generation</TableCell>
                                            <TableCell>VPC name</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>IPv4 CIDR block</TableCell>
                                            <TableCell>10.0.0.0/16</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>IPv6 CIDR block</TableCell>
                                            <TableCell>No</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Tenancy</TableCell>
                                            <TableCell>Default</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Number of Availability Zones</TableCell>
                                            <TableCell>1</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Number of public subnets</TableCell>
                                            <TableCell>1</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Number of private subnets</TableCell>
                                            <TableCell>1</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>NAT gateways</TableCell>
                                            <TableCell>None</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>VPC endpoints</TableCell>
                                            <TableCell>S3 GateWay</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleClick('vpc')}
                            disabled={state.vpc}
                        >Done</Button>
                    </AccordionActions>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                        <Typography fontWeight={600} mr={1}>3. Create a EC2 instance (Elastic Compute Cloud)</Typography>
                        {state.ec2 && <CheckCircleIcon />}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography ml={2}>A data capture application running on the receiver EC2 instance ingests the incoming VITA 49 stream from ground station.</Typography>

                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>- Instance Setting:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Setting</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Name and tags</TableCell>
                                            <TableCell>[Name of Instance]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>System</TableCell>
                                            <TableCell>Linux</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Architecture</TableCell>
                                            <TableCell>64-bit(x-86)</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Instance type</TableCell>
                                            <TableCell>more than "t3.micro"</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Key pair name</TableCell>
                                            <TableCell>create a key pair and download to local</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>- Network Setting:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Setting</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        <TableRow>
                                            <TableCell>VPC</TableCell>
                                            <TableCell>Select created VPC - required</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Subnet</TableCell>
                                            <TableCell>Select a subnet that created</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Auto-assign public IP</TableCell>
                                            <TableCell>Enable</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Firewall (security groups)</TableCell>
                                            <TableCell>Create a new security group</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Security group name</TableCell>
                                            <TableCell>Name that you created - required</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Security Group description - required</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleClick('ec2')}
                            disabled={state.ec2}
                            data-testid={'btn-done-ec2'}
                        >Done</Button>
                    </AccordionActions>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                        <Typography fontWeight={600} mr={1}>4. Create a CloudFormation</Typography>
                        {state.stack && <CheckCircleIcon />}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography ml={2}>Create a Mission Profile to tell AWS Ground Station how to process the incoming radio frequency signal.</Typography>
                        <Typography ml={2}>Naviagate to CloudFormation and create a new stack.</Typography>

                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>- Following Parameters:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Setting</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Prepare template</TableCell>
                                            <TableCell>Template is ready</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Template source</TableCell>
                                            <TableCell>Amazon S3 URL</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Amazon S3 URL</TableCell>
                                            <TableCell>https://aws-groundstation-stack-templates.s3.eu-north-1.amazonaws.com/aws-stack-template.yml</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleClick('stack')}
                            disabled={state.stack}
                        >Done</Button>
                    </AccordionActions>
                </Accordion>
            </Box>
        </>
    )
}

export default AwsResources;