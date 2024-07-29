import React from 'react';
import { FC } from "react";
import { Popup, Position, ToolbarItem } from "devextreme-react/popup";
import { Box, Typography } from "@mui/material";

interface IConfirm {
    visible: boolean;
    message: string;
    onHide: () => void;
    onOk: () => void;
}

const Confirm: FC<IConfirm> = (props: IConfirm) => {

    const okButtonOptions = {
        text: 'OK',
        onClick: props.onOk,
    };

    const cancelButtonOptions = {
        text: 'Cancel',
        onClick: props.onHide,
    };

    return (
        <Popup
            width={400}
            height='auto'
            showTitle={true}
            title="Information"
            visible={props.visible}
            showCloseButton={true}
            onHiding={props.onHide}
        >
            <Position
                at="top"
                my="center"
                collision="fit"
                offset="0 300"
            />

            <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={okButtonOptions}
            />

            <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={cancelButtonOptions}
            />

            <Box>
                <Typography fontSize="1.2rem">
                    {props.message}
                </Typography>
            </Box>

        </Popup>
    )
}

export default Confirm;