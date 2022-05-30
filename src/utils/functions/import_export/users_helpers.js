export const userChecker = () => {}

export const userDataTransform = (data) => {
  const items = [...data]
  items.shift()
  return items.map((item) => {
    const _item = {
      email: item.data[0],
      name: item.data[1],
      alias: item.data[2],
      department: item.data[3]
    }
    if (item.data[4]) {
      _item.name = item.data[4]
    }
    if (item.data[5]) {
      _item.lasName = item.data[5]
    }
    return _item
  })
}

export const transformUsersToExport = (data) => {
  const _data = data.map((user) => {
    const { _id, alias, name, ref, email, department, focusPoint } = user
    return {
      "ID DB": _id,
      "ID VTI": ref,
      Alias: alias,
      Departamento: department && department.name,
      Nombre: name,
      Email: email,
      "Proyectos donde es punto focal": focusPoint.join(", ")
    }
  })
  return _data
}
