
export type EbNo = {
  'EbNo_10E-5'?: string;
  codeRate?: string;
  codingType?: string;
  id?: number;
  modulation?: string;
};

export type NewEbNo = {
  codingType?: string;
  modulation?: string;
  codingRate?: string;
  ebno?: string;
};

export interface AttrValue {
  id: number;
  name: string;
}

export interface AttrValue2 {
  Id: number;
  Name: string;
}

export interface NewEntry {
  name: string;
  submit: any;
}

export type UpdateEbNo = {
  key: EbNo,
  newData: EbNo
}

export type DeleteEbNo = {
  key: EbNo
}

export type CodingTypeUpdate = {
  cancel: boolean,
  newData: AttrValue,
  oldData: AttrValue
}

export type ModulationUpdate = {
  cancel: boolean,
  newData: AttrValue2,
  oldData: AttrValue2
}

export type DeleteModulation = {
  key: AttrValue2
}

export type DeleteCodingType = {
  key: AttrValue
}


