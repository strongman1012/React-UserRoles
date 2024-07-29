import React from "react";
import { FC } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeEditor from "@uiw/react-textarea-code-editor";
import { setIputJson, setOutputJson } from "../reducers/testReducer";
import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { codeFont } from "../config/app";

const DashboardSidebar: FC = () => {

    const dispatch = useAppDispatch();

    const inputJson = useAppSelector((root: RootState) => root.test.inputJson);
    const outputJson = useAppSelector((root: RootState) => root.test.outputJson);

    /**
     * Handle Code Change
     * @param e 
     */
    const handleInputChange = (e: any) => {
        dispatch(setIputJson(e.target.value));
    }

    /**
     * Handle Code Change
     * @param e 
     */
    const handleOutputChange = (e: any) => {
        dispatch(setOutputJson(e.target.value));
    }

    return (
        <>
            <Box
                className="sidebar"
                sx={{
                    width: 450,
                    px: 3,
                    pt: 2,
                    borderLeft: '1px solid #ddd'
                }}
                role="presentation"
            >
                <Accordion defaultExpanded sx={{ boxShadow: '0 0 1px #333' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}
                        sx={{
                            minHeight: '40px !important',
                            '& .Mui-expanded': {
                                margin: '8px 0 0 0 !important'
                            }
                        }}
                    >
                        <Typography fontWeight={600} mr={1}>Test Input JSON</Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pb: 0, px: 0 }}>
                        <CodeEditor
                            value={inputJson}
                            language="json"
                            placeholder="Please enter JSON."
                            onChange={(e) => handleInputChange(e)}
                            padding={15}
                            style={{
                                fontSize: 12,
                                fontFamily: codeFont,
                                minHeight: 200,
                                height: 250,
                                overflowY: 'auto'
                            }}
                        />
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded sx={{ boxShadow: '0 0 1px #333' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}
                        sx={{
                            minHeight: '40px !important',
                            '& .Mui-expanded': {
                                margin: '8px 0 0 0 !important'
                            }
                        }}
                    >
                        <Typography fontWeight={600} mr={1}>Test Output JSON</Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pb: 0, px: 0 }}>
                        <CodeEditor
                            value={outputJson}
                            language="json"
                            placeholder="Please enter JSON."
                            onChange={(e) => handleOutputChange(e)}
                            padding={15}
                            style={{
                                fontSize: 12,
                                fontFamily: codeFont,
                                minHeight: 200,
                                height: 250,
                                overflowY: 'auto'
                            }}
                        />
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>
    )
};

export default DashboardSidebar;