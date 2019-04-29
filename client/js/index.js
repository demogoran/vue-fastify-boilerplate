import Vue from 'vue';
import Vuex from 'vuex';
import Buefy from 'buefy';
import VueRouter from 'vue-router';
import VuexI18n from 'vuex-i18n';
import Translations from './localizations/english.locale.js';

import '../styles/index.scss'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../templates/MainPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../templates/LoginPage.vue')
    },
  ]
});

router.beforeEach((to, from, next) => { 
  let jwtToken = localStorage.getItem('jwtToken');
  if(to.path === '/login'){
    if(jwtToken) next('/');
    else next();
    return;
  }
  if(!jwtToken){
    next('/login');
    return;
  }
  next();
}) 


Vue.use(Buefy);
Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store();
Vue.use(VuexI18n.plugin, store);
Vue.i18n.add('en', Translations);
Vue.i18n.set('en');


new Vue({
    store,
    router,
}).$mount('#app');