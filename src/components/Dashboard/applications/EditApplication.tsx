import React, { FC, useEffect, useState } from 'react';
import { TextField, Button, Container, Box, Divider, Card, CardHeader, CardContent } from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchApplicationById, updateApplicationById } from '../../../reducers/applications/applicationsSlice';
import { Application } from '../../../reducers/applications/applicationsAPI';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface EditApplicationProps {
    applicationId: number;
    onClose: () => void;
}

const EditApplication: FC<EditApplicationProps> = ({ applicationId, onClose }) => {
    const dispatch = useAppDispatch();
    const application = useSelector((state: RootState) => state.applications.currentApplication);
    const editable = useSelector((state: RootState) => state.applications.editable);

    const [formData, setFormData] = useState<Application | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {
        if (applicationId) {
            dispatch(fetchApplicationById(applicationId));
        }
    }, [dispatch, applicationId]);

    useEffect(() => {
        if (application) {
            setFormData(application);
            setIsLoading(false);
        }
    }, [application]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData?.name) {
            setConfirmTitle('Application Name is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        if (!formData?.url) {
            setConfirmTitle('Application URL is required');
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
                const message = await dispatch(updateApplicationById(applicationId, formData));
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
                    <CardHeader title="Edit Application"
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={!editable?.update} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onClose} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}>
                                    Cancel
                                </Button>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                required
                                label="Application Name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                required
                                label="Application URL"
                                name="url"
                                value={formData.url || ''}
                                onChange={handleInputChange}
                            />
                        </Box>
                        <Box>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                            />
                        </Box>
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

export default EditApplication;
