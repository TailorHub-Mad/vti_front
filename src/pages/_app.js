import { ChakraProvider } from "@chakra-ui/react"
import ApiAuthProvider from "../provider/ApiAuthProvider"
import ToastProvider from "../provider/ToastProvider"
import ErrorProvider from "../provider/ErrorProvider"
import { SWRConfig } from "swr"
import theme from "../theme/"
import Meta from "../components/layout/Meta/Meta"
import "focus-visible/dist/focus-visible"
import "../theme/nofocus.css"

function MyApp({ Component, pageProps }) {
  const swrConfig = { provider: () => new Map() }

  return (
    <ChakraProvider resetCSS theme={theme}>
      <SWRConfig value={swrConfig}>
        <ApiAuthProvider>
          <ErrorProvider>
            <ToastProvider>
              <Meta />
              <Component {...pageProps} />
            </ToastProvider>
          </ErrorProvider>
        </ApiAuthProvider>
      </SWRConfig>
    </ChakraProvider>
  )
}

export default MyApp
