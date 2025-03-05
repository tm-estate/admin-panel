import React, { useEffect, useState } from 'react';
import Select, { components, ControlProps, Props } from 'react-select';

export const SelectField = ({ field, form, options, setSelectedOption, initial, showField }) => {
  const [value, setValue] = useState(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    if(initial) {
      setValue({value: initial._id, label: initial[showField]});
      form.setFieldValue(
          field.name,
          field.value?.id
      )
    }
  }, [initial])

  const mapResponseToValuesAndLabels = (data) => ({
    value: data._id,
    label: data[showField],
  })

  const handleChange = (option) => {
    setValue(option);
    form.setFieldValue(field.name, option.value);
  };

  return (
      <Select
          classNames={{ control: () => 'px-1 py-2' }}
          options={options.map(mapResponseToValuesAndLabels)} // ✅ Ensure options are correctly passed
          value={value} // ✅ Ensure correct value selection
          onChange={handleChange}
          getOptionLabel={(e) => e.label} // ✅ Ensure correct display text
          getOptionValue={(e) => e.label} // ✅ Ensure correct value selection
      />
  );
};
