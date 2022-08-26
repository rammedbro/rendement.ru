<template>
    <app-dialog v-model="display" class="pa-4">
        <p class="text-body-2 pa-5">
            Проверьте резюме кандидата
            на соответствие требования
        </p>
    </app-dialog>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import AppDialog                    from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppNoteDialog',
        components: { AppDialog },
        computed: {
            ...mapGetters( 'ui', [ 'appNoteDialogDisplay' ] ),
            display: {
                get: vm => vm.appNoteDialogDisplay,
                set( value ) {
                    if ( value ) return;
                    this.hideAppDialog( 'note' );
                },
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'hideAppDialog' ] ),
        },
    };
</script>
