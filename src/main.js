import Vue from 'vue'
import VueMeta from 'vue-meta'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store'

import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

import KProgress from 'k-progress';
Vue.component('k-progress', KProgress);


// import { Telegraf } from 'Telegraf'

import Loader from '@/components/Loader'
import currencyFilter from '@/filters/currency.filter'
import dateFilter from '@/filters/date.filter'

import '@/assets/main.sass'
import './registerServiceWorker'

Vue.use(ElementUI, {locale})
Vue.use(VueMeta)

Vue.component('Loader', Loader)

Vue.filter('currency', currencyFilter)
Vue.filter('date', dateFilter)

// Initialize Firebase
firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "goodgame-58.firebaseapp.com",
  databaseURL: "https://goodgame-58-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "goodgame-58",
  storageBucket: "goodgame-58.appspot.com",
  messagingSenderId: "564488794295",
  appId: process.env.VUE_APP_FIREBASE_APP_ID
})

// const bot = new Telegraf(process.env.BOT_TOKEN)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
