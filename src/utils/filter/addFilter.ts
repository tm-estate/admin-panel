import { uniqueId } from 'lodash';
import { IFilterConfig, IFilterItem } from '@/interfaces';

export const addFilter = (
    filters: IFilterConfig[],
    setFilterItems: (items: IFilterItem[]) => void,
    currentItems: IFilterItem[]
) => {
    if (!filters.length) return;

    const newItem: IFilterItem = {
        id: uniqueId('filter_'),
        fields: {
            selectedField: '',
            filterValue: '',
            filterBooleanValue: false,
            filterValueFrom: '',
            filterValueTo: '',
        },
        config: null
    };

    setFilterItems([...currentItems, newItem]);
};
