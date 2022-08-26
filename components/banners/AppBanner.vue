<template>
    <app-dialog v-model="display"
                :fullscreen="fullscreen"
                :max-width="maxWidth"
                :root-class="rootClass">
        <slot name="default" v-bind="{ hide }"></slot>
    </app-dialog>
</template>

<script>
    import { mapMutations } from 'vuex';

    import AppDialog from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppBanner',
        components: { AppDialog },
        props: {
            delay: {
                type: [ Number, String ],
                default: 0,
            },
            cookieName: {
                type: String,
                required: true,
            },
            cookieOptions: {
                type: Object,
                default: () => ( {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365,
                } ),
            },
            maxWidth: {
                type: [ Number, String ],
                default: 384,
            },
            rootClass: {
                type: [ String, Array, Object ],
                default: null,
            },
            fullscreen: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ( {
            display: false,
        } ),
        mounted() {
            const cookie = this.$cookies.get( this.cookieName );

            if ( cookie === 2 ) return;

            this.show();
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            show() {
                const { delay, cookieName, cookieOptions } = this;

                setTimeout( () => {
                    const cookie = this.$cookies.get( this.cookieName );
                    this.display = true;
                    this.$cookies.set( cookieName, cookie ? '2' : '1', cookieOptions );
                }, +delay * 1000 );
            },
            hide() {
                this.display = false;
            },
        },
    };
</script>
