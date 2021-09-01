import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react"
import { Context, ContextProvider } from "../context"
import theme from "../theme/"

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <ContextProvider>
          <Component {...pageProps} />
        </ContextProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
