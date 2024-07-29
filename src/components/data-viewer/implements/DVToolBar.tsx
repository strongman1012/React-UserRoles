import React from "react";
import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';

const DVToolBar = () => {

    return (

        <>
            <Box
                className="dv-toolbar"
                sx={{
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Box className="tb-before" sx={{ display: 'flex', gap: 3 }}>
                    <Button
                        variant="text"
                        startIcon={<ExitToAppOutlinedIcon />}
                    >
                        CSV
                    </Button>
                    <Button
                        variant="text"
                        startIcon={<ExitToAppOutlinedIcon />}
                    >
                        Excel
                    </Button>
                    <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Record Scroll"
                    />
                    <Button
                        variant="text"
                        startIcon={<BuildOutlinedIcon />}
                    >
                        Column Options
                    </Button>
                </Box>
                <Box className="tb-center"> </Box>
                <Box className="tb-after">
                    <Button variant="contained">Search</Button>
                </Box>
            </Box>
        </>
    )
}

export default DVToolBar;