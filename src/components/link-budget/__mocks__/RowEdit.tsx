import React, { FC, useEffect, useState } from 'react';
import { Row } from '../types/LinkBudgetTypes';
import { Box, TextField } from '@material-ui/core';

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

const MockRowEdit: FC<RowEditPop> = (props: RowEditPop) => {
    const { row, visible, onChangeName, onChangeTitle, onChangeCode, onChangeNotes, onOk, onHide, error } = props;
    const [userExp, setUserExp] = useState<string>(props.row.user_exp);

    useEffect(() => {
        setUserExp(row.user_exp);
    }, [row.user_exp]);

    if (!visible) {
        return null;
    }

    return (
        <div data-testid="mock_row_edit" role="dialog">
            <div data-testid="mock-row-content">
                <TextField
                        label="Item Name"
                        autoFocus
                        id="itemName"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={row.name}
                        onBlur={onChangeName}
                    />

                    <TextField
                        label="Item Title"
                        id="itemTitle"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={row.title}
                        onBlur={onChangeTitle}
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
                        onBlur={onChangeCode}
                        inputProps={{ 'data-testid': 'mock_jsonequation_input' }}
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
                            value={props.row.notes}
                            onBlur={onChangeNotes}
                        />
                    </Box>
                <button onClick={onHide}>Hide</button>
                <button onClick={onOk} data-testid="mock_button_ok" >OK</button>
            </div>
        </div>
    );
};

export default MockRowEdit;