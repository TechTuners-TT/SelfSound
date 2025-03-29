import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../clients/supabase'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'

let localUser;

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_DATABASEURL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/secret',
      name: 'secret',
      component: () => import('../views/SecretView.vue'),
      meta: { requiresAuth: true }
    },
	{
      path: '/login',
      name: 'login',
      component: LoginView
	},
	{
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView
	}
  ]
})

async function getUser(next) {
	localUser = await supabase.auth.getSession();
	if (localUser.data.session == null) {
		next('/unauthorized')
	}
	else {
		next();
	}
}


router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth) {
		getUser(next);
	}
	else {
		next();
	}
})

export default router
