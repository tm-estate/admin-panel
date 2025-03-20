import React, { useState, useEffect } from 'react';
import { Field, useField } from 'formik';

interface SearchFieldProps {
    name: string;
    id: string;
    placeholder?: string;
    className?: string;
    label?: string;
    disabled?: boolean;
    autoFocus?: boolean;
}

const SearchField: React.FC<SearchFieldProps> = ({
                                                     name,
                                                     id,
                                                     placeholder = 'Search...',
                                                     className = '',
                                                     label,
                                                     disabled = false,
                                                     autoFocus = false,
                                                     ...props
                                                 }) => {
    const [field, meta] = useField(name);

    const controlClasses = [
        'w-full py-3.5 px-3 border-gray-300 rounded dark:placeholder-gray-400 ',
        'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none bg-white ',
        'dark:bg-slate-800 border',
        meta.touched && meta.error  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
    ].join('')
    const [localValue, setLocalValue] = useState(field.value || '');

    useEffect(() => {
        setLocalValue(field.value || '');
    }, [field.value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== field.value) {
                field.onChange({ target: { name, value: localValue } });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localValue, field, name]);

    return (
        <div className="flex flex-col w-full">
            {label && (
                <label htmlFor={id} className="text-gray-500 font-bold mb-1">
                    {label}
                </label>
            )}
            <input
                type="text"
                id={id}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                className={`${controlClasses} ${className}`}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={field.onBlur}
                {...props}
            />
            {meta.touched && meta.error && (
                <div className="text-red-500 text-xs mt-1">{meta.error}</div>
            )}
        </div>
    );
};

export default SearchField;
