import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react"
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
          <Component {...pageProps} />
        </ApiUserProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
