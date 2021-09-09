import { ChakraProvider } from "@chakra-ui/react"
import ApiAuthProvider from "../provider/ApiAuthProvider"
import ToastProvider from "../provider/ToastProvider"
import { SWRConfig } from "swr"
import theme from "../theme/"

function MyApp({ Component, pageProps }) {
  const swrConfig = { provider: () => new Map() }

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ApiAuthProvider>
        <SWRConfig value={swrConfig}>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </SWRConfig>
      </ApiAuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
