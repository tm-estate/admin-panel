import { ILocalizedTitles } from "./ILocalizedTitles";

export interface IAgencyType extends ILocalizedTitles{
    createdAt?: string,
    updatedAt?: string,
}

export interface IAgencyTypes {
    rows: IAgencyType[];
    count: number;
}


export interface IAgencyTypeUpdatePayload {
    id: string | string[];
    data: IAgencyType;
}
