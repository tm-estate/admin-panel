import { FILTER_TYPES } from "@/constants/filterTypes";

export type FilterType = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];

export const isRangeFilter = (filterType?: string): boolean => {
    return filterType === FILTER_TYPES.NUMBER || filterType === FILTER_TYPES.DATE;
};

export const getFilterLabel = (filterType?: string): string => {
    switch (filterType) {
        case FILTER_TYPES.SEARCH:
        case FILTER_TYPES.TEXT:
            return 'Contains';
        case FILTER_TYPES.SELECT:
            return 'Select';
        case FILTER_TYPES.MULTI:
            return 'Select Multiple';
        case FILTER_TYPES.BOOLEAN:
            return 'Yes / No';
        case FILTER_TYPES.NUMBER:
        case FILTER_TYPES.DATE:
            return 'Range';
        default:
            return 'Value';
    }
};
