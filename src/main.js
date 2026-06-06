import { createApp } from 'vue'
import './style.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import Main from './Main.vue'   


const vuetify = createVuetify({
  components,
  directives,
})

createApp(Main).use(vuetify).mount('#app')
