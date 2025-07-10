import { api } from 'boot/axios';;
export default class AuthApi {
    /**
     * login
     * @param {*} payload
     * @returns
     */
    static async signIn (payload) {
        return api.post(`/auth/login`, payload);
    }

    static async whoAmI () {
        return api.get(`/auth/profile`);
    }

    /**
     * send email reset password
     * @param {*} payload
     * @returns
     */
    static async sendResetPassword (payload) {
        return api.post(`/auth/mail-reset`, payload);
    }

    /**
     * get key reset password
     * @param {*} key
     * @returns
     */
    static async getResetKey (key) {
        return api.get(`/auth/reset/${key}`);
    }

    /**
     * reset password
     * @param {*} payload
     */
    static async resetPassword (payload) {
        return api.post(`/auth/reset`, payload);
    }
}
