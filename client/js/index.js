import Vue from 'vue';
import Vuex from 'vuex';
import Buefy from 'buefy';
import VueRouter from 'vue-router';

import '../styles/index.scss'
import playerStore from './stores/playerStore';

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../templates/pages/MainPage.vue')
    },
    {
      path: '/serials',
      name: 'serials',
      component: () => import('../templates/pages/SerialsPage.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../templates/pages/TestPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../templates/pages/LoginPage.vue')
    },
    {
      path: '*', component: {
        template: `<div>Not found</div>`
      }
    },
  ]
});

Vue.component('playerComponent', () => import('../templates/components/PlayerComponent.vue'));

router.beforeEach((to, from, next) => {
  let jwtToken = localStorage.getItem('jwtToken');
  console.log('jwtToken', jwtToken);
  if(to.path === `/login` && jwtToken) next('/');
  else if(to.path === `/login` && !jwtToken) next();
  else if(!jwtToken) next('/login');
  else next();
});


Vue.use(Vuex);
Vue.use(Buefy);
Vue.use(VueRouter);

const store = new Vuex.Store(playerStore);

new Vue({
  store,
  router,
  data() {
    return {
      testStateObj: true,
      playerComponent: 'playerComponent'
    }
  },
  computed: {
    currentRoute: function(){
      return this.$route.name;
    }
  },
}).$mount('#app');