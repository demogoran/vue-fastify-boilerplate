import Vue from 'vue';
import Vuex from 'vuex';
import Buefy from 'buefy';
import VueRouter from 'vue-router';
import VuexI18n from 'vuex-i18n';

import Translations from './localizations/english.locale';
import playerStore from './stores/playerStore';

import '../styles/index.scss'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../templates/pages/MainPage.vue')
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
  if (to.path === `/login`) {
    if (jwtToken) next(`/`);
    else next();
    return;
  }
  if (!jwtToken) {
    next(`/login`);
    return;
  }
  next();
});


Vue.use(Buefy);
Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store(playerStore);
Vue.use(VuexI18n.plugin, store);
Vue.i18n.add('en', Translations);
Vue.i18n.set('en');

store.subscribe((mutation, state) => {
	// Store the state object as a JSON string
	localStorage.setItem('playerStore', JSON.stringify(state));
});


new Vue({
  store,
  router,
  data() {
    return {
      playerComponent: 'playerComponent'
    }
  },
  computed: {
    currentRoute: function(){
      return this.$route.name;
    }
  },
  beforeCreate() {
		this.$store.commit('initialiseStore');
	}
}).$mount('#app');