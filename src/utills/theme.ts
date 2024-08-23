import { createTheme } from '@mui/material/styles';

const MAIN_COLOR = '#206c91';

const theme = createTheme({
    palette: {
        primary: {
            contrastText: '#FFF',
            main: MAIN_COLOR
        },
        success: {
            main: '#4caf50'
        },
        text: {
            primary: MAIN_COLOR,
            secondary: MAIN_COLOR,
        },
    },
    typography: {
        fontSize: 16,
        h3: {
            fontWeight: 700,
            fontSize: '2.2rem'
        },
        h4: {
            fontWeight: 700,
            fontSize: '1.75rem'
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 500
        },
        h6: {
            fontWeight: 500
        }
    }
})

export default theme;