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
    title: 'Inbound Putaway',
    icon: 'sym_o_move_to_inbox',
    path: '/inbound/task',
    roles: ['superadmin', 'multitask_worker', 'putaway_team', 'supervisor'],
    group: 'putaway',
  },
  {
    title: 'Putaway Moving',
    icon: 'sym_o_move_up',
    path: '/putaway/moving',
    roles: ['superadmin', 'multitask_worker', 'putaway_team', 'supervisor'],
    group: 'putaway',
  },
  {
    title: 'Cycle Count SKU',
    icon: 'sym_o_recycling',
    path: '/cycle-count/sku/task',
    roles: ['superadmin', 'multitask_worker', 'cycle_count_team', 'supervisor'],
    group: 'cycle_count',
  },
  {
    title: 'Cycle Count Loc',
    icon: 'sym_o_recycling',
    path: '/cycle-count/location/task',
    roles: ['superadmin', 'multitask_worker', 'cycle_count_team', 'supervisor'],
    group: 'cycle_count',
  },
  {
    title: 'Order Picking B2C',
    icon: 'shopping_basket',
    path: '/orders/picking/b2c',
    roles: ['superadmin', 'multitask_worker', 'picker', 'supervisor'],
    group: 'picking',
  },
  {
    title: 'Order Picking B2B',
    icon: 'shopping_cart_checkout',
    path: '/orders/picking/b2b',
    roles: ['superadmin', 'multitask_worker', 'picker', 'supervisor'],
    group: 'picking',
  },
]

export { menus, menu_mobile }
