export const Modal = {
  baseStyle: {
    overlay: {
      bgColor: "rgba(5, 46, 87, 0.8)",
      zIndex: "10000",
      overflow: "auto"
    },
    dialog: {
      pointerEvents: "auto"
    },
    dialogContainer: {
      pointerEvents: "none",
      zIndex: "10001"
    }
  },
  variants: {
    response: {
      overlay: {
        bgColor: "rgba(5, 46, 87, 0.8)",
        zIndex: "100000",
        overflow: "auto"
      },
      dialog: {
        pointerEvents: "auto"
      },
      dialogContainer: {
        pointerEvents: "none",
        zIndex: "100001"
      }
    }
  }
}
