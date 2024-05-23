import {createApp} from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/main.css'

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faClock, faFile, faMessage, faRandom} from '@fortawesome/free-solid-svg-icons'
import {ComponentPublicInstance} from "@vue/runtime-core"

library.add(faFile)
library.add(faMessage)
library.add(faClock)
library.add(faRandom)

let app = createApp(App);

app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
    if (err?.response?.status === 401 && instance) {
        instance.$emit('user-data', null)
    } else {
        throw err;
    }
};

app
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
