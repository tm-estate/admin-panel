import { ICity } from "./ICities";
import { ICoordinate } from "./index";

export interface IRegion {
    _id?: string;
    cities: ICity[];
    titleEn: string;
    titleRu: string;
    titleTm: string;
    coordinate: ICoordinate
    createdAt?: string;
    updatedAt?: string;
}

export interface IRegions {
    count: number;
    rows: IRegion[];
}

export interface IRegionUpdatePayload {
    id: string | string[];
    data: IRegion;
}
