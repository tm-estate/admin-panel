import { ICity } from "./ICities";
import {ICoordinate, ILocalizedTitles} from "./index";

export interface IRegion extends ILocalizedTitles {
    cities: ICity[];
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
