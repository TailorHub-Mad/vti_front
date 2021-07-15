import { useAriaHidden } from "@chakra-ui/react"

export const Tag = {
  baseStyle: {
    container: {
      fontSize: "10px",
      lineHeight: "13px",
      padding: "5.5px 8px",
      overflow: "hidden",
      width:"fit-content",
    },

  },
  variants: {
    project: {
      container: {
        backgroundColor: "violete",
        borderRadius: "50px",
      },
    },
    testSystem: {
      container: {
        backgroundColor: "pale_yellow",
        borderRadius: "50px",
      },
    },
    note: {
      container: {
        backgroundColor: "light_blue",
        borderRadius: "50px",
      },
    },
  },
}
