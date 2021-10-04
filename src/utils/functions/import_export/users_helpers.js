export const userChecker = () => {}

export const userDataTransform = (data) => {
  const items = [...data]
  items.shift()
  return items.map((item) => {
    const _item = {
      email: item.data[0],
      password: item.data[1],
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
    const { _id, alias, name, lastName, department, focusPoint } = user
    return {
      _id,
      alias,
      department: department && department.name,
      name,
      lastName,
      focusPoint
    }
  })
  return _data
}
