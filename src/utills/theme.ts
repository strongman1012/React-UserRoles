import { createTheme, ThemeOptions } from '@mui/material/styles';

const COSMOS_RED = '#e34747';


function createShadow(px: number) {
    return `0 0 ${px}px 0 rgba(53,64,82,.05)`;
}


const lightTheme: ThemeOptions = {
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f0f1f3',
                    color: '#2a2c2d',
                },
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true
            }
        },
        MuiCssBaseline: {
            styleOverrides: {
                '.text-secondary': {
                    color: `${COSMOS_RED} !important`
                }
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#f7f7f7',
                    },
                },
            },
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: { variant: 'h6' }
            }
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1600
        }
    },
    spacing: 4,
    shadows: [
        'none',
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14)
    ],
    typography: {
        fontFamily: [
            "Nunito",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(","),
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        h1: {
            fontSize: "2rem",
            '@media (max-width:1600px)': {
                fontSize: "1.65rem"
            },
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: "1.75rem",
            '@media (max-width:1600px)': {
                fontSize: "1.45rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        h3: {
            fontSize: "1.5rem",
            '@media (max-width:1600px)': {
                fontSize: "1.25rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        h4: {
            fontSize: "1.25rem",
            '@media (max-width:1600px)': {
                fontSize: "1.05rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        h5: {
            fontSize: "1.125rem",
            '@media (max-width:1600px)': {
                fontSize: "0.95rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        h6: {
            fontSize: "1.0625rem",
            '@media (max-width:1600px)': {
                fontSize: "0.85rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        body1: {
            fontSize: 14,
            '@media (max-width:1600px)': {
                fontSize: "12px"
            },
        },
        body2: {
            '@media (max-width:1600px)': {
                fontSize: "0.675rem"
            },
        },
        button: {
            textTransform: "none",
            fontSize: "13px",
            '@media (max-width:1600px)': {
                fontSize: "11px",
                lineHeight: 'normal'
            }
        },
    },
    palette: {
        mode: "light",
        primary: {
            main: COSMOS_RED,
            light: '#f7f7f7',
            dark: '#2a2c2d' //previously: #000000
        },
        secondary: {
            main: '#e8e9ea',
            dark: '#e34748'
        },
        background: {
            default: '#ffffff',
            paper: '#f0f1f3'
        },
        text: {
            primary: '#2a2c2d',
            secondary: '#737373'
        }
    }
};


const darkTheme: ThemeOptions = {
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#232323',
                    color: '#f7f7f7',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                // Autofill styles for dark mode
                'input:-webkit-autofill': {
                    boxShadow: '0 0 0 100px #474747 inset !important',
                },
                '.dx-widget': {
                    color: '#f0f0f0'
                },
                '.dx-header-row': {
                    background: '#616161',
                    color: '#f7f7f7'
                },
                '.dx-data-row': {
                    background: '#2d2d2d',
                    color: '#f7f7f7'
                },
                '.dx-row-alt td': {
                    background: '#282828 !important',
                    color: '#f7f7f7'
                },
                '.text-secondary': {
                    color: `${COSMOS_RED} !important`
                }
            },
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: '#616161',
                    },
                },
            },
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: { variant: 'h6' }
            }
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    '& .MuiTableRow-root': {
                        backgroundColor: '#282828 !important'
                    },
                },
            },
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1600
        }
    },
    spacing: 4,
    shadows: [
        'none',
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14),
        createShadow(14)
    ],
    typography: {
        fontFamily: [
            "Nunito",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(","),
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        h1: {
            fontSize: "2rem",
            '@media (max-width:1600px)': {
                fontSize: "1.65rem"
            },
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: "1.75rem",
            '@media (max-width:1600px)': {
                fontSize: "1.45rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        h3: {
            fontSize: "1.5rem",
            '@media (max-width:1600px)': {
                fontSize: "1.25rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        h4: {
            fontSize: "1.25rem",
            '@media (max-width:1600px)': {
                fontSize: "1.05rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        h5: {
            fontSize: "1.125rem",
            '@media (max-width:1600px)': {
                fontSize: "0.95rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        h6: {
            fontSize: "1.0625rem",
            '@media (max-width:1600px)': {
                fontSize: "0.85rem"
            },
            fontWeight: 600,
            lineHeight: 1.2
        },
        body1: {
            fontSize: 14,
            '@media (max-width:1600px)': {
                fontSize: "12px"
            },
        },
        body2: {
            '@media (max-width:1600px)': {
                fontSize: "0.675rem"
            },
        },
        button: {
            textTransform: "none",
            fontSize: "13px",
            '@media (max-width:1600px)': {
                fontSize: "11px",
                lineHeight: 'normal'
            }
        }
    },
    palette: {
        mode: "dark",
        primary: {
            main: COSMOS_RED,
            light: '#2d2d2d',
            dark: '#f7f7f7' //previously #dddddd
        },
        secondary: {
            main: '#323232',
            dark: '#e34748'
        },
        background: {
            default: '#232323',
            paper: '#232323'
        },
        text: {
            primary: '#f7f7f7',
            secondary: '#7e7e7f'
        }
    }
};

export const getTheme = (mode: 'light' | 'dark') => createTheme(mode === 'light' ? lightTheme : darkTheme);
