const routes = [
  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        name: 'login',
        path: '/login',
        component: () => import('pages/LoginPage.vue'),
        meta: { authPage: true },
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'home',
        path: '/',
        component: () => import('pages/IndexPage.vue'),
        meta: { requireAuth: true },
      },
    ],
  },
  {
    path: '/workplace',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'workplace-list',
        path: 'workplace-list',
        component: () => import('pages/Workplace/WorkplaceList.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] }, // ⬅️ ini penting
      },
      {
        name: 'workplace-create',
        path: 'workplace-create',
        component: () => import('pages/Workplace/CreateWorkplace.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] }, // ⬅️ ini penting
      },
      {
        name: 'workplace-detail',
        path: 'workplace-detail/:id',
        component: () => import('pages/Workplace/CreateWorkplace.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] }, // ⬅️ ini penting
      },
      {
        name: 'workplace-edit',
        path: 'workplace-edit/:id',
        component: () => import('pages/Workplace/CreateWorkplace.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] }, // ⬅️ ini penting
      },
    ],
  },
  {
    path: '/tenant',
    name: 'tenant',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'tenant-list',
        path: '',
        component: () => import('pages/Tenant/TenantList.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] },
      },
      {
        name: 'tenant-create',
        path: 'tenant-create',
        component: () => import('pages/Tenant/CreateTenant.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] },
      },
      {
        name: 'tenant-users',
        path: 'tenant-users/:tenant_id/:workplace_id?',
        component: () => import('pages/Tenant/TenantUser.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] },
      },
      {
        name: 'tenant-workplaces',
        path: 'tenant-workplaces/:tenant_id',
        component: () => import('pages/Tenant/TenantWorkplace.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] },
      },
      {
        name: 'tenant-users-workplace',
        path: 'tenant-users/:tenant_id/tenant-workplace/:workplace_id',
        component: () => import('pages/Tenant/TenantUser.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] },
      },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'user-list',
        path: 'user-list',
        component: () => import('pages/User/UserList.vue'),
        meta: { requireAuth: true, roles: ['superadmin', 'admin', 'hr'] },
      },
      {
        name: 'user-create',
        path: 'user-create',
        component: () => import('pages/User/CreateUser.vue'),
        meta: { requireAuth: true, roles: ['superadmin', 'admin', 'hr'] },
      },
      {
        name: 'user-detail',
        path: 'user-detail/:id',
        component: () => import('pages/User/CreateUser.vue'),
        meta: { requireAuth: true, roles: ['superadmin', 'admin', 'hr'] },
      },
      {
        name: 'user-edit',
        path: 'user-edit/:id',
        component: () => import('pages/User/CreateUser.vue'),
        meta: { requireAuth: true, roles: ['superadmin', 'admin', 'hr'] },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
