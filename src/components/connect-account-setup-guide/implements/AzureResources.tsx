import React from "react";
import { FC, useEffect, useState } from "react";
import {
    Accordion, AccordionActions, AccordionDetails,
    AccordionSummary, Box, Button, Divider, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface AzureResourcesProps {
    onCompleted: () => void;
}

const initState = {
    register: false,
    vnet: false,
    vm: false
}

const AzureResources: FC<AzureResourcesProps> = (props: AzureResourcesProps) => {

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
        localStorage.setItem('casg_azure_state', JSON.stringify({ ...state, [step]: true }));
    }

    return (
        <>
            <Box color='primary.main' style={{ maxHeight: '50vh' }}>
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600} mr={1}>1. Register Spacecraft</Typography>
                        {state.register && <CheckCircleIcon />}
                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography ml={2}>Find: In the Azure portal search box, enter Spacecraft. Select Spacecraft in the search results.</Typography>
                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>Create Resource (ex: AQUA):</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Field</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Subscription</TableCell>
                                            <TableCell>OrbitalSerivesTesting: [Subscription Name]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Resource Group</TableCell>
                                            <TableCell>OrbitalInterfaceTesting: [Resource Group]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>AQUA</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Region</TableCell>
                                            <TableCell>West US 2</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>NORAD ID</TableCell>
                                            <TableCell>27424</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>TLE title line</TableCell>
                                            <TableCell>AQUA</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>TLE line 1</TableCell>
                                            <TableCell>1 27424U 02022A   23257.42215448  .00001561  00000+0  34758-3 0  9996</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>TLE line 1</TableCell>
                                            <TableCell>2 27424  98.2924 201.5623 0000746  80.5965  29.0874 14.58311276136361</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>Link Information:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Field</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Link_No_1</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Direction</TableCell>
                                            <TableCell>Downlink</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Center Frequency</TableCell>
                                            <TableCell>8160</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Bandwidth</TableCell>
                                            <TableCell>15</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Polarization</TableCell>
                                            <TableCell>RHCP</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>Authorize the registered Spacecraft:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Field</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Summary</TableCell>
                                            <TableCell>Request authorization for AQUA</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Issue type</TableCell>
                                            <TableCell>Technical</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Subscription</TableCell>
                                            <TableCell>OrbitalSerivesTesting: [Subscription Name]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Service</TableCell>
                                            <TableCell>My services</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Service type</TableCell>
                                            <TableCell>Azure Orbital</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Problem type</TableCell>
                                            <TableCell>Spacecraft Management and Setup</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Problem subtype</TableCell>
                                            <TableCell>Spacecraft Registration</TableCell>
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
                            onClick={() => handleClick('register')}
                            disabled={state.register}
                        >Done</Button>
                    </AccordionActions>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600} mr={1}>2. Create a Virtual Network (VNET)</Typography>
                        {state.vnet && <CheckCircleIcon />}
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography ml={2}>Find: In the Azure portal search box, enter Virtual Network. Select Virtual Network in the search results.</Typography>
                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>Basic Information:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Field</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Subscription</TableCell>
                                            <TableCell>OrbitalSerivesTesting: [Subscription Name]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Resource Group</TableCell>
                                            <TableCell>OrbitalInterfaceTesting: [Resource Group]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Virtual network name</TableCell>
                                            <TableCell>Vnet-Orbital: [Please enter name]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Region</TableCell>
                                            <TableCell>West US 2</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>IP Address Information:</Typography>
                            <Typography mb={1}>In the address space box in Subnets, select the default subnet.
                                In Edit subnet, enter or select the following information:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Field</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Subnet template</TableCell>
                                            <TableCell>Default</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Subnet-1</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Starting address</TableCell>
                                            <TableCell>10.0.0.0</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Subnet size</TableCell>
                                            <TableCell>/24(256 addresses)</TableCell>
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
                            onClick={() => handleClick('vnet')}
                            disabled={state.vnet}
                        >Done</Button>
                    </AccordionActions>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600} mr={1}>3. Create a Virtual Machine (VM)</Typography>
                        {state.vm && <CheckCircleIcon />}
                    </AccordionSummary>

                    <AccordionDetails>
                        <Typography ml={2}>Find: In the portal, search for and select Virtual machines.</Typography>
                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>Basic Tab:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Field</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Subscription</TableCell>
                                            <TableCell>OrbitalSerivesTesting: [Subscription Name]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Resource Group</TableCell>
                                            <TableCell>OrbitalInterfaceTesting: [Resource Group]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Virtual machine name</TableCell>
                                            <TableCell>Vm-Orbital: [Please enter name]</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Region</TableCell>
                                            <TableCell>West US 2</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Availability options</TableCell>
                                            <TableCell>No infrastructure redundancy required</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Security type</TableCell>
                                            <TableCell>Standard</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>CentOS 7 - x64 Gen1</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>VM architecture</TableCell>
                                            <TableCell>x64</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Size</TableCell>
                                            <TableCell>at least 32 GiB of RAM (D8s_v3)</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Authentication type</TableCell>
                                            <TableCell>SSH public key</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Username</TableCell>
                                            <TableCell>azureuser</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>SSH public key source</TableCell>
                                            <TableCell>Generate new key pair</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Key pair name</TableCell>
                                            <TableCell>Vm-Orbital_key</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Publick inbounds ports</TableCell>
                                            <TableCell>Allow selected ports</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Select inbounds ports</TableCell>
                                            <TableCell>SSH (22), 80, 443</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box p={2}>
                            <Typography mb={1} fontWeight={600}>Networking Tab:</Typography>
                            <Divider />
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 600 }}>Field</TableCell>
                                            <TableCell style={{ fontWeight: 600 }}>Value</TableCell>
                                        </TableRow>

                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Virtual network</TableCell>
                                                <TableCell>Vnet-Orbital</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Subnet</TableCell>
                                                <TableCell>Subnet-1</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Public IP</TableCell>
                                                <TableCell>select or create a public-ip</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>NIC network security group</TableCell>
                                                <TableCell>Advanced</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Configure network security group</TableCell>
                                                <TableCell>Select Create new.
                                                    Enter nsg-1 for the name.
                                                    Leave the rest at the defaults and select OK.</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </Box>
                    </AccordionDetails>

                    <AccordionActions>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleClick('vm')}
                            disabled={state.vm}
                            data-testid={'btn-done-vm'}
                        >
                            Done
                        </Button>
                    </AccordionActions>
                </Accordion>
            </Box>
        </>
    )
}

export default AzureResources;