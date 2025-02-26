import React, { useEffect, useState } from 'react';
import Select, { components, ControlProps, Props } from 'react-select';

export const SelectField = ({ field, form, options, setSelectedOption, ...props }) => {
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption)
    form.setFieldValue(field.name, selectedOption);
  };

  return (
      <Select
          {...props}
          classNames={{ control: () => 'px-1 py-2' }}
          options={options} // ✅ Ensure options are correctly passed
          value={options.find((opt) => opt.title === field.value?.title) || null} // ✅ Ensure correct value selection
          onChange={handleChange}
          getOptionLabel={(e) => e.label} // ✅ Ensure correct display text
          getOptionValue={(e) => e.title} // ✅ Ensure correct value selection
      />
  );
};
