import React from 'react';
import { Field, ErrorMessage } from 'formik';
import SwitchField from '@/components/UI/SwitchField';
import { IFilterFieldProps } from '@/interfaces';

const BooleanFilterField: React.FC<IFilterFieldProps> = ({
                                                                   filterItem,
                                                                   setFieldValue,
                                                                   handleFilterValueChange,
                                                                   errorClasses
                                                               }) => {
    const { id, config, fields } = filterItem;

    return (
        <>
            <div className="mt-3 flex items-center">
                <Field
                    name={`${id}_value`}
                    id={`${id}_value`}
                    component={SwitchField}
                    checked={fields.filterBooleanValue}
                    onChange={(checked: boolean) => {
                        setFieldValue(`${id}_value`, checked);
                        handleFilterValueChange(id, 'filterBooleanValue', checked);
                    }}
                />
                <label className="ml-2" htmlFor={`${id}_value`}>
                    {`${config?.label || ''} ${fields.filterBooleanValue ? 'Enabled' : 'Disabled'}`}
                </label>
            </div>
            <ErrorMessage
                name={`${id}_value`}
                component="div"
                className={errorClasses}
            />
        </>
    );
};

export default React.memo(BooleanFilterField);
