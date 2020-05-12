import Vue from 'vue';
import vuetify from './plugins/vuetify';
import './plugins/vee-validate';

import App from './App.vue';
import router from './router';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');
