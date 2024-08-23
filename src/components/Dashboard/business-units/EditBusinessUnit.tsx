import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Typography, Button, FormControlLabel, Switch, Grid, Autocomplete,
    Container, Box, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchBusinessUnitById, updateBusinessUnitById, fetchBusinessUnitsList } from '../../../reducers/businessUnits/businessUnitsSlice';
import { BusinessUnit } from '../../../reducers/businessUnits/businessUnitsAPI';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface EditBusinessUnitProps {
    businessUnitId: number;
    onClose: () => void;
}

const EditBusinessUnit: FC<EditBusinessUnitProps> = ({ businessUnitId, onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.businessUnits.editable);
    const businessUnit = useSelector((state: RootState) => state.businessUnits.currentBusinessUnit);
    const allBusinessUnits = useSelector((state: RootState) => state.businessUnits.businessUnitsList);
    const [formData, setFormData] = useState<BusinessUnit | null>(null);
    const [selectedParentBusinessUnit, setSelectedParentBusinessUnit] = useState<any | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {
        if (businessUnitId) {
            dispatch(fetchBusinessUnitById(businessUnitId));
            dispatch(fetchBusinessUnitsList());
        }
    }, [dispatch, businessUnitId]);

    useEffect(() => {
        if (businessUnit) {
            setFormData(businessUnit);
            setSelectedParentBusinessUnit(
                allBusinessUnits.find(unit => unit.id === businessUnit.parent_id) || null
            );
            setIsLoading(false);
        }
    }, [businessUnit, allBusinessUnits]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData!,
            [name]: value,
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData!,
            status: e.target.checked,
        });
    };

    const validateForm = () => {
        let tempErrors: { [key: string]: string } = {};
        if (!formData?.name) tempErrors.name = "Name is required";
        if (!formData?.email) tempErrors.email = "Email is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (formData && validateForm()) {
            setIsLoading(true);
            try {
                const message = await dispatch(updateBusinessUnitById(businessUnitId, formData));
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

    const handleParentBusinessUnitChange = (event: any, value: any) => {
        setSelectedParentBusinessUnit(value);
        setFormData((prevData) => ({
            ...prevData!,
            parent_id: value?.id || null,
        }));
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Edit Business Unit"
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={editable ? false : true} sx={{ mr: 2 }}>
                                    Save
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6">Business Unit Information</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            options={allBusinessUnits.filter(unit => unit.id !== businessUnitId)}
                                            getOptionLabel={(option) => option.name}
                                            value={selectedParentBusinessUnit}
                                            onChange={handleParentBusinessUnitChange}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Parent Business" fullWidth />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Website"
                                            name="website"
                                            value={formData.website || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Main Phone"
                                            name="mainPhone"
                                            value={formData.mainPhone || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Other Phone"
                                            name="otherPhone"
                                            value={formData.otherPhone || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Fax"
                                            name="fax"
                                            value={formData.fax || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Email"
                                            name="email"
                                            value={formData.email || ''}
                                            onChange={handleInputChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Addresses</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Street 1"
                                            name="street1"
                                            value={formData.street1 || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Street 2"
                                            name="street2"
                                            value={formData.street2 || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Street 3"
                                            name="street3"
                                            value={formData.street3 || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="city"
                                            value={formData.city || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="State/Province"
                                            name="state"
                                            value={formData.state || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Zip/Postal Code"
                                            name="zipCode"
                                            value={formData.zipCode || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Country/Region"
                                            name="region"
                                            value={formData.region || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.status || false}
                                            onChange={handleStatusChange}
                                            name="status"
                                        />
                                    }
                                    label="Status"
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

export default EditBusinessUnit;
