import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react"
import { ContextProvider } from "../context"
import ApiUserProvider from "../provider/ApiAuthProvider"
import theme from "../theme/"

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <ApiUserProvider>
          <ContextProvider>
            <Component {...pageProps} />
          </ContextProvider>
        </ApiUserProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
