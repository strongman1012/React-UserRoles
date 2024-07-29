import axios from '../../config/axios';

function updateObject(url: string) {
    return async (objectId: number, attributes: { [key: string]: any } | null, notes?: { [key: string]: { references?: string, explanation?: string } }): Promise<void> => {
        try {
            await axios.post(url, {
                id: objectId,
                attr: attributes ?? {},
                notes: notes ?? {}
            });
        } catch (err: any) {
            console.error(err);
            throw err
        }
    }
}


const updatePlatform = updateObject('/updatePlatform');
const updateAntenna = updateObject('/updateAntenna');
const updateRFFrontEnd = updateObject('/updateRFFrontEnd');
const updateModDemod = updateObject('/updateModDemod');
const updateLinkBudget = updateObject('/updateLink');

export const NetworklibApi = {
    updatePlatform,
    updateAntenna,
    updateRFFrontEnd,
    updateModDemod,
    updateLinkBudget,
};