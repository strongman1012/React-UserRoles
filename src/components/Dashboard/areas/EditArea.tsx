import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Typography, Button, Grid, Autocomplete,
    Container, Box, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchAreaById, updateAreaById } from '../../../reducers/areas/areasSlice';
import { fetchApplications } from '../../../reducers/applications/applicationsSlice';
import { Area } from '../../../reducers/areas/areasAPI';
import { Application } from '../../../reducers/applications/applicationsAPI';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface EditAreaProps {
    areaId: number;
    onClose: () => void;
}

const EditArea: FC<EditAreaProps> = ({ areaId, onClose }) => {
    const dispatch = useAppDispatch();
    const area = useSelector((state: RootState) => state.areas.currentArea);
    const applications = useSelector((state: RootState) => state.applications.allApplications);
    const editable = useSelector((state: RootState) => state.areas.editable);

    const [formData, setFormData] = useState<Area | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {
        if (areaId) {
            dispatch(fetchAreaById(areaId));
        }
        dispatch(fetchApplications());
    }, [dispatch, areaId]);

    useEffect(() => {
        if (area) {
            setFormData(area);
            setSelectedApplication(applications.find(app => app.id === area.application_id) || null);
            setIsLoading(false)
        }
    }, [area, applications]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const handleApplicationChange = (event: any, value: Application | null) => {
        setSelectedApplication(value);
        setFormData((prevData) => ({
            ...prevData!,
            application_id: value?.id || 0,
            application_name: value?.name || '',
        }));
    };

    const validateForm = () => {
        if (!formData?.name) {
            setConfirmTitle('Area Name is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        if (!formData?.description) {
            setConfirmTitle('Area Description is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        if (!formData?.application_id) {
            setConfirmTitle('Applicatoin is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (formData && validateForm()) {
            setIsLoading(true);
            try {
                const message = await dispatch(updateAreaById(areaId, formData));
                if (message) {
                    setConfirmTitle(message);
                    setConfirmDescription('');
                    setConfirmModalOpen(true);
                }
            } catch (error: any) {
                setConfirmTitle(error.message);
                setConfirmDescription('');
                setConfirmModalOpen(true);
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Edit Area"
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={!editable?.update} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onClose} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Cancel
                                </Button>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Area Information</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Area Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={applications}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedApplication}
                                    onChange={handleApplicationChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Application" fullWidth required />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>

            <AlertModal
                show={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title={confirmTitle}
                description={confirmDescription}
            />
        </Container>
    );
};

export default EditArea;
