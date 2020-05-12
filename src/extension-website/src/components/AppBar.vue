<template>
    <v-app-bar app clipped-left dense color="primary" class="white--text">
        <v-toolbar-title>
            Hidden JVC
        </v-toolbar-title>

        <v-toolbar-items class="hidden-sm-and-down ml-4">
            <v-btn class="text-capitalize" to="/forums" text dark>
                <v-icon left> fas fa-comments </v-icon> Forums
            </v-btn>

            <v-btn class="text-capitalize" to="/topic" text dark>
                <v-icon left> fas fa-store-alt </v-icon> Topic
            </v-btn>

            <v-btn class="text-capitalize" to="/posts" text dark>
                <v-icon left> fas fa-building </v-icon> Posts
            </v-btn>

            <v-btn class="text-capitalize" to="/parametres" text dark>
                <v-icon left> fas fa-cogs </v-icon> Paramètres
            </v-btn>
        </v-toolbar-items>
    </v-app-bar>
</template>

<script>
export default {
    name: 'AppBar'
};
</script>