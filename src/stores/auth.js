import { defineStore, getActivePinia } from 'pinia'
import AuthApi from 'src/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    refreshToken: null,
    user: null,
    currentWorkplace: null,
    permission: null,
  }),

  persist: true,

  getters: {
    isLoggedIn: (state) => !!state.token,
    isSuperadmin(state) {
      return state.user?.roles?.includes('superadmin')
    },
  },

  actions: {
    /**
     * Initialize store with router reference
     */
    init(router) {
      this.router = router
    },
    /**
     * logout reset app store
     */
    async login(payload) {
      try {
        const { data } = await AuthApi.signIn(payload)
        this.setPermission(data.permission)
        this.setToken(data.access_token)
        this.setUser({ ...data })
        return true
      } catch (err) {
        throw err?.response?.data?.message || err
      }
    },
    logout() {
      getActivePinia()._s.forEach((store) => store.$reset())
      // Redirect to login page after logout
      if (this.router) {
        this.router.push({ name: 'login' })
      } else {
        // Fallback if router is not available
        window.location.href = '/login'
      }
    },

    /**
     * set user state
     * @param {object} payload
     */
    setUser(payload) {
      this.user = payload
      this.setCurrentWorkplace(payload.workplace)
    },
    setPermission(payload) {
      this.permission = { permission: payload }
    },
    setCurrentWorkplace(payload) {
      this.currentWorkplace = payload
    },
    setPickingMode(pickingMode) {
      this.pickingMode = pickingMode
    },
    /**
     * set token state
     * @param {string} payload
     */
    setToken(payload) {
      this.token = payload
    },
    /**
     * set token state
     * @param {object} payload
     */
    setTokens(payload) {
      this.token = payload.accessToken
      this.refreshToken = payload.refreshToken
    },
  },
})
