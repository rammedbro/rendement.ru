<template>
    <app-dialog v-model="display"
                content-class="list-mb-6">
        <v-icon size="60" color="red"
                class="mb-4">
            mdi-close-circle
        </v-icon>

        <div class="text-h5 mb-4">Ошибка</div>

        <p class="text-body-2">
            Произошла непредвиденная ошибка.
            Напишите или позвоните нам.
        </p>

        <a :href="`tel:${ $legacy.constants.SITE_PHONE }`"
           class="d-block text-subtitle-1 link--unstyled">
            {{ $legacy.constants.SITE_PHONE_FORMAT }}
        </a>

        <v-btn text color="primary"
               @click="hideAppDialog( 'error' )">
            Ок
        </v-btn>
    </app-dialog>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import AppDialog                    from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppErrorDialog',
        components: { AppDialog },
        computed: {
            ...mapGetters( 'ui', [ 'appErrorDialogDisplay' ] ),
            display: {
                get: vm => vm.appErrorDialogDisplay,
                set( value ) {
                    if ( value ) return;
                    this.hideAppDialog( 'error' );
                },
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'hideAppDialog' ] ),
        },
    };
</script>