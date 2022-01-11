export const projectChecker = () => {}

export const projectDataTransform = (data) => {
  const items = [...data]
  items.shift()
  const _items = items.map((item) => {
    const _item = {
      alias: item.data[0],
      client: item.data[1],
      sector: item.data[2],
      date: {
        year: item.data[3]
      },
      focusPoint: item.data[6]
    }

    if (item.data[4]) {
      _item.date.month = item.data[4]
    }
    if (item.data[5]) {
      _item.date.day = item.data[5]
    }
    if (item.data[7]) {
      _item.testSystems = item.data[7].split(" ").map((el) => el.trim())
    }

    if (item.data[8]) {
      _item.tags = item.data[8].split(" ").map((el) => el.trim())
    }

    return _item
  })

  return _items
}

export const transformProjectsToExport = (data) => {
  const _data = data.map((project) => {
    const {
      _id,
      alias,
      sector,
      focusPoint,
      testSystems,
      tags,
      notes,
      ref,
      isActive
    } = project
    return {
      "ID DB": _id,
      "ID VTI": ref,
      Alias: alias,
      Sector: sector[0]?.title,
      "Puntos Focales": focusPoint.map((fp) => fp?.name).join(", "),
      "Sistemas de ensayo": testSystems?.map((ts) => ts?.alias),
      "Tags de proyecto": tags.map((tag) => tag?.name).join(", "),
      // users: users.map((us) => us?.alias).join(", "),
      Apuntes: notes?.map((note) => note?.ref),
      Finalizado: isActive ? "No" : "Si"
    }
  })
  return _data
}
