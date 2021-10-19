export const Checkbox = {
  baseStyle: {
    input: {
      outline: "none",
      _focus: { boxShadow: "none", outline: "none" }
    },
    outline: "none",
    _focus: { boxShadow: "none", outline: "none" },
    _active: { boxShadow: "none", outline: "none" }
  },
  variants: {
    filter: {
      container: {
        width: "fit-content",
        alignItems: "center"
      },
      label: {
        fontSize: "14px",
        lineHeight: "normal"
      }
    }
  }
}
