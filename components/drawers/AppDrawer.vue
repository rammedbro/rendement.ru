<template>
    <v-navigation-drawer :value="value"
                         fixed :right="right"
                         :touchless="touchless"
                         width="320"
                         mobile-breakpoint="9999"
                         disable-resize-watcher
                         disable-route-watcher
                         :style="styleObject"
                         @input="onInput">
        <slot v-if="isInit"
              name="default" v-bind="{ hide }"></slot>
    </v-navigation-drawer>
</template>

<script>
    export default {
        name: 'AppDrawer',
        props: {
            value: {
                type: Boolean,
                required: true,
            },
            right: {
                type: Boolean,
                default: false,
            },
            touchless: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ( {
            isInit: false,
        } ),
        computed: {
            styleObject: vm => ( {
                top: ( vm.$vuetify.application.top || 0 ) + 'px',
                height: ( document.documentElement.clientHeight - vm.$vuetify.application.top ) + 'px',
            } ),
        },
        methods: {
            onInput( value ) {
                this.isInit = true;
                this.$emit( 'input', value );
            },
            show() {
                this.$emit( 'input', true );
            },
            hide() {
                this.$emit( 'input', false );
            },
        },
    };
</script>