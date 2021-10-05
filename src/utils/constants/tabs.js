export const variantGeneralTag = {
  NOTE: "pale_yellow",
  PROJECT: "violete",
  SYSTEM: "light_blue",
  FINISH: "green_finish"
}

export const formatTags = (tags, field) => {
  const data = Array.isArray(tags) ? tags : [{ ...tags }]
  return data.map((tag) => tag[field])
}
