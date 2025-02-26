import { ICoordinate } from "./index";
import { ICityArea } from "./ICityAreas";

export interface ICity {
    _id?: string;
    cityAreas: ICityArea[]
    coordinate: ICoordinate
    titleEn: string
    titleRu: string
    titleTm: string
}

// export interface ICities extends Omit<ICity, '_id'> {}
export interface ICities {
    rows: ICity[];
    count: number;
}

export interface ICityUpdatePayload {
    id: string | string[];
    data: ICity;
}
