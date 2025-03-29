import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../clients/supabase'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'

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
	},
  {
      path: '/signin',
      name: 'signin',
      component: SignIn
	},
  {
      path: '/signup',
      name: 'signup',
      component: SignUp
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
