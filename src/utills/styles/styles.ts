import { makeStyles, Theme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) => ({
    // Page Layout
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    introBody: {
        minHeight: theme.spacing(130) + '!important',
        maxHeight: theme.spacing(130) + '!important',
        marginTop: theme.spacing(10) + '!important',
        border: '1px solid red'
    },

    dialog: {
        minWidth: theme.spacing(180) + 'px !important',
        minHeight: theme.spacing(160) + 'px !important',
        maxWidth: theme.spacing(180) + 'px !important',
        maxHeight: theme.spacing(160) + 'px !important'
    },
    dialogDeep: {
        minWidth: theme.spacing(160) + 'px !important',
        minHeight: theme.spacing(175) + 'px !important',
        maxWidth: theme.spacing(160) + 'px !important',
        maxHeight: theme.spacing(175) + 'px !important'
    },
    dialogTitle: {
        minHeight: theme.spacing(10) + '!important',
        maxHeight: theme.spacing(10) + '!important',
        border: '1px solid red'
    },
    dialogCloseBtn: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
        zIndex: 100
    },
    dialogWide: {
        minWidth: theme.spacing(350) + 'px !important',
        minHeight: theme.spacing(150) + 'px !important',
        maxWidth: theme.spacing(350) + 'px !important',
        maxHeight: theme.spacing(150) + 'px !important'
    },

    visualizer: {
        minHeight: theme.spacing(125) + '!important',
        maxHeight: theme.spacing(125) + '!important',
        minWidth: theme.spacing(290) + '!important',
        maxWidth: theme.spacing(290) + '!important',
        margin: 'auto'
    },

    plotCntlBox: {
        marginTop: theme.spacing(20)
    },

    iconBtn: {
        padding: theme.spacing(1)
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
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
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
        right: theme.spacing(3),
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem'
    },
    rightAccountTab: {
        position: 'absolute',
        right: '6%',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        borderRight: '1px solid #fff'
    },
    title: {
        position: 'relative',
        paddingTop: '0.2rem',
        paddingBottom: '0.2rem',
        paddingRight: theme.spacing(2)
    },
    titleLink: {
        color: '#FFF',
        '&:hover': {
            color: '#FFF'
        },
        textDecoration: 'none'
    },
    link: {
        paddingRight: theme.spacing(2),
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
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1, 0, 0, 4),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%'
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    phoneInput: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(10)
    },
    authcard: {
        minWidth: '30vw',
        padding: theme.spacing(3)
    },
    menuButton: {
        marginRight: theme.spacing(2)
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
        color: theme.palette.grey[100]
    },
    paramDisabledCard: {
        width: '3vw',
        height: '86vh',
        backgroundColor: '#595959',
        color: theme.palette.grey[100],
        padding: theme.spacing(0, 1, 0)
    },
    paramPin: {
        right: theme.spacing(2)
    },
    paramDivider: {
        margin: theme.spacing(2, 1, 2, 1),
        backgroundColor: theme.palette.grey[100]
    },
    paramInput: {
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.spacing(1)
    },
    paramSelect: {
        textIndent: theme.spacing(5)
    },

    // Dashboard Panel
    table: {
        marginRight: theme.spacing(8),
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
        }
    },
    darkTableCell: {
        backgroundColor: '#ccc'
    },

    deepDiveInput: {
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.spacing(1),
        border: '1px solid #000'
    },

    // Chart Panel Dialog
    fab: {
        top: theme.spacing(2)
    },
    fabClose: {
        position: 'fixed',
        top: theme.spacing(14),
        right: theme.spacing(86),
        zIndex: 10
    },
    cancelButton: {
        position: 'absolute',
        left: theme.spacing(3)
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
        width: theme.spacing(90) + '!important',
        margin: 0,
        backgroundColor: theme.palette.background.default,
        right: 0,
        top: 0
    },
    subChartDialog: {
        width: theme.spacing(100) + '!important',
        height: '63vh !important'
    },

    // Explore Summary Panel
    cover: {
        width: '100%',
        borderRadius: theme.spacing(1)
    },
    coverCard: {
        marginLeft: theme.spacing(2),
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

    // Search Section
    searchCard: {
        backgroundColor: grey[100]
    },
    searchSelect: {
        textAlignLast: 'center'
    },
    searchYearInput: {
        marginLeft: theme.spacing(2)
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
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
        zIndex: 100
    },
    introItem: {
        //height: '61vh'
        height: '71vh'
    },
    introContent: {
        height: '87%',
        padding: theme.spacing(3, 8, 3, 8)
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
        color: theme.palette.grey[100]
    },
    visualChartCard: {
        overflowY: 'auto',
        height: '86vh'
    },
    visualChartDisabledCard: {
        width: '3vw',
        height: '86vh',
        padding: theme.spacing(0, 1, 0)
    },

    pdfFullScreenButton: {
        position: 'absolute',
        right: theme.spacing(5)
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
        borderColor: theme.palette.primary.main
    }
}));

export default useStyles;