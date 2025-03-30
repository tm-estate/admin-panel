import React, { useMemo } from 'react';
import { Field } from 'formik';
import BaseButton from '@/components/Base/BaseButton';
import SelectField from '@/components/UI/SelectField';
import { IFilterConfig, IFilterItem } from '@/interfaces';
import { isRangeFilter, getFilterLabel } from '@/utils/filter/filterTypes';
import RangeFilterField from './fields/RangeFilterField';
import BooleanFilterField from './fields/BooleanFilterField';
import SelectFilterField from './fields/SelectFilterField';
import TextFilterField from './fields/TextFilterField';

interface FilterItemProps {
    filterItem: IFilterItem;
    filterItems: IFilterItem[];
    filters: IFilterConfig[];
    handleFilterTypeChange: (id: string, filter: IFilterConfig) => void;
    handleFilterValueChange: (id: string, name: string, value: any) => void;
    deleteFilter: (id: string) => void;
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched: (field: string, touched: boolean) => void;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
}

const FilterItem: React.FC<FilterItemProps> = ({
                                                   filterItem,
                                                   filterItems,
                                                   filters,
                                                   handleFilterTypeChange,
                                                   handleFilterValueChange,
                                                   deleteFilter,
                                                   setFieldValue,
                                                   setFieldTouched,
                                                   errors,
                                                   touched
                                               }) => {
    const controlClasses = [
        'w-full py-3.5 px-3 border-gray-300 rounded dark:placeholder-gray-400',
        'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none bg-white',
        'dark:bg-slate-800 border',
    ].join(' ');

    const errorClasses = 'text-red-500 text-sm mt-1';

    const hasFilterType = !!filterItem.fields.selectedField;

    const currentFilter = filterItem.config ||
        (filterItem.fields.selectedField ? filters.find(f => f.key === filterItem.fields.selectedField) : null);

    const isRange = currentFilter ? isRangeFilter(currentFilter.selectType) : false;

    const filterTypeKey = useMemo(() =>
            `${filterItem.id}_${currentFilter?.selectType || 'empty'}_${currentFilter?.key || 'none'}`,
        [filterItem.id, currentFilter?.selectType, currentFilter?.key]
    );

    const usedFilterTypes = useMemo(() => {
        const usedTypes = new Set<string>();

        filterItems.forEach(item => {
            if (!item.fields.selectedField || item.id === filterItem.id) return;

            usedTypes.add(item.fields.selectedField);
        });

        return usedTypes;
    }, [filterItems, filterItem.id]);

    const availableFilters = useMemo(() => {
        return filters.filter(filter =>
            filter.key === filterItem.fields.selectedField || !usedFilterTypes.has(filter.key)
        );
    }, [filters, filterItem.fields.selectedField, usedFilterTypes]);

    const showTypeError = !hasFilterType &&
        touched[`${filterItem.id}_type`] &&
        errors[`${filterItem.id}_type`];

    const renderFilterField = () => {
        if (!hasFilterType || !currentFilter) {
            return (
                <div className="flex flex-col w-full md:w-2/4 mr-3">
                    <div className="text-gray-500 font-bold">
                        Filter Value
                    </div>
                    <div className="flex items-center text-gray-400 italic p-3.5 border border-gray-300 rounded bg-gray-50">
                        Select a filter type first
                    </div>
                </div>
            );
        }

        if (isRange) {
            return (
                <RangeFilterField
                    key={filterTypeKey}
                    filterItem={filterItem}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    handleFilterValueChange={handleFilterValueChange}
                    controlClasses={controlClasses}
                    errorClasses={errorClasses}
                    errors={errors}
                    touched={touched}
                />
            );
        }

        return (
            <div className="flex flex-col w-full md:w-2/4 mr-3">
                <div className="text-gray-500 font-bold">
                    {getFilterLabel(currentFilter.selectType)}
                </div>

                {currentFilter.selectType === 'boolean' ? (
                    <BooleanFilterField
                        key={filterTypeKey}
                        filterItem={filterItem}
                        setFieldValue={setFieldValue}
                        handleFilterValueChange={handleFilterValueChange}
                        errorClasses={errorClasses}
                    />
                ) : currentFilter.selectType === 'select' || currentFilter.selectType === 'multi' ? (
                    <SelectFilterField
                        key={filterTypeKey}
                        filterItem={filterItem}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        handleFilterValueChange={handleFilterValueChange}
                        errorClasses={errorClasses}
                    />
                ) : (
                    <TextFilterField
                        key={filterTypeKey}
                        filterItem={filterItem}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        handleFilterValueChange={handleFilterValueChange}
                        controlClasses={controlClasses}
                        errorClasses={errorClasses}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col mb-4">
            <div className="flex flex-wrap md:flex-nowrap" key={`${filterItem.id}_wrapper`}>
                {/* Filter Type Selection */}
                <div className="flex flex-col w-full md:w-1/4 mr-3 mb-2 md:mb-0">
                    <div className="text-gray-500 font-bold">Filter</div>
                    <Field
                        name={`${filterItem.id}_type`}
                        id={`${filterItem.id}_type`}
                        component={SelectField}
                        options={availableFilters}
                        showField="label"
                        initial={currentFilter ? {
                            key: currentFilter.key,
                            label: currentFilter.label,
                            selectType: currentFilter.selectType
                        } : null}
                        placeholder="Select filter type..."
                        isClearable={false}
                        setSelectedOption={(selectedOption) => {
                            if (!selectedOption) return;

                            const matchedFilter = filters.find(f => f.key === selectedOption.key);
                            if (matchedFilter) {
                                setFieldValue(`${filterItem.id}_type`, matchedFilter.key);
                                handleFilterTypeChange(filterItem.id, matchedFilter);
                            }
                        }}
                        onBlur={() => {
                            setFieldTouched(`${filterItem.id}_type`, true);
                        }}
                    />
                </div>

                {/* Filter Value Fields */}
                {renderFilterField()}

                {/* Action Button */}
                <div className="flex flex-col w-full md:w-1/4">
                    <div className="text-gray-500 font-bold">Action</div>
                    <BaseButton
                        className="my-2"
                        type="button"
                        color="danger"
                        label="Delete"
                        onClick={() => deleteFilter(filterItem.id)}
                    />
                </div>
            </div>

            {/* Error message shown below the entire row */}
            {showTypeError && (
                <div className={`${errorClasses} mt-1 ml-1`}>
                    Please select a filter type
                </div>
            )}
        </div>
    );
};

export default React.memo(FilterItem);
