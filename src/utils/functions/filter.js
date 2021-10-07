export const generateFilterQueryObj = (keyRef, values) => {
  const queryObj = Object.entries(values).reduce((ac, [name, value]) => {
    if (value && keyRef[name]) {
      if (Array.isArray(value) && keyRef[name]) {
        ac[keyRef[name]] = value[0]?.value ? value[0].value : value[0]
      } else {
        ac[keyRef[name]] = value?.value ? value.value : value
      }
    }
    return ac
  }, {})

  return queryObj
}
