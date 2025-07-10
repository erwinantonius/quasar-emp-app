import { api } from 'boot/axios'
export default class WorkplaceApi {
  /**
   * get workplace list
   * @param {object} payload
   * @returns
   */
  static async getWorkplace(payload) {
    return api.get(`/workplaces`, payload)
  }

  /**
   * get workplace count
   * @param {object} payload
   * @returns
   */
  static async countWorkplace(payload) {
    return api.get(`/workplaces/count`, payload)
  }

  /**
   * get workplace detail
   * @param {object} payload
   * @returns
   */
  static async getWorkplaceById(id) {
    console.log('Fetching workplace by ID:', id)
    return api.get(`/workplaces/${id}`)
  }

  /**
   * create workplace
   * @param {*} payload
   * @returns
   */
  static async createWorkplace(payload) {
    return api.post(`workplaces`, payload)
  }
  /**
   * update workplace
   * @param {string} id
   * @param {*} payload
   * @returns
   */
  static async updateWorkplace(id, payload) {
    return api.patch(`workplaces/${id}`, payload)
  }
}
