// import { SettingsContent } from '@teltrium/cosmos-ebno';
import RfAttribute from './RfAttribute';
import React, { useEffect, FC, useState } from 'react';
import { CodingTypeUpdate, DeleteCodingType, DeleteEbNo, DeleteModulation, EbNo, NewEbNo, NewEntry, UpdateEbNo } from '../types/msTypes';
import { MockRfAttributeData, RfAttributeData } from '../assets/data';

const RenderEbNo: FC = () => {
	const [showEbNo, setShowEbNo] = useState<boolean>(true);
	const [isEngineer, setIsEngineer] = useState<boolean>(true);
	const [ebnoData, setEbNoData] = useState<EbNo[]>([]);
	const [codingRates, setCodingRates] = useState<any[]>([]);
	const [modulations, setModulations] = useState<any[]>([]);
	const [rfAttributeData, setRfAttributeData] = useState<RfAttributeData>(MockRfAttributeData);
	// const inputJson = useSelector((root: RootState) => root.test.inputJson);
	// const dispatch = useDispatch();

	// useEffect(() => {
	// 	dispatch(setIputJson(JSON.stringify(MockRfAttributeData, null, 2)));
	// }, []);

	// useEffect(() => {
	// 	try {
	// 		debugger
	// 		// convert inputJson to object
	// 		const convertedInputJson = JSON.parse(inputJson);
	// 		// set rfAttributeData
	// 		setRfAttributeData(convertedInputJson);
	// 	} catch (error) {
	// 		// display alert message
	// 		alert(error);
	// 	}

	// }, [inputJson]);


	const handleCreateModulation = async (values: NewEntry) => {
		const formartedDat = { Name: values.name, Id: modulations.length + 2 }
		try {
			setModulations([...modulations, formartedDat]);
		} catch (error: any) {
			console.log(error)
		}
	};

	const handleCreateCodingRate = async (values: NewEntry) => {
		const formartedDat = { name: values.name, id: codingRates.length + 2 }
		try {
			setCodingRates([...codingRates, formartedDat]);
		} catch (error) {
			console.log(error)
		}
	};

	const handleCreateEbNo = async (data: NewEbNo) => {
		const formartedDat = {
			id: ebnoData.length + 2,
			'EbNo_10E-5': data.ebno,
			codeRate: rfAttributeData.codingRateOptions.filter((codingRate) => codingRate.id === data.codingRate)[0].name,
			codingType: rfAttributeData.codingTypeOptions.filter((codingType) => codingType.id === data.codingType)[0].name,
			modulation: rfAttributeData.modulationOptions.filter((modulation) => modulation.id === data.modulation)[0].name
		}
		try {
			setEbNoData([...ebnoData, formartedDat]);
		} catch (error) {
			console.log('error');
		}
	};

	const handleUpdateEbNo = (data: UpdateEbNo) => {
		const { newData } = data;
		const { id, codingType } = data.key;
		try {
			const updatedEbNoData = ebnoData.map((ebno) => {
				if (ebno.id === id) {
					return {
						...ebno,
						...newData,
					};
				}
				return ebno;
			}
			);
			setEbNoData(updatedEbNoData);
		} catch (error) {
			console.log('error');
		}
	};

	const handleRemoveEbNo = async (data: DeleteEbNo) => {
		const { id } = data.key;
		try {
			console.log(id)
		} catch (error) {
			alert(error);
		}
	};

	const getEbNoData = async () => {
		// debugger
		try {
			setEbNoData(rfAttributeData.ebnoData);
		} catch (error) {
			console.log(error);
		}
	};

	const getCodingData = async () => {
		try {
			setCodingRates(rfAttributeData.codingRates);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCodingUpdate = async (data: CodingTypeUpdate) => {
		const { name } = data.newData;
		const { id } = data.oldData;
		try {
			const updatedCodingRateData = codingRates.map((codingRate) => {
				if (codingRate.id === id) {
					return {
						...codingRate,
						name,
					};
				}
				return codingRate;
			}
			);
			setCodingRates(updatedCodingRateData);
		} catch (error) {
			console.log('error', error);
			// alert(error)
		}
	};

	async function handleModulationUpdate(data: any) {
		const { Name } = data.newData;
		const { Id: id } = data.oldData;
		try {
			const updatedModulationData = modulations.map((modulation) => {
				if (modulation.Id === id) {
					return {
						...modulation,
						Name,
					};
				}
				return modulation;
			}
			);
			setModulations(updatedModulationData);
		} catch (error) {
			console.log('error', error);
			// alert(error)
		}
	}

	const getModulationData = async () => {
		try {
			setModulations(rfAttributeData.modulations);
		} catch (error) {
			console.log(error);
		}
	};

	async function handleCodingRemove(data: DeleteCodingType) {
		const { id } = data.key;
		try {
			const updatedCodingRateData = codingRates.filter((codingRate) => codingRate.id !== id);
			setCodingRates(updatedCodingRateData);
		} catch (error) {
			alert(error);
		}
	}

	async function handleModulationRemove(data: DeleteModulation) {
		const { Id: id } = data.key;
		try {
			const updatedModulationData = modulations.filter((modulation) => modulation.Id !== id);
			setModulations(updatedModulationData);
		} catch (error) {
			alert(error);
		}
	}


	useEffect(() => {
		// debugger
		getEbNoData();
		getCodingData();
		getModulationData();
	}, [rfAttributeData]);

	return (
		<RfAttribute
			open={true}
			onOpen={() => setShowEbNo(false)}
			isEngineer={isEngineer}
			ebnoData={ebnoData}
			codingTypeOptions={rfAttributeData.codingTypeOptions}
			codingRateOptions={rfAttributeData.codingRateOptions}
			modulationOptions={rfAttributeData.modulationOptions}
			handleUpdateEbNo={(data: UpdateEbNo) => handleUpdateEbNo(data)}
			handleRemoveEbNo={(data: any) => handleRemoveEbNo(data)}
			handleCreateEbNo={(data: NewEbNo) => handleCreateEbNo(data)}
			codingRates={codingRates}
			modulations={modulations}
			handleModulationUpdate={(data: any) => handleModulationUpdate(data)}
			handleCodingUpdate={(data: any) => handleCodingUpdate(data)}
			handleCodingRemove={(data: any) => handleCodingRemove(data)}
			handleModulationRemove={(data: any) => handleModulationRemove(data)}
			handleCreateCodingRate={(value: any) => handleCreateCodingRate(value)}
			handleCreateModulation={(value: any) => handleCreateModulation(value)}
		/>
	);
};

export default RenderEbNo;
