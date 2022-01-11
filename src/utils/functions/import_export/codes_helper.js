export const codeChecker = () => {}

export const codeDataTransform = (data) => {
  const items = [...data]
  items.shift()
  const _items = items.map((item) => {
    const _item = {
      name: item.data[0]
    }
    return _item
  })

  return _items
}

export const transformCodesToExport = (data) => {
  const _data = data.map((code) => {
    const { _id, ref, name, testSystems } = code
    return {
      "ID DB": _id,
      "ID VTI": ref,
      Nombre: name,
      "Sistemas de ensayo": testSystems.map((ts) => ts).join(", ")
    }
  })
  return _data
}
