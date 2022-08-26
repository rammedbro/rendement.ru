<template>
    <!-- Каталог -->
    <l-catalog v-bind="props">
        <!-- Заголовок -->
        <template v-slot:title>
            <h1 class="text-h3 mb-4 mb-lg-8">{{ title }}</h1>
        </template>

        <!-- Подразделы раздела -->
        <template v-slot:sections="{ items }">
            <v-row dense>
                <v-col v-for="item in items" :key="item.id"
                       cols="4">
                    <v-card nuxt :to="item.url"
                            class="pa-4">
                        {{ item.name }}
                    </v-card>
                </v-col>
            </v-row>
        </template>

        <!-- Элементы раздела -->
        <template v-slot:elements="{ items }">
            <div class="d-none">
                <nuxt-link v-for="item in items" :key="item.id"
                           :to="item.url">
                    Подробнее
                </nuxt-link>
            </div>

            <v-expansion-panels v-if="isMounted"
                                accordion multiple
                                class="list-mb-2">
                <v-expansion-panel v-for="item in items" :key="item.id">
                    <!-- Заголовок -->
                    <v-expansion-panel-header hide-actions>
                        <template v-slot:default="{ open }">
                            <div class="text-subtitle-2"
                                 :class="{ 'primary--text': open }">
                                {{ item.name }}
                            </div>

                            <v-icon class="v-expansion-panel-header__icon"
                                    :class="{ 'primary--text': open }">
                                {{ open ? 'mdi-minus' : 'mdi-plus' }}
                            </v-icon>
                        </template>
                    </v-expansion-panel-header>

                    <!-- Контент -->
                    <v-expansion-panel-content eager
                                               class="text-body-2">
                        <p v-html="item.body"></p>

                        <a :href="`${baseUrl}${item.url}`" class="link">
                            Подробнее
                        </a>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <!-- Детальная страница -->
        <template v-slot:element.detail="{ value }">
            <v-card>
                <v-container v-html="value.body"/>
            </v-card>
        </template>
    </l-catalog>
</template>

<script>
    import LCatalog from '~/components/core/catalog/LCatalog';

    export default {
        name: 'LCatalogTemplateDefault',
        components: { LCatalog },
        props: {
            title: {
                type: String,
                required: true,
            },
            props: {
                type: Object,
                required: true,
            },
        },
        computed: {
            baseUrl: vm => process.env.baseURL,
        },
    };
</script>
