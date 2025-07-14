import { api } from 'src/boot/axios';

export const UserApi = {
    /**
     * get users list
     * @param {*} payload
     * @returns
     */
    getUser: (payload) => {
        return api.get(`/users`, payload);
    },

    getById: (id) => {
        return api.get(`/users/${id}`);
    },

    /**
     * get user count
     * @param {*} payload
     * @returns
     */
    countUser: (payload) => {
        return api.get(`/users/count`, payload);
    },

    /**
     * create user
     * @param {*} payload
     * @returns
     */
    createUser: (payload) => {
        return api.post('/users', payload);
    },

    /**
     * update user
     * @param {string} id
     * @param {*} payload
     * @returns
     */
    updateUser: (id, payload) => {
        return api.patch(`/users/${id}`, payload);
    },

    /**
     * delete user
     * @param {string} id
     * @returns
     */
    delete: (id) => {
        return api.delete(`/users/${id}`);
    },

    /**
     * change password
     * @param {*} id
     * @param {*} payload
     * @returns
     */
    changePassword: (id, payload) => {
        return api.post(`/users/${id}`, payload);
    },

    /**
     * send email invitation
     * @param {*} payload
     * @returns
     */
    sendInvitation: (payload) => {
        return api.post(`/mail/send-invitation`, payload);
    }
};
