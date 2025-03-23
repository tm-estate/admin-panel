import React, { useEffect, useState, useId, useCallback, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { fetchAutocompleteOptions } from '@/stores/slices/autocompleteSlice';

const mountedInstances = new Set();

interface AsyncSelectFieldProps {
  field: any;
  form: any;
  initialOption?: any;
  initialValue?: string;
  itemRef: string;
  showField: string;
  isMulti?: boolean;
  placeholder?: string;
  limit?: number;
  customFilter?: string;
  className?: string;
  onChange?: (selectedOption: any) => void;
}

const AsyncSelectField: React.FC<AsyncSelectFieldProps> = ({
                            field,
                            form,
                            initialOption,
                            initialValue,
                            itemRef,
                            showField,
                            isMulti = false,
                            placeholder = 'Select...',
                            limit = 100,
                            customFilter = '',
                            className = '',
                            onChange,
                          }) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<any>(isMulti ? [] : null);
  const componentId = useId();
  const fetchedRef = useRef(false);
  const instanceRef = useRef(`${itemRef}_${componentId}`);

  const cachedOptions = useAppSelector(state =>
      (state.autocomplete?.items?.[itemRef] || []) as any[]
  );

  const isLoading = useAppSelector(state =>
      state.autocomplete?.loading?.[itemRef] || false
  );

  useEffect(() => {
    const instanceId = instanceRef.current;

    if (!mountedInstances.has(instanceId)) {
      mountedInstances.add(instanceId);

      if (!fetchedRef.current && cachedOptions.length === 0 && !isLoading) {
        fetchedRef.current = true;

        Promise.resolve().then(() => {
          dispatch(fetchAutocompleteOptions({
            entityType: itemRef,
            limit,
            customFilter
          }));
        });
      }
    }

    return () => {
      mountedInstances.delete(instanceId);
    };
  }, [dispatch, itemRef, limit, customFilter, cachedOptions.length, isLoading]);

  useEffect(() => {
    if (cachedOptions.length === 0 || (value && (isMulti ? value.length > 0 : true))) {
      return;
    }

    try {
      if (initialOption) {
        setValue(initialOption);
      }
      else if (initialValue) {
        if (isMulti) {
          const valueArray = initialValue.split(',');
          if (valueArray.length) {
            const selectedValues = valueArray
                .map(val => {
                  const foundOption = cachedOptions.find(opt =>
                      String(opt._id) === val
                  );
                  return foundOption ? {
                    value: foundOption._id,
                    label: foundOption[showField] || foundOption.name || val,
                    original: foundOption
                  } : null;
                })
                .filter(Boolean);

            if (selectedValues.length) {
              setValue(selectedValues);
            }
          }
        } else {
          const foundOption = cachedOptions.find(opt =>
              String(opt._id) === initialValue
          );

          if (foundOption) {
            setValue({
              value: foundOption._id,
              label: foundOption[showField] || foundOption.name || initialValue,
              original: foundOption
            });
          }
        }
      }
      else if (field.value) {
        if (isMulti && Array.isArray(field.value) && field.value.length) {
          const selectedValues = field.value
              .map(val => {
                const foundOption = cachedOptions.find(opt =>
                    String(opt._id) === String(val)
                );
                return foundOption ? {
                  value: foundOption._id,
                  label: foundOption[showField] || foundOption.name || val,
                  original: foundOption
                } : null;
              })
              .filter(Boolean);

          if (selectedValues.length) {
            setValue(selectedValues);
          }
        } else if (!isMulti && field.value) {
          const foundOption = cachedOptions.find(opt =>
              String(opt._id) === String(field.value)
          );

          if (foundOption) {
            setValue({
              value: foundOption._id,
              label: foundOption[showField] || foundOption.name || field.value,
              original: foundOption
            });
          }
        }
      }
    } catch (error) {
      console.error("Error initializing AsyncSelectField:", error);
    }
  }, [cachedOptions.length > 0]);

  const formattedOptions = React.useMemo(() => {
    return cachedOptions.map(option => ({
      value: option._id,
      label: option[showField] || option.name || option.title || option.label,
      original: option
    }));
  }, [cachedOptions, showField]);

  const handleChange = useCallback((selectedOption) => {
    setValue(selectedOption);

    if (isMulti) {
      form.setFieldValue(
          field.name,
          selectedOption ? selectedOption.map((option: any) => option.value) : []
      );
    } else {
      form.setFieldValue(
          field.name,
          selectedOption ? selectedOption.value : null
      );
    }

    if (onChange) {
      onChange(selectedOption);
    }
  }, [field.name, form, isMulti, onChange]);

  const loadOptions = useCallback(async (inputValue: string) => {
    if (!inputValue || inputValue.length < 2) {
      return formattedOptions;
    }

    try {
      const resultAction = await dispatch(fetchAutocompleteOptions({
        entityType: itemRef,
        search: inputValue,
        limit,
        customFilter
      })).unwrap();

      return resultAction.data.map(option => ({
        value: option._id,
        label: option[showField] || option.name || option.title || option.label,
        original: option
      }));
    } catch (error) {
      console.error(`Error loading options for ${itemRef}:`, error);
      return formattedOptions;
    }
  }, [dispatch, itemRef, limit, customFilter, showField, formattedOptions]);

  return (
      <AsyncSelect
          key={`async-select-${itemRef}-${field.name}`}
          classNames={{
            control: () => `px-1 py-2 ${className}`
          }}
          instanceId={field.name || componentId}
          value={value}
          loadOptions={loadOptions}
          isLoading={isLoading && cachedOptions.length === 0}
          onChange={handleChange}
          isMulti={isMulti}
          placeholder={placeholder}
          isClearable={true}
          defaultOptions={formattedOptions}
          cacheOptions={true}
          closeMenuOnSelect={!isMulti}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
      />
  );
};

export default React.memo(AsyncSelectField);
