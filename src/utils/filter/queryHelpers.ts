import { IFilterConfig, IFilterItem } from "@/interfaces";
import { isRangeFilter } from "./filterTypes";
import { uniqueId } from "lodash";
import { FILTER_TYPES } from "@/constants/filterTypes";

export const generateFilterQuery = (filterItems: IFilterItem[]) => {
    let query = '';
    const object: Record<string, any> = {};

    filterItems.forEach((item) => {
        if (!item.fields.selectedField || !item.config) return;

        const filterConfig = item.config;
        const { fields } = item;
        const fieldKey = fields.selectedField;

        if (isRangeFilter(filterConfig.selectType)) {
            if (fields.filterValueFrom || fields.filterValueTo) {
                if (fields.filterValueFrom) {
                    const fromValue = filterConfig.selectType === 'number'
                        ? +fields.filterValueFrom
                        : fields.filterValueFrom;

                    object[`${fieldKey}From`] = fromValue;
                    query += `${fieldKey}From=${encodeURIComponent(fields.filterValueFrom)}&`;
                }
                if (fields.filterValueTo) {
                    const toValue = filterConfig.selectType === 'number'
                        ? +fields.filterValueTo
                        : fields.filterValueTo;

                    object[`${fieldKey}To`] = toValue;
                    query += `${fieldKey}To=${encodeURIComponent(fields.filterValueTo)}&`;
                }
            }
        } else if (filterConfig.selectType === FILTER_TYPES.MULTI && fields.filterValue && typeof fields.filterValue === 'string') {
            const values = fields.filterValue.split(',').filter(val => val.trim() !== '');
            if (values.length > 0) {
                object[fieldKey] = values;
                query += `${fieldKey}=${encodeURIComponent(fields.filterValue)}&`;
            }
        } else if (filterConfig.selectType === FILTER_TYPES.BOOLEAN) {
            object[fieldKey] = fields.filterBooleanValue;
            query += `${fieldKey}=${encodeURIComponent(String(fields.filterBooleanValue))}&`;
        } else if (typeof fields.filterValue === 'string' && fields.filterValue.trim() !== '') {
            object[fieldKey] = fields.filterValue;
            query += `${fieldKey}=${encodeURIComponent(fields.filterValue)}&`;
        }
    });

    return {
        object,
        query: query.endsWith('&') ? query.slice(0, -1) : query
    };
};

export const parseQueryToFilterItems = (
    queryParams: URLSearchParams,
    filters: IFilterConfig[]
): IFilterItem[] => {
    if (!queryParams || !filters.length) return [];

    const filterItems: IFilterItem[] = [];
    const processedKeys = new Set<string>();

    const entries = Array.from(queryParams).map(([key, value]) => ({key, value}));

    entries.forEach(({key, value}) => {
        if (!value) return;

        if (key.endsWith('From') || key.endsWith('To')) {
            const baseKey = key.endsWith('From')
                ? key.slice(0, -4)
                : key.slice(0, -2);

            if (processedKeys.has(baseKey)) return;
            processedKeys.add(baseKey);

            const filterConfig = filters.find(f => f.key === baseKey);
            if (!filterConfig || !isRangeFilter(filterConfig.selectType)) return;

            const fromValue = queryParams.get(`${baseKey}From`) || '';
            const toValue = queryParams.get(`${baseKey}To`) || '';

            filterItems.push({
                id: uniqueId('filter_'),
                config: filterConfig,
                fields: {
                    selectedField: baseKey,
                    filterValue: '',
                    filterBooleanValue: false,
                    filterValueFrom: fromValue,
                    filterValueTo: toValue
                }
            });
        }
        else if (value === 'true' || value === 'false') {
            const filterConfig = filters.find(f => f.key === key);
            if (!filterConfig) return;

            filterItems.push({
                id: uniqueId('filter_'),
                config: filterConfig,
                fields: {
                    selectedField: key,
                    filterValue: '',
                    filterBooleanValue: value === 'true',
                    filterValueFrom: '',
                    filterValueTo: ''
                }
            });
        }
        else {
            const filterConfig = filters.find(f => f.key === key);
            if (!filterConfig) return;

            filterItems.push({
                id: uniqueId('filter_'),
                config: filterConfig,
                fields: {
                    selectedField: key,
                    filterValue: value,
                    filterBooleanValue: false,
                    filterValueFrom: '',
                    filterValueTo: ''
                }
            });
        }
    });

    return filterItems;
};

export const updateBrowserUrl = (queryString: string) => {
    const url = new URL(window.location.href);
    url.search = queryString;
    window.history.pushState({}, '', url.toString());
};
