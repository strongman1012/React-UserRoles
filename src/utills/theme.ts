import { createTheme } from '@mui/material/styles';

const MAIN_COLOR = '#206c91';
const DARK_COLOR = '#424242'; // Adjust this for dark mode if needed

export const getTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    // Light mode palette
                    primary: {
                        contrastText: '#FFF',
                        main: MAIN_COLOR,
                    },
                    success: {
                        main: '#4caf50',
                    },
                    text: {
                        primary: MAIN_COLOR,
                        secondary: MAIN_COLOR,
                    },
                }
                : {
                    // Dark mode palette
                    primary: {
                        contrastText: '#FFF',
                        main: DARK_COLOR,
                    },
                    success: {
                        main: '#66bb6a', // Darker success green
                    },
                    background: {
                        default: DARK_COLOR, // Dark mode background
                        paper: '#2a2a2a', // Dark mode paper
                    },
                    text: {
                        primary: '#ffffff',
                        secondary: '#b0bec5', // Muted text color for dark mode
                    },
                }),
        },
        typography: {
            fontSize: 16,
            h3: {
                fontWeight: 700,
                fontSize: '2.2rem',
            },
            h4: {
                fontWeight: 700,
                fontSize: '1.75rem',
            },
            h5: {
                fontSize: '1.5rem',
                fontWeight: 500,
            },
            h6: {
                fontWeight: 500,
            },
        },
        // Add DevExtreme styles here
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    '.dx-widget': {
                        color: mode === 'light' ? '#333' : '#f0f0f0',
                    }
                }
            }
        }
    });

export default getTheme;
