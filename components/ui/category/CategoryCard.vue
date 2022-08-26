<template>
    <v-card nuxt :to="link"
            hover class="category-card">
        <!-- Текст -->
        <div class="category-card__text">
            <div class="text-h6 mb-2">{{ value.name }}</div>
            <div class="text-body-2 grey--text text--darken-1">
                {{ subCategoriesCountFormat }}
            </div>
        </div>

        <!-- Картинка -->
        <v-img :src="value.image"
               contain position="center right"
               class="category-card__img"/>
    </v-card>
</template>

<script>
    import { pickNumeralEnding } from '~/lib/classes/utility';

    export default {
        name: 'CategoryCard',
        props: {
            value: {
                type: Object,
                required: true,
            },
            section: {
                type: String,
                required: true,
            },
        },
        computed: {
            link: vm => `/${ vm.section }/filter/category-is-${ vm.value.code }/`,
            subCategoriesCountFormat: vm => {
                const count = vm.value.subCategories.length;
                const ending = pickNumeralEnding( count, [ 'ия', 'ии', 'ий' ] );

                return `${ count } подкатегор${ ending }`;
            },
        },
    };
</script>

<style lang="scss" scoped>
    .category-card {
        display: flex !important;
        background: map_get($light-blue, 'lighten-5') !important;

        &__text {
            width: 80%;
            padding: 16px;
        }

        &__img {
            align-self: flex-end;
            width: 20%;
            height: 60px;
        }

        @include media-breakpoint-up(lg) {
            flex-direction: column;

            &__text {
                width: 100%;
            }

            &__img {
                width: 40%;
                height: 90px;
            }
        }
    }
</style>