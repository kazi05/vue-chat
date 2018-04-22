import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import VueSocketIO from 'vue-socket.io'
import 'vuetify/dist/vuetify.css'

Vue.use(VueSocketIO, 'http://localhost:8081')
Vue.use(Vuetify)

new Vue({
  el: '#app',
  render: h => h(App)
})
