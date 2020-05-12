import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import fr from 'vuetify/es5/locale/fr';

import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { fr },
        current: 'fr'
    },
    icons: {
        iconfont: 'fa'
    },
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: colors.blue.darken4
            }
        }
    }
});
