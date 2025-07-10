import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'stores/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeResolve((to, from, next) => {
    // If this isn't an initial page load.
    if (to.name && to.name !== from.name) {
      //
    }
    next()
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isLoggedIn = authStore.isLoggedIn
    const user = authStore.user
    if (to.meta.requireAuth) {
      if (isLoggedIn) {
        if (to.fullPath !== '/') {
          let allow = false
          user.roles.map((m) => {
            if (!to.meta.roles) {
              allow = true
            }
            if (to.meta.roles && to.meta.roles.includes(m)) {
              allow = true
            }
            if (to.meta.roles && to.meta.roles.includes('all')) {
              allow = true
            }
          })
          if (!allow) {
            next({ name: 'not-found' })
          }
          next()
        } else {
          next()
        }
      } else {
        next({ name: 'login' })
      }
    } else if (to.meta.authPage) {
      if (!isLoggedIn) {
        next()
      } else {
        next(from)
      }
    } else {
      next()
    }
  })

  return Router
})
