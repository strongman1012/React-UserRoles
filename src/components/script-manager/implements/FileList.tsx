// src/components/FileList.tsx
import React from "react";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import jsFileSvg from "../assets/file-js.svg";
import pythonFileSvg from "../assets/file-python.svg";
import unknownFileSvg from "../assets/file-unknown.svg";
import { TFile, actionTypes } from "../types";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Button, Typography, MenuList, MenuItem } from "@mui/material";
import { THEMES } from '../../../utills/constatnts/general';
import { Paper } from "@mui/material";
import { Theme, makeStyles } from "@material-ui/core";
import { useTheme } from '@material-ui/core';
import CreateScript from "./popups/CreateScript";
import AddIcon from '@mui/icons-material/Add';
import { generateUUID } from "../../../utills/functions";
import themes from "../../../utills/styles/theme";

enum ext {
    javascript = '.js',
    python = '.py'
}

const drawerWidth = 240;

export interface FileListProps {
    isEditable: boolean;
    scriptList: TFile[];
    currentFile: TFile | undefined;
    updateCurrentFile: (file: TFile) => void;
    deleteScript: (id: string) => void;
    extTypes: string[];
    templateScripts: { ext: string, script: string }[];
    updateScript: (file: TFile, actionType: string) => void;
    fileOpen: boolean;
    deployUpdatedScript?: (script: TFile) => void;
    resetScript?: (script: TFile) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    tabDrawer: {
        '& .MuiDrawer-paper': {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.background.default
        }
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
        color: theme.palette.text.primary,
        padding: '0.25rem'
    },
}));

