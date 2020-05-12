import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/forums',
            component: () => import(/* webpackChunkName: "Forums" */ './views/Forums.vue')
        },
        {
            path: '/forums/:forumId',
            component: () => import(/* webpackChunkName: "Topics" */ './views/Topics.vue')
        }
    ]
});

export default router;
