<template>
    <component :is="component"
               :style="rootStyle"
               class="l-text-limiter">
        <div :class="{ 'absolute-center-y' : adaptive }"
             class="text-ellipsis">
            <div v-if="scroll"
                 :style="animationStyle"
                 class="l-text-limiter__scroll-text">
                <slot name="default"></slot>
            </div>

            <slot v-else
                  name="default"></slot>
        </div>
    </component>
</template>

<script>
    export default {
        name: 'AppTextLimiter',
        props: {
            maxWidth: {
                type: [ Number, String ],
                default: null,
            },
            component: {
                type: [ String, Function ],
                default: 'div',
            },
            adaptive: {
                type: Boolean,
                default: false,
            },
            scroll: {
                type: Boolean,
                default: false,
            },
            scrollOptions: {
                type: Object,
                default: () => ( {} ),
            },
        },
        data: vm => ( {
            animationOptions: {
                duration: 4,
                timingFunction: 'linear',
                delay: 0,
                iterationCount: 'infinite',
                direction: 'normal',
                ...vm.scrollOptions,
            },
            animationStart: false,
        } ),
        computed: {
            rootStyle: vm => ( {
                maxWidth: vm.maxWidth + 'px',
            } ),
            animationStyle: vm => ( {
                animationDuration: vm.animationOptions.duration + 's',
                animationTimingFunction: vm.animationOptions.timingFunction,
                animationDelay: vm.animationOptions.delay + 's',
                animationIterationCount: vm.animationOptions.iterationCount,
                animationDirection: vm.animationOptions.direction,
            } ),
        },
    };
</script>

<style lang="scss" scoped>
    .l-text-limiter {
        position: relative;
        height: 100%;

        &__scroll-text {
            display: inline-block;
            padding-left: 100%;
            animation-name: scroll;

            @keyframes scroll {
                0% {
                    transform: translateX(-100%);
                }

                100% {
                    transform: translateX(0);
                }
            }
        }
    }
</style>