export const Button = {
  baseStyle: {
    fontFamily: "Noway-Regular",
    fontWeight: "400",
    border: "2px solid",
    borderColor: "blue",
    h: "48px",
    height: "48px",
    borderRadius: "2px",
    bgColor: "blue",
    color: "white",
    _hover: {
      opacity: 0.8,
    },
    _disabled: {
      opacity: 0.1,
      pointerEvents: "none",
    },
  },

  variants: {
    primary: {
      minW: "194px",
      fontSize: "17px",
      lineHeight: "18.7px",
      alignItems: "center",
    },
    icon_only: {
      minW: "48px",
      w: "48px",
      h: "48px",
    },
    secondary: {
      minW: "194px",
      bg: "white",
      color: "blue",
      _hover: {
        bg: "#E1E5E8",
      },
      _active: {
        bg: "#B1BCC7",
      },
      _disabled: {
        opacity: 0.3,
        pointerEvents: "none",
      },
    },
  },
  defaultProps: {
    variant: "primary",
  },
}
