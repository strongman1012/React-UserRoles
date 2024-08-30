import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Card, CardHeader, CardContent, Divider, Typography, Grid } from '@mui/material';
import { RootState } from '../../store/store';
import SettingsIcon from '@mui/icons-material/Settings';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import LoadingScreen from 'src/components/Basic/LoadingScreen';

interface Application {
    name: string;
    url: string;
}

const Home: FC = () => {
    const areaLists = useSelector((state: RootState) => state.areaList.areaLists);
    const [applications, setApplications] = useState<(Application | null)[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (areaLists.length > 0) {
            const temp_applications = areaLists.map(row => {
                if (row.permission === true) {
                    if (row.application_name === "System")
                        return {
                            name: row.application_name, url: '#'
                        }
                    else if (row.application_name === "Application A")
                        return {
                            name: row.application_name, url: 'https://react-booking-henna.vercel.app/'
                        }
                    else if (row.application_name === "Application B")
                        return {
                            name: row.application_name, url: 'https://react-real-estate-one.vercel.app/'
                        }
                }
                return null;
            }).filter(Boolean);
            setApplications(temp_applications);
            setIsLoading(false);
        }
    }, [areaLists]);

    const handleCardClick = (app: Application | null) => {
        if (app && app.name !== "System") {
            window.open(app.url, '_blank');
        }
    };

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Home" />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3} pt={2}>
                            {applications.map((app, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card
                                        onClick={() => handleCardClick(app)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)'
                                            }
                                        }}
                                    >
                                        <CardContent style={{ textAlign: 'center' }}>
                                            {app?.name === "System"
                                                ? <SettingsIcon style={{ width: '60px', height: '60px' }} />
                                                : <DisplaySettingsIcon style={{ width: '60px', height: '60px' }} />
                                            }
                                            <Typography variant="h6" component="div">
                                                {app?.name}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Home;
