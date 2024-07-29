import axios from '../../config/axios';
import { CalculatedLosses, IDataResponse, IDatasetNames } from '../../components/link-budget/types/LinkBudgetTypes';
import { NetworklibApi } from './api-networklib';

export interface AttrValue {
    id: number;
    name: string;
    disabled: boolean;
}

async function getEbNo(codingType: number, modulationId: number, codingRateId: number): Promise<{ value: number, error?: string }> {
    try {
        const ebno = { data: { value: 4.2 } };//await axios.get<{ value: number }>('/getEbNo', {
        //     params: {
        //         codingType: codingType,
        //         modulationId: modulationId,
        //         codingRateId: codingRateId
        //     }
        // });
        if (ebno == null)
            return {
                value: -1,
                error: `No response from server.`
            };
        else if (ebno.data == null)
            return {
                value: -1,
                error: `No data from ebno request response.`
            };
        else if (ebno.data.value == null)
            return {
                value: -1,
                error: `No value found from ebno response.`
            };
        else
            return {
                value: ebno.data.value
            };
    } catch (err: any) {
        const msg = `Failed to get ebno for codType, modId, codRateId, ${[codingType, modulationId, codingRateId].join()}: ${err.toString()}`;
        console.error(msg);
        return { value: -1, error: msg };
    }
}

async function getLosses(latitude_deg: number, longitude_deg: number, height_km: number, frequency_GHz: number, elevation_deg: number, unavailability: number, polarization_deg: number, efficiency: number, diameter_m: number): Promise<{ losses: CalculatedLosses | null, error?: string }> {
    try {
        const losses = {
            data: {
                atmosphericLoss: 0.28,
                rainAttenuation: 0.0008,
                cloudAttenuation: 0.03,
                scintillationLoss: 0.59,
                totalPropagationLoss: 0.88
            }
        }
        //await axios.get<{ atmosphericLoss: number, rainAttenuation: number, cloudAttenuation: number, scintillationLoss: number, totalPropagationLoss: number }>('/getPropagationLosses', {
        //     params: {
        //         latitude_deg,
        //         longitude_deg,
        //         height_km,
        //         frequency_GHz,
        //         elevation_deg,
        //         unavailability,
        //         polarization_deg,
        //         efficiency,
        //         diameter_m
        //     }
        // });
        if (losses == null)
            return {
                losses: null,
                error: `No response from server.`
            };
        else if (losses.data == null)
            return {
                losses: null,
                error: `No data from losses request response.`
            };
        else
            return {
                losses: losses.data
            };
    } catch (err: any) {
        const msg = `Failed to get losses for input ${[latitude_deg, longitude_deg, height_km, frequency_GHz, elevation_deg, unavailability, polarization_deg, efficiency, diameter_m].join()}: ${err.toString()}`;
        console.error(msg);
        return { losses: null, error: msg };
    }
}

async function setTemplateForService(serviceId: number, templateId: number): Promise<void> {

    await NetworklibApi.updateLinkBudget(serviceId, { linkBudgetTemplateId: templateId }, undefined);
}

async function getReqPerformanceMargin(email: string): Promise<number | null> {
    // const responseData = await axios.get('/getUserPreferences', {
    //     params: { email: email }
    // });
    // const linkMarginThreshold: number = responseData.data[0].linkMarginThreshold;
    return 3; //linkMarginThreshold;
}

async function getLinkBudgetDataById(templateId: number): Promise<IDataResponse | { error: string }> {
    const response = await axios.get('/getLinkBudgetDataById', {
        params: {
            id: templateId
        }
    });
    if (response.status === 200 && response.data) {
        return response.data;
    } else {
        console.warn(`Failed to get linkbudgetdata`);
        return { error: `No data` };
    }
}

async function retrieveLinkBudgetTemplates(): Promise<{ success: false, error: string } | { success: true, values: AttrValue[] }> {
    try {
        const serviceInfo: AttrValue[] = [
            {
                id: 13,
                name: "DTE Downlink",
                disabled: false
            },
            {
                id: 23,
                name: "Bent-Pipe Return",
                disabled: false
            },
            {
                id: 24,
                name: "Regenerative Transponder Return",
                disabled: false
            },
            {
                id: 48,
                name: "DTE Uplink",
                disabled: false
            },
            {
                id: 50,
                name: "Bent-Pipe Forward",
                disabled: false
            },
        ]//await (await axios.get<AttrValue[]>('/getLinkBudgetTemplates', {})).data;
        return { success: true, values: serviceInfo };
    } catch (err: any) {
        console.error(err, `Failed to get link budget templates`);
        return { success: false, error: err };
    }
}

async function getLinkBudgetDataByName(name: any): Promise<IDataResponse | { error: string }> {
    const response = await axios.get('/getLinkBudgetDataByName', {
        params: {
            name: name
        }
    });
    if (response.status === 200 && response.data) {
        return response.data;
    } else {
        console.warn(`Link Budget not found, retrieving default`);
        return { error: `No data` };
    }
}

async function getLinkBudgetData(): Promise<IDataResponse | { error: string }> {
    const response = await axios.get('/getLinkBudgetData', {});
    if (response.status === 200 && response.data) {
        return response.data;
    } else {
        console.warn(`Link Budget not found, retrieving default`);
        return { error: `No data` };
    }
}

async function getLinkBudgetNewData(): Promise<IDataResponse | { error: string }> {
    const response = await axios.get('/getLinkBudgetNewData', {});
    if (response.status === 200 && response.data) {
        return response.data;
    } else {
        console.warn(`Link Budget not found, retrieving default`);
        return { error: `No data` };
    }
}

async function getLinkBudgetDatasetNames(): Promise<IDatasetNames | { error: string }> {
    const response = await axios.get('/getLinkBudgetDatasetNames', {});
    if (response.status === 200 && response.data) {
        return response.data;
    } else {
        console.warn(`Link Budget not found, retrieving default`);
        return { error: `No data` };
    }
}

async function deleteLinkBudget(linkBudgetId: number): Promise<{ success: boolean, message: string }> {
    const response = await axios.post('/deleteLinkBudget', {
        id: linkBudgetId
    });

    if (response.status === 200 && response.data) {
        return {
            success: true,
            message: 'Success!'
        };
    } else {
        return {
            success: false,
            message: 'Failed!'
        };
    }
}

/**
 * Store Data
 * @param storeData 
 * @returns 
 */
async function storeLinkBudget(storeData: any): Promise<{ success: boolean, message: string }> {

    const postData = { ...storeData, id: storeData.id ?? -1 };

    try {
        const response = await axios.post('/storeLinkBudget', postData);

        if (response.status === 200 && response.data) {
            return {
                success: true,
                message: 'Success!'
            };
        } else {
            return {
                success: false,
                message: 'Failed!'
            };
        }
    } catch (err: any) {
        // Access the error message from the err object
        const errorMessage = err.message || 'An error occurred';
        return {
            success: false,
            message: errorMessage
        };
    }
}

export const LinkbudgetApi = {
    getEbNo,
    getLosses,
    setTemplateForService,
    getReqPerformanceMargin,
    getLinkBudgetData,
    getLinkBudgetDataById,
    getLinkBudgetDataByName,
    retrieveLinkBudgetTemplates,
    storeLinkBudget,
    getLinkBudgetNewData,
    getLinkBudgetDatasetNames,
    deleteLinkBudget
}