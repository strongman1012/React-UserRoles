import { grey } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';
import useTheme from './theme';

const theme = useTheme;

const useStyles = makeStyles(() => ({
    // Page Layout
    paper: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    introBody: {
        minHeight: 130 + '!important',
        maxHeight: 130 + '!important',
        marginTop: 10 + '!important',
        border: '1px solid red'
    },

    dialog: {
        minWidth: 180 + 'px !important',
        minHeight: 160 + 'px !important',
        maxWidth: 180 + 'px !important',
        maxHeight: 160 + 'px !important'
    },
    dialogDeep: {
        minWidth: 160 + 'px !important',
        minHeight: 175 + 'px !important',
        maxWidth: 160 + 'px !important',
        maxHeight: 175 + 'px !important'
    },
    dialogTitle: {
        minHeight: 10 + '!important',
        maxHeight: 10 + '!important',
        border: '1px solid red'
    },
    dialogCloseBtn: {
        position: 'absolute',
        right: 1,
        top: 1,
        color: theme.light.palette?.background?.default,
        zIndex: 100
    },
    dialogWide: {
        minWidth: 350 + 'px !important',
        minHeight: 150 + 'px !important',
        maxWidth: 350 + 'px !important',
        maxHeight: 150 + 'px !important'
    },

    visualizer: {
        minHeight: 125 + '!important',
        maxHeight: 125 + '!important',
        minWidth: 290 + '!important',
        maxWidth: 290 + '!important',
        margin: 'auto'
    },

    plotCntlBox: {
        marginTop: 20
    },

    iconBtn: {
        padding: 1
    },
    rankingLabel: {
        width: '20px',
        height: '20px',
        border: '3px solid ' + grey[700],
        borderRadius: '10px',
        color: grey[700],
        fontSize: '15px',
        fontWeight: 'bold',
        position: 'relative'
    },

    tableLabel: {
        maxWidth: '10vw',
        color: '#fff',
        padding: '1vw',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    tableRadio: {
        maxWidth: '3vw',
        color: '#fff',
        margin: 0,
        padding: 0
    },
    tableRadioHeader: {
        maxWidth: '3vw',
        color: '#fff',
        margin: 0,
        padding: 0,
        textAlign: 'center'
    },

    gitBtn: {
        '&:hover': {
            color: '#fff'
        }
    },

    centered: {
        textAlign: 'right'
    },

    // Top Menu Bar
    tab: {
        color: '#FFF',
        '&:hover': {
            color: '#AAA'
        }
    },
    extendedTab: {
        paddingLeft: 2,
        paddingRight: 1,
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        borderLeft: '1px solid #fff'
    },
    extendedRightTab: {
        borderRight: '1px solid #fff'
    },
    deActive: {
        '&:after': {
            content: 'BBBB'
        }
    },
    rightTab: {
        position: 'absolute',
        right: 3,
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem'
    },
    rightAccountTab: {
        position: 'absolute',
        right: '6%',
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        borderRight: '1px solid #fff'
    },
    title: {
        position: 'relative',
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        paddingRight: 2
    },
    titleLink: {
        color: '#FFF',
        '&:hover': {
            color: '#FFF'
        },
        textDecoration: 'none'
    },
    link: {
        paddingRight: 2,
        color: '#3385ff'
    },
    menuItem: {
        color: '#000',
        width: '25%'
    },

    // Landing Page
    mainPanelCard: {
        border: '2px solid #3366ff',
        borderRadius: '8px',
        minHeight: '27vh'
    },
    hoverPoint: {
        '&:hover': {
            cursor: 'pointer'
        }
    },

    // Auth Pages
    singupPaper: {
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        backgroundColor: theme.light.palette?.background?.default
    },
    form: {
        width: '100%'
    },
    phoneInput: {
        marginTop: 2,
        padding: 10
    },
    authcard: {
        minWidth: '30vw',
        padding: 3
    },
    menuButton: {
        marginRight: 2
    },
    cardHeader: {
        textAlign: 'center'
    },

    // Parameter Panel
    paramCard: {
        overflowY: 'auto',
        //width: "28vw",
        paddingRight: 0,
        minHeight: '86vh',
        maxHeight: '86vh',
        backgroundColor: '#595959',
        color: theme.light.palette?.background?.default
    },
    paramDisabledCard: {
        width: '3vw',
        height: '86vh',
        backgroundColor: '#595959',
        color: theme.light.palette?.background?.default,
    },
    paramPin: {
        right: 2
    },
    paramDivider: {
        backgroundColor: theme.light.palette?.background?.default
    },
    paramInput: {
        backgroundColor: theme.light.palette?.background?.default,
        borderRadius: 1
    },
    paramSelect: {
        textIndent: 5
    },

    // Dashboard Panel
    table: {
        marginRight: 8,
        '&:nth-of-type(odd)': {
            backgroundColor: theme.light.palette?.action?.hover
        }
    },
    darkTableCell: {
        backgroundColor: '#ccc'
    },

    deepDiveInput: {
        backgroundColor: theme.light.palette?.background?.default,
        borderRadius: 1,
        border: '1px solid #000'
    },

    // Chart Panel Dialog
    fab: {
        top: 2
    },
    fabClose: {
        position: 'fixed',
        top: 14,
        right: 86,
        zIndex: 10
    },
    cancelButton: {
        position: 'absolute',
        left: 3
    },
    chartBar: {
        position: 'fixed',
        width: '4vw',
        top: '8vh',
        right: '0',
        minHeight: '86vh',
        zIndex: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        marginTop: '24px'
    },
    chartBarPanel: {
        width: '3vw',
        height: '86vh',
        margin: '0 auto'
    },
    chartDialog: {
        width: 90 + '!important',
        margin: 0,
        backgroundColor: theme.light.palette?.background?.default,
        right: 0,
        top: 0
    },
    subChartDialog: {
        width: 100 + '!important',
        height: '63vh !important'
    },

    // Explore Summary Panel
    cover: {
        width: '100%',
        borderRadius: 1
    },
    coverCard: {
        marginLeft: 2,
        padding: 0,
        textAlign: 'center'
    },
    eachCard: {
        maxWidth: '32%',
        backgroundColor: grey[200],
        boxShadow:
            '0px 3px 9px -1px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.4), 0px 1px 3px 0px rgba(0,0,0,0.4) !important'
    },

    card: {
        margin: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },

    searchSelect: {
        textAlignLast: 'center'
    },
    searchYearInput: {
        marginLeft: 2
    },
    chartPinBar: {
        writingMode: 'vertical-rl',
        transform: 'rotate(-180deg)',
        fontSize: '1.2rem',
        color: grey[700],
        marginTop: '14vh'
    },
    anaylzeChartPinBar: {
        writingMode: 'vertical-rl',
        transform: 'rotate(-180deg)',
        fontSize: '1.2rem',
        color: grey[700],
        margin: '31vh auto'
    },
    paramPinBar: {
        writingMode: 'vertical-rl',
        transform: 'rotate(-180deg)',
        fontSize: '1.2rem',
        marginTop: '21vh'
    },

    // Intro Panel
    introPanel: {
        width: '50vw !important',
        height: '70vh !important'
    },
    closeButton: {
        position: 'absolute',
        right: 1,
        top: 1,
        color: theme.light.palette?.background?.default,
        zIndex: 100
    },
    introItem: {
        //height: '61vh'
        height: '71vh'
    },
    introContent: {
        height: '87%',
    },

    // Analyze Result Page
    analyzeResultLink: {
        textDecoration: 'underline !important',
        '&:hover': {
            cursor: 'pointer !important',
            color: '#3f51b5 !important'
        }
    },
    tooltip: {
        maxWidth: '500px'
    },
    visualParamCard: {
        overflowY: 'auto',
        //width: "28vw",
        height: '86vh',
        backgroundColor: '#595959',
        color: theme.light.palette?.background?.default
    },
    visualChartCard: {
        overflowY: 'auto',
        height: '86vh'
    },
    visualChartDisabledCard: {
        width: '3vw',
        height: '86vh',
    },

    pdfFullScreenButton: {
        position: 'absolute',
        right: 5
    },

    // Septrum Panel
    spectrumGrid: {
        minHeight: '40vh'
    },
    spectrumDiv: {
        minHeight: '10vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #000',
        cursor: 'pointer'
    },
    spectrumSelected: {
        boxShadow:
            '6px 6px 6px -3px rgba(0,0,0,0.4),' +
            '4px 4px 4px 0px rgba(0,0,0,0.4),' +
            '0px 4px 4px 0px rgba(0,0,0,0.4) !important',
        zIndex: 1000
    },

    //Login Page
    loginLine: {
        width: '130px',
        margin: '0px',
        marginTop: '5px',
        borderColor: theme.light.palette?.background?.default
    }
}));

export default useStyles;