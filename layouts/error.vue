<template>
    <v-container>
        <h1 class="display-2 mb-4 mb-lg-8">{{ title }}</h1>

        <nuxt-link to="/">Главная страница</nuxt-link>
    </v-container>
</template>

<script>
    export default {
        layout: 'empty',
        props: {
            error: {
                type: Object,
                default: null,
            },
        },
        head: vm => ( {
            title: vm.title,
        } ),
        data: () => ( {
            pageNotFound: '404 Страница не найдена',
            otherError: 'Произошла ошибка',
        } ),
        computed: {
            title: vm => vm.error.statusCode === 404 ? vm.pageNotFound : vm.otherError,
        },
    };
</script>
