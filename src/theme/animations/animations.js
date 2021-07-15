import { css } from "@emotion/react"

export const BLINK_ANIMATION = css`
  @keyframes blink {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  animation: blink 1s alternate infinite;
`
