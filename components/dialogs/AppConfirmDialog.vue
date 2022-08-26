<template>
    <app-dialog v-model="display">
        <div class="body-2 mb-8">
            Вы действительно хотите удалить карточку?
        </div>

        <v-row justify="center">
            <v-col cols="5">
                <v-btn color="primary"
                       block x-small
                       @click="onConfirm">
                    Завершить
                </v-btn>
            </v-col>
            <v-col cols="5">
                <v-btn color="primary"
                       block x-small
                       outlined
                       @click="onDecline">
                    Отмена
                </v-btn>
            </v-col>
        </v-row>
    </app-dialog>
</template>

<script>
    import AppDialog                    from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppConfirmDialog',
        components: { AppDialog },
        props: {
            value: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            display: {
                get: vm => vm.value,
                set( value ) {
                    if ( value ) return;
                    this.$emit( 'input', value );
                },
            },
        },
        methods: {
            onConfirm() {
                this.display = false;
                this.$emit( 'confirm' );
            },
            onDecline() {
                this.display = false;
                this.$emit( 'decline' );
            },
        },
    };
</script>
