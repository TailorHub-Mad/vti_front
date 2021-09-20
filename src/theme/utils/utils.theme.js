//   The -webkit-scrollbar family of properties consists of seven different pseudo-elements that, together, comprise a full scrollbar UI element:
//   ::-webkit-scrollbar addresses the background of the bar itself. It is usually covered by the other elements
//   ::-webkit-scrollbar-button addresses the directional buttons on the scrollbar
//   ::-webkit-scrollbar-track addresses the empty space “below” the progress bar
//   ::-webkit-scrollbar-track-piece is the top-most layer of the the progress bar not covered by the draggable scrolling element (thumb)
//   ::-webkit-scrollbar-thumb addresses the draggable scrolling element that resizes depending on the size of the scrollable element
//   ::-webkit-scrollbar-corner addresses the (usually) bottom corner of the scrollable element, where two scrollbars might meet
//   ::-webkit-resizer addresses the draggable resizing handle that appears above the scrollbar-corner at the bottom corner of some elements

export const CUSTOM_SCROLLBAR = {
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
    borderRadius: "8px",
    backgroundColor: `transparent`
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: `blue.400`,
    width: "8px",
    borderRadius: "8px",
    border: "0px solid transparent",
    backgroundClip: "content-box"
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: `blue.500`
  }
}
