import React, { useEffect, useId, useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

export const AsyncSelectField = ({ options, field, form, itemRef, showField }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    console.log({ itemRef })
    if (options?._id) {
      setValue({ value: options._id, label: options[showField] })
      // setValue(options.map((el) => ({ value: el._id, label: el[showField] })))
      form.setFieldValue(
        field.name,
        field.value?.id
      )
    }
  }, [options])

  // useEffect(() => {
  //   if (options?.id && field?.value?.id) {
  //     setValue({ value: field.value?.id, label: field.value[showField] });
  //     form.setFieldValue(field.name, field.value?.id);
  //   }
  // }, [options?.id, field?.value?.id]);

  const mapResponseToValuesAndLabels = (data) => ({
    value: data._id,
    label: data[showField],
  });
  const handleChange = (option) => {
    form.setFieldValue(field.name, option.value);
    setValue(option);
  };

  async function callApi() {
    console.log(3333)
    const { data } = await axios(`/${itemRef}/autocomplete?limit=100`);
    const test = data.data.map(mapResponseToValuesAndLabels);

    console.log({ test })

    return test
  }
  return (
    <AsyncSelect
      classNames={{
        control: () => 'px-1 py-2',
      }}
      instanceId={field.name || useId()}
      value={value}
      loadOptions={callApi}
      onChange={handleChange}
      defaultOptions
    />
  );
};
