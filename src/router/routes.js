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
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'tenant-list',
        path: 'tenant-list',
        component: () => import('pages/Tenant/TenantList.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] },
      },
      {
        name: 'tenant-create',
        path: 'tenant-create',
        component: () => import('pages/Tenant/CreateTenant.vue'),
        meta: { requireAuth: true, roles: ['superadmin'] },
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
