import React, { FC, useState } from 'react';
import {
    TextField, Typography, Button, Grid,
    Container, Box, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import { useAppDispatch } from '../../../store/hooks';
import { createDataAccess } from '../../../reducers/dataAccesses/dataAccessesSlice'; // Ensure you have this action in your dataAccessesSlice
import { DataAccess } from '../../../reducers/dataAccesses/dataAccessesAPI'; // Ensure you have DataAccess type defined in dataAccessesAPI
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface NewDataAccessProps {
    onClose: () => void;
}

const initialFormData: Omit<DataAccess, 'id'> = {
    name: '',
    level: '',
};

const NewDataAccess: FC<NewDataAccessProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.dataAccesses.editable);
    const [formData, setFormData] = useState<Omit<DataAccess, 'id'>>(initialFormData);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        if (!formData.name) {
            setConfirmTitle('Data Access Name is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        if (!formData.level) {
            setConfirmTitle('Access Level is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (validateForm()) {
            try {
                const message = await dispatch(createDataAccess(formData));
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
                setFormData(initialFormData); // Reset form data after successful save
            }
        }
    };

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined" sx={{ border: (theme) => `1px solid ${theme.palette.primary.main}` }}>
                    <CardHeader title="New Data Access"
                        sx={{ background: (theme) => `${theme.palette.primary.main}`, color: '#f7f7f7' }}
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={editable ? false : true} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper} !important`, color: (theme) => `${theme.palette.primary.dark}` }}>
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
                                <Typography variant="h6">Data Access Information</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Data Access Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Access Level"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleInputChange}
                                    type="number"
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

export default NewDataAccess;
