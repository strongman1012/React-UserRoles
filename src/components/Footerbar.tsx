import React from "react";
import { FC, useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from "@mui/material";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";

interface FooterProps {
    result: string
}

const DashboardFooter: FC<FooterProps> = (props: FooterProps) => {

    const testReducer = useAppSelector((root: RootState) => root.test.testStatus);
    const [testResult, setTestResult] = useState<string>('');

    useEffect(() => {

        if (testReducer !== '') {
            const testResultObject = JSON.parse(testReducer);

            if (testResultObject.result) {
                const testResultMessage = testResultObject.result;
                const formattedMessage = removeAnsiEscapeCodes(testResultMessage);
                setTestResult(formattedMessage);
            } else {
                setTestResult('Error: Unknown issues happened.');
            }
        }

    }, [testReducer]);

    const removeAnsiEscapeCodes = (input: string) => {
        // eslint-disable-next-line no-control-regex
        return input.replace(/\u001b\[[0-9;]*m/g, '');
    }

    const handleClear = (e: any) => {
        e.stopPropagation();
        setTestResult('')
    }

    return (
        <Box className="footer" sx={{ px: 3 }}>
            <Accordion
                // defaultExpanded 
                sx={{ boxShadow: '0 0 1px #333' }}
            >
                <AccordionSummary expandIcon={<ExpandLessIcon />}
                    sx={{
                        minHeight: '40px !important',
                        '& .Mui-expanded': {
                            margin: '8px 0 0 0 !important'
                        }
                    }}
                >
                    <Typography fontWeight={600} mr={1} mt={1}>Test Status</Typography>
                    <Button
                        variant="text"
                        size="small"
                        sx={{
                            position: 'absolute',
                            right: '50px'
                        }}
                        onClick={handleClear}
                    >Clear</Button>
                </AccordionSummary>

                <AccordionDetails sx={{ pb: 0, px: 0 }}>
                    <Box sx={{
                        minHeight: 150,
                        color: 'white',
                        backgroundColor: '#222',
                        p: 1,
                        overflowX: 'scroll'
                    }}>
                        <pre>{testResult}</pre>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default DashboardFooter;