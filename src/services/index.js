import axios from "axios"
import { parseCookies } from "nookies"
// import { setRefreshCookie, setSessioncookie } from "../utils/functions/cookies"

// const instance = axios.create({
//   baseURL:
//     process.env.NODE_ENV === "production"
//       ? process.env.NEXT_PUBLIC_API_URL_PROD
//       : process.env.NEXT_PUBLIC_API_URL,
// })
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// instance.interceptors.request.use(async (config) => {
//   const token = await firebase.auth().currentUser?.getIdToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// instance.interceptors.response.use(undefined, (error) => new Promise(async (resolve, reject) => {
//   if (error.response && error.response.status === 401) {
//     const token = "";
//     if (token) {
//       error.config.__isRetryRequest = true;
//       error.config.headers.Authorization = `Bearer ${token}`;
//       axios(error.config).then(resolve, reject);
//       return;
//     }
//   }
//   reject(error);
// }));

class ServiceConstructor {
  constructor(errorHandler, removeError) {
    this.instance = instance;
    this.errorHandler = errorHandler;
    this.removeError = removeError;
  }

  makeRequest = async (request, validate) => {
    try {
      typeof validate === 'function' && validate();
      this.removeError();
      const response = await request;
      return response.data;
    } catch (e) {
      this.errorHandler(e.response?.data?.details ? e.response.data.details[0]?.message : e?.message);
      return { error: true };
    }
  };
}

export default ServiceConstructor;