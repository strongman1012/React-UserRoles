import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Typography, Button, Grid,
    Container, Box, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchDataAccessById, updateDataAccessById } from '../../../reducers/dataAccesses/dataAccessesSlice';
import { DataAccess } from '../../../reducers/dataAccesses/dataAccessesAPI';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface EditDataAccessProps {
    dataAccessId: number;
    onClose: () => void;
}

const EditDataAccess: FC<EditDataAccessProps> = ({ dataAccessId, onClose }) => {
    const dispatch = useAppDispatch();
    const dataAccess = useSelector((state: RootState) => state.dataAccesses.currentDataAccess);
    const editable = useSelector((state: RootState) => state.dataAccesses.editable);

    const [formData, setFormData] = useState<DataAccess | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {
        if (dataAccessId) {
            dispatch(fetchDataAccessById(dataAccessId));
        }
    }, [dispatch, dataAccessId]);

    useEffect(() => {
        if (dataAccess) {
            setFormData(dataAccess);
            setIsLoading(false);
        }
    }, [dataAccess]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData?.name) {
            setConfirmTitle('Data Access Name is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        if (!formData?.level) {
            setConfirmTitle('Access Level is required');
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
                const message = await dispatch(updateDataAccessById(dataAccessId, formData));
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
                    <CardHeader title="Edit Data Access"
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

export default EditDataAccess;
