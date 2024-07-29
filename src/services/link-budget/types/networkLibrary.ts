export type TService = {
	antennaId: number;
	serviceId: number;
	antennaName: string;
	isTx: boolean;
	frequencyBandId: number;
	frequencyBandName: string;
	antennaSize: number;
	system: string;
	location: string;
	year: number;
	gtValues: string;
	eirpValues: string;
	minFrequency: number;
	maxFrequency: number;
	scanAgreement: boolean;
	polarization: string;
	antennaGain: string;
	dataFormat: string;
	dataRate: number;
	modulationType: string;
	channelCodingType: string;
	subcarrierModulationType: string;
	standardsCompliance: number;
	networkName: string;
	platformName: string;
	name: string;
	version: number;
	regime: string;
};

export type TPlatform = {
	id: number;
	name: string;
	type: number;
	location: string;
	services: TService[];
	antennaIds: number[];
	count: number;
	startYear: number;
	version: number;
	referenceBody: number;
};

export type TNetwork = {
	id: number;
	name: string;
	system: string;
	location: string;
	year: number;
	numLocations: number;
	supportedFrequencies: string;
	gtValues: string;
	eirpValues: string;
	minFrequency: number;
	maxFrequency: number;
	scanAgreement: boolean;
	antennaNames: string;
	antennaSize: string;
	polarization: string;
	antennaGain: string;
	dataFormat: string;
	modulationType: string;
	channelCodingType: string;
	subcarrierModulationType: string;
	standardsCompliance: number;
	platforms: TPlatform[];
	isEditable: boolean;
};

export type TNetworks = {
	networks: TNetwork[];
};

/**
 * Type for Grid LIST
 */
export type TListItem = {
	id: number;
	objId: number;
	serviceId?: number;
	parent_id: number;
	parentObjId: number;
	selected: boolean;
	name: string;
	value1: string;
	value2: string;
	value3: string;
	level: string;
	count: number;
	platformType: number;
	platformId?: number;
	platformName?: string;
	networkType?: string;
	networkName?: string;
	networkId?: number;
	frequencyBandId?: number;
	version?: number;
	referenceBody?: number;
};

export type ServiceDetails = {
	id: number;
	name: string;
	owner?: number;
	networkId?: number;
	forward: boolean;
	antennaId: number;
	platformId: number;
	linkBudgetTemplateId: number;
	startingPlatform: PlatformDetails;
	startOffset: number;
	endOffset: number;
	segments: Connection[];
	color?: string;
};

/**
 * Reference frame, also the "coordinateSystem"
 * @see {@link ReferenceBody}
 */
export enum ReferenceFrame {
	EarthJ2000 = 1,
	MoonJ2000 = 2,
	MoonBodyFixed = 3,
	EarthBodyFixed = 4
}

/**
 * Reference body, the "reference body"
 * @see {@link ReferenceFrame}
 */
export enum ReferenceBody {
	EARTH = 1,
	MOON = 2
}

export type PlatformDetails = {
	id: number;
	isUser: boolean;
	name: string;
	name_notes: number;
	platformType: number;
	platformType_notes: number;
	referenceBody: ReferenceBody;
	referenceBody_notes: number;
	latitude: number;
	longitude: number;
	longitude_notes: number;
	location: string;
	location_notes: number;
	siteAltitude: number;
	siteAltitude_notes: number;
	isActive: boolean;
	version: number;
	modifiedOn: Date;
	modifiedBy: number;
	latitude_notes: number;
	startOperationalYear: number;
	startOperationalYear_notes: number;
	stopOperationalYear: number;
	stopOperationalYear_notes: number;
	subSatelliteLong: number;
	subSatelliteLong_notes: number;
	numSatellitesPerPlane: number;
	numSatellitesPerPlane_notes: number;
	halfConeAngle: number;
	halfConeAngle_notes: number;
	numberOfShells: number;
	numberOfShells_notes: number;
	altitudeOfShells: number;
	altitudeOfShells_notes: number;
	numberOfPlanesPerShell: number;
	numberOfPlanesPerShell_notes: number;
	planeInclination: number;
	planeInclination_notes: number;
	planeDistribution: number;
	planeDistribution_notes: number;
	owner: number | null;
	eccentricity: number;
	phaseDiff: boolean;
	phaseOffset: number;
	phaseOffset_notes: number;
	altitude: number;
	inclination: number;
	trueAnomaly: number;
	raan: number;
	argumentOfPerigee: number;
	epoch: string;
	epoch_notes: number;
	trajectoryFile: string;
	trajectoryFile_notes: number;
	color: string | null;
	referenceFrame: ReferenceFrame;
	referenceFrame_notes: number | null;
	createdAt: Date;
	updatedAt: Date;
};

export type Connection = {
	linkId: number;
	name: string;
	owner?: number;
	segmentId: number;
	connectionId: number;
	linkPosition: number;
	antennaId: number;
	platformId: number;
	isOrbital: boolean;
	isTx: boolean;
	parentAntennaId: number;
	object: AntennaDetails | RfFrontEndDetails | ModDemodDetails;
};

export type AntennaDetails = {
	id: number;
	antennaSize: number;
	antennaEfficiency: number;
	RxSystemNoise: number;
	polarizationType: number;
	polarizationLosses: number;
	platformId: number;
	name: string;
	owner: number | null;
	fov: number;
	scanAgreement: boolean;
	isServiceAntenna: boolean;
};

export type RfFrontEndDetails = {
	id: number;
	startFrequency: number;
	stopFrequency: number;
	centerFrequency: number;
	otherLosses: number;
	TxPower: number;
	antennaId: number;
	name: string;
	symbolRate?: number;
	bandwidth: number;
	antennaGain: number;
	antennaGT: number;
	pointingLoss?: number;
	antennaBeamwidth: number;
	EIRP?: number;
	isTx: boolean;
	rf_ci: number;
};

export type ModDemodDetails = {
	id: number;
	modulationType: string;
	suppCarrierDataRate: string;
	carrierDataFormat: string;
	subcarrierFrequency: string;
	subcarrierModulation: string;
	subcarrierDataRate: string;
	subcarrierDataFormat: string;
	channelCodingType: string;
	maxDataRate: number;
	implementationLoss: number;
	RFFrontEndId: number;
	name: string;
	vcmVdrSupport?: number;
	std_compliance: number;
};
