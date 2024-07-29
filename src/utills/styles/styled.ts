import { colors } from "@mui/material";

export const FormControlStyled = {
    component: "fieldset",
    sx: {
        display: 'block',
        px: 2,
        py: 1.5,
        border: 1,
        borderStyle: 'solid',
        borderColor: colors.grey[500],
        borderRadius: 2,
        '& .MuiFilledInput-root': {
            backgroundColor: '#0000000d'
        }
    }
}