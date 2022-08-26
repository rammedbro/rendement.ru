<template>
    <v-avatar :size="size"
              :width="width"
              :height="height"
              :min-width="width"
              class="avatar theme--light"
              :class="cssClass">
        <img :src="src" alt="Avatar"
             class="avatar__image">
    </v-avatar>
</template>

<script>
    export default {
        name: 'AppAvatar',
        props: {
            img: {
                type: String,
                default: null,
            },
            size: {
                type: [ Number, String ],
                default: 42,
            },
            width: {
                type: [ Number, String ],
                default: null,
            },
            height: {
                type: [ Number, String ],
                default: null,
            },
            bordered: {
                type: Boolean,
                default: false,
            },
            outlined: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            src: vm => ( typeof vm.img === 'string' ) ? vm.img : '/images/no-img-placeholder.png',
            cssClass: vm => ( {
                'avatar--bordered': vm.bordered,
                'avatar--outlined': vm.outlined,
            } ),
        },
    };
</script>

<style lang="scss" scoped>
    .avatar {
        &__image {
            width: 100%;
            height: 100%;
        }

        &--bordered {
            border: 3px solid;
            border-radius: 50%;
            background-color: transparent !important;
        }

        &--outlined {
            padding: 2px;
        }
    }

    @include theme('avatar') using($theme) {
        border-color: map-get($theme, 'dividers');
    }
</style>