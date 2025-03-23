import React, { useMemo } from 'react';
import { IFilterItem } from '@/interfaces';
import { isRangeFilter } from '@/utils/filter/filterTypes';
import { useAppSelector } from '@/stores/hooks';
import { FILTER_TYPES } from "@/constants/filterTypes";

interface AppliedFilterProps {
    filterItems: IFilterItem[];
    onRemoveFilter: (id: string) => void;
}

const AppliedFilters: React.FC<AppliedFilterProps> = ({
                                                          filterItems,
                                                          onRemoveFilter,
                                                      }) => {
    const autocompleteItems = useAppSelector(state => state.autocomplete?.items || {});

    const getEntityLabel = (entityType: string, id: string): string => {
        if (!entityType || !id) return id;

        const entityData = autocompleteItems[entityType];
        if (!entityData || !Array.isArray(entityData) || entityData.length === 0) {
            return id;
        }

        const entity = entityData.find(item => String(item._id) === id);
        if (!entity) return id;

        return entity.titleRu || entity.name || entity.title || entity.label || id;
    };

    const formatMultiValues = (config: any, values: string): string => {
        if (!values) return '';

        const valueArray = values.split(',');

        if (config.itemRef) {
            return valueArray
                .map(id => getEntityLabel(config.itemRef, id))
                .filter(Boolean)
                .join(', ');
        } else if (config.options) {
            return valueArray
                .map(val => {
                    const option = config.options.find(opt =>
                        String(opt._id || opt.key || opt.value) === val
                    );
                    return option ? (option.label || option.titleRu || option.name || val) : val;
                })
                .join(', ');
        }

        return values;
    };

    const filterDescriptions = useMemo(() => {
        return filterItems.map(item => {
            const { config, fields, id } = item;
            if (!config) return null;

            const label = config.label || config.key;
            let displayValue = '';

            if (isRangeFilter(config.selectType)) {
                if (fields.filterValueFrom && fields.filterValueTo) {
                    displayValue = `${fields.filterValueFrom} to ${fields.filterValueTo}`;
                } else if (fields.filterValueFrom) {
                    displayValue = `≥ ${fields.filterValueFrom}`;
                } else if (fields.filterValueTo) {
                    displayValue = `≤ ${fields.filterValueTo}`;
                }
            } else if (config.selectType === FILTER_TYPES.BOOLEAN) {
                displayValue = fields.filterBooleanValue ? 'Yes' : 'No';
            } else if (config.selectType === FILTER_TYPES.MULTI && fields.filterValue) {
                displayValue = formatMultiValues(config, fields.filterValue);
            } else if (fields.filterValue) {
                if (config.selectType === FILTER_TYPES.SELECT) {
                    if (config.itemRef) {
                        displayValue = getEntityLabel(config.itemRef, fields.filterValue);
                    } else if (config.options) {
                        const option = config.options.find(opt =>
                            String(opt._id || opt.key || opt.value) === fields.filterValue
                        );
                        displayValue = option ? (option.label || option.titleRu || option.name || fields.filterValue) : fields.filterValue;
                    } else {
                        displayValue = fields.filterValue;
                    }
                } else {
                    displayValue = fields.filterValue;
                }
            }

            return {
                id,
                label,
                displayValue
            };
        }).filter(Boolean);
    }, [filterItems, autocompleteItems]);

    if (!filterDescriptions.length) return null;

    return (
        <div className="p-7">
            <div className="font-medium mb-2">Applied Filters:</div>
            <div className="flex flex-wrap gap-2">
                {filterDescriptions.map(filter => (
                    <div
                        key={filter.id}
                        className="inline-flex items-center px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                        <span>{filter.label}: {filter.displayValue}</span>
                        <button
                            type="button"
                            className="ml-2 p-1"
                            onClick={() => onRemoveFilter(filter.id)}
                            aria-label={`Remove ${filter.label} filter`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(AppliedFilters);
