export enum actionTypes {
    new = 'NEW', update = 'UPDATE', delete = 'DELETE'
}

export type TFile = {
    id: string | number;
    name: string;
    ext: string;
    script: string;
    editable?: boolean;
    custom?: boolean;
    filePath?: string;
}

export type TTab = {
    id: string;
    name: string;
    ext: string;
}

export type TCode = {
    id: string, 
    name: string, 
    ext: string, 
    script: string,
    changed: boolean, 
}

export type TFiles = {
    files: TFile[]
}

export type FileState = {
    files: TFile[];
    openedFiles: TFile[];
    selectedFile: TFile | undefined;
}

export type ToolbarEvent = {
    save: boolean;
    saveAs: boolean;
    saveAll: boolean;
    copy: boolean;
    changed: boolean;
    drawOpend: boolean;
    darkMode: boolean;
}

export type TFileSaveRequest = {
    fileName: string;
    data: string;
}

export type TFileSaveResponse = {
    success: boolean;
}