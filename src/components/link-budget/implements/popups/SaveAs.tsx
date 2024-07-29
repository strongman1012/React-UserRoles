import React from 'react';
import { FC, useEffect, useState } from "react";
import DialogBox from "../../../global/DialogBox";
import { makeStyles, Theme } from "@material-ui/core";
import { Button, Grid, TextField } from "@mui/material"
import { DatasetName } from "../../types/LinkBudgetTypes";

interface ISaveAs {
    visible: boolean;
    datasetName: { id: number, name: string };
    onChange: (e: any) => void;
    onHide: () => void;
    onOk: (name: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    dialogBox: {

    }
}));

const SaveAs: FC<ISaveAs> = (props: ISaveAs) => {

    const classes = useStyles();

    const [value, setValue] = useState<DatasetName>(props.datasetName);

    useEffect(() => {
        setValue(props.datasetName);
    }, [props.datasetName]);

    return (
        <DialogBox
            title="Save As"
            isOpen={props.visible}
            onClose={props.onHide}
        // className={{ paper: classes.dialogBox }}
        >
            <Grid container justifyContent="center" alignItems="center" spacing={2}>

                <Grid item md={12}>
                    <TextField
                        autoFocus
                        id="templateName"
                        label="Template Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={value.name}
                        onChange={(e) => {
                            setValue((t) => ({ id: -1, name: e.target.value }));
                        }}
                        onBlur={props.onChange}
                        inputProps={{
                            "aria-label": "template-name-input"
                        }}
                    />
                </Grid>
                <Grid item md={12} container alignItems={'flex-end'}>
                    <Button
                        name="submitSave"
                        variant="contained"
                        color="primary"
                        onClick={() => props.onOk(value?.name?.trim())}
                        disabled={value?.name?.trim().length <= 0}
                        style={{ float: 'right' }}
                    >
                        OK
                    </Button>
                </Grid>
            </Grid>
        </DialogBox>
    )
}

export default SaveAs;