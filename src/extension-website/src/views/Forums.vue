<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="6">
                <v-row align="center" no-gutters>
                    <v-col cols="3">
                        <v-text-field v-model="quickSearch" @keydown.enter="resetPage = true && fetchForums()" label="Recherche..." dense hide-details outlined clearable />
                    </v-col>

                    <v-col>
                        <v-btn @click="fetchForums" color="primary" class="mx-4" dark small>
                            <v-icon left x-small> fas fa-search </v-icon>
                            Rechercher
                        </v-btn>

                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-chip label small v-on="on" class="ml-4"> {{ forumsCount }} </v-chip>
                            </template>
                            Nombre total de forums
                        </v-tooltip>
                    </v-col>

                    <v-col>
                        <v-pagination v-model="page" @input="fetchForums" :disabled="loading" :length="maxPage" :total-visible="7" class="justify-md-end" color="primary" />
                    </v-col>
                </v-row>

                <router-link to="/forums/51"> topics </router-link>

                <v-row>
                    <v-col>
                        <v-data-table :headers="headers" :items="forums" @click:row="onForumClicked" :items-per-page="limit" :loading="loading" item-key="Id" show-expand single-expand hide-default-footer>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Forums',

    data: () => ({
        loading: true,

        quickSearch: null,
        filtersToggled: true,

        page: 1,
        limit: 20,
        sortBy: 'CreationDate',
        orderBy: 'ASC',

        resetPage: false, // wether or not to reset the page to 1 when fetching the next sales
        firstRequest: true,

        maxPage: 1,

        forums: [],
        forumsCount: 0,

        headers: [
            {
                text: 'Nom',
                value: 'name'
            },
            {
                text: 'Nombre de topics',
                value: 'topics-count'
            },
            {
                text: 'Nombre de posts',
                value: 'posts-count'
            },
            {
                text: 'Dernier post',
                value: 'last-post-date'
            }
        ]
    }),

    methods: {
        fetchForums() {
            this.loading = false;
        },

        onForumClicked() {

        }
    },

    created() {
        this.fetchForums();
    }
};
</script>
