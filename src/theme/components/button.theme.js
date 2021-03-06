export const Button = {
  baseStyle: {
    fontFamily: "Noway-Regular",
    fontWeight: "400",
    border: "2px solid",
    borderColor: "blue.500",
    h: "48px",
    height: "48px",
    borderRadius: "2px",
    bgColor: "blue.500",
    color: "white",
    textDecoration: "none",
    outline: "none",
    _hover: {
      opacity: 0.8
    },
    _focus: { boxShadow: "none" },
    _disabled: {
      opacity: 1,
      bgColor: "blue.300",
      borderColor: "blue.300",
      pointerEvents: "none"
    }
  },

  variants: {
    primary: {
      minW: "194px",
      fontSize: "17px",
      lineHeight: "18.7px",
      alignItems: "center"
    },
    icon_only: {
      minW: "48px",
      w: "48px",
      h: "48px"
    },
    icon_only_secondary: {
      bg: "white",
      color: "blue.500",
      minW: "48px",
      w: "48px",
      h: "48px",
      _disabled: {
        opacity: 1,
        bgColor: "#EBEEF2",
        pointerEvents: "none",
        border: "none"
      }
    },
    icon_only_secondary_mobile: {
      bg: "white",
      color: "blue.500",
      border: "none",
      minW: "48px",
      w: "48px",
      h: "48px",
      boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)",
      css: {
        boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)"
      },
      _disabled: {
        opacity: 1,
        bgColor: "#EBEEF2",
        pointerEvents: "none",
        border: "none"
      }
    },
    secondary: {
      minW: "194px",
      bg: "white",
      color: "blue.500",
      boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)",
      css: {
        boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)"
      },

      _hover: {
        bg: "#E1E5E8"
      },
      _active: {
        bg: "#B1BCC7"
      },
      _disabled: {
        opacity: 0.3,
        pointerEvents: "none",
        bgColor: "transparent",
        borderColor: "blue.500"
      }
    },
    tool_button: {
      borderColor: "white",
      bg: "white",
      color: "blue.500",
      padding: "16px",
      width: ["46px", "46px", "46px", "auto"],
      fontSize: ["0", "0", "0", "17px"],
      boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)",
      _hover: {
        bg: "blue.500",
        borderColor: "blue.500",
        color: "white"
      },
      _active: {
        bg: "#B1BCC7"
      },
      _disabled: {
        opacity: 0.3,
        pointerEvents: "none",
        bgColor: "transparent",
        borderColor: "transparent"
      }
    },
    filter_button: {
      fontFamily: "Noway-Medium",
      fontSize: "14px",
      minW: "32px",
      maxW: "32px",
      height: "27px",
      bg: "start",
      color: "white",
      boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)",
      borderColor: "start",
      _hover: {
        opacity: 0.6
      },
      _disabled: {
        opacity: 0.3,
        pointerEvents: "none",
        bgColor: "transparent",
        bg: "start",
        borderColor: "start"
      }
    },
    note_content: {
      fontFamily: "Noway-Regular",
      fontSize: "10px",
      minW: "32px",
      height: "25px",
      bg: "white",
      color: "blue.500",
      borderColor: "blue.500",
      boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)",
      padding: "8px 24px",
      border: "1px solid",
      _hover: {
        opacity: 0.6
      },
      _disabled: {
        opacity: 0.3,
        pointerEvents: "none",
        bgColor: "white",
        borderColor: "blue.500"
      }
    },
    text_only: {
      fontFamily: "Noway-Regular",
      fontSize: "14px",
      border: "none",
      bgColor: "transparent",
      color: "blue.500",
      width: "fit-content",
      margin: "0 auto",
      display: "block",
      _disabled: {
        opacity: 0.3,
        pointerEvents: "none",
        bgColor: "transparent",
        borderColor: "transparent"
      }
    }
  },
  defaultProps: {
    variant: "primary"
  }
}
