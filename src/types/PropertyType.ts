import { IDealType } from './DealType';

export interface IPropertyType {
  _id: string;
  titleEn: string;
  titleRu: string;
  titleTm: string;
  dealTypes: IDealType[];
}
