<template>
    <v-app>
        <AppBar />

        <v-content style="margin-bottom: 24px">
            <router-view />
        </v-content>

        <v-system-bar color="primary" fixed height="24" style="top: calc(100% - 24px);">
            <v-spacer />
            205 connectés
            <v-icon right> fas fa-users </v-icon>
        </v-system-bar>

        <div id="overlay"> </div>
    </v-app>
</template>

<script>
import AppBar from './components/AppBar';

export default {
    name: 'App',

    components: {
        AppBar
    },

    created() {
        this.$router.push('/forums');

        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5') {
                e.preventDefault();
            }
        });
    }
};
</script>

<style scoped>
#overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    height: 100vh;
    width: 100vw;
    pointer-events: none;
    background-color: rgba(255, 255, 0, 0.2);
    mix-blend-mode: multiply;
}
</style>