export interface IAgencyType {
    _id?: string;
    titleEn: string;
    titleRu: string;
    titleTm: string;
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
