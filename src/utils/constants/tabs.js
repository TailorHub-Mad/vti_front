export const variantGeneralTag = {
  NOTE: "pale_yellow",
  PROJECT: "violete",
  SYSTEM: "light_blue"
}

export const formatTags = (tags, field) => {
  const data = Array.isArray(tags) ? tags : [{ ...tags }]
  return data.map((tag) => tag[field])
}
