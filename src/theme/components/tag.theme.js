import { useAriaHidden } from "@chakra-ui/react"

export const Tag = {
  baseStyle: {
    container: {
      fontSize: "10px",
      padding: "8px 8px 5px 0",
      overflow: "hidden",
      width:"fit-content",
      height:"28px"
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
