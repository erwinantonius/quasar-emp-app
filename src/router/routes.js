const routes = [
  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { name: 'login', path: '/login', component: () => import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requireAuth: true } },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
