const inputThemes = {
  variants: {
    base: {
      field: {
        bg: "light_grey",
        borderRadius: "2px",
        border: "1px",
        padding: "16px 8px",
        height: "48px",
        borderColor: "light_grey",
        fontSize: ["16px", "17px"],
        lineHeight: ["21px", "18.70px"],
        boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)",
        placeholder: {
          color: "red"
        },
        _disabled: {
          _hover: {
            borderColor: "light_grey"
          },
          opacity: 0.6
        },
        _focus: {
          borderColor: "blue.500"
        },
        _invalid: {
          borderColor: "error"
        },
        _hover: {
          borderColor: "blue.500"
        }
      }
    },
    white: {
      field: {
        bg: "white",
        borderRadius: "2px",
        border: "1px",
        padding: "16px 8px",
        height: "48px",
        borderColor: "white",
        fontSize: ["16px", "14px"],
        lineHeight: ["21px", "18.70px"],
        _focus: {
          borderColor: "blue.500"
        },
        _invalid: {
          borderColor: "error"
        },
        _hover: {
          borderColor: "blue.500"
        }
      }
    }
  },
  defaultProps: {
    variant: "base"
  }
}

export const Input = { ...inputThemes }

export const Textarea = { ...inputThemes }
