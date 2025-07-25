import { api } from 'boot/axios';

/**
 * Inbox API functions
 * Based on NestJS InboxController
 */
export const InboxApi = {
    /**
     * Get all inbox messages
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getInbox (params = {}) {
        return api.get('/inbox', { params });
    },

    /**
     * Get inbox message by ID
     * @param {string} id - Inbox message ID
     * @returns {Promise} API response
     */
    findOne (id) {
        return api.get(`/inbox/${id}`);
    },

    /**
     * Get inbox counts
     * @returns {Promise} API response
     */
    getCounts () {
        return api.get('/inbox/counts');
    },

    /**
     * Get unread count
     * @returns {Promise} API response
     */
    getUnreadCount () {
        return api.get('/inbox/unread-count');
    },

    /**
     * Get approval messages
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getApprovals (params = {}) {
        return api.get('/inbox/approvals', { params });
    },

    /**
     * Get notification messages
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getNotifications (params = {}) {
        return api.get('/inbox/notifications', { params });
    },

    /**
     * Get announcement messages
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getAnnouncements (params = {}) {
        return api.get('/inbox/announcements', { params });
    },

    /**
     * Get reminder messages
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getReminders (params = {}) {
        return api.get('/inbox/reminders', { params });
    },

    /**
     * Get high priority messages
     * @param {Object} params - Query parameters
     * @returns {Promise} API response
     */
    getHighPriority (params = {}) {
        return api.get('/inbox/high-priority', { params });
    },

    /**
     * Mark a message as read
     * @param {string} id - Inbox message ID
     * @returns {Promise} API response
     */
    markAsRead (id) {
        return api.patch(`/inbox/${id}/mark-read`);
    },

    /**
     * Mark a message as processed
     * @param {string} id - Inbox message ID
     * @returns {Promise} API response
     */
    markAsProcessed (id) {
        return api.patch(`/inbox/${id}/mark-processed`);
    },

    /**
     * Archive a message
     * @param {string} id - Inbox message ID
     * @returns {Promise} API response
     */
    archive (id) {
        return api.patch(`/inbox/${id}/archive`);
    }
};

export default InboxApi;
