import dayjs from 'dayjs'

export default {
  capitalize(str) {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
  },
  filesFormatter(arr) {
    if (!arr || !arr.length) return []
    return arr.map((item) => item)
  },
  imageFormatter(arr) {
    if (!arr || !arr.length) return []
    return arr.map((item) => ({
      publicUrl: item.publicUrl || '',
    }))
  },
  oneImageFormatter(arr) {
    if (!arr || !arr.length) return ''
    return arr[0].publicUrl || ''
  },
  dateFormatter(date) {
    if (!date) return ''
    return dayjs(date).format('YYYY-MM-DD')
  },
  dateTimeFormatter(date) {
    if (!date) return ''
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  },
  booleanFormatter(val) {
    return val ? 'Yes' : 'No'
  },

  deal_typesManyListFormatter(val, showField = 'titleRu') {
    if (!val || !val.length) return []
    return val.map((item) => item[showField])
  },
  deal_typesOneListFormatter(val, showField = 'titleRu') {
    if (!val) return ''
    return val[showField]
  },
  deal_typesManyListFormatterEdit(val) {
    if (!val || !val.length) return []
    return val.map((item) => {
      return { id: item.id, label: item.id }
    })
  },
  deal_typesOneListFormatterEdit(val) {
    if (!val) return ''
    return { label: val.id, id: val.id }
  },
  property_typesManyListFormatter(val, showField = 'titleRu') {
    if (!val || !val.length) return []
    return val.map((item) => item[showField])
  },
  property_typesOneListFormatter(val, showField = 'titleRu') {
    if (!val) return ''
    return val[showField]
  },
  property_typesManyListFormatterEdit(val) {
    if (!val || !val.length) return []
    return val.map((item) => {
      return { id: item.id, label: item.id }
    })
  },
  property_typesOneListFormatterEdit(val) {
    if (!val) return ''
    return { label: val.id, id: val.id }
  },

  product_parameter_itemsManyListFormatter(val, showField) {
    if (!val || !val.length) return []
    return val.map((item) => item[showField])
  },
  product_parameter_itemsOneListFormatter(val) {
    if (!val) return ''
    return val.id
  },
  product_parameter_itemsManyListFormatterEdit(val) {
    if (!val || !val.length) return []
    return val.map((item) => {
      return { id: item.id, label: item.id }
    })
  },
  product_parameter_itemsOneListFormatterEdit(val) {
    if (!val) return ''
    return { label: val.id, id: val.id }
  },

  city_areasManyListFormatter(val, showField) {
    if (!val || !val.length) return []
    return val.map((item) => item[showField])
    // if (!val || !val.length) return []
    // return val.map((item) => item.id)
  },
  city_areasOneListFormatter(val, showField = 'titleRu') {
    if (!val) return ''
    return val[showField]
  },
  city_areasManyListFormatterEdit(val) {
    if (!val || !val.length) return []
    return val.map((item) => {
      return { id: item.id, label: item.id }
    })
  },
  city_areasOneListFormatterEdit(val) {
    if (!val) return ''
    return { label: val.id, id: val.id }
  },

  citiesManyListFormatter(val, showField) {
    if (!val || !val.length) return []
    return val.map((item) => item[showField])
  },
  citiesOneListFormatter(val, showField = 'titleRu') {
    if (!val) return ''
    return val[showField]
  },
  citiesManyListFormatterEdit(val) {
    if (!val || !val.length) return []
    return val.map((item) => {
      return { id: item.id, label: item.id }
    })
  },
  citiesOneListFormatterEdit(val) {
    if (!val) return ''
    return { label: val.id, id: val.id }
  },
  phoneFormatter(str) {
    const regex = /^993(\d{2})(\d{6})$/;
    console.log({str})
    const match = str.match(regex);

    console.log({match})
    const operatorCode = match[1];
    const subscriberNumber = match[2];

    return `+993 (${operatorCode}) ${subscriberNumber}`;
  }
}
