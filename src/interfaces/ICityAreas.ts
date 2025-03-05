import { ICoordinate, ILocalizedTitles } from "./index";

export interface ICityArea extends ILocalizedTitles{
    coordinate: ICoordinate;
}

export interface ICityAreas {
    rows: ICityArea[];
    count: number;
}

export interface ICityAreasUpdatePayload {
    id: string | string[];
    data: ICityArea;
}
