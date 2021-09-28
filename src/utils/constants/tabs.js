export const variantGeneralTag = {
  NOTE: "pale_yellow",
  PROJECT: "violete",
  SYSTEM: "light_blue"
}

export const getRemainingTags = (tags, max = 3) =>
  tags.length < max ? 0 : tags.length - 2

export const formatTags = (tags, field) => {
  const data = Array.isArray(tags) ? tags : [{ ...tags }]
  return data.map((tag) => tag[field])
}
