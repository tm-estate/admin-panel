import { IFilterConfig, IFilterItem } from "../interfaces";

export interface ITableProps {
    filterItems: IFilterItem[];
    setFilterItems: (items: IFilterItem[]) => void;
    filters: IFilterConfig[];
}
