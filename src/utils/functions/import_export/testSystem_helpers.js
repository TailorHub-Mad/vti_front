export const testSystemChecker = () => {}

export const testSystemDataTransform = (data) => {
  const items = [...data]
  items.shift()
  const _items = items.map((item) => {
    const _item = {
      vtiCode: item.data[0],
      alias: item.data[1],
      client: item.data[3]
    }

    if (item.data[2]) {
      _item.date = {
        year: item.data[2]
      }
    }

    return _item
  })

  return _items
}

export const transformTestSystemsToExport = (data) => {
  const _data = data.map((testSystem) => {
    const { _id, ref, alias, clientAlias, vtiCode, date, projects, notes } =
      testSystem
    return {
      "ID DB": _id,
      "ID VTI": ref,
      Alias: alias,
      Cliente: clientAlias,
      "Código VTI": vtiCode,
      Año: date?.year,
      "Proyectos asociados al sistema": projects.map((pr) => pr.alias).join(", "),
      "Apuntes asociados al sistema": notes
        ?.map((note) => (note.ref ? note.ref : ""))
        .join(", ")
    }
  })
  return _data
}
