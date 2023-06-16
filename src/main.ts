import {createApp} from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/main.css'

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faClock, faFile, faMessage, faRandom} from '@fortawesome/free-solid-svg-icons'

library.add(faFile)
library.add(faMessage)
library.add(faClock)
library.add(faRandom)

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
