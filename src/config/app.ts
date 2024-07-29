export const codeFont = 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace';

export const locations = [
    {
        id: 'westus1',
        name: 'West US 1'
    },
    {
        id: 'westus2',
        name: 'West US 2'
    },
    {
        id: 'eastus1',
        name: 'East US 1'
    },
    {
        id: 'eastus2',
        name: 'East US 2'
    }
];

export const regions = [
    {
        id: 'us-east-1',
        name: 'US East (N. Virginia)'
    },
    {
        id: 'us-east-2',
        name: 'US East (Ohio)'
    },
    {
        id: 'us-west-1',
        name: 'US West (N. California)'
    },
    {
        id: 'us-west-2',
        name: 'US West (Oregon)'
    },
    {
        id: 'eu-north-1',
        name: 'Europe (Stockholm)'
    }
];

export const noradIds = [
    {
        id: 54234,
        name: 'NOAA-21 (JPSS-2)',
    },
    {
        id: 43013,
        name: 'NOAA 20 (JPSS 1)'
    },
    {
        id: 27424,
        name: 'AQUA'
    },
    {
        id: 29108,
        name: 'CALIPSO'
    },
    {
        id: 41240,
        name: 'JASON 3'
    },
    {
        id: 37849,
        name: 'SUOMI NPP'
    },
    {
        id: 25994,
        name: 'TERRA'
    }
];

export const awsDownlinkDecode = {
    "edges": [
        {
            "from": "I-A",
            "to": "I-B"
        },
        {
            "from": "Q-A",
            "to": "Q-B"
        },
        {
            "from": "I-B",
            "to": "C"
        },
        {
            "from": "Q-B",
            "to": "C"
        },
        {
            "from": "C",
            "to": "G"
        }
    ],
    "nodeConfigs": {
        "I-A": {
            "type": "CODED_SYMBOLS_INGRESS",
            "codedSymbolsIngress": {
                "source": "I"
            }
        },
        "Q-A": {
            "type": "CODED_SYMBOLS_INGRESS",
            "codedSymbolsIngress": {
                "source": "Q"
            }
        },
        "I-B": {
            "type": "NRZ_M_DECODER"
        },
        "Q-B": {
            "type": "NRZ_M_DECODER"
        },
        "C": {
            "type": "IQ_RECOMBINER"
        },
        "G": {
            "type": "UNCODED_FRAMES_EGRESS"
        }
    }
};

export const awsDownlinkDemode = {
    "type": "OQPSK",
    "oqpsk": {
        "carrierFrequencyRecovery": {
            "centerFrequency": {
                "value": 8160,
                "units": "MHz"
            },
            "range": {
                "value": 250,
                "units": "kHz"
            }
        },
        "symbolTimingRecovery": {
            "symbolRate": {
                "value": 7.5,
                "units": "Msps"
            },
            "range": {
                "value": 0.75,
                "units": "ksps"
            },
            "matchedFilter": {
                "type": "ROOT_RAISED_COSINE",
                "rolloffFactor": 0.5
            }
        }
    }
};

export const setupSteps = [
    'Select Service', 
    'Register', 
    'Create Resources', 
    'Verify account'
];

export const serviceProviders = [
    {
        label: 'AWS Ground Station',
        key: 'aws',
        accountUrl: 'https://console.aws.amazon.com/'
    },
    {
        label: 'Azure Orbital',
        key: 'azure',
        accountUrl: 'https://portal.azure.com/'
    }
];
