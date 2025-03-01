import { IPropertyType } from "./IPropertyTypes";
import { IDealType } from "./IDealTypes";

export interface IProductParameterItem {
    _id?: string;
    titleRu: string;
    titleEn: string;
    titleTm: string;
    __v: string;
    createdAt: string;
    updatedAt: string;
}

export interface IProductParameter {
    _id?: string;
    titleRu: string;
    titleEn: string;
    titleTm: string;
    selectType: string;
    items: IProductParameterItem[];
    key: string;
    dealTypes: IDealType | [];
    propertyTypes: IPropertyType | [];
    isRequired?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: string;
}

export interface IProductParameters {
    rows: IProductParameter[];
    count: number;
}

export interface IProductParametersUpdatePayload {
    id: string | string[];
    data: IProductParameter
}
