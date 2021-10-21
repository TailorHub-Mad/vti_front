export const Checkbox = {
  baseStyle: {
    input: {
      outline: "none"
    },
    outline: "none"
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
    },
    multi: {
      container: {},
      input: {
        borderRadius: "50% !important"
      },
      control: {
        borderRadius: "50% !important"
      }
    }
  }
}
