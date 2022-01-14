export const tagChecker = () => {}

export const tagDataTransform = (data) => {
  const items = [...data]
  items.shift()
  const _items = items.map((item) => {
    const _item = {
      name: item.data[0],
      parent: item.data[1]
    }

    if (item.data[1]) {
      _item.parent
    }

    return _item
  })

  return _items
}

export const transformTagsToExport = (data) => {
  const _data = data.map((tag) => {
    //Pendientes de la REF de apuntes y proyectos del back
    const { id, name, ref, parent, notes, projects, relatedTags } = tag
    const obj = {
      "ID DB": id,
      "ID VTI": ref,
      Nombre: name,
      Padre: parent && parent?.name,
      "Tags relacionados": relatedTags.map((rt) => rt.name).join(", ")
    }

    if (tag.notes) {
      obj.Apuntes = notes?.map((ap) => ap?.ref).join(", ")
    }
    if (tag.projects) {
      obj.Proyectos = projects?.map((pr) => pr?.ref).join(", ")
    }
    return obj
  })
  return _data
}
