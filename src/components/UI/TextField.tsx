import React, { useState, useEffect } from 'react';
import { useField } from 'formik';

interface TextFieldProps {
    name: string;
    id: string;
    placeholder?: string;
    className?: string;
    label?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<TextFieldProps> = ({
                                                 name,
                                                 id,
                                                 placeholder = 'Enter value',
                                                 className = '',
                                                 label,
                                                 disabled = false,
                                                 autoFocus = false,
                                                 type = 'text',
                                                 onChange,
                                                 onBlur,
                                                 ...props
                                             }) => {
    const [field, meta] = useField(name);

    const [localValue, setLocalValue] = useState(field.value || '');

    useEffect(() => {
        setLocalValue(field.value || '');
    }, [field.value]);

    const controlClasses = [
        'w-full py-3.5 px-3 border-gray-300 rounded dark:placeholder-gray-400',
        'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none bg-white',
        'dark:bg-slate-800 border',
        meta.touched && meta.error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
    ].join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        field.onChange(e);

        if (onChange) {
            onChange(e);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        field.onBlur(e);

        if (onBlur) {
            onBlur(e);
        }
    };

    return (
        <div className="flex flex-col w-full">
            {label && (
                <label htmlFor={id} className="text-gray-500 font-bold mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                className={`${controlClasses} ${className}`}
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                {...props}
            />
            {meta.touched && meta.error && (
                <div className="text-red-500 text-xs mt-1">{meta.error}</div>
            )}
        </div>
    );
};

export default TextField;
