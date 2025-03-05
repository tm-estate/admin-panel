import React, { useEffect, useState } from 'react';
import Select, { components, ControlProps, Props } from 'react-select';

export const SelectFieldMany = ({ field, form, options, setSelectedOption, initial, showField }) => {
    const [value, setValue] = useState(null)
    useEffect(() => {
        // console.log(2, {options}, {field}, {initial})
        if(initial) {
            setValue(initial.map((el) => ({value: el._id, label: el[showField]})));
            form.setFieldValue(
                field.name,
                initial.map((el) => ({value: el._id, label: el[showField]}))
            )
        }
    }, [initial])

    const mapResponseToValuesAndLabels = (data) => ({
        value: data._id,
        label: data[showField],
    })
    const handleChange = (options) => {
        console.log({options})
        setValue(options);
        form.setFieldValue(field.name, options.map((el) => el.value));
    };

    return (
        <Select
            classNames={{ control: () => 'px-1 py-2' }}
            options={options.map(mapResponseToValuesAndLabels)} // ✅ Ensure options are correctly passed
            value={value} // ✅ Ensure correct value selection
            onChange={handleChange}
            isMulti
            getOptionLabel={(e) => e.label} // ✅ Ensure correct display text
            getOptionValue={(e) => e.value} // ✅ Ensure correct value selection
        />
    );
};
