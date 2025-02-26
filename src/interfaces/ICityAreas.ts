import { ICoordinate } from "./index";

export interface ICityArea {
    _id?: string
    coordinate: ICoordinate
    titleEn: string
    titleRu: string
    titleTm: string
}

export interface ICityAreas {
    rows: ICityArea[];
    count: number;
}

export interface ICityAreasUpdatePayload {
    id: string | string[];
    data: ICityArea;
}
