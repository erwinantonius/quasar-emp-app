import { api } from 'boot/axios';
export default class UserApi {
    /**
     * get users list
     * @param {*} payload
     * @returns
     */
    static async get (payload) {
        return api.get(`/users`, payload);
    }
    static async getById (id) {
        return api.get(`/users/${id}`);
    }

    /**
     * get user count
     * @param {*} payload
     * @returns
     */
    static async count (payload) {
        return api.get(`/users/count`, payload);
    }
    /**
     * create user
     * @param {*} payload
     * @returns
     */
    static async create (payload) {
        return api.post('/users', payload);
    }
    /**
     * update user
     * @param {string} id
     * @param {*} payload
     * @returns
     */
    static async update (id, payload) {
        return api.patch(`/users/${id}`, payload);
    }

    /**
     * change password
     * @param {*} id
     * @param {*} payload
     * @returns
     */
    static async changePassword (id, payload) {
        return api.post(`/users/${id}`, payload);
    }

    /**
     * send email invitation
     * @param {*} payload
     * @returns
     */
    static async sendInvitation (payload) {
        return api.post(`/mail/send-invitation`, payload);
    }
}
