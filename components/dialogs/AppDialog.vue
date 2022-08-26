<template>
    <v-dialog :value="value"
              :max-width="maxWidth"
              :fullscreen="fullscreen"
              content-class="l-dialog"
              :persistent="persistent"
              @input="$emit('input', $event)">
        <v-card :class="rootClass">
            <v-container class="text-center">
                <slot name="body">
                    <div class="text-right">
                        <v-icon @click="$emit('input', false)">
                            mdi-close
                        </v-icon>
                    </div>

                    <div class="l-dialog__content"
                         :class="contentClass">
                        <slot v-if="isInit"
                              name="default"></slot>
                    </div>
                </slot>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: 'AppDialog',
        props: {
            value: {
                type: Boolean,
                default: false,
            },
            maxWidth: {
                type: [ Number, String ],
                default: 384,
            },
            rootClass: {
                type: [ String, Array, Object ],
                default: null,
            },
            contentClass: {
                type: [ String, Array, Object ],
                default: null,
            },
            fullscreen: {
                type: Boolean,
                default: false,
            },
            persistent: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ( {
            isInit: false,
        } ),
        watch: {
            value() {
                this.isInit = true;
            },
        },
    };
</script>
