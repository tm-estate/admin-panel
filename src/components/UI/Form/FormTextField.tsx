import React from 'react';
import { Field } from 'formik';
import FormField from '@/components/FormField';
import TextField from '@/components/UI/TextField';

interface FormTextFieldProps {
    name: string;
    id?: string;
    label?: string;
    placeholder?: string;
    help?: string;
    icon?: string;
    isBorderless?: boolean;
    isTransparent?: boolean;
    hasTextareaHeight?: boolean;
    className?: string;
    type?: string;
    disabled?: boolean;
    required?: boolean;
    autoFocus?: boolean;
    setFormValues?: (values: any) => void;
}

/**
 * A TextField component wrapped with FormField
 */
const FormTextField: React.FC<FormTextFieldProps> = ({
                                                         name,
                                                         id = '',
                                                         label = '',
                                                         placeholder = '',
                                                         help = '',
                                                         icon = null,
                                                         isBorderless = false,
                                                         isTransparent = false,
                                                         hasTextareaHeight = false,
                                                         className = '',
                                                         type = 'text',
                                                         disabled = false,
                                                         required = false,
                                                         autoFocus = false,
                                                         setFormValues,
                                                         ...props
                                                     }) => {
    // Generate an ID if none provided
    const fieldId = id || `field-${name}`;

    return (
        <FormField
            label={label + (required ? ' *' : '')}
            labelFor={fieldId}
            help={help}
            icons={icon ? [icon] : undefined}
            isBorderless={isBorderless}
            isTransparent={isTransparent}
            hasTextareaHeight={hasTextareaHeight}
        >
            <Field name={name}>
                {({ field, form, meta }) => (
                    <TextField
                        {...field}
                        id={fieldId}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoFocus={autoFocus}
                        className={className}
                        onChange={(e) => {
                            // Call formik's onChange
                            field.onChange(e);

                            // If setFormValues is provided, update the form values when input changes
                            if (setFormValues) {
                                setFormValues(prev => ({
                                    ...prev,
                                    [name]: e.target.value
                                }));
                            }
                        }}
                        {...props}
                    />
                )}
            </Field>
        </FormField>
    );
};

export default FormTextField;
