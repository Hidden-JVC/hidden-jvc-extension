import Vue from 'vue';

import { extend, setInteractionMode, ValidationObserver, ValidationProvider } from 'vee-validate';
import { required, email, numeric } from 'vee-validate/dist/rules';

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

setInteractionMode('aggressive');

extend('required', {
    ...required,
    message: 'Ce champ est obligatoire'
});

extend('email', {
    ...email,
    message: 'Vous devez saisir une adresse email valide'
});

extend('numeric', {
    ...numeric,
    message: 'Vous devez saisir une valeur numérique'
});


