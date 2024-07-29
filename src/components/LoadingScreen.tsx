import React from 'react';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingScreen = (props: { show: boolean; }) => {

    return (
        <>
            <div data-testid="loading-screen">
                <Backdrop
                    sx={{ color: '#ddd', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={props.show}
                    className='loading-screen'
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </>
    )
}

export default LoadingScreen;