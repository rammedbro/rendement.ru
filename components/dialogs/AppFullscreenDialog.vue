<template>
    <v-dialog :value="value"
              fullscreen
              :transition="transition"
              :content-class="contentClass"
              :eager="eager"
              @input="$emit('input', $event)">
        <div class="l-dialog-fullscreen ">
            <div class="l-dialog-fullscreen__toolbar">
                <!-- Тулбар -->
                <slot name="toolbar">
                    <app-toolbar :title="title"
                                 :with-back-btn="withBackBtn"
                                 @click:back="$emit('click:back')"
                                 @click:close="$emit('input', false)"/>
                </slot>
            </div>

            <div class="l-dialog-fullscreen__content">
                <slot name="default"></slot>
            </div>
        </div>
    </v-dialog>
</template>

<script>
    import AppToolbar from '~/components/layout/AppToolbar';

    export default {
        name: 'AppFullscreenDialog',
        components: { AppToolbar },
        props: {
            value: {
                type: Boolean,
                required: true,
            },
            title: {
                type: String,
                default: null,
            },
            contentClass: {
                type: String,
                default: 'white',
            },
            transition: {
                type: String,
                default: 'dialog-bottom-transition',
            },
            withBackBtn: {
                type: Boolean,
                default: false,
            },
            eager: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-dialog-fullscreen {
        position: relative;
        height: 100%;

        &__content {
            overflow: auto;
            height: calc(100% - 56px);

            @include media-breakpoint-up(md) {
                height: calc(100% - 64px);
            }
        }
    }
</style>
