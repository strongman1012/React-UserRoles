import React from 'react';
import { Box, Container, Card, CardHeader, CardContent, Divider } from '@mui/material';

const ApplicationMetrics: React.FC = () => {

    return (
        <Container maxWidth={false}>
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Application Access Metrics" />
                    <Divider />
                    <CardContent>
                        
                    </CardContent>
                </Card>
            </Box>
        </Container>

    );
};

export default ApplicationMetrics;
