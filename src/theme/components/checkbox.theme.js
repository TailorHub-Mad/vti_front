export const Checkbox = {
  baseStyle: {
    input: {
      outline: "none",
      _disabled: {
        borderRadius: "50% !important",
        border: "2px solid #C4C4C4"
      }
    },
    label: {},
    outline: "none",
    _disabled: {
      borderRadius: "50% !important",
      border: "2px solid #C4C4C4"
    }
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
        borderRadius: "50% !important",
        _disabled: {
          borderRadius: "50% !important",
          border: "2px solid #C4C4C4"
        }
      },
      control: {
        borderRadius: "50% !important"
      }
    }
  }
}
