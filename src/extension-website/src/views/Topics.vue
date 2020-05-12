<template>
    <v-container>
        <!-- Quick search and pagination -->
        <v-row class="pb-4" align="center" no-gutters>
            <v-col cols="12" md="2">
                <v-text-field v-model="quickSearch" @keydown.enter="resetPage = true && fetchTopics()" label="Recherche..." dense hide-details outlined clearable />
            </v-col>

            <v-col>
                <v-btn @click="fetchTopics" color="primary" class="mx-4" dark small>
                    <v-icon left x-small> fas fa-search </v-icon>
                    Rechercher
                </v-btn>

                <v-btn @click="filtersToggled = !filtersToggled" color="primary" outlined small>
                    <v-icon v-if="!filtersToggled" left x-small> fas fa-plus </v-icon>
                    <v-icon v-if="filtersToggled" left x-small> fas fa-minus </v-icon>
                    de filtres
                </v-btn>

                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-chip label small v-on="on" class="ml-4"> {{ topicsCount }} </v-chip>
                    </template>
                    Nombre total de topics
                </v-tooltip>
            </v-col>

            <v-col>
                <v-pagination v-model="page" @input="fetchTopics" :disabled="loading" :length="pagesCount" :total-visible="7" class="justify-md-end" color="primary" />
            </v-col>
        </v-row>

        <!-- Filters and Topics list -->
        <v-row>
            <!-- Filters -->
            <v-col v-show="filtersToggled" cols="12" lg="3">
                <v-navigation-drawer width="100%" permanent>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">
                                Filtrer les topics :
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider class="mx-2" />

                    <v-list dense>
                        <!-- Sujet -->
                        <v-list-item>
                            <v-list-item-content>
                                <v-text-field v-model="titleFilter" label="Sujet" @keyup.enter="fetchTopics" @keydown="resetPage = true" outlined hide-details dense clearable />
                            </v-list-item-content>
                        </v-list-item>

                        <!-- Sujet -->
                        <v-list-item>
                            <v-list-item-content>
                                <v-text-field v-model="userFilter" label="Auteur" @keyup.enter="fetchTopics" @keydown="resetPage = true" outlined hide-details dense clearable />
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <!-- Tri -->
                    <template v-slot:append>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-row align="center">
                                        <v-col cols="10">
                                            <v-select v-model="sortBy" :items="sortSelect" label="Trier par" menu-props="offsetY" hide-details outlined dense />
                                        </v-col>
                                        <v-col cols="1">
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon @click="orderBy = orderBy === 'ASC' ? 'DESC' : 'ASC'" v-bind:class="{'fa-rotate-180': orderBy === 'ASC'}" v-on="on">
                                                        fas fa-chevron-down
                                                    </v-icon>
                                                </template>
                                                <template v-if="orderBy === 'ASC'">
                                                    Croissant
                                                </template>
                                                <template v-if="orderBy === 'DESC'">
                                                    Décroissant
                                                </template>
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </template>
                </v-navigation-drawer>
            </v-col>

            <!-- Topics list -->
            <v-col>
                <v-data-table class="sales-table" :headers="headers" :items="topics" @click:row="onTopicClicked" :items-per-page="limit" :loading="loading" item-key="keyid" show-expand single-expand hide-default-footer>

                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Topic',

    data: () => ({
        loading: true,

        quickSearch: null,
        filtersToggled: true,

        titleFilter: null,
        userFilter: null,

        page: 1,
        limit: 20,
        sortBy: 'CreationDate',
        orderBy: 'ASC',

        resetPage: false, // wether or not to reset the page to 1 when fetching the next sales

        pagesCount: 1,

        topics: [],
        topicsCount: 0,

        sortSelect: [
            { text: 'SUJET', value: 'Title' },
            { text: 'NB', value: 'postsCount' },
            { text: 'DERNIER MSG', value: 'lastPostDate' }
        ],

        headers: [
            {
                text: 'SUJET',
                value: 'title',
                sortable: false
            },
            {
                text: 'AUTEUR',
                value: 'user',
                sortable: false
            },
            {
                text: 'NB',
                value: 'postsCount',
                sortable: false
            },
            {
                text: 'DERNIER MSG',
                value: 'lastPostDate',
                sortable: false
            }
        ]
    }),

    methods: {
        onTopicClicked() {

        },

        fetchTopics() {
            this.loading = false;
        }
    },

    created() {
        this.fetchTopics();
    }
};
</script>