import { ILocalizedTitles } from "./ILocalizedTitles";

export interface IDealType extends ILocalizedTitles{
    createdAt?: string,
    updatedAt?: string,
}

export interface IDealTypes {
    rows: IDealType[];
    count: number;
}


export interface IDealTypeUpdatePayload {
    id: string | string[];
    data: IDealType;
}
