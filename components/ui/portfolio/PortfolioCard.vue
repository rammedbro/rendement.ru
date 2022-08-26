<template>
    <v-card width="190" height="190" elevation="0"
            class="portfolio-card">
        <!-- Кнопка "Редактировать портфолио" -->
        <v-icon v-if="enableEdit"
                color="primary"
                size="24"
                class="l-card-action-icon l-icon--fill"
                @click.stop="$emit('click:edit', value)">
            mdi-pencil-circle
        </v-icon>

        <!-- Обложка -->
        <v-img height="142"
               :src="cover"
               lazy-src="/images/no-img-placeholder.png"/>

        <!-- Описание -->
        <v-card-text class="py-2">
            <div class="text-small-1 text-ellipsis">{{ value.title }}</div>
            <div class="text-small-3 grey--text lighten-1">
                {{ value.images.length }} фото
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: 'PortfolioCard',
        props: {
            value: {
                type: Object,
                required: true,
            },
            enableEdit: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            cover: vm => vm.value.images.length ? vm.value.images[0].preview : null,
        },
    };
</script>

<style lang="scss" scoped>
    .portfolio-card {
        cursor: pointer;
        border: 1px solid;
    }

    @include theme('portfolio-card') using($material) {
        border-color: map_get($material, 'dividers');
    }
</style>