import React from "react";
import { FC, useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Container, Divider } from "@mui/material";
import ServiceSelect from "./ServiceSelect";
import RegisterAccount from "./Register";
import ResourceSetup from "./Resources";
import { serviceProviders, setupSteps } from '../../../config/app';
import AccountVerify from "./AccountVerify";

const ConnectAccountSetupGuide: FC = () => {

    const [activeStep, setActiveStep] = useState(0);
    const [selectedService, setSelectedService] = useState(serviceProviders[0].key);
    const [resourcesCreated, setResourcesCreated] = useState<boolean>(false);
    const [accountVerified, setAccountVerified] = useState<boolean>(false);

    useEffect(() => {
        const currentStep = Number(localStorage.getItem('casg_active_step')) ?? 0;
        setActiveStep(currentStep);
    }, []);

    /**
     * Handle Next
     */
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        localStorage.setItem('casg_active_step', (activeStep + 1).toString());
    };

    /**
     * Handle Back
     */
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        localStorage.setItem('casg_active_step', (activeStep - 1).toString());
    };

    /**
     * Handle Reset
     */
    const handleReset = () => {
        setActiveStep(0);
    };

    /**
     * Handle Service Select
     * @param service 
     */
    const handleServiceChanged = (service: string) => {
        setSelectedService(service);
    }

    /**
     * Handle Resource Complete
     */
    const handleResourcesDone = () => {
        setResourcesCreated(true);
    }

    const handleVerifyDone = () => {
        setAccountVerified(true);
    }

    return (
        <>
            <Container maxWidth={false}>

                <Box p={3} textAlign={'center'} sx={{ height: '40px' }}>
                    <Typography variant="h3" color={'primary.main'}>Setup Your Account</Typography>
                </Box>

                <Card variant="outlined"
                // sx={{height: 'calc(100vh - 150px)', position: 'relative'}}
                >

                    <Box p={2}>
                        <Stepper activeStep={activeStep}>
                            {setupSteps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: {
                                    optional?: React.ReactNode;
                                } = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </Box>

                    <Divider />

                    <Box>
                        {activeStep === setupSteps.length ? (
                            <>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                    <Box sx={{ flex: '1 1 auto' }} />
                                    <Button onClick={handleReset}>Reset</Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <CardContent sx={{ overflowY: 'auto' }}>
                                    {activeStep === 0 && <ServiceSelect service={selectedService} onChanged={handleServiceChanged} />}
                                    {activeStep === 1 && <RegisterAccount service={selectedService} />}
                                    {activeStep === 2 && <ResourceSetup service={selectedService} onCompleted={handleResourcesDone} />}
                                    {activeStep === 3 && <AccountVerify service={selectedService} onCompleted={handleVerifyDone} />}
                                </CardContent>

                                <Box>

                                    <Divider />

                                    <Box sx={{ display: 'flex', flexDirection: 'row', p: 2, justifyContent: 'space-between' }}>
                                        <Button
                                            color="secondary"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{ mr: 1 }}
                                            variant="contained"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            variant="contained"
                                            disabled={activeStep === 2 && !resourcesCreated || activeStep === 3 && !accountVerified}
                                            className="next-button"
                                        >
                                            {activeStep === setupSteps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </Box>

                                </Box>
                            </>
                        )}
                    </Box>
                </Card>

            </Container>
        </>
    );
}

export default ConnectAccountSetupGuide;