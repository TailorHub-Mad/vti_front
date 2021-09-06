import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react"
import ApiUserProvider from "../provider/ApiAuthProvider"
import ApiToastProvider from "../provider/ApiToastProvider"
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
          <ApiToastProvider>
            <Component {...pageProps} />
          </ApiToastProvider>
        </ApiUserProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