const FileList: FC<FileListProps> = ({
    isEditable,
    scriptList,
    currentFile,
    updateCurrentFile,
    extTypes,
    templateScripts,
    updateScript,
    fileOpen,
    deployUpdatedScript,
    resetScript
}) => {

    const [lightMode, setLightMode] = useState<boolean>();
    const classes = useStyles();
    const theme = useTheme<Theme>();
    const [createNewDialog, setCreateNewDialog] = useState<boolean>(false);
    const [contextMenu, setShowContextMenu] = useState<{ visible: boolean, x: number, y: number, editable: boolean, custom: boolean, file: TFile | undefined }>({ visible: false, x: 0, y: 0, editable: false, custom: false, file: undefined });
    const [uploadFile, setUploadFile] = useState<TFile | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    const drawOpened = true;

    useEffect(() => {
        theme.palette.type === THEMES.LIGHT ? setLightMode(true) : setLightMode(false);
    }, [theme]);

    /**
     * Dispatch selected File to File Editor
     * @param file TFile
     */
    const handleSelectFile = async (file: TFile) => {
        updateCurrentFile(file);
    }

    const handleCreateNew = () => {
        setCreateNewDialog(true);
    }

    // Handle Confirm for New Script
    const handleOnConfirm = (filename: string, ext: string) => {
        const findScript = templateScripts.find((x) => x.ext === ext);
        const fileIds = scriptList.map(script => script.id);
        const newFileId = generateUUID(4, fileIds);
        const newFile: TFile = {
            id: newFileId,
            name: filename,
            ext: ext,
            script: findScript ? findScript.script : ''
        }
        updateScript(newFile, actionTypes.new);
        setCreateNewDialog(false);
        updateCurrentFile(newFile);
    }

    const handleContextMenu = (mouseX: number, mouseY: number, file: TFile) => {
        setShowContextMenu({ visible: true, x: mouseX, y: mouseY, editable: file.editable ?? false, custom: file.custom ?? false, file: file });
        window.addEventListener('click', clearContextMenu);
    }

    const clearContextMenu = () => {
        setShowContextMenu({ visible: false, x: 0, y: 0, editable: false, custom: false, file: undefined });
        window.removeEventListener('click', clearContextMenu);
    }

    const downloadFile = async (file: TFile) => {
        const fileName = file.name;
        const blob = new Blob([file.script], { type: 'application/' + file.ext });
        const href = URL.createObjectURL(blob);

        //create anchor/click
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + file.ext;
        document.body.appendChild(link);
        link.click();

        //clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }

    const filesAdded = async (event: ChangeEvent<HTMLInputElement>) => {

        setUploadFile(undefined);

        if (!event.target.files || event.target.files.length <= 0 || uploadFile === undefined) {
            return;
        }
        deployUpdatedScript && deployUpdatedScript({ ...uploadFile, script: await event.target.files[0].text() });
    };

    return (
        <>
            <input
                style={{ display: 'none' }}
                ref={inputRef}
                id="upload"
                type="file"
                accept={uploadFile?.ext ?? '.py,js'}
                onChange={(e) => filesAdded(e)}
            />
            {contextMenu.visible &&

                <Paper style={{ position: "fixed", left: contextMenu.x, top: contextMenu.y, zIndex: "10000" }}>
                    <MenuList>
                        <MenuItem onClick={() => {
                            contextMenu.file && downloadFile(contextMenu.file);
                        }}>
                            <Typography variant="body2" className={classes.labelText}>Download</Typography>
                        </MenuItem>
                        {contextMenu.editable && !contextMenu.custom &&
                            <MenuItem
                                onClick={(e) => {
                                    contextMenu.file && setUploadFile(contextMenu.file);
                                    inputRef && inputRef.current && inputRef.current.click();
                                }}>
                                <Typography variant="body2" className={classes.labelText}>Upload Custom Script</Typography>
                            </MenuItem>
                        }
                        {contextMenu.editable && contextMenu.custom &&
                            <MenuItem
                                onClick={() => {
                                    contextMenu.file && resetScript && resetScript(contextMenu.file);
                                }}>
                                <Typography variant="body2" className={classes.labelText}>Revert to Default Script</Typography>
                            </MenuItem>
                        }
                    </MenuList>
                </Paper >
            }
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        position: 'relative',
                        '& >div': {
                            minHeight: '47px'
                        },
                    }
                }}
                variant="permanent"
                anchor="left"
                open={drawOpened}
                className={classes.tabDrawer}
            >
                <List sx={{
                    padding: '12px 12px',
                    overflowY: 'scroll',
                    maxHeight: '650px',
                    '&::-webkit-scrollbar': {
                        width: '0.4em'
                    },
                    '&::-webkit-scrollbar-track': {
                        boxShadow: theme.palette.background.paper,
                        webkitBoxShadow: theme.palette.background.paper
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.grey[400],
                        borderRadius: '5px'
                    }
                }}>
                    {scriptList?.map((file: TFile) => (
                        <ListItem key={file.name}
                            className={file?.id === currentFile?.id && fileOpen ? "active" : ""}
                            onClick={() => handleSelectFile(file)}
                            disablePadding
                            sx={{
                                padding: '6px 12px',
                                borderRadius: '5px',
                                color: themes.light.palette?.text?.primary,
                                '&.active': lightMode
                                    ? { backgroundColor: '#EEE !important', color: '#000 !important' }
                                    : { backgroundColor: '#333 !important' },
                                '&:hover': lightMode
                                    ? { backgroundColor: '#EEE !important', color: '#000 !important' }
                                    : { backgroundColor: '#333 !important' }
                            }}
                            onContextMenu={(event) => {
                                event.preventDefault();
                                handleContextMenu(event.clientX, event.clientY, file);
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    padding: '6px 0px 6px 10px'
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: '30px' }}>
                                    {file.ext === ext.javascript && <img alt="js-icon" src={jsFileSvg} style={{ width: '16px' }} />}
                                    {file.ext === ext.python && <img alt="pyhon-icon" src={pythonFileSvg} style={{ width: '16px' }} />}
                                    {file.ext !== ext.javascript && file.ext !== ext.python && <img alt="unknown-icon" src={unknownFileSvg} style={{ width: '16px' }} />}
                                </ListItemIcon>
                                <Tooltip title={`${file.name}${file.custom ? ' (* Custom Scipt)' : ''}`} placement="bottom">
                                    <ListItemText primary={`${file.custom ? '* ' : ''}${file.name}${file.ext}`}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontSize: '.8rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }
                                        }} />
                                </Tooltip>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                {isEditable &&
                    <Button variant="text"
                        startIcon={<AddIcon />}
                        onClick={handleCreateNew}
                        color="inherit"
                        style={{ position: 'absolute', bottom: 0, width: '100%', padding: '10px' }}
                    >Create New
                    </Button>
                }
            </Drawer>

            <CreateScript
                open={createNewDialog}
                extOptions={extTypes}
                onConfirm={handleOnConfirm}
                closeDialog={() => setCreateNewDialog(false)}
            />
        </>
    )
}

export default FileList;