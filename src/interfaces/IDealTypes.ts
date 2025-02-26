export interface IDealType {
    _id?: string;
    titleEn: string;
    titleRu: string;
    titleTm: string;
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
