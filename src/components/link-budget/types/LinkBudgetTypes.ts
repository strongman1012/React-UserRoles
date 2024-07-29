import { Service } from "../../../services/link-budget/Service";
import { AttrValue } from "../../../services/link-budget/api-linkbudget";

export interface ReferenceBodies {
    user: number;
    asset: number;
}

export interface LinkBudgetRow {
    id: string;
    key: string;
    group?: string;
    parameter: string;
    location: number;
    value: any;
    jsonata_exp?: string;
    user_exp?: string;
    noteId: string;
    notes: string;
}

export interface Row {
    id: string;
    group: string;
    name: string;
    title: string;
    value: number | string;
    jsonata_exp: string;
    user_exp: string;
    order: number;
    notes: string;
}

export interface Rows {
    items: Row[]
}

export interface IColWidth {
    collapse: string[];
    expanded: string[];
}

export interface IDataResponse {
    name: string;
    id: number;
    type: number;
    status: number;
    items: Row[];
    width: IColWidth
}

export interface IResultData {
    result: number;
}

export interface IStoreData {
    name: string;
    items: Row[];
    status?: number;
    width?: IColWidth
}

export interface IStoreDataResponse {
    statusText: string,
    data: IStoreData
}

export interface IStoreResult {
    success: boolean;
    message: string;
}

export interface IDeleteResult {
    success: boolean;
}

export interface DatasetName {
    id: number;
    name: string;
    updatedAt?: string;
}

export interface IDatasetNames {
    names: DatasetName[]
}

export type Mapping<A, B> = { (inVal: A): B | null };
export type CalculatedLosses = {
    atmosphericLoss: number,
    rainAttenuation: number,
    cloudAttenuation: number,
    scintillationLoss: number,
    totalPropagationLoss: number
};

export interface ParamGroup {
    name: string,
    usat: {
        altitude: number,
        inclination: number,
        eccentricity: number
    }
    userCommsSpecs: {
        useUserDataRate: boolean;
        dataRateKbps: number;
        freqBand: number;
        centerBand: number;
        txRx: { tx: boolean, rx: boolean };
        commsPayloadSpecs: {
            minEIRPFlag: boolean;
            gain: number;
            eirp: number;
            polarizationLoss: number;
            passiveLoss: number;
            pointingLoss: number;
            transmitterPower: number;
            otherLoss: number;
            modulation: number;
            coding: number;
            codingType: number;
            gainOn: boolean;
            gt?: number;
            sysNoise?: number;
        }
    },
    refBodies: ReferenceBodies,
    service: Service,
    functions: {
        getEbNo: (codingType: number, modId: number, codingRateId: number) => Promise<number | null>,
        getLosses: (frequency: number, minElevDeg: number, diameterM: number) => Promise<CalculatedLosses | null>,
        computeSlant: (minElevDeg: number, altitude: number) => number,
        modulationNameFromId: Mapping<number, string>,
        codingRateNameFromId: Mapping<number, string>,
        codingTypeNameFromId: Mapping<number, string>,
        elevationAngleFromFrequency: Mapping<number, number>,
        getReqPerformanceMargin: () => Promise<number | null>
    }
}

export interface LinkBudgetParams {
    source: ParamGroup | null,
    templateId: number,
    preRunResults?: LinkBudgetRow[],
    isEngineer: boolean,
    linkBudgetDatasetNames: DatasetName[],
    loadLinkBudgetDatasetNames: () => void,
    linkBudgetTemplates: AttrValue[],
    linkBudgetLoaded: boolean,
    saveLinkBudget: () => void,
    loadLinkBudget: () => void,
    themeName: string,
    onChangeTheme: (name: string) => void,
}

export enum menuItemPositions {
    above = 'above',
    below = 'below',
    delete = 'delete'
}

export enum messages {
    updated = 'Current dataset is Updated, please save before load new dataset.',
    saved = 'Successfully Saved.',
    startSymbol = 'Formula must start with equation'
}

export enum actions {
    new = 'new',
    edit = 'edit'
}
