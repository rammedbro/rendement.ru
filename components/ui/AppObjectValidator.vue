<template>
    <component :is="component"
               v-if="result"
               v-bind="componentProps">
        <slot name="default"
              v-bind="{ value: result }"></slot>
    </component>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import { checkObjectInterface } from '~/lib/classes/validation';

    export default {
        name: 'AppObjectValidator',
        props: {
            value: {
                type: Object,
                required: true,
            },
            type: {
                type: [ Object, Array ],
                required: true,
            },
            component: {
                type: [ String, Function ],
                default: 'div',
            },
            complex: {
                type: Boolean,
                default: false,
            },
            props: {
                type: Object,
                default: () => ( {} ),
            },
            errorOutput: {
                type: String,
                default: 'dialog',
            },
        },
        data: () => ( {
            result: null,
        } ),
        computed: {
            ...mapGetters( 'ui', [ 'appErrorDialogDisplay' ] ),
            componentProps: vm => vm.complex ? vm.props : { value: vm.result, ...vm.props },
        },
        created() {
            this.validate();
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            validate() {
                const { value, type, errorOutput } = this;

                try {
                    this.result = checkObjectInterface( value, type );
                } catch ( e ) {
                    switch ( errorOutput ) {
                        case 'dialog':
                            if ( !this.appErrorDialogDisplay ) {
                                this.showAppDialog( 'error' );
                            }

                            break;
                        case 'page':
                            this.$nuxt.error( e );
                            break;
                    }

                    console.log( e.message );
                }
            },
        },
    };
</script>