<template>
    <div class="l-card"
         :class="{ 'l-card--hover': hover }"
         :style="rootStyle">
        <v-card nuxt :to="link"
                elevation="0"
                class="l-card__card">
            <v-row no-gutters
                   class="l-card__row"
                   :class="{ 'flex-column': column }">
                <!-- Левая область -->
                <v-col :cols="colLeftWidth"
                       :style="colLeftStyle"
                       class="l-card__col-wrapper">
                    <div class="l-card__col"
                         :class="{ 'absolute-full': !column }">
                        <slot name="left"></slot>
                    </div>
                </v-col>

                <!-- Правая область -->
                <v-col :style="colRightStyle"
                       class="l-card__col-wrapper">
                    <div class="l-card__col l-card__right">
                        <slot name="right"></slot>
                    </div>
                </v-col>
            </v-row>
        </v-card>

        <!-- Нижняя область -->
        <div class="l-card__bottom">
            <slot name="bottom"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AppCard',
        props: {
            minWidth: {
                type: [ Number, String ],
                default: 288,
            },
            maxWidth: {
                type: [ Number, String ],
                default: 576,
            },
            minHeight: {
                type: [ Number, String ],
                default: null,
            },
            hover: {
                type: Boolean,
                default: false,
            },
            link: {
                type: String,
                default: null,
            },
            column: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            rootStyle: vm => ( {
                minWidth: vm.minWidth + 'px',
                maxWidth: vm.maxWidth + 'px',
            } ),
            colLeftStyle: vm => ( {
                minWidth: vm.minWidth + 'px',
                minHeight: vm.minHeight + 'px',
            } ),
            colRightStyle: vm => ( {
                minWidth: vm.minWidth + 'px',
            } ),
            colLeftWidth: vm => vm.column ? 'auto' : null,
        },
    };
</script>

<style lang="scss" scoped>
    .l-card {
        position: relative;
        display: flex;
        flex-direction: column;
        @include elevation($card-elevation);

        &__card {
            flex-grow: 1;
        }

        &__row {
            overflow: hidden;
            height: 100%;
        }

        &__col-wrapper {
            position: relative;
            z-index: 0;
        }

        &__col {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 16px;
        }

        &__right {
            width: calc(100% + 1px);
            height: calc(100% + 1px);
            margin-top: -2px;
            margin-left: -2px;
            border-top: 1px solid map_get($grey, 'lighten-4');
            border-left: 1px solid map_get($grey, 'lighten-4');
        }

        &--hover {
            transition: box-shadow .4s cubic-bezier(.25, .8, .25, 1);

            &:hover {
                @include elevation($card-hover-elevation);
            }

            .l-card__card {
                cursor: pointer;
            }
        }
    }
</style>