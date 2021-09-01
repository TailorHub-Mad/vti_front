import axios from "axios"
import { parseCookies } from "nookies"
// import { setRefreshCookie, setSessioncookie } from "../utils/functions/cookies"

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL_PROD
      : process.env.NEXT_PUBLIC_API_URL,
})

instance.interceptors.response.use(
  undefined,
  // eslint-disable-next-line no-async-promise-executor
  (error) =>
    new Promise(async (resolve, reject) => {
      const cookies = parseCookies()
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.code === "auth/id-token-expired"
      ) {
        // const _token = await axios.post(); TODO Refrescar token con el back
        //   setSessioncookie(_token.data.id_token);
        //   setRefreshCookie(_token.data.refresh_token);
        //   error.config.__isRetryRequest = true;
        //   error.config.headers.Authorization = `Bearer ${_token.data.id_token}`;
        axios(error.config).then(resolve, reject)
      } else {
        reject(error)
      }
    })
)

class ServiceConstructor {
  constructor() {
    this.instance = instance
    const cookies = parseCookies()
    this.token = cookies.vti
    this.addToken()
  }

  addToken = () => {
    if (this.token) {
      this.instance.defaults.headers.common.Authorization = `Bearer ${this.token}`
    } else {
      this.instance.defaults.headers.common.Authorization = ""
    }
  }

  errorHandler = (e) => {
    throw e
  }
}

export default ServiceConstructor
