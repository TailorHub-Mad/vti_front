export const MOCK_SELECT_OPTIONS = [
  { label: "Tag 1", value: "tag1" },
  { label: "Lorem Ipsum", value: "tag2" },
  { label: "Tag 3", value: "tag3" },
  { label: "Tag 4", value: "tag4" },
  { label: "Tag 5", value: "tag5" },
  { label: "Test Proyecto", value: "tag6" },
  { label: "Tag 7", value: "tag7" },
  { label: "Actuación", value: "tag8" },
  { label: "Tag 9", value: "tag9" },
  { label: "Tag 10", value: "tag10" },
  { label: "Tag 11", value: "tag11" }
]

export const MOCK_YEAR_OPTIONS = new Array(40).fill("").map((_, idx) => {
  const _year = new Date().getFullYear() - idx
  return { label: _year, value: _year }
})
