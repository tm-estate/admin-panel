import React, { useEffect, useState, useRef, useCallback } from 'react';
import Select from 'react-select';

interface SelectFieldProps {
    field: any;
    form: any;
    options: any[];
    setSelectedOption?: (option: any) => void;
    initial?: any;
    initialValue?: string;
    showField?: string;
    isMulti?: boolean;
    placeholder?: string;
    className?: string;
    onChange?: (selectedOption: any) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
                         field,
                         form,
                         options,
                         setSelectedOption,
                         initial,
                         initialValue,
                         showField = 'label',
                         isMulti = false,
                         placeholder = 'Select...',
                         className = '',
                         onChange
                     }) => {
    const [value, setValue] = useState(null);
    const initializedRef = useRef(false);

    const mappedOptions = React.useMemo(() => {
        return options.map(item => ({
            value: item._id || item.key,
            label: item[showField] || item.label,
            key: item.selectType,
            original: item
        }));
    }, [options, showField]);

    useEffect(() => {
        if (initializedRef.current) return;

        if (initial) {
            setValue(initial);
            initializedRef.current = true;
            return;
        }

        if (initialValue) {
            if (isMulti) {
                try {
                    const valueArray = initialValue.split(',');
                    if (valueArray.length) {
                        const selectedValues = valueArray
                            .map(val => {
                                return mappedOptions.find(opt =>
                                    String(opt.value) === val
                                ) || null;
                            })
                            .filter(Boolean);

                        if (selectedValues.length) {
                            setValue(selectedValues);
                            initializedRef.current = true;
                            return;
                        }
                    }
                } catch (error) {
                    console.error("Error setting initial values in SelectField:", error);
                }
            }
            else {
                const foundOption = mappedOptions.find(opt =>
                    String(opt.value) === initialValue
                );

                if (foundOption) {
                    setValue(foundOption);
                    initializedRef.current = true;
                    return;
                }
            }
        }

        if (field.value && !initializedRef.current) {
            if (isMulti && Array.isArray(field.value)) {
                const selectedValues = field.value
                    .map(val => {
                        return mappedOptions.find(opt =>
                            String(opt.value) === String(val)
                        ) || null;
                    })
                    .filter(Boolean);

                if (selectedValues.length) {
                    setValue(selectedValues);
                    initializedRef.current = true;
                }
            }
            else if (!isMulti && field.value) {
                const foundOption = mappedOptions.find(opt =>
                    String(opt.value) === String(field.value)
                );

                if (foundOption) {
                    setValue(foundOption);
                    initializedRef.current = true;
                }
            }
        }
    }, []);

    const handleChange = useCallback((option) => {
        setValue(option);

        if (isMulti) {
            form.setFieldValue(
                field.name,
                option ? option.map(item => item.value) : []
            );
        } else {
            form.setFieldValue(field.name, option ? option.value : null);
        }

        if (setSelectedOption && option) {
            if (!isMulti && option.original) {
                setSelectedOption(option.original);
            }
            else if (isMulti && Array.isArray(option)) {
                setSelectedOption(option.map(o => o.original));
            }
        }

        if (onChange) {
            onChange(option);
        }
    }, [field.name, form, isMulti, onChange, setSelectedOption]);

    return (
        <Select
            classNames={{
                control: () => `px-1 py-2 ${className}`
            }}
            options={mappedOptions}
            value={value}
            onChange={handleChange}
            isMulti={isMulti}
            placeholder={placeholder}
            isClearable={isMulti}
            closeMenuOnSelect={!isMulti}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
        />
    );
};

export default SelectField;
