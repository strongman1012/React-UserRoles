export const MockcodingTypeOptions: any[] = [
	{
		disable: false,
		id: 1,
		name: 'Convolutional'
	},
	{
		disable: false,
		id: 2,
		name: 'Reed-Solomon'
	},
	{
		disable: false,
		id: 4,
		name: 'TurboCodes'
	},
	{
		disable: false,
		id: 5,
		name: 'LDPC'
	},
]
export const MockcodingRateOptions: any[] = [
	{
		disable: false,
		id: 1,
		name: 'Uncoded'
	},
	{
		disable: false,
		id: 2,
		name: 'Rate 1/2'
	},
	{
		disable: false,
		id: 3,
		name: 'Rate 5/6'
	},
]

export const MockmodulationOptions: any[] = [
	{
		disable: false,
		id: 4,
		name: 'BPSK'
	},
	{
		disable: false,
		id: 5,
		name: 'QPSK'
	},
	{
		disable: false,
		id: 7,
		name: 'UQPSK'
	}
]

export const MockebnoData = [
	{
		'EbNo_10E-5': '9.62',
		codeRate: '1/2',
		codingType: 'Convolutional',
		id: 2,
		modulation: 'BPSK'
	},
	{
		'EbNo_10E-5': 'NaN',
		codeRate: 'Uncoded',
		codingType: 'Convolutional',
		id: 3,
		modulation: 'QPSK'
	},
	{
		'EbNo_10E-5': '9.64',
		codeRate: 'Uncoded',
		codingType: 'Convolutional',
		id: 4,
		modulation: 'UQPSK'
	},
	{
		'EbNo_10E-5': '9.65',
		codeRate: '1/2',
		codingType: 'Convolutional',
		id: 5,
		modulation: 'BPSK'
	},
];

export const MockcodingRates = [
	{
		id: 1,
		name: 'Uncoded',
	},
	{
		id: 2,
		name: 'Rate 1/2',
	},
	{
		id: 3,
		name: 'Rate 5/6',
	},
];

export const Mockmodulations = [
	{
		Id: 4,
		Name: 'BPSK',
	},
	{
		Id: 5,
		Name: 'QPSK',
	},
	{
		Id: 7,
		Name: 'UQPSK',
	},
];

export interface RfAttributeData {
	codingTypeOptions: any[];
	codingRateOptions: any[];
	modulationOptions: any[];
	ebnoData: any[];
	codingRates: any[];
	modulations: any[];
}

export const MockRfAttributeData: RfAttributeData = {
	ebnoData: MockebnoData,
	modulations: Mockmodulations,
	codingRates: MockcodingRates,
	codingTypeOptions: MockcodingTypeOptions,
	codingRateOptions: MockcodingRateOptions,
	modulationOptions: MockmodulationOptions,
}