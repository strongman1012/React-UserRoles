import React from "react";
import { FC, useEffect, useRef, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { styled } from '@mui/material/styles';
import { Box, IconButton, Tab, Tabs } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { CodeEditorProps } from "./CodeEditor";
import { Theme, makeStyles } from "@material-ui/core";
import Confirm from "./popups/Confirm";
import { TCode, TFile, TTab, actionTypes } from "../types";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
    activeTab: {
        backgroundColor: '#161B22 !important'
    }
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    minHeight: '600px',
    height: 'calc(100% - 50px)',
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    })
}));

export interface FileEditorProps extends CodeEditorProps {
    setCodeChanged: (boolean: boolean) => void,
    setFileOpen: (boolean: boolean) => void,
    saveTrigger: boolean,
    setSaveTrigger: (boolean: boolean) => void,
    deleteTrigger: boolean,
    setDeleteTrigger: (boolean: boolean) => void,
    currentFile: TFile | undefined,
    updateCurrentFile: (file: TFile | undefined) => void,
    setChangesMade: (boolean: boolean) => void;
}

const FileEditor: FC<FileEditorProps> = ({
    setCodeChanged,
    setFileOpen,
    saveTrigger,
    setSaveTrigger,
    deleteTrigger,
    setDeleteTrigger,
    scriptList,
    isEditable,
    deleteScript,
    refreshScripts,
    currentFile,
    updateCurrentFile,
    updateScript,
    setChangesMade
}) => {

    const textRef = useRef<HTMLTextAreaElement | any>();
    const drawOpened = true;

    const [language, setLanguage] = useState<string>('js');
    const [codes, setCodes] = useState<any[]>([]);
    const [code, setCode] = useState<string>('');
    const [tabs, setTabs] = useState<TTab[]>([]);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [tabIdToDelete, setTabIdToDelete] = useState<number>(0);
    const [warningMessage, setWarningMessage] = useState<string>('');
    const [showWarning, setShowWarning] = useState<boolean>(false);
    const classes = useStyles();

    useEffect(() => {
        if (deleteTrigger) {
            const currentTab = tabs.find((tab: TTab, idx: number) => idx === activeTab);

            if (currentTab) {
                closeFile(activeTab);
                deleteScript(currentTab.id);
                setDeleteTrigger(false);
                refreshScripts();
            }
        }
    }, [deleteTrigger]);

    /**
     * Load Selected File from File list
     */
    useEffect(() => {
        if (currentFile !== undefined) {
            let newLanguage = 'text';

            if (currentFile.ext === '.js') {
                newLanguage = 'js';
            } else if (currentFile.ext === '.py') {
                newLanguage = 'js'; //'python' was showing unreadable text
            }

            setLanguage(newLanguage);

            const currentTab = tabs.find((tab: TTab) => tab.id === currentFile.id);
            const currentCodeObj = codes.find((code: TCode) => code.id === currentFile.id);

            if (currentTab === undefined) {
                const newTabs: any = [...tabs, { id: currentFile.id, name: currentFile.name, ext: currentFile.ext }];
                setTabs(newTabs);
                setActiveTab(newTabs.length - 1);

                if (!currentCodeObj) {
                    setCodes([...codes, { ...currentFile, changed: false }]);
                    setCode(currentFile.script);
                    setCodeChanged(false);
                } else {
                    setCode(currentCodeObj.script);
                    setCodeChanged(currentCodeObj.changed);
                }
            } else {
                const tabIdx = tabs.indexOf(currentTab);
                setActiveTab(tabIdx);

                if (currentCodeObj !== undefined) {
                    setCode(currentCodeObj.script);
                    setCodeChanged(currentCodeObj.changed);
                }
            }
        }
    }, [currentFile, tabs, codes]);

    /**
     * Check for deleted files and remove from view
     */
    useEffect(() => {
        codes.forEach((x) => {
            if (![...scriptList].some(c => c?.id === x.id)) {
                const newCodes = [...codes.filter((y) => y.id !== x.id) ?? null];
                const newTabs = [...tabs.filter((y) => y.id !== x.id) ?? null];
                if (!currentFile || currentFile?.id === x.id) {
                    setCode('');
                }
                setCodes(newCodes);
                setTabs(newTabs);
            }
        });
    }, [scriptList]);

    /**
     * Handle Code Change
     * @param evn 
     */
    const handleCodeChange = (evn: any) => {
        setCode(evn.target.value);

        if (currentFile !== undefined) {
            setCodes([...codes.filter((x) => x.id !== currentFile.id), {
                id: currentFile.id,
                changed: true,
                name: currentFile.name,
                ext: currentFile.ext,
                script: evn.target.value
            }]);
            setCodeChanged(true);
        }
    }

    /**
     * SaveEvent recieved From Toolbar
     */
    useEffect(() => {
        if (saveTrigger) {
            const currentTab = tabs.find((tab: TTab, idx: number) => idx === activeTab);

            if (currentTab !== undefined) {
                const currentCode = codes.find((code) => code.id === currentTab.id);

                if (currentCode !== undefined) {
                    const currentFile: TFile = {
                        id: currentCode.id,
                        name: currentCode.name,
                        ext: currentCode.ext,
                        script: currentCode.script
                    }

                    updateScript(currentFile, actionTypes.update);

                    setSaveTrigger(false);

                    setCodes([...codes.filter((x) => x.id !== currentCode.id), {
                        id: currentCode.id,
                        changed: false,
                        name: currentCode.name,
                        ext: currentCode.ext,
                        script: currentCode.script
                    }]);
                    setCodeChanged(false);
                }
            }
        }
    }, [saveTrigger]);

    useEffect(() => {
        codes.some((x) => x.changed) ? setChangesMade(true) : setChangesMade(false);
    }, [codes]);

    useEffect(() => {
        if (activeTab > -1) {
            setFileOpen(true);
        } else {
            setFileOpen(false);
        }
    }, [activeTab]);

    /**
     * Handle Change Active File Tab
     * @param tab 
     */
    const handleChangeTab = (tabToActive: number) => {
        const currentTab = tabs.find((tab: TTab, idx: number) => idx === tabToActive);

        if (currentTab !== undefined) {
            const codeObj = codes.find((code: TCode) => code.id === currentTab.id);
            setActiveTab(tabToActive);

            if (codeObj !== undefined) {
                setCode(codeObj.script);
                codeObj.ext.includes('.js') && setLanguage('js');
                codeObj.ext.includes('.py') && setLanguage('js');
                !codeObj.ext.includes('.js') && !codeObj.ext.includes('.py') && setLanguage('text');

                const findFile = scriptList.find((file: TFile) => file.id === currentTab.id);

                if (findFile !== undefined) {
                    updateCurrentFile({
                        id: codeObj.id,
                        name: codeObj.name,
                        ext: codeObj.ext, script: findFile.script
                    });
                    setCodeChanged(codeObj.changed);
                }
            }
        }
    }

    /**
     * Handle Close File Tab
     * @param event 
     * @param tabToDelete 
     */
    const handleCloseFile = (event: any, tabToDelete: number) => {
        event.stopPropagation();
        const codeToClose = codes.find((code: TCode, idx: number) => idx === tabToDelete);

        if (codeToClose !== undefined && codeToClose.changed) {
            setTabIdToDelete(tabToDelete);
            setWarningMessage('Changes have been made to this file. Close without saving?');
            setShowWarning(true);
        } else {
            closeFile(tabToDelete);
        }
    };

    const closeFile = (tabToDelete: number) => {
        const currentTab = tabs.find((tab: TTab, idx: number) => idx === tabToDelete);

        if (currentTab !== undefined) {
            // Filter out the code and tabs related to the tab to delete
            const updatedCodes = codes.filter((code: TCode) => code.id !== currentTab.id);
            const updatedTabs = tabs.filter((tab: TTab) => tab.id !== currentTab.id);

            let newActiveTabIdx = activeTab;

            if (tabToDelete === activeTab) {
                // Find the index of the new active tab after deletion
                newActiveTabIdx = Math.max(updatedTabs.length - 1, 0);
            } else if (activeTab > tabToDelete) {
                // If the active tab is after the deleted tab, adjust its index
                newActiveTabIdx = activeTab - 1;
            }

            setActiveTab(newActiveTabIdx);

            if (updatedTabs.length > 0) {
                const newCode = codes.find((code: TCode) => code.id === updatedTabs[newActiveTabIdx].id);
                if (newCode !== undefined) {
                    setCode(newCode.script);
                    setCodeChanged(newCode.changed);
                    updateCurrentFile({ ...updatedTabs[newActiveTabIdx], script: newCode.script });
                }
            } else {
                // No tabs left, reset the code and current file
                setCode('');
                updateCurrentFile(undefined);
            }

            // Update the state with the filtered codes and tabs
            setCodes(updatedCodes);
            setTabs(updatedTabs);
            setCodeChanged(updatedTabs.length > 0);
        }
    };

    return (
        <>
            <Main open={drawOpened} >
                <Box
                    sx={{ backgroundColor: '#333' }}
                    className="tabs-wrap"
                >
                    <Tabs value={activeTab}
                        TabIndicatorProps={{
                            style: { display: 'none' }
                        }}
                        variant="scrollable"
                        scrollButtons={true}
                    >
                        {tabs.length > 0 ?
                            tabs.map((tab, idx: number) => (
                                <Tab key={idx}
                                    style={{ textTransform: 'none' }}
                                    label={
                                        <span>
                                            {tab.name + tab.ext}{(codes.find((x) => x.id === tab.id)?.changed) && '*'}
                                            <IconButton
                                                component="div"
                                                color="inherit"
                                                style={{ padding: 0 }}
                                                onClick={(event: any) => handleCloseFile(event, idx)}
                                                aria-label={`Close ${tab.name + tab.ext} tab`}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </span>
                                    }
                                    className={idx === activeTab ? classes.activeTab : ''}
                                    onClick={() => handleChangeTab(idx)}
                                    sx={{ color: '#FFF !important' }}
                                />
                            ))
                            :
                            <Tab key={0}
                                style={{ textTransform: 'none', color: 'white' }}
                                label={
                                    <span>
                                        {'No File'}
                                        <IconButton
                                            component="div"
                                            color="inherit"
                                            style={{ padding: 0, display: 'none' }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </span>
                                }
                                className={classes.activeTab}
                                disabled
                            />
                        }
                    </Tabs>
                </Box>

                <div
                    data-color-mode="dark"
                    style={{
                        minHeight: 500,
                        height: 600,
                        overflowY: 'auto',
                    }}>

                    <CodeEditor
                        value={tabs.length > 0 ? code : ''}
                        ref={textRef}
                        language={language}
                        placeholder={tabs.length > 0 && currentFile ? `Please enter ${currentFile.ext} code.` : "Please Select a File"}
                        onChange={(evn) => tabs.length > 0 && handleCodeChange(evn)}
                        disabled={!isEditable || tabs.length === 0 || !currentFile}
                        padding={15}
                        style={{
                            fontSize: 12,
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            color: 'white !important',
                            minHeight: 600
                        }}
                    />
                </div>

            </Main>

            <Confirm
                open={showWarning}
                message={warningMessage}
                onOpen={() => setShowWarning(!showWarning)}
                onConfirm={() => closeFile(tabIdToDelete)}
            />
        </>
    )
}

export default FileEditor;