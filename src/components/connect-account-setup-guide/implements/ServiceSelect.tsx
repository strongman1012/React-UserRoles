import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FC } from 'react';
import { serviceProviders } from '../../../config/app';

interface ServicesProps {
    service: string,
    onChanged: (selectedService: string) => void;
}

const ServiceSelect: FC<ServicesProps> = (props: ServicesProps) => {

    /**
     * Handle Change Provider
     * @param event 
     */
    const handleChange = (event: SelectChangeEvent) => {
        props.onChanged(event.target.value);
    };

    return (
        <>
            <Box p={2}>
                <FormControl fullWidth>
                    <InputLabel>Select Provider</InputLabel>
                    <Select
                        id="sel-service-provider"
                        value={props.service}
                        label="Select Provider"
                        onChange={handleChange}
                    >
                        {serviceProviders.map((provider, idx: number) => {
                            return <MenuItem value={provider.key} key={idx}>{provider.label}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Box>
        </>
    )
}

export default ServiceSelect;