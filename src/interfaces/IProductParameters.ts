import { IPropertyType, IDealType, ILocalizedTitles } from "../interfaces";

export interface IProductParameterItem extends ILocalizedTitles {
    __v?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IProductParameter extends ILocalizedTitles {
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
