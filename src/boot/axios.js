import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { API_URL } from 'src/config/app.js'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default defineBoot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  // Update the response interceptor to include router for 401 handling
  api.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout() // Clear auth state
        router.push({ name: 'login' }) // Redirect to login page
        return Promise.reject({
          status: 401,
          message: 'Unauthorized access - redirected to login',
          originalError: error,
        })
      }
      return Promise.reject(error)
    },
  )
})

export { api }
