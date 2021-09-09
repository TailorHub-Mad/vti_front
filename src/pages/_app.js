import { ChakraProvider } from "@chakra-ui/react"
import ApiUserProvider from "../provider/ApiAuthProvider"
import ApiToastProvider from "../provider/ApiToastProvider"
import { SWRConfig } from "swr"
import theme from "../theme/"

function MyApp({ Component, pageProps }) {
  const swrConfig = { provider: () => new Map() }

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ApiUserProvider>
        <SWRConfig value={swrConfig}>
          <ApiToastProvider>
            <Component {...pageProps} />
          </ApiToastProvider>
        </SWRConfig>
      </ApiUserProvider>
    </ChakraProvider>
  )
}

export default MyApp
