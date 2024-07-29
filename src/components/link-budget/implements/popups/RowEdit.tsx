import React from 'react';
import { FC, useEffect, useState } from "react";
import { Row } from "../../types/LinkBudgetTypes";
import DialogBox from "../../../global/DialogBox";
import { Box, Button, Grid, TextField } from "@mui/material";

interface RowEditPop {
    row: Row;
    visible: boolean;
    onChangeName: (e: any) => void;
    onChangeTitle: (e: any) => void;
    onChangeCode: (e: any) => void;
    onChangeNotes: (e: any) => void;
    onOk: () => void;
    onHide: () => void;
    error: string | undefined;
}

const RowEdit: FC<RowEditPop> = (props: RowEditPop) => {

    const [name, setName] = useState<string>(props.row.name);
    const [title, setTitle] = useState<string>(props.row.title);
    const [userExp, setUserExp] = useState<string>(props.row.user_exp);
    const [notes, setNotes] = useState<string>(props.row.notes)

    useEffect(() => {
        setName(props.row.name);
    }, [props.row.name]);

    useEffect(() => {
        setTitle(props.row.title);
    }, [props.row.title]);

    useEffect(() => {
        setUserExp(props.row.user_exp);
    }, [props.row.user_exp]);

    useEffect(() => {
        setNotes(props.row.notes);
    }, [props.row.notes]);

    return (
        <DialogBox
            id="rowEdit"
            title="Row Edit"
            isOpen={props.visible}
            onClose={props.onHide}
        >
            <Grid container justifyContent="center" alignItems="center" spacing={2}>

                <Grid item md={12}>
                    <TextField
                        label="Item Name"
                        autoFocus
                        id="itemName"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        onBlur={props.onChangeName}
                    />

                    <TextField
                        label="Item Title"
                        id="itemTitle"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                        onBlur={props.onChangeTitle}
                    />

                    <TextField
                        label="JSONata Equation"
                        id="itemEqn"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={userExp}
                        onChange={(e) => {
                            setUserExp(e.target.value);
                        }}
                        onBlur={props.onChangeCode}
                    />

                    <Box sx={{
                        margin: '20px -20px 0',
                        padding: '20px 20px 0',
                        borderTop: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <TextField
                            label="Value"
                            value={props.error ? props.error : props.row.value}
                            size="small"
                            fullWidth
                            style={{ WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)' }}
                            disabled
                        />
                    </Box>

                    <Box sx={{
                        margin: '20px -20px 0',
                        padding: '20px 20px 0',
                        borderTop: '1px solid #ddd'
                    }}>
                        <TextField
                            label="Notes"
                            autoFocus
                            id="itemNotes"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={notes}
                            onChange={(e) => {
                                setNotes(e.target.value);
                            }}
                            onBlur={props.onChangeNotes}
                        />
                    </Box>
                </Grid>
                <Grid item md={12} container alignItems={'flex-end'}>
                    <Button
                        name="submitSave"
                        variant="contained"
                        color="primary"
                        onClick={props.onOk}
                        style={{ float: 'right' }}
                    >
                        OK
                    </Button>
                </Grid>
            </Grid>
        </DialogBox>
    )


}

export default RowEdit;
