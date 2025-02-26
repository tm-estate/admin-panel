import { IDealType } from "./IDealTypes";

export interface IPropertyType {
    _id?: string;
    dealTypes: IDealType[];
    titleEn: string;
    titleRu: string;
    titleTm: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPropertyTypes {
    count: number;
    rows: IPropertyType[];
}

export interface IPropertyTypeUpdatePayload {
    id: string | string[];
    data: IPropertyType;
}
