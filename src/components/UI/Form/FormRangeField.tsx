import React from 'react';
import { Field } from 'formik';
import FormField from '@/components/FormField';
import FixedTextField from '@/components/UI/TextField';

interface FormRangeFilterFieldProps {
    name: string;
    id?: string;
    label?: string;
    help?: string;
    isDate?: boolean;
    setFormValues?: (values: any) => void;
}

const FormRangeFilterField: React.FC<FormRangeFilterFieldProps> = ({
                                                                       name,
                                                                       id = '',
                                                                       label = '',
                                                                       help = '',
                                                                       isDate = false,
                                                                       setFormValues,
                                                                       ...props
                                                                   }) => {
    // Generate IDs if none provided
    const fieldIdFrom = id ? `${id}_from` : `field-${name}-from`;
    const fieldIdTo = id ? `${id}_to` : `field-${name}-to`;

    return (
        <div className="flex flex-row space-x-4 w-full">
            <div className="flex-1">
                <FormField
                    label={`${label} From`}
                    labelFor={fieldIdFrom}
                    help={help}
                >
                    <Field
                        name={`${name}_from`}
                        id={fieldIdFrom}
                        component={FixedTextField}
                        type={isDate ? 'datetime-local' : 'text'}
                        placeholder="From"
                        onChange={(e) => {
                            // If setFormValues is provided, update the form values when input changes
                            if (setFormValues) {
                                setFormValues(prev => ({
                                    ...prev,
                                    [`${name}_from`]: e.target.value
                                }));
                            }
                        }}
                        {...props}
                    />
                </FormField>
            </div>

            <div className="flex-1">
                <FormField
                    label={`${label} To`}
                    labelFor={fieldIdTo}
                    help={help}
                >
                    <Field
                        name={`${name}_to`}
                        id={fieldIdTo}
                        component={FixedTextField}
                        type={isDate ? 'datetime-local' : 'text'}
                        placeholder="To"
                        onChange={(e) => {
                            // If setFormValues is provided, update the form values when input changes
                            if (setFormValues) {
                                setFormValues(prev => ({
                                    ...prev,
                                    [`${name}_to`]: e.target.value
                                }));
                            }
                        }}
                        {...props}
                    />
                </FormField>
            </div>
        </div>
    );
};

export default FormRangeFilterField;
