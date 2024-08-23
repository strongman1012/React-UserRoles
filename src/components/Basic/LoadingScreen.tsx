import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingScreen = (props: { show: boolean; }) => {

    return (
        <>
            <div>
                <Backdrop
                    sx={{ color: '#ddd', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={props.show}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    )
}

export default LoadingScreen;