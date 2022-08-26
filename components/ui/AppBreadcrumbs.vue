<template>
    <v-breadcrumbs itemscope itemtype="https://schema.org/BreadcrumbList">
        <template v-for="(item, index) in items">
            <v-breadcrumbs-item :key="`i-${ index }`"
                                itemprop="itemListElement"
                                itemscope
                                itemtype="https://schema.org/ListItem"
                                class="text-small-2">
                <nuxt-link :to="item.url"
                           :title="item.name"
                           itemprop="item"
                           class="v-breadcrumbs__item">
                    <span itemprop="name">{{ item.name }}</span>
                    <meta itemprop="position" :content="index">
                </nuxt-link>
            </v-breadcrumbs-item>

            <v-breadcrumbs-divider v-if="index < items.length - 1"
                                   :key="`d-${ index }`">
                <v-icon>mdi-chevron-right</v-icon>
            </v-breadcrumbs-divider>
        </template>
    </v-breadcrumbs>
</template>

<script>
    export default {
        name: 'AppBreadcrumbs',
        props: {
            items: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>
