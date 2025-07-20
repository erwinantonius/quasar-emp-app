import { api } from 'boot/axios'

/**
 * Attendance API functions
 * Based on NestJS AttendanceController
 */
export const AttendanceApi = {
  /**
   * Create a new attendance record
   * @param {Object} createAttendanceDto - Attendance data
   * @returns {Promise} API response
   */
  create(createAttendanceDto) {
    return api.post('/attendance', createAttendanceDto)
  },

  /**
   * Get all attendance records
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  findAll(params = {}) {
    return api.get('/attendance', { params })
  },

  /**
   * Get attendance records by user ID
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  findByUser(userId, params = {}) {
    return api.get(`/attendance/user/${userId}`, { params })
  },

  /**
   * Get attendance records by workplace ID
   * @param {string} workplaceId - Workplace ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  findByWorkplace(workplaceId, params = {}) {
    return api.get(`/attendance/workplace/${workplaceId}`, { params })
  },

  /**
   * Get attendance records by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {Object} params - Additional query parameters
   * @returns {Promise} API response
   */
  findByDateRange(startDate, endDate, params = {}) {
    return api.get('/attendance/date-range', {
      params: {
        startDate,
        endDate,
        ...params,
      },
    })
  },

  /**
   * Get today's attendance for a specific user and workplace
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  getTodayAttendance(userId) {
    return api.get(`/attendance/today/${userId}`)
  },

  /**
   * Get attendance statistics for a user
   * @param {string} userId - User ID
   * @param {number} month - Month (1-12)
   * @param {number} year - Year
   * @returns {Promise} API response
   */
  getAttendanceStats(userId, month, year) {
    return api.get(`/attendance/stats/${userId}`, {
      params: { month, year },
    })
  },

  /**
   * Get a single attendance record by ID
   * @param {string} id - Attendance record ID
   * @returns {Promise} API response
   */
  findOne(id) {
    return api.get(`/attendance/${id}`)
  },

  /**
   * Check in - Record user arrival
   * @param {Object} checkInDto - Check-in data
   * @param {string} checkInDto.userId - User ID
   * @param {string} checkInDto.workplaceId - Workplace ID
   * @param {number[]} [checkInDto.coordinate] - GPS coordinates [longitude, latitude]
   * @returns {Promise} API response
   */
  checkIn(checkInDto) {
    return api.post('/attendance/check-in', checkInDto)
  },

  /**
   * Check out - Record user departure
   * @param {Object} checkOutDto - Check-out data
   * @param {string} checkOutDto.userId - User ID
   * @param {string} checkOutDto.workplaceId - Workplace ID
   * @param {number[]} [checkOutDto.coordinate] - GPS coordinates [longitude, latitude]
   * @returns {Promise} API response
   */
  checkOut(checkOutDto) {
    return api.post('/attendance/check-out', checkOutDto)
  },

  /**
   * Update an attendance record
   * @param {string} id - Attendance record ID
   * @param {Object} updateAttendanceDto - Updated attendance data
   * @returns {Promise} API response
   */
  update(id, updateAttendanceDto) {
    return api.patch(`/attendance/${id}`, updateAttendanceDto)
  },

  /**
   * Update the valid status of an attendance record
   * @param {string} id - Attendance record ID
   * @param {boolean} isValid - Whether the attendance is valid
   * @returns {Promise} API response
   */
  updateValidStatus(id, isValid) {
    return api.patch(`/attendance/${id}/valid-status`, { isValid })
  },

  /**
   * Delete an attendance record
   * @param {string} id - Attendance record ID
   * @returns {Promise} API response
   */
  remove(id) {
    return api.delete(`/attendance/${id}`)
  },

  // Helper methods for common use cases

  /**
   * Quick check-in with current location
   * @param {string} userId - User ID
   * @param {string} workplaceId - Workplace ID
   * @param {GeolocationPosition} position - Browser geolocation position
   * @returns {Promise} API response
   */
  quickCheckIn(userId, workplaceId, position = null, is_checkin_valid = true) {
    const checkInData = {
      userId,
      workplaceId,
      is_checkin_valid,
    }

    if (position) {
      checkInData.checkin_coordinate = [position.coords.latitude, position.coords.longitude]
    }

    return this.checkIn(checkInData)
  },

  /**
   * Quick check-out with current location
   * @param {string} userId - User ID
   * @param {string} workplaceId - Workplace ID
   * @param {GeolocationPosition} position - Browser geolocation position
   * @returns {Promise} API response
   */
  quickCheckOut(userId, position = null, is_checkout_valid = true) {
    const checkOutData = {
      userId,
      is_checkout_valid,
    }

    if (position) {
      checkOutData.checkout_coordinate = [position.coords.latitude, position.coords.longitude]
    }

    return this.checkOut(checkOutData)
  },

  /**
   * Get current month attendance for user
   * @param {string} userId - User ID
   * @returns {Promise} API response
   */
  getCurrentMonthAttendance(userId) {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    return this.getAttendanceStats(userId, month, year)
  },

  /**
   * Get attendance history for a specific period
   * @param {string} userId - User ID
   * @param {Object} options - Options object
   * @param {number} options.days - Number of days to look back (default: 30)
   * @param {number} options.limit - Limit number of records (default: no limit)
   * @param {Object} options.sort - Sort options (default: { checkin_date: -1 })
   * @returns {Promise} API response
   */
  getAttendanceHistory(userId, options = {}) {
    const { days = 30, limit, sort } = options

    // If options is a number (backward compatibility), treat it as days
    const daysToLookBack = typeof options === 'number' ? options : days

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysToLookBack)

    const formatDate = (date) => date.toISOString().split('T')[0]

    const params = { userId }
    if (limit) params.limit = limit
    if (sort) params.sort = sort

    return this.findByDateRange(formatDate(startDate), formatDate(endDate), params)
  },
}

export default AttendanceApi
