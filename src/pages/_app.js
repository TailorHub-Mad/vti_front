import { ChakraProvider } from "@chakra-ui/react"
import ApiAuthProvider from "../provider/ApiAuthProvider"
import ToastProvider from "../provider/ToastProvider"
import ErrorProvider from "../provider/ErrorProvider"
import { SWRConfig } from "swr"
import theme from "../theme/"

function MyApp({ Component, pageProps }) {
  const swrConfig = { provider: () => new Map() }

  return (
    <ChakraProvider resetCSS theme={theme}>
      <SWRConfig value={swrConfig}>
        <ApiAuthProvider>
          <ErrorProvider>
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </ErrorProvider>
        </ApiAuthProvider>
      </SWRConfig>
    </ChakraProvider>
  )
}

export default MyApp
