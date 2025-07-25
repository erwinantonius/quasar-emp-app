const menus = [
  {
    title: 'Home',
    icon: 'sym_o_space_dashboard',
    path: '/',
    roles: [], // ⬅️ bisa kosong = semua user
  },
  {
    title: 'Tenant',
    icon: 'business_center',
    path: '/tenant',
    roles: ['superadmin'],
  },
  {
    title: 'Workplace',
    icon: 'corporate_fare',
    path: '/workplace/workplace-list',
    roles: ['superadmin'],
  },
  {
    title: 'User',
    icon: 'people',
    path: '/user/user-list',
    roles: ['superadmin', 'admin', 'hr'],
  },
  {
    title: 'Preferences',
    icon: 'sym_o_settings',
    path: '/setting',
    roles: ['superadmin', 'internal_administrator', 'warehouse_manager'],
    children: [
      {
        title: 'App',
        path: '/setting/app',
        roles: ['superadmin', 'internal_administrator', 'warehouse_manager'],
      },
    ],
  },
]

const menu_mobile = [
  {
    title: 'Inbox',
    icon: 'inbox',
    path: '/inbox',
    roles: ['superadmin', 'employee'],
    group: 'Communication',
    description: 'View your messages, notifications, and approval requests.',
  },
  {
    title: 'Attendance',
    icon: 'alarm',
    path: '/attendance/tick',
    roles: ['superadmin', 'employee'],
    group: 'Time Management',
    description: 'Manage your attendance records and view history.',
  },
  {
    title: 'Attendance History',
    icon: 'history',
    path: '/attendance/history',
    roles: ['superadmin', 'employee'],
    group: 'Time Management',
    description: 'View your last 10 attendance records with validation status.',
  },
  {
    title: 'Timesheet',
    icon: 'sym_o_recycling',
    path: '/timesheet/timesheet-list',
    roles: ['superadmin', 'employee'],
    group: 'Time Management',
    description: 'Track your work hours and manage timesheets.',
  },
  {
    title: 'Leave Request',
    icon: 'sym_o_move_up',
    path: '/leave/leave-request-list',
    roles: ['superadmin', 'employee'],
    group: 'Time Management',
    description: 'Submit and manage your leave requests.',
  },
  {
    title: 'Overtime Request',
    icon: 'sym_o_recycling',
    path: '/overtime/overtime-request-list',
    roles: ['superadmin', 'employee'],
    group: 'Time Management',
    description: 'Request and manage your overtime hours.',
  },

  {
    title: 'Profile',
    icon: 'shopping_basket',
    path: '/profile',
    roles: ['superadmin', 'employee'],
    group: 'Personal',
    description: 'View and edit your profile information.',
  },
  {
    title: 'Payroll',
    icon: 'shopping_cart_checkout',
    path: '/payroll/payroll-list',
    roles: ['superadmin', 'employee'],
    group: 'Personal',
    description: 'Access and manage your payroll details.',
  },
]

export { menus, menu_mobile }
