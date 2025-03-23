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
    const [initialOptions, setInitialOptions] = useState<any>(null);

    const autocompleteOptions = useAppSelector(state =>
        (state.autocomplete?.items?.[config?.itemRef || ''] || []) as any[]
    );

    useEffect(() => {
        if (initialOptions !== null || !fields.filterValue || !config) return;

        const isMulti = config.selectType === FILTER_TYPES.MULTI;
        const valueArray = isMulti ? fields.filterValue.split(',') : [fields.filterValue];

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
                setInitialOptions(isMulti ? mappedOptions : mappedOptions[0]);
            }
        }
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
                setInitialOptions(isMulti ? mappedOptions : mappedOptions[0]);
            }
        }
    }, [fields.filterValue, config, autocompleteOptions.length]);

    if (!config) return null;

    const isMulti = config.selectType === FILTER_TYPES.MULTI;

    if (config.itemRef) {
        return (
            <>
                <Field
                    name={`${id}_value`}
                    id={`${id}_value`}
                    component={AsyncSelectField}
                    isMulti={isMulti}
                    itemRef={config.itemRef}
                    showField={config.showField || 'label'}
                    initialOption={initialOptions}
                    initialValue={fields.filterValue}
                    onChange={(selected: any) => {
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
                    }}
                    onBlur={() => {
                        setFieldTouched(`${id}_value`, true);
                    }}
                />
                <ErrorMessage
                    name={`${id}_value`}
                    component="div"
                    className={errorClasses}
                />
            </>
        );
    }

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
                    initial={initialOptions}
                    initialValue={fields.filterValue}
                    onChange={(selected: any) => {
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
                    }}
                    onBlur={() => {
                        setFieldTouched(`${id}_value`, true);
                    }}
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
