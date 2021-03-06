export const departmentChecker = () => {}

export const departmentDataTransform = (data) => {
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

export const transformDepartmentsToExport = (data) => {
  const _data = data.map((department) => {
    const { _id, ref, users, name } = department
    return {
      "ID DB": _id,
      "ID VTI": ref,
      Nombre: name,
      Usuarios: users && users.map((us) => us.alias).join(", ")
    }
  })
  return _data
}
