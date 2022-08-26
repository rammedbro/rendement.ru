<template>
    <v-toolbar class="toolbar"
               :class="{'toolbar--fixed': fixed}">
        <v-container class="py-0">
            <v-row align="center" justify="space-between">
                <v-col v-if="withBackBtn"
                       cols="auto">
                    <v-icon color="primary"
                            @click="$emit('click:back')">
                        mdi-arrow-left
                    </v-icon>
                </v-col>

                <v-col>
                    <app-text-limiter adaptive>
                        <slot name="title">
                            <div class="text-h6 text-center">{{ title }}</div>
                        </slot>
                    </app-text-limiter>
                </v-col>

                <v-col cols="auto">
                    <v-icon color="primary"
                            @click="$emit('click:close')">
                        mdi-close
                    </v-icon>
                </v-col>
            </v-row>
        </v-container>

        <v-progress-linear :active="apiLoading"
                           indeterminate height="2"
                           absolute bottom color="primary"/>
    </v-toolbar>
</template>

<script>
    import { mapGetters } from 'vuex';

    import AppTextLimiter from '~/components/ui/AppTextLimiter';

    export default {
        name: 'AppToolbar',
        components: { AppTextLimiter },
        props: {
            title: {
                type: String,
                default: null,
            },
            fixed: {
                type: Boolean,
                default: false,
            },
            withBackBtn: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            ...mapGetters( 'api', [ 'apiLoading' ] ),
        },
    };
</script>

<style scoped lang="scss">
    .toolbar {
        position: relative;
        z-index: 5;

        &--fixed {
            position: fixed;
            z-index: 10;
            top: 0;
            right: 0;
            left: 0;
            box-shadow: none;
        }
    }
</style>