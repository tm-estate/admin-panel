import React, {useCallback, useEffect, useState} from 'react'
import Switch from 'react-switch'

interface SwitchFieldProps {
  field: any;
  form: any;
  className?: string;
  onChange?: (checked: boolean) => void;
}

const SwitchField: React.FC<SwitchFieldProps> = ({ field, form, onChange }) => {
  const [value, setValue] = useState(field.value === true)

  useEffect(() => {
    if (field.value === true) {
      setValue(true)
    } else {
      setValue(false)
    }
  }, [field.value])

  const handleChange = useCallback((checked) => {
    setValue(checked)

    if (onChange) {
      onChange(checked);
    }

    form.setFieldValue(field.name, checked)
  }, [onChange])

  return (
      <Switch
          onColor={'#2563EB'}
          checkedIcon={false}
          uncheckedIcon={false}
          className={'check'}
          onChange={handleChange}
          checked={value}
      />
  )
}

export default SwitchField;
