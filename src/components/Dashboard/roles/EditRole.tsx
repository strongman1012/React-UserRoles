import React, { FC, useEffect, useState } from 'react';
import {
    TextField, Button, Container, Box, Divider, Card, CardHeader, CardContent
} from '@mui/material';
import { RootState } from '../../../store/store';
import { useAppDispatch } from '../../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchRoleById, updateRoleById } from '../../../reducers/roles/rolesSlice';
import { Role } from '../../../reducers/roles/rolesAPI';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface EditRoleProps {
    roleId: number;
    onClose: () => void;
}

const EditRole: FC<EditRoleProps> = ({ roleId, onClose }) => {
    const dispatch = useAppDispatch();
    const role = useSelector((state: RootState) => state.roles.currentRole);
    const editable = useSelector((state: RootState) => state.roles.editable);

    const [formData, setFormData] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    useEffect(() => {
        if (roleId) {
            dispatch(fetchRoleById(roleId));
        }
    }, [dispatch, roleId]);

    useEffect(() => {
        if (role) {
            setFormData(role);
            setIsLoading(false);
        }
    }, [role]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData!,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData?.name) {
            setConfirmTitle('Role Name is required');
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
                const message = await dispatch(updateRoleById(roleId, formData.name));
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
                    <CardHeader title="Edit Role"
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
                        <TextField
                            fullWidth
                            required
                            label="Role Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
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

export default EditRole;
