import jsonata from "jsonata";
import { CalculatedLosses, ParamGroup } from "../../../components/link-budget/types/LinkBudgetTypes";

export default class JSONataService {

    // @ts-expect-error because the library does not have the correct types for this feature
    expression: jsonata.Expression;

    async getExpression(exp: string, externalSource: ParamGroup, lossHolder: LossHolderFunctions) {
        this.expression = jsonata(exp);

        // Register Math Functions
        this.expression.registerFunction('percent', this.percent);
        this.expression.registerFunction('log', this.baseLog);


        //Retrieve external values and register with functions
        this.expression.registerFunction('getNthDataRate', (transNum: number) => this.getNthDataRate(externalSource, transNum));
        this.expression.registerFunction('getModulation', (transNum: number) => this.getModulation(externalSource, transNum));

        //Old cosmos data rate, if user then user, otherwise get hop
        this.expression.registerFunction('getDataRate', (fallbackTransnum: number) => this.getDataRate(externalSource, fallbackTransnum));

        this.expression.registerFunction('getBandwidth', (transNum: number) => this.getBandwith(externalSource, transNum));

        this.expression.registerFunction('getCodingRate', (transNum: number) => this.getCodingRate(externalSource, transNum));
        this.expression.registerFunction('getFrequency', (transNum: number) => this.getFrequency(externalSource, transNum));

        this.expression.registerFunction('getSlantRange', (transNum: number, altitude: number) => this.getSlantRange(externalSource, transNum, altitude));
        this.expression.registerFunction('getPolarizationLoss', (transNum: number) => this.getPolarizationLoss(externalSource, transNum));
        this.expression.registerFunction('getAtmosphericLoss', (transNum: number) => lossHolder.atmosphericLoss(transNum));
        this.expression.registerFunction('getCloudLoss', (transNum: number) => lossHolder.cloudAttenuation(transNum));
        this.expression.registerFunction('getRainLoss', (transNum: number) => lossHolder.rainAttenuation(transNum));
        this.expression.registerFunction('getScintillationLoss', (transNum: number) => lossHolder.scintillationLoss(transNum));
        this.expression.registerFunction('getTotalPropagationLoss', (transNum: number) => lossHolder.totalPropagationLoss(transNum));
        this.expression.registerFunction('getPointingLoss', (transNum: number) => this.getPointingLoss(externalSource, transNum));
        this.expression.registerFunction('getImplementationLoss', (transNum: number) => this.getImplementationLoss(externalSource, transNum));
        this.expression.registerFunction('getOtherLoss', (transNum: number) => this.getOtherLoss(externalSource, transNum));
        this.expression.registerFunction('getGT', (transNum: number) => this.getGT(externalSource, transNum));
        this.expression.registerFunction('getEbNo', (transNum: number) => this.getEbNo(externalSource, transNum));
        this.expression.registerFunction('getEIRP', (transNum: number) => this.getEIRP(externalSource, transNum));
        this.expression.registerFunction('getSystemNoiseTemp', (transNum: number) => this.getSystemNoiseTemp(externalSource, transNum));
        this.expression.registerFunction('getGain', (transNum: number) => this.getGain(externalSource, transNum));
        this.expression.registerFunction('getCI', (transNum: number) => this.getCI(externalSource, transNum));
        this.expression.registerFunction('getReqPerformanceMargin', () => this.getReqPerformanceMargin(externalSource));

        this.expression.assign('userDataRate', this.getUserDataRate(externalSource));
        this.expression.assign('userFrequencyBand', this.getUserFrequencyBand(externalSource));
        this.expression.assign('usatEIRP', this.getUsatEIRP(externalSource));
        this.expression.assign('userCodingType', this.getCodingType(externalSource));
        this.expression.assign('userInclination', this.getUsatInclination(externalSource));
        this.expression.assign('userEccentricity', this.getUsatEccentricity(externalSource));
        this.expression.assign('userGain', this.getUserGain(externalSource));
        this.expression.assign('userGT', this.getUserGT(externalSource));
        this.expression.assign('userSystemNoiseTemp', this.getUserSysNoiseTemp(externalSource));
        return this.expression;
    }

    //Math Functions
    percent(n: number) {
        return n / 100;
    }

