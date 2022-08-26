<template>
    <div class="l-catalog-element">
        <slot v-if="value"
              name="default" v-bind="{ value }"></slot>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';

    import { checkObjectInterface }    from '~/lib/classes/validation';
    import { IntCatalogElementDetail } from '~/lib/types/catalog';

    export default {
        name: 'LCatalogElement',
        props: {
            infoBlockId: {
                type: Number,
                required: true,
            },
            sectionId: {
                type: Number,
                default: null,
            },
            content: {
                type: Object,
                default: undefined,
            },
            type: {
                type: Object,
                default: () => IntCatalogElementDetail,
            },
        },
        data: vm => ( {
            value: undefined,
        } ),
        created() {
            if ( !this.type ) return;

            try {
                this.value = checkObjectInterface( this.content, this.type );
            } catch ( e ) {
                console.log( e.message );
                this.showAppDialog( 'error' );
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
        },
    };
</script>