import { ServiceDetails } from "../../../services/link-budget/types/networkLibrary";
import { CalculatedLosses, IDataResponse, IDatasetNames, ParamGroup } from "../types/LinkBudgetTypes";

export const sampleData: IDataResponse = {
    "id": 13,
    "name": "DTE Downlink",
    "type": 1,
    "status": 1,
    "width": {
        "expanded": [
            "5%",
            "10%",
            "10%",
            "17.614%",
            "11.594%",
            "16.945%",
            "160"
        ],
        "collapse": [
            "7.898%",
            "28.54%",
            "36.165%",
            "39.155%",
            "24.694%",
            "null",
            "223"
        ]
    },
    "items": [
        {
            "id": "8aee8d14-8434-4429-a83f-a7aee1167a02",
            "group": "1. Constants",
            "name": "bcon",
            "title": "Boltzmanns Constant",
            "value": -228.60000610351562,
            "jsonata_exp": "-228.6",
            "user_exp": "=-228.6",
            "order": 1,
            "notes": "Constant"
        },
        {
            "id": "866bf837-da81-4c00-b689-941ef663b67c",
            "group": "2. Mission Service Parameters",
            "name": "mod",
            "title": "Modulation",
            "value": 0,
            "jsonata_exp": "$getModulation(1)",
            "user_exp": "=$getModulation(1)",
            "order": 2,
            "notes": "User or Input"
        },
        {
            "id": "02de009f-89e7-475d-adf8-6aeebb83c4fc",
            "group": "2. Mission Service Parameters",
            "name": "ct",
            "title": "Coding Type",
            "value": 0,
            "jsonata_exp": "$userCodingType",
            "user_exp": "=$userCodingType",
            "order": 3,
            "notes": "User or Input"
        },
        {
            "id": "a500e8f4-38f8-42cd-ad70-b34b80d5dbee",
            "group": "2. Mission Service Parameters",
            "name": "cr",
            "title": "Coding Rate",
            "value": 0,
            "jsonata_exp": "$getCodingRate(1)",
            "user_exp": "=$getCodingRate(1)",
            "order": 4,
            "notes": "User or Input"
        },
        {
            "id": "28651e74-04bc-4267-b3dd-c74ccd5c747b",
            "group": "2. Mission Service Parameters",
            "name": "dr",
            "title": "Data Rate (kbps)",
            "value": 40000,
            "jsonata_exp": "$getDataRate(1)",
            "user_exp": "=$getDataRate(1)",
            "order": 5,
            "notes": "User or Input"
        },
        {
            "id": "efb699e4-fe9b-4317-a76d-bf330e0f4ebd",
            "group": "3. Space to Ground Link",
            "name": "sglF",
            "title": "SGL Frequency (MHz)",
            "value": 2245,
            "jsonata_exp": "$getFrequency(1)",
            "user_exp": "=$getFrequency(1)",
            "order": 6,
            "notes": "Input"
        },
        {
            "id": "fd654147-52ae-4aa2-a1f6-6fd269e38fb6",
            "group": "3. Space to Ground Link",
            "name": "uEIRP",
            "title": "User EIRP (dBW)",
            "value": 0,
            "jsonata_exp": "$usatEIRP",
            "user_exp": "=$usatEIRP",
            "order": 7,
            "notes": "User Input"
        },
        {
            "id": "aefb8336-ee5f-429b-8fb2-0b24d826f1e2",
            "group": "3. Space to Ground Link",
            "name": "dsat",
            "title": "Distance to sat (km)",
            "value": 1501.6053466796875,
            "jsonata_exp": "$getSlantRange(1,$userAltitude)",
            "user_exp": "=$getSlantRange(1,$userAltitude)",
            "order": 8,
            "notes": "Calculated"
        },
        {
            "id": "c41617aa-8c30-44c0-971f-a38223549493",
            "group": "3. Space to Ground Link",
            "name": "fsl",
            "title": "Free Space Loss (dB)",
            "value": 163.0054473876953,
            "jsonata_exp": "32.45+20*$log(10,items[name=\"sglF\"].value)+20*$log(10,items[name=\"dsat\"].value)",
            "user_exp": "=32.45+20*$log(10,sglF)+20*$log(10,dsat)",
            "order": 9,
            "notes": "Calculated"
        },
        {
            "id": "ea192a9d-e810-46f7-a4d0-658839c00558",
            "group": "3. Space to Ground Link",
            "name": "mL",
            "title": "Multipath Loss (dB)",
            "value": 0,
            "jsonata_exp": "",
            "user_exp": "=0",
            "order": 10,
            "notes": "Assumpiton"
        },
        {
            "id": "14be9b26-ed9e-49be-bf31-aacdbcd27b5f",
            "group": "3. Space to Ground Link",
            "name": "pL",
            "title": "Polarization Loss (dB)",
            "value": 0,
            "jsonata_exp": "$getPolarizationLoss(1)",
            "user_exp": "=$getPolarizationLoss(1)",
            "order": 11,
            "notes": "User Input or Assumption"
        },
        {
            "id": "90067400-c91d-41cc-bf36-f89dccae4be6",
            "group": "3. Space to Ground Link",
            "name": "atL",
            "title": "Atmospheric Loss (dB)",
            "value": 0.4267681837081909,
            "jsonata_exp": "$getAtmosphericLoss(1)",
            "user_exp": "=$getAtmosphericLoss(1)",
            "order": 12,
            "notes": "ITU-RP 676-10 Calculated for 99%"
        },
        {
            "id": "bb1aab46-a9bd-44cf-abee-983b0a77bfc9",
            "group": "3. Space to Ground Link",
            "name": "ptL",
            "title": "Pointing Loss (dB)",
            "value": 0,
            "jsonata_exp": "$getPointingLoss(1)",
            "user_exp": "=$getPointingLoss(1)",
            "order": 13,
            "notes": "User Input or Assumption"
        },
        {
            "id": "8dfa5d2b-5b3e-4bf6-9a96-35aae20df801",
            "group": "3. Space to Ground Link",
            "name": "oL",
            "title": "Other Losses (dB)",
            "value": 0,
            "jsonata_exp": "$getOtherLoss(1)",
            "user_exp": "=$getOtherLoss(1)",
            "order": 14,
            "notes": "User Input or Assumption"
        },
        {
            "id": "e5e4fbb1-781b-45b7-be92-343d7485de29",
            "group": "3. Space to Ground Link",
            "name": "cL",
            "title": "Cloud Loss (dB)",
            "value": 0.1121193915605545,
            "jsonata_exp": "$getCloudLoss(1)",
            "user_exp": "=$getCloudLoss(1)",
            "order": 15,
            "notes": "ITU-RP 676-10 Calculated for 99%"
        },
        {
            "id": "9f28b194-2e8e-4d8f-abe7-755b61090f54",
            "group": "3. Space to Ground Link",
            "name": "scL",
            "title": "Scintillation Loss (dB)",
            "value": 0.7839844226837158,
            "jsonata_exp": "$getScintillationLoss(1)",
            "user_exp": "=$getScintillationLoss(1)",
            "order": 16,
            "notes": "ITU-RP 676-10 Calculated for 99%"
        },
        {
            "id": "1a589683-345b-403e-b99d-20ae6e340092",
            "group": "3. Space to Ground Link",
            "name": "rL",
            "title": "Rain Loss (dB)",
            "value": 0.004866208415478468,
            "jsonata_exp": "$getRainLoss(1)",
            "user_exp": "=$getRainLoss(1)",
            "order": 17,
            "notes": "ITU-RP 676-10 Calculated for 99%"
        },
        {
            "id": "7d3a5542-6c35-4676-81d5-9d5aa989847b",
            "group": "3. Space to Ground Link",
            "name": "prec",
            "title": "Prec @ Ground",
            "value": -164.3331756591797,
            "jsonata_exp": "items[name=\"uEIRP\"].value-items[name=\"fsl\"].value-items[name=\"mL\"].value-items[name=\"pL\"].value-items[name=\"atL\"].value-items[name=\"cL\"].value-items[name=\"scL\"].value-items[name=\"rL\"].value-items[name=\"ptL\"].value-items[name=\"oL\"].value",
            "user_exp": "=uEIRP-fsl-mL-pL-atL-cL-scL-rL-ptL-oL",
            "order": 18,
            "notes": "6-8-9-10-11-12-13-14-15-16"
        },
        {
            "id": "54ecd724-6665-4fed-9b96-f08d92478d5c",
            "group": "3. Space to Ground Link",
            "name": "ggt",
            "title": "Gateway G/T (dB/K)",
            "value": 0,
            "jsonata_exp": "$getGT(1)",
            "user_exp": "=$getGT(1)",
            "order": 19,
            "notes": "Assumption"
        },
        {
            "id": "8868872b-dc2a-4726-bdc8-41e19863f7c8",
            "group": "3. Space to Ground Link",
            "name": "cno",
            "title": "C/No @ Ground (dB-Hz)",
            "value": 86.0771255493164,
            "jsonata_exp": "items[name=\"prec\"].value+items[name=\"ggt\"].value-items[name=\"bcon\"].value",
            "user_exp": "=prec+ggt-bcon",
            "order": 20,
            "notes": "17+18-1"
        },
        {
            "id": "f345c174-ddeb-4c2a-b4f7-725a3beb5ddf",
            "group": "4. Comms Link Performance",
            "name": "mdL",
            "title": "Modulation Loss (dB)",
            "value": 0,
            "jsonata_exp": "",
            "user_exp": "=0",
            "order": 21,
            "notes": "Assumpiton"
        },
        {
            "id": "8787f770-d0e8-48e4-931e-aa7b0a62115f",
            "group": "4. Comms Link Performance",
            "name": "drbps",
            "title": "Data Rate (dB-BPS)",
            "value": 49.95635223388672,
            "jsonata_exp": "10*$log(10,items[name=\"dr\"].value*100)",
            "user_exp": "=10*$log(10,dr*1000)",
            "order": 22,
            "notes": "Calculated"
        },
        {
            "id": "6669d347-2aaa-4ddf-86e5-039fa66fb369",
            "group": "4. Comms Link Performance",
            "name": "dedL",
            "title": "Differential Encoding/Decoding Loss (dB)",
            "value": 0,
            "jsonata_exp": "",
            "user_exp": "=0",
            "order": 23,
            "notes": "Not Considered"
        },
        {
            "id": "9ad79893-b901-4fd1-9240-c03c3be7dc1f",
            "group": "4. Comms Link Performance",
            "name": "uscL",
            "title": "User Constraint Loss (dB)",
            "value": 0,
            "jsonata_exp": "0",
            "user_exp": "=0",
            "order": 24,
            "notes": "Not Considered"
        },
        {
            "id": "60e62c42-e404-43d4-a438-5f7235c10eb5",
            "group": "4. Comms Link Performance",
            "name": "rcebno",
            "title": "Received Eb/No (dB)",
            "value": 36.12077331542969,
            "jsonata_exp": "items[name=\"cno\"].value-items[name=\"mdL\"].value-items[name=\"drbps\"].value-items[name=\"dedL\"].value-items[name=\"uscL\"].value",
            "user_exp": "=cno-mdL-drbps-dedL-uscL",
            "order": 25,
            "notes": "19-20-21-22-23"
        },
        {
            "id": "47846d1a-35b3-4118-8089-8156c39b01bb",
            "group": "4. Comms Link Performance",
            "name": "iL",
            "title": "Implementation Loss (dB)",
            "value": 0,
            "jsonata_exp": "$getImplementationLoss(1)",
            "user_exp": "=$getImplementationLoss(1)",
            "order": 26,
            "notes": "Database"
        },
        {
            "id": "7a955214-85af-47c0-82f3-c566d02ce561",
            "group": "4. Comms Link Performance",
            "name": "rqebno",
            "title": "Required Eb/No (dB)",
            "value": 4.199999809265137,
            "jsonata_exp": "$getEbNo(1)",
            "user_exp": "=$getEbNo(1)",
            "order": 27,
            "notes": "Database: BER 10^-5"
        },
        {
            "id": "9ff9b1cd-f02b-4958-9522-5457aef5a8e0",
            "group": "4. Comms Link Performance",
            "name": "rqpm",
            "title": "Required Performance Margin (dB)",
            "value": 0,
            "jsonata_exp": "$getReqPerformanceMargin()",
            "user_exp": "=$getReqPerformanceMargin()",
            "order": 28,
            "notes": "User or Input"
        },
        {
            "id": "1c260813-5c86-4aa3-a3c2-fdb8bb0a81af",
            "group": "4. Comms Link Performance",
            "name": "M",
            "title": "Margin (dB)",
            "value": 28.920772552490234,
            "jsonata_exp": "items[name=\"rcebno\"].value-items[name=\"iL\"].value-items[name=\"rqebno\"].value-items[name=\"rqpm\"].value",
            "user_exp": "=rcebno-iL-rqebno-rqpm",
            "order": 29,
            "notes": "24-25-26-27"
        }
    ]
};

export const sampleSource: ParamGroup = {
    name: "Oregon",
    usat: {
        altitude: 300,
        inclination: 30,
        eccentricity: 0
    },
    userCommsSpecs: {
        "useUserDataRate": false,
        "dataRateKbps": 1000,
        "freqBand": 0,
        "centerBand": 0,
        "txRx": {
            "tx": false,
            "rx": true
        },
        "commsPayloadSpecs": {
            "minEIRPFlag": false,
            "gain": 5,
            "eirp": 10,
            "polarizationLoss": 0,
            "pointingLoss": 0,
            "passiveLoss": 0,
            "transmitterPower": 1,
            "otherLoss": 0,
            "modulation": -1,
            "coding": -1,
            "codingType": 1,
            "gainOn": false,
            "gt": 0,
            "sysNoise": 290
        }
    },
    refBodies: {
        user: 1,
        asset: 1
    },
    service: {
        "link": {
            "id": 3743,
            "name": "OR1 S-Band Rx Service",
            "owner": 13,
            "networkId": undefined,
            "forward": false,
            "antennaId": 84,
            "platformId": 66,
            "linkBudgetTemplateId": 13,
            "color": undefined,
            "startOffset": 1,
            "endOffset": 2,
            "startingPlatform": {
                "id": 66,
                "isUser": false,
                "name": "Oregon",
                "name_notes": 25649,
                "platformType": 1,
                "platformType_notes": 25650,
                "referenceBody": 1,
                "referenceBody_notes": 25651,
                "latitude": 43.804100036621094,
                "longitude": -120.55419921875,
                "longitude_notes": 25653,
                "location": "United States (North America)",
                "location_notes": 25654,
                "siteAltitude": 1.4170000553131104,
                "siteAltitude_notes": 25655,
                "isActive": true,
                "version": 1,
                "modifiedOn": new Date('2023-12-06T15:35:01.530Z'),
                "modifiedBy": 1,
                "latitude_notes": 25652,
                "startOperationalYear": 2019,
                "startOperationalYear_notes": 25657,
                "stopOperationalYear": 2123,
                "stopOperationalYear_notes": 25658,
                "subSatelliteLong": 0,
                "subSatelliteLong_notes": 25659,
                "numSatellitesPerPlane": 0,
                "numSatellitesPerPlane_notes": 1,
                "halfConeAngle": 0,
                "halfConeAngle_notes": 25660,
                "numberOfShells": 0,
                "numberOfShells_notes": 25661,
                "altitudeOfShells": 30000,
                "altitudeOfShells_notes": 25662,
                "numberOfPlanesPerShell": 0,
                "numberOfPlanesPerShell_notes": 25663,
                "planeInclination": 0,
                "planeInclination_notes": 25664,
                "planeDistribution": 0,
                "planeDistribution_notes": 25665,
                "owner": null,
                "eccentricity": 0,
                "phaseDiff": false,
                "altitude": 300,
                "inclination": 0,
                "trueAnomaly": 0,
                "raan": 0,
                // "eccentricity_notes": 25666,
                // "phaseDiff_notes": 25667,
                "phaseOffset": 0,
                "phaseOffset_notes": 25672,
                // "altitude_notes": 25668,
                // "inclination_notes": 25669,
                // "trueAnomaly_notes": 25670,
                // "raan_notes": 25671,
                "argumentOfPerigee": 0,
                // "argumentOfPerigee_notes": 25673,
                "epoch": 'null',
                "epoch_notes": 1,
                "trajectoryFile": 'null',
                "trajectoryFile_notes": 1,
                "color": null,
                // "color_notes": null,
                "referenceFrame": 1,
                "referenceFrame_notes": null,
                // "regime": "1",
                // "regime_notes": null,
                "createdAt": new Date("2023-08-03T14:47:25.420Z"),
                "updatedAt": new Date("2023-12-06T15:35:00.643Z")
            },
            "segments": [
                {
                    "linkId": 3743,
                    "name": "OR1 S-Band Rx Service",
                    "owner": 13,
                    "segmentId": 13240,
                    "connectionId": 2030,
                    "linkPosition": 0,
                    "antennaId": 84,
                    "platformId": 66,
                    "isOrbital": false,
                    "isTx": false,
                    "parentAntennaId": 84,
                    "object": {
                        "id": 84,
                        "antennaSize": 5.400000095367432,
                        "antennaEfficiency": 1,
                        "RxSystemNoise": 1,
                        "polarizationType": 3,
                        "polarizationLosses": 4,
                        "platformId": 66,
                        "name": "OR1",
                        "owner": null,
                        "scanAgreement": false,
                        "fov": 90,
                        "isServiceAntenna": true
                    }
                },
                {
                    "linkId": 3743,
                    "name": "OR1 S-Band Rx Service",
                    "owner": 13,
                    "segmentId": 13240,
                    "connectionId": 2030,
                    "linkPosition": 0,
                    "antennaId": 84,
                    "platformId": 66,
                    "isOrbital": false,
                    "isTx": false,
                    "parentAntennaId": 84,
                    "object": {
                        "id": 161,
                        "startFrequency": 2200,
                        "stopFrequency": 2290,
                        "centerFrequency": 2245,
                        "otherLosses": 1,
                        "TxPower": 1,
                        "antennaId": 84,
                        "name": "S-Band",
                        "bandwidth": 90,
                        "antennaGain": 38,
                        "antennaGT": 16,
                        "pointingLoss": undefined,
                        "antennaBeamwidth": 1.899999976158142,
                        "EIRP": undefined,
                        "isTx": false,
                        "rf_ci": 1,
                        "owner": null
                    }
                },
                {
                    "linkId": 3743,
                    "name": "OR1 S-Band Rx Service",
                    "owner": 13,
                    "segmentId": 13241,
                    "connectionId": 1580,
                    "linkPosition": 1,
                    "antennaId": 84,
                    "platformId": 66,
                    "isOrbital": false,
                    "isTx": false,
                    "parentAntennaId": 84,
                    "object": {
                        "id": 137,
                        "modulationType": "4,5,7,20",
                        "suppCarrierDataRate": "1 Mbps - 5 Mbps",
                        "carrierDataFormat": "23",
                        "subcarrierFrequency": "N/A",
                        "subcarrierModulation": "",
                        "subcarrierDataRate": "N/A",
                        "subcarrierDataFormat": "",
                        "channelCodingType": "2,5,6,7,8,11",
                        "maxDataRate": 5000,
                        "implementationLoss": 3,
                        "RFFrontEndId": 161,
                        "name": "MOD1",
                        "vcmVdrSupport": undefined,
                        "std_compliance": 3,
                        "owner": null
                    }
                }
            ]
        },
        "transceivers": [
            {
                "antenna": {
                    "id": 84,
                    "antennaSize": 5.400000095367432,
                    "antennaEfficiency": 1,
                    "RxSystemNoise": 1,
                    "polarizationType": 3,
                    "polarizationLosses": 4,
                    "platformId": 66,
                    "name": "OR1",
                    "owner": null,
                    "scanAgreement": false,
                    "fov": 90,
                    "isServiceAntenna": true
                },
                "rffrontend": {
                    "id": 161,
                    "startFrequency": 2200,
                    "stopFrequency": 2290,
                    "centerFrequency": 2245,
                    "otherLosses": 1,
                    "TxPower": 1,
                    "antennaId": 84,
                    "name": "S-Band",
                    "bandwidth": 90,
                    "antennaGain": 38,
                    "antennaGT": 16,
                    "pointingLoss": undefined,
                    "antennaBeamwidth": 1.899999976158142,
                    "EIRP": undefined,
                    "isTx": false,
                    "rf_ci": 1
                },
                "moddemod": {
                    "id": 137,
                    "modulationType": "4,5,7,20",
                    "suppCarrierDataRate": "1 Mbps - 5 Mbps",
                    "carrierDataFormat": "23",
                    "subcarrierFrequency": "N/A",
                    "subcarrierModulation": "",
                    "subcarrierDataRate": "N/A",
                    "subcarrierDataFormat": "",
                    "channelCodingType": "2,5,6,7,8,11",
                    "maxDataRate": 5000,
                    "implementationLoss": 3,
                    "RFFrontEndId": 161,
                    "name": "MOD1",
                    "vcmVdrSupport": undefined,
                    "std_compliance": 3
                }
            }
        ],
        "id": 3743,
        getNthTransceiver(n: number) {
            return this.transceivers[n] ?? null;
        },
        getLength() {
            return this.transceivers.length;
        },
        getId() {
            return this.id;
        },
        getInfo(): ServiceDetails {
            return this.link;
        }
    },
    functions: {
        getEbNo: async (codingType: number, modId: number, codingRateId: number): Promise<number | null> => {
            return 4.2;
        },
        getLosses: async (frequency: number, minElevDeg: number, diameterM: number): Promise<CalculatedLosses | null> => {
            return {
                atmosphericLoss: 1,
                rainAttenuation: 2,
                cloudAttenuation: 3,
                scintillationLoss: 4,
                totalPropagationLoss: 5
            }
        },
        computeSlant: (minElevDeg: number, altitude: number): number => {
            return 5;
        },
        modulationNameFromId: () => {
            return 'BPSK';
        },
        codingRateNameFromId: () => {
            return 'Rate 1/2';
        },
        codingTypeNameFromId: () => {
            return 'Convolutional';
        },
        elevationAngleFromFrequency: () => {
            return 5;
        },
        getReqPerformanceMargin: async () => {
            return 2;
        }
    }
}

export const sampleDatasetNames: IDatasetNames = {
    "names": [
        {
            "id": 13,
            "name": "DTE Downlink",
            "updatedAt": "2024-03-14T17:32:49.180Z"
        },
        {
            "id": 23,
            "name": "Bent-Pipe Return",
            "updatedAt": "2023-05-17T17:59:03.793Z"
        },
        {
            "id": 24,
            "name": "Regenerative Transponder Return",
            "updatedAt": "2023-05-11T15:32:29.393Z"
        },
        {
            "id": 48,
            "name": "DTE Uplink",
            "updatedAt": "2023-05-11T14:40:36.660Z"
        },
        {
            "id": 50,
            "name": "Bent-Pipe Forward",
            "updatedAt": "2023-05-17T17:38:56.360Z"
        },
        {
            "id": 54,
            "name": "Regenerative Transponder Forward",
            "updatedAt": "2023-05-17T17:00:12.310Z"
        },
        {
            "id": 55,
            "name": "Regenerative Transponder Forward",
            "updatedAt": "2023-05-23T15:06:07.073Z"
        },
        {
            "id": 56,
            "name": "Regenerative Transponder Forward",
            "updatedAt": "2023-05-17T16:24:22.160Z"
        },
        {
            "id": 70,
            "name": "Test_Delete",
            "updatedAt": "2024-03-14T17:32:16.840Z"
        }
    ]
}