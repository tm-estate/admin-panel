import { IPropertyType } from './PropertyType';

export interface IRegion extends Omit<IPropertyType, 'dealTypes'> {
  cities: ICity[];
}

export interface ICity extends Omit<IPropertyType, 'dealTypes'> {
  cityAreas: Omit<IPropertyType[], 'dealTypes'>;
}
