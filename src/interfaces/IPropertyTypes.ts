import { IDealType } from "./IDealTypes";
import { ILocalizedTitles } from "./index";

export interface IPropertyType extends ILocalizedTitles {
    dealTypes: IDealType[];
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
