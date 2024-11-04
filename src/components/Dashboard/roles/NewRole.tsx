import React, { FC, useState } from 'react';
import { TextField, Button, Container, Box, Divider, Card, CardHeader, CardContent } from '@mui/material';
import { useAppDispatch } from '../../../store/hooks';
import { createRole } from '../../../reducers/roles/rolesSlice';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import AlertModal from 'src/components/Basic/Alert';

interface NewRoleProps {
    onClose: () => void;
}

const NewRole: FC<NewRoleProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const editable = useSelector((state: RootState) => state.roles.editable);
    const [roleName, setRoleName] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmTitle, setConfirmTitle] = useState<string>('');
    const [confirmDescription, setConfirmDescription] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoleName(e.target.value);
    };

    const validateForm = () => {
        if (!roleName) {
            setConfirmTitle('Role Name is required');
            setConfirmDescription('');
            setConfirmModalOpen(true);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                const message = await dispatch(createRole(roleName));
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
                setRoleName(''); // Reset form data after successful save
            }
        }
    };

    return (

        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="New Role"
                        action={
                            <>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={!editable?.create} sx={{ mr: 2, background: (theme) => `${theme.palette.background.paper}`, color: (theme) => `${theme.palette.primary.dark}` }}>
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
                            value={roleName}
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

export default NewRole;
