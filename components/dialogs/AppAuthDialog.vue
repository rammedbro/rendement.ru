<template>
    <v-dialog v-model="display"
              fullscreen
              transition="dialog-bottom-transition"
              content-class="white">
        <v-container fluid fill-height>
            <v-row no-gutters justify="end"
                   class="mb-8 mb-lg-0">
                <!-- Кнопка "Закрыть" -->
                <v-icon @click="display = false">
                    mdi-close
                </v-icon>
            </v-row>

            <v-row align-lg="center" justify="center"
                   class="h-100">
                <v-col cols="auto">
                    <!-- Авторизация -->
                    <app-auth-form v-show="appAuthDialogDisplay"
                                   @click:reg="onRegistrationClick"
                                   @click:forgot="onForgotPasswordClick"
                                   @success="display = false"/>

                    <!-- Регистрация -->
                    <app-registration-form v-show="appRegistrationDialogDisplay"
                                           :key="registrationKey"
                                           :is-recruiting-agency="appRecruitingAgencyRegistrationDialogDisplay"
                                           @click:auth="onAuthClick"
                                           @success="display = false"/>

                    <!-- Сброс пароля -->
                    <app-forgot-password-form v-show="appForgotPasswordDialogDisplay"
                                              @success="onAuthClick"/>
                </v-col>
            </v-row>
        </v-container>
    </v-dialog>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import AppAuthForm           from '~/components/forms/AppAuthForm';
    import AppRegistrationForm   from '~/components/forms/AppRegistrationForm';
    import AppForgotPasswordForm from '~/components/forms/AppForgotPasswordForm';

    export default {
        name: 'AppAuthDialog',
        components: {
            AppAuthForm,
            AppRegistrationForm,
            AppForgotPasswordForm,
        },
        data() {
            return {
                registrationKey: 0,
            };
        },
        computed: {
            ...mapGetters( 'ui', [
                'appAuthDialogDisplay',
                'appRegistrationDialogDisplay',
                'appForgotPasswordDialogDisplay',
                'appRecruitingAgencyRegistrationDialogDisplay',
            ] ),
            display: {
                get: vm =>
                    vm.appAuthDialogDisplay ||
                    vm.appRegistrationDialogDisplay ||
                    vm.appForgotPasswordDialogDisplay,
                set( value ) {
                    if ( value ) return;
                    this.hideAppDialog( [ 'auth', 'registration', 'forgotPassword', 'recruitingAgencyRegistration' ] );
                },
            },
        },
        watch: {
            appRegistrationDialogDisplay() {
                this.registrationKey += 1;
            },
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog', 'hideAppDialog' ] ),
            onAuthClick() {
                this.hideAppDialog( [ 'registration', 'forgotPassword' ] );
                this.showAppDialog( 'auth' );
            },
            onRegistrationClick() {
                this.hideAppDialog( [ 'auth', 'forgotPassword' ] );
                this.showAppDialog( 'registration' );
            },
            onForgotPasswordClick() {
                this.hideAppDialog( [ 'auth', 'registration' ] );
                this.showAppDialog( 'forgotPassword' );
            },
        },
    };
</script>