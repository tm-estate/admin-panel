import { ICoordinate } from "./index";
import { ICityArea } from "./ICityAreas";
import { ILocalizedTitles } from "./ILocalizedTitles";

export interface ICity extends ILocalizedTitles{
    cityAreas: ICityArea[]
    coordinate: ICoordinate
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