    baseLog(x: number, y: number) {
        return Math.log(y) / Math.log(x);
    }
    // log(1/(1/(10^(1/10))+(1/(10^(1/10)))))
    // cOverN0atUsat(cOverNrelay: number, cOverNusat: number) {
    //     // return 10 * Math.log(
    //     //     Math.pow(Math.pow(10,-(cOverNrelay/10)) + Math.pow(10, -(cOverNusat/10)), -1)
    //     // )
    //     return 10 * =$cOverN0atUsat(1,2);
    // }

    //External Data Retrieval Functions
    getUserFrequencyBand(externalVals: ParamGroup) {
        return externalVals.userCommsSpecs.freqBand;
    }

    getUserDataRate(externalVals: ParamGroup) {
        return externalVals.userCommsSpecs.dataRateKbps;
    }

    getUsatInclination(externalVals: ParamGroup) {
        return externalVals.usat.inclination;
    }

    getUsatEccentricity(externalVals: ParamGroup) {
        return externalVals.usat.eccentricity;
    }

    getSystemNoiseTemp(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR';
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        // @ts-expect-error because the library does not have the correct types for this feature legacy
        return externalVals.service.getNthTransceiver(index).antenna?.RxSystemNoiseTemp ?? 0;
    }

    getUserGain(externalVals: ParamGroup) {
        return externalVals.userCommsSpecs.commsPayloadSpecs.gain;
    }

    getUserGT(externalVals: ParamGroup) {
        return externalVals.userCommsSpecs.commsPayloadSpecs.gt;
    }

    getUserSysNoiseTemp(externalVals: ParamGroup) {
        return externalVals.userCommsSpecs.commsPayloadSpecs.sysNoise;
    }

    getCI(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR';
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        return externalVals.service.getNthTransceiver(index).rffrontend?.rf_ci ?? 0;
    }

    getGain(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR';
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        return externalVals.service.getNthTransceiver(index).rffrontend?.antennaGain ?? 0;
    }

    getEIRP(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR';
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        return externalVals.service.getNthTransceiver(index).rffrontend?.EIRP ?? 0;
    }

