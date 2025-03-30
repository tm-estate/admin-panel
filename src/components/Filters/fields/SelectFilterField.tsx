import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import AsyncSelectField from '@/components/UI/AsyncSelectField';
import SelectField from '@/components/UI/SelectField';
import { IFilterItem } from '@/interfaces';
import { useAppSelector } from '@/stores/hooks';
import { FILTER_TYPES } from "@/constants/filterTypes";

interface SelectFilterFieldProps {
    filterItem: IFilterItem;
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched: (field: string, touched: boolean) => void;
    handleFilterValueChange: (id: string, name: string, value: any) => void;
    errorClasses: string;
}

const SelectFilterField: React.FC<SelectFilterFieldProps> = ({
                                                                 filterItem,
                                                                 setFieldValue,
                                                                 setFieldTouched,
                                                                 handleFilterValueChange,
                                                                 errorClasses
                                                             }) => {
    const { id, config, fields } = filterItem;
    const [initialOption, setInitialOption] = useState<any>(null);

    const isMulti = config?.selectType === FILTER_TYPES.MULTI;

    // Get options from cache if using autocomplete
    const autocompleteOptions = useAppSelector(state =>
        (state.autocomplete?.items?.[config?.itemRef || ''] || []) as any[]
    );

    // Set initial option when fields or options change
    useEffect(() => {
        if (!fields.filterValue || !config) return;

        // Skip if initialOption is already set
        if (initialOption !== null) return;

        const valueArray = isMulti ? fields.filterValue.split(',') : [fields.filterValue];

        // If using static options
        if (config.options) {
            const mappedOptions = valueArray
                .map(val => {
                    const foundOption = config.options.find((opt: any) =>
                        String(opt._id || opt.key || opt.value) === val
                    );
                    if (foundOption) {
                        return {
                            value: val,
                            label: foundOption[config.showField] || foundOption.label || foundOption.titleRu || val,
                            original: foundOption
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            if (mappedOptions.length > 0) {
                setInitialOption(isMulti ? mappedOptions : mappedOptions[0]);
            }
        }
        // If using autocomplete and options are loaded
        else if (config.itemRef && autocompleteOptions.length > 0) {
            const mappedOptions = valueArray
                .map(val => {
                    const foundOption = autocompleteOptions.find((opt: any) => String(opt._id) === val);
                    if (foundOption) {
                        return {
                            value: val,
                            label: foundOption[config.showField || 'label'] || foundOption.name || val,
                            original: foundOption
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            if (mappedOptions.length > 0) {
                setInitialOption(isMulti ? mappedOptions : mappedOptions[0]);
            }
        }
    }, [fields.filterValue, config, autocompleteOptions.length, initialOption, isMulti]);

    if (!config) return null;

    // Handle change for both async and regular select
    const handleSelectChange = (selected: any) => {
        let value;

        if (isMulti) {
            value = Array.isArray(selected) && selected.length > 0
                ? selected.map((s: any) => s.value).join(',')
                : '';
        } else {
            value = selected?.value || '';
        }

        setFieldValue(`${id}_value`, value);
        handleFilterValueChange(id, 'filterValue', value);
    };

    // Render AsyncSelectField for autocomplete
    if (config.itemRef) {
        return (
            <>
                <Field
                    name={`${id}_value`}
                    id={`${id}_value`}
                    component={AsyncSelectField}
                    isMulti={isMulti}
                    itemRef={config.itemRef}
                    showField={config.showField || 'titleRu'}
                    initialOption={initialOption}
                    initialValue={fields.filterValue}
                    onChange={handleSelectChange}
                    onBlur={() => setFieldTouched(`${id}_value`, true)}
                />
                <ErrorMessage
                    name={`${id}_value`}
                    component="div"
                    className={errorClasses}
                />
            </>
        );
    }

    // Render SelectField for static options
    if (config.options) {
        return (
            <>
                <Field
                    name={`${id}_value`}
                    id={`${id}_value`}
                    component={SelectField}
                    isMulti={isMulti}
                    options={config.options}
                    showField={config.showField || 'label'}
                    initial={initialOption}
                    initialValue={fields.filterValue}
                    onChange={handleSelectChange}
                    onBlur={() => setFieldTouched(`${id}_value`, true)}
                />
                <ErrorMessage
                    name={`${id}_value`}
                    component="div"
                    className={errorClasses}
                />
            </>
        );
    }

    return null;
};

export default React.memo(SelectFilterField);
