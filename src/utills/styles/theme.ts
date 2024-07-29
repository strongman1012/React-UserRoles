import { ThemeOptions, createTheme } from '@material-ui/core/styles';

const COSMOS_RED = '#e34747';

function createShadow(px: number) {
    return `0 0 ${px}px 0 rgba(53,64,82,.05)`;
}

const lightTheme: ThemeOptions = createTheme({
    props: {
        MuiButtonBase: {
            disableRipple: true
        },
        MuiCardHeader: {
            titleTypographyProps: { variant: 'h6' }
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
        type: "light",
        primary: {
            main: COSMOS_RED,
            light: '#ffffff',
            dark: '#000000'
        },
        secondary: {
            main: '#1a1a1a',
            dark: '#fof1f3'
        },
        background: {
            default: '#f0f1f3',
            paper: '#ffffff'
        },
        text: {
            primary: '#737373'
        }
    }
});


const darkTheme: ThemeOptions = createTheme({
    props: {
        MuiButtonBase: {
            disableRipple: true
        },
        MuiCardHeader: {
            titleTypographyProps: { variant: 'h6' }
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
        type: "dark",
        primary: {
            main: '#e34748',
            light: '#2d2d2d',
            dark: '#dddddd'
        },
        secondary: {
            main: '#e34748',
            dark: "ffffff"
        },
        background: {
            default: '#232323',
            paper: '#e6e5e8'
        },
        text: {
            primary: '#737373'
        }
    }
});

const themes = {
    dark: darkTheme,
    light: lightTheme
};

export default themes;
