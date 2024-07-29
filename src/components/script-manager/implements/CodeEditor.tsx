// src/pages/CodeEditor.tsx
import React from "react";
import { FC, useState } from "react";
import { Box, Card, Container } from "@mui/material";
import FileList from "./FileList";
import FileEditor from "./FileEditor";
import EditorToolBar from "./EditorToolBar";
import { TFile } from "../types";

export interface CodeEditorProps {
    scriptList: TFile[],
    isEditable: boolean;
    templateScripts: { ext: string, script: string }[];
    extTypes: string[];
    deleteScript: (id: string) => void;
    updateScript: (file: TFile, actionType: string) => void;
    refreshScripts: () => void;
    changesMade?: boolean;
    setChangesMade: (boolean: boolean) => void;
    deployUpdatedScript?: (script: TFile) => void;
    resetScript?: (script: TFile) => void;
}

const CodeEditor: FC<CodeEditorProps> = ({
    scriptList,
    isEditable,
    templateScripts,
    extTypes,
    deleteScript,
    updateScript,
    refreshScripts,
    changesMade,
    setChangesMade,
    deployUpdatedScript,
    resetScript
}) => {

    const [codeChanged, setCodeChanged] = useState<boolean>(false);
    const [fileOpen, setFileOpen] = useState<boolean>(false);
    const [currentFile, updateCurrentFile] = useState<TFile | undefined>();
    const [saveTrigger, setSaveTrigger] = useState<boolean>(false);
    const [deleteTrigger, setDeleteTrigger] = useState<boolean>(false);

    return (
        <>
            <Container maxWidth="lg" sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Card>
                    <Box sx={{ display: 'flex' }}>
                        <FileList
                            isEditable={isEditable}
                            scriptList={scriptList}
                            currentFile={currentFile}
                            updateCurrentFile={updateCurrentFile}
                            deleteScript={deleteScript}
                            extTypes={extTypes}
                            templateScripts={templateScripts}
                            updateScript={updateScript}
                            fileOpen={fileOpen}
                            deployUpdatedScript={deployUpdatedScript}
                            resetScript={resetScript}
                        />
                        <Box sx={{ width: '100%' }}>
                            <EditorToolBar
                                codeChanged={codeChanged}
                                fileOpen={fileOpen}
                                isEditable={isEditable}
                                templateScripts={templateScripts}
                                extTypes={extTypes}
                                updateScript={updateScript}
                                refreshScripts={refreshScripts}
                                scriptList={scriptList}
                                deleteScript={deleteScript}
                                setSaveTrigger={setSaveTrigger}
                                setDeleteTrigger={setDeleteTrigger}
                                setChangesMade={() => { }}
                            />
                            <FileEditor
                                setCodeChanged={setCodeChanged}
                                setFileOpen={setFileOpen}
                                saveTrigger={saveTrigger}
                                setSaveTrigger={setSaveTrigger}
                                deleteTrigger={deleteTrigger}
                                setDeleteTrigger={setDeleteTrigger}
                                scriptList={scriptList}
                                isEditable={isEditable}
                                deleteScript={deleteScript}
                                refreshScripts={refreshScripts}
                                currentFile={currentFile}
                                updateCurrentFile={updateCurrentFile}
                                templateScripts={templateScripts}
                                extTypes={extTypes}
                                updateScript={updateScript}
                                changesMade={changesMade}
                                setChangesMade={setChangesMade}
                            />
                        </Box>
                    </Box>
                </Card>
            </Container>
        </>
    );
}

export default CodeEditor;