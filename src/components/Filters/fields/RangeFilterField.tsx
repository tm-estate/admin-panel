import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { IFilterItem } from '@/interfaces';

interface RangeFilterFieldProps {
    filterItem: IFilterItem;
    setFieldValue: (field: string, value: any) => void;
    setFieldTouched: (field: string, touched: boolean) => void;
    handleFilterValueChange: (id: string, name: string, value: any) => void;
    controlClasses: string;
    errorClasses: string;
    touched: Record<string, boolean>;
    errors: Record<string, string>;
}

const RangeFilterField: React.FC<RangeFilterFieldProps> = ({
                                                               filterItem,
                                                               setFieldValue,
                                                               setFieldTouched,
                                                               handleFilterValueChange,
                                                               controlClasses,
                                                               errorClasses,
                                                               touched,
                                                               errors
                                                           }) => {
    const { id, config, fields } = filterItem;
    const isPriceField = config?.key === 'price';
    const isDateField = config?.selectType === 'date';

    return (
        <div className="flex flex-col w-full md:w-2/4 mr-3">
            <div className="flex flex-row space-x-2">
                <div className="flex flex-col w-full">
                    <div className="text-gray-500 font-bold">From</div>
                    <Field
                        className={`${controlClasses} ${touched[`${id}_from`] && errors[`${id}_from`] ? 'border-red-500' : ''}`}
                        name={`${id}_from`}
                        placeholder={isPriceField ? "Min price (≥ 0)" : isDateField ? "Start date" : "From"}
                        id={`${id}_from`}
                        type={isDateField ? "date" : config?.selectType === 'number' ? "number" : "text"}
                        min={isPriceField ? '0' : undefined}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newValue = e.target.value;
                            handleFilterValueChange(id, 'filterValueFrom', newValue);
                            setFieldValue(`${id}_from`, newValue);
                        }}
                        value={fields.filterValueFrom || ''}
                        onBlur={() => {
                            setFieldTouched(`${id}_from`, true);
                            setFieldTouched(`${id}_from_to`, true);
                        }}
                    />
                    {touched[`${id}_from`] && errors[`${id}_from`] && (
                        <div className={errorClasses}>
                            {errors[`${id}_from`]}
                        </div>
                    )}
                </div>
                <div className="flex flex-col w-full">
                    <div className="text-gray-500 font-bold">To</div>
                    <Field
                        className={`${controlClasses} ${touched[`${id}_to`] && errors[`${id}_to`] ? 'border-red-500' : ''}`}
                        name={`${id}_to`}
                        placeholder={isDateField ? "End date" : "To"}
                        id={`${id}_to`}
                        type={isDateField ? "date" : config?.selectType === 'number' ? "number" : "text"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newValue = e.target.value;
                            handleFilterValueChange(id, 'filterValueTo', newValue);
                            setFieldValue(`${id}_to`, newValue);
                        }}
                        value={fields.filterValueTo || ''}
                        onBlur={() => {
                            setFieldTouched(`${id}_to`, true);
                            setFieldTouched(`${id}_from_to`, true);
                        }}
                    />
                    {touched[`${id}_to`] && errors[`${id}_to`] && (
                        <div className={errorClasses}>
                            {errors[`${id}_to`]}
                        </div>
                    )}
                </div>
            </div>
            {/* Common error for range fields - only show if no other specific errors are visible */}
            {touched[`${id}_from_to`] && errors[`${id}_from_to`] &&
                !errors[`${id}_from`] && !errors[`${id}_to`] && (
                    <div className={`${errorClasses} mt-1`}>
                        {errors[`${id}_from_to`]}
                    </div>
                )}
        </div>
    );
};

export default React.memo(RangeFilterField);
