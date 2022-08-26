<template>
    <app-dialog v-model="display">
        <app-form url="/api/sendTicketToSupport/"
                  :values="values"
                  :inline-success-message="false"
                  :inline-error-message="false">
            <template v-slot:header>
                <div class="text-h5 mb-6">
                    Напишите нам, мы обязательно вам ответим
                </div>
            </template>

            <template v-slot:fields="{ rules, masks }">
                <v-text-field v-model="values.name"
                              :rules="[rules.required]"
                              outlined label="Имя"/>

                <v-text-field v-model="values.phone"
                              v-mask="masks.phone"
                              :rules="[rules.required, rules.phone]"
                              type="tel" outlined label="Номер телефона"/>

                <v-text-field v-model="values.email"
                              :rules="[rules.email]"
                              outlined label="Email"/>

                <v-textarea v-model="values.comment"
                            outlined label="Ваш вопрос"/>
            </template>

            <template v-slot:success>
                <div class="text-h5 mb-4">Вопрос отправлен</div>

                <div class="text-body-2">
                    Мы свяжемся с вами в<br>
                    ближайшее время
                </div>
            </template>
        </app-form>
    </app-dialog>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import AppForm                      from '~/components/forms/AppForm';
    import AppDialog                    from '~/components/dialogs/AppDialog';

    export default {
        name: 'AppSupportDialog',
        components: { AppDialog, AppForm },
        data: () => ( {
            values: {
                name: null,
                phone: null,
                email: null,
                comment: null,
            },
        } ),
        computed: {
            ...mapGetters( 'ui', [ 'appSupportDialogDisplay' ] ),
            ...mapGetters( 'user', [ 'userIsLogin', 'userData' ] ),
            display: {
                get: vm => vm.appSupportDialogDisplay,
                set( value ) {
                    if ( value ) return;
                    this.hideAppDialog( 'support' );
                },
            },
        },
        watch: {
            userIsLogin( newValue ) {
                if ( newValue ) {
                    this.copyDataFromStore();
                }
            },
        },
        created() {
            if ( this.userIsLogin ) {
                this.copyDataFromStore();
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'hideAppDialog' ] ),
            copyDataFromStore() {
                const { name, phone, email } = this.userData;
                Object.assign( this.values, { name, phone, email } );
            },
        },
    };
</script>