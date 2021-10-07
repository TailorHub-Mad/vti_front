export const FormLabel = {
  variants: {
    base: {
        fontFamily: "Noway-Medium",
        fontSize: ["14px", "14px"],
        lineHeight: ["16px", "16px"],
        marginBottom: "2.5px !important",
        _disabled: {
          _hover: {
            borderColor: "light_grey"
          },
          opacity: 0.6
        },
    },
    
  },
  defaultProps: {
    variant: "base"
  }
}

