import { createSlice } from "@reduxjs/toolkit";

interface TestData {
    inputJson: string;
    outputJson: string;
    testStatus: string;
}

const initialState: TestData = {
    inputJson: '{}',
    outputJson: '{}',
    testStatus: ''
}

export const slice = createSlice({
    name: 'testRedux',
    initialState,
    reducers: {
        init: (state, action) => {
            state = initialState
        },
        setIputJson: (state, action) => {
            state.inputJson = action.payload;
        },
        setOutputJson: (state, action) => {
            state.outputJson = action.payload;
        },
        setTestStatus: (state, action) => {
            state.testStatus = action.payload;
        }
    },
});

export const {
    init,
    setIputJson,
    setOutputJson,
    setTestStatus
} = slice.actions;

export default slice.reducer;