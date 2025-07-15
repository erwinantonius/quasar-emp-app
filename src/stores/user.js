import { defineStore } from 'pinia'
import AuthApi from 'src/api/auth'

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null,
    }),

    persist: true,

    getters: {
        getProfile: (state) => state.profile,
    },

    actions: {
        async whoAmI () {
            try {
                const { data } = await AuthApi.whoAmI()
                this.setProfile({ ...data })
                return true
            } catch (err) {
                throw err?.response?.data?.message || err
            }
        },
        setProfile (payload) {
            this.profile = payload
        },
    },
})
