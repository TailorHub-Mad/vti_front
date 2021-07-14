import React from "react"
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react"
import theme from "../src/theme"



export const decorators = [
  (Story) => (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Story />
      </ColorModeProvider>
    </ChakraProvider>
  ),
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
