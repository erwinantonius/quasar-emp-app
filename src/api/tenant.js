import { api } from 'boot/axios'

export default class TenantApi {
  /**
   * get tenant list
   * @param {object} payload
   * @returns
   */
  static async getTenant(payload) {
    return api.get(`/tenants`, payload)
  }

  /**
   * get tenant count
   * @param {object} payload
   * @returns
   */
  static async countTenant(payload) {
    return api.get(`/tenants/count`, payload)
  }

  /**
   * get tenant detail
   * @param {object} payload
   * @returns
   */
  static async getTenantById(id) {
    return api.get(`/tenants/${id}`)
  }

  /**
   * create tenant
   * @param {*} payload
   * @returns
   */
  static async createTenant(payload) {
    return api.post(`tenants`, payload)
  }

  /**
   * update tenant
   * @param {string} id
   * @param {*} payload
   * @returns
   */
  static async updateTenant(id, payload) {
    return api.patch(`tenants/${id}`, payload)
  }

  /**
   * delete tenant
   * @param {string} id
   * @returns
   */
  static async delete(id) {
    return api.delete(`tenants/${id}`)
  }
}