    getDataRate(externalVals: ParamGroup, fallbackTransnum: number) {
        if (fallbackTransnum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = fallbackTransnum > 0 ? fallbackTransnum - 1 : 0;

        return externalVals.userCommsSpecs.useUserDataRate ? externalVals.userCommsSpecs.dataRateKbps : externalVals.service.getNthTransceiver(index)?.moddemod?.maxDataRate ?? 0;
    }

    getBandwith(externalVals: ParamGroup, transNum: number): any {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR';
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        return externalVals.service.getNthTransceiver(index).rffrontend?.bandwidth ?? 0;
    }


    getNthDataRate(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        return externalVals.service.getNthTransceiver(index).moddemod?.maxDataRate ?? 0;
    }
    getModulation(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;
        const modId = Number(Number(externalVals.userCommsSpecs.commsPayloadSpecs.modulation) !== -1 ?
            externalVals.userCommsSpecs.commsPayloadSpecs.modulation
            : externalVals.service.getNthTransceiver(index).moddemod?.modulationType?.split(",")[0])

        return externalVals.functions.modulationNameFromId(modId);
    }
    getCodingType(externalVals: ParamGroup) {
        const codingId = Number(Number(externalVals.userCommsSpecs.commsPayloadSpecs.codingType) !== -1 ?
            externalVals.userCommsSpecs.commsPayloadSpecs.codingType
            : externalVals.userCommsSpecs.commsPayloadSpecs.codingType ?? 0)
        return externalVals.functions.codingTypeNameFromId(codingId);
    }
    getCodingRate(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;
        const codingId = Number(Number(externalVals.userCommsSpecs.commsPayloadSpecs.coding) !== -1 ?
            externalVals.userCommsSpecs.commsPayloadSpecs.coding
            : externalVals.service.getNthTransceiver(index).moddemod?.channelCodingType?.split(",")[0])

        return externalVals.functions.codingRateNameFromId(codingId);
    }
    getFrequency(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        return externalVals.service.getNthTransceiver(index).rffrontend?.centerFrequency ?? 0;
    }
    getUsatEIRP(externalVals: ParamGroup) {
        return externalVals.userCommsSpecs.commsPayloadSpecs.eirp ?? 0;
    }
    getSlantRange(externalVals: ParamGroup, transNum: number, altitude: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        const t = externalVals.service.getNthTransceiver(index);
        const minElevAngle = externalVals.functions.elevationAngleFromFrequency(t.rffrontend?.centerFrequency ?? 0);

        // @ts-expect-error because the library does not have the correct types for this feature
        return externalVals.functions.computeSlant(minElevAngle, altitude);
    }
    getPolarizationLoss(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        const uPL = externalVals.userCommsSpecs.commsPayloadSpecs.polarizationLoss;

        return uPL > 0 ? uPL : externalVals.service.getNthTransceiver(index).antenna?.polarizationLosses ?? 0;
    }
    getPointingLoss(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        const uPL = externalVals.userCommsSpecs.commsPayloadSpecs.pointingLoss;

        return uPL > 0 ? uPL : externalVals.service.getNthTransceiver(index).rffrontend?.pointingLoss ?? 0;
    }

    getImplementationLoss(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        return externalVals.service.getNthTransceiver(index).moddemod?.implementationLoss ?? 0;
    }
    getOtherLoss(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        const OL /* ... */ = externalVals.userCommsSpecs.commsPayloadSpecs.otherLoss;

        return OL > 0 ? OL : externalVals.service.getNthTransceiver(index).rffrontend?.otherLosses ?? 0;
    }
    getGT(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        const index = transNum > 0 ? transNum - 1 : 0;

        return externalVals.service.getNthTransceiver(index).rffrontend?.antennaGT;
    }

    async getEbNo(externalVals: ParamGroup, transNum: number) {
        if (transNum > externalVals.service.getLength()) {
            return 'ERROR'
        }
        if (externalVals.userCommsSpecs.commsPayloadSpecs.modulation > 0 && externalVals.userCommsSpecs.commsPayloadSpecs.coding > 0) {
            const ebno = await externalVals.functions.getEbNo(externalVals.userCommsSpecs.commsPayloadSpecs.codingType, externalVals.userCommsSpecs.commsPayloadSpecs.modulation, externalVals.userCommsSpecs.commsPayloadSpecs.coding);
            // @ts-expect-error because the library does not have the correct types for this feature 
            if (!isNaN(ebno) && ebno) {
                return ebno;
            } else {
                return await this.getFirstEbNo(externalVals, transNum);
            }
        } else {
            return await this.getFirstEbNo(externalVals, transNum);
        }
    }

    async getFirstEbNo(externalVals: ParamGroup, transNum: number) {
        const index = transNum > 0 ? transNum - 1 : 0;
        const t = externalVals.service.getNthTransceiver(index);
        const rate = (t.moddemod?.channelCodingType?.split(",") ?? [])[0];
        const mod = (t.moddemod?.modulationType?.split(",") ?? [])[0];
        console.log('Coding Type: ', externalVals?.userCommsSpecs?.commsPayloadSpecs?.codingType ?? 'NOTFOUND');
        const codtype = externalVals?.userCommsSpecs?.commsPayloadSpecs?.codingType ?? 1;
        if (rate == null || mod == null || codtype == null)
            return 0;
        else
            return await externalVals.functions.getEbNo(codtype, Number(mod), Number(rate));
    }

    async getReqPerformanceMargin(externalVals: ParamGroup) {
        return await externalVals.functions.getReqPerformanceMargin();
    }


}
//Create a function which has a central hop map. The map holds all losses for each hop.
//This allows us to call getLosses only once per hop rather than 4 times per hop.

export function createLossHolder(extSource: ParamGroup): LossHolderFunctions {
    const hopMap = new Map<number, CalculatedLosses>();

    const getLossForHop = async (n: number): Promise<CalculatedLosses | null> => {
        const t = extSource.service.getNthTransceiver(n);

        if (t == null) return null;

        const freq = t.rffrontend?.centerFrequency;
        const minElev = extSource.functions.elevationAngleFromFrequency(freq ?? 0);
        const diameterM = t.antenna.antennaSize;

        if (freq == null || minElev == null || diameterM == null) return null;

        const L = await extSource.functions.getLosses(freq, minElev, diameterM);

        if (L == null) return null;

        hopMap.set(n, L);
        return L;
    }

    //
    let apiFlag = false;
    // @ts-expect-error because the library does not have the correct types for this feature
    let apiPromise = null;

    return {
        // @ts-expect-error because the library does not have the correct types for this feature
        atmosphericLoss: async (transNum: number) => {
            transNum = transNum > 0 ? transNum - 1 : transNum;
            if (hopMap.has(transNum) || apiFlag) {
                // @ts-expect-error because the library does not have the correct types for this feature
                if (apiPromise != null)
                    // @ts-expect-error because the library does not have the correct types for this feature
                    await apiPromise;
                // @ts-expect-error because the library does not have the correct types for this feature
                return hopMap.get(transNum).atmosphericLoss;
            } else {
                apiFlag = true;
                apiPromise = getLossForHop(transNum);
                const promiseVal = await apiPromise;
                apiFlag = false;
                apiPromise = null;
                return promiseVal?.atmosphericLoss;
            }
        },
        // @ts-expect-error because the library does not have the correct types for this feature
        rainAttenuation: async (transNum: number) => {
            transNum = transNum > 0 ? transNum - 1 : transNum;
            if (hopMap.has(transNum) || apiFlag) {
                // @ts-expect-error because the library does not have the correct types for this feature
                if (apiPromise != null)
                    // @ts-expect-error because the library does not have the correct types for this feature
                    await apiPromise;
                // @ts-expect-error because the library does not have the correct types for this feature
                return hopMap.get(transNum).rainAttenuation;
            } else {
                apiFlag = true;
                apiPromise = getLossForHop(transNum);
                const promiseVal = await apiPromise;
                apiFlag = false;
                apiPromise = null;
                return promiseVal?.rainAttenuation;
            }
        },
        // @ts-expect-error because the library does not have the correct types for this feature
        cloudAttenuation: async (transNum: number) => {
            transNum = transNum > 0 ? transNum - 1 : transNum;
            if (hopMap.has(transNum) || apiFlag) {
                // @ts-expect-error because the library does not have the correct types for this feature
                if (apiPromise != null) // @ts-expect-error because the library does not have the correct types for this feature
                    await apiPromise; // @ts-expect-error because the library does not have the correct types for this feature
                return hopMap.get(transNum).cloudAttenuation;
            } else {
                apiFlag = true;
                apiPromise = getLossForHop(transNum);
                const promiseVal = await apiPromise;
                apiFlag = false;
                apiPromise = null;
                return promiseVal?.cloudAttenuation;
            }
        }, // @ts-expect-error because the library does not have the correct types for this feature
        scintillationLoss: async (transNum: number) => {
            transNum = transNum > 0 ? transNum - 1 : transNum;
            if (hopMap.has(transNum) || apiFlag) { // @ts-expect-error because the library does not have the correct types for this feature
                if (apiPromise != null) // @ts-expect-error because the library does not have the correct types for this feature
                    await apiPromise; // @ts-expect-error because the library does not have the correct types for this feature
                return hopMap.get(transNum).scintillationLoss;
            } else {
                apiFlag = true;
                apiPromise = getLossForHop(transNum);
                const promiseVal = await apiPromise;
                apiFlag = false;
                apiPromise = null;
                return promiseVal?.scintillationLoss;
            }
        }, // @ts-expect-error because the library does not have the correct types for this feature
        totalPropagationLoss: async (transNum: number) => {
            transNum = transNum > 0 ? transNum - 1 : transNum;
            if (hopMap.has(transNum) || apiFlag) { // @ts-expect-error because the library does not have the correct types for this feature
                if (apiPromise != null) // @ts-expect-error because the library does not have the correct types for this feature
                    await apiPromise;
                return hopMap.get(transNum)?.totalPropagationLoss;
            } else {
                apiFlag = true;
                apiPromise = getLossForHop(transNum);
                const promiseVal = await apiPromise;
                apiFlag = false;
                apiPromise = null;
                return promiseVal?.totalPropagationLoss;
            }
        }
    }
}

type LossFunction = (transNum: number) => Promise<number | null>;
export type LossHolderFunctions = {
    atmosphericLoss: LossFunction,
    rainAttenuation: LossFunction,
    cloudAttenuation: LossFunction,
    scintillationLoss: LossFunction,
    totalPropagationLoss: LossFunction
};