import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { IFilterFieldProps } from '@/interfaces';

const TextFilterField: React.FC<IFilterFieldProps> = ({
                                                             filterItem,
                                                             setFieldValue,
                                                             setFieldTouched,
                                                             handleFilterValueChange,
                                                             controlClasses,
                                                             errorClasses
                                                         }) => {
    const { id, fields } = filterItem;

    return (
        <>
            <Field
                className={controlClasses}
                name={`${id}_value`}
                placeholder="Enter value"
                id={`${id}_value`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = e.target.value;
                    handleFilterValueChange(id, 'filterValue', newValue);
                    setFieldValue(`${id}_value`, newValue);
                }}
                value={fields.filterValue || ''}
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
};

export default React.memo(TextFilterField);
