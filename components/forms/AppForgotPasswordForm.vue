<template>
    <div class="forgot-password-form">
        <v-stepper v-model="step">
            <v-stepper-items>
                <!-- Отправка кода -->
                <v-stepper-content step="1">
                    <app-form ref="stepOneForm"
                              url="/api/sendCode/"
                              :values="{ type, ...values }"
                              :loading.sync="stepOne.loading"
                              :error.sync="stepOne.error"
                              width="288"
                              submit-id="btn-203"
                              submit-text="Отправить код"
                              @success="step = 2">
                        <template v-slot:header>
                            <div class="text-h5 mb-8">Восстановление пароля</div>

                            <div class="text-small-1 mb-6">
                                Укажите {{ stepOne.text[curResetBy] }},
                                который был использован при регистрации.
                                После чего мы вышлем письмо с кодом для восстановления аккаунта
                            </div>
                        </template>

                        <template v-slot:fields="{ rules, masks }">
                            <v-text-field v-if="curResetBy === 'email'"
                                          :key="curResetBy"
                                          v-model="email"
                                          :rules="[rules.required, rules.email]"
                                          outlined label="E-mail"/>

                            <v-text-field v-if="curResetBy === 'phone'"
                                          :key="curResetBy"
                                          v-model="phone"
                                          v-mask="masks.phone"
                                          :rules="[rules.required, rules.phone]"
                                          type="tel" outlined label="Номер телефона"/>
                        </template>

                        <template v-slot:footer>
                            <v-divider class="mb-4"/>

                            <v-btn color="primary" text block
                                   @click="switchResetBy">
                                Восстановить с помощью {{ stepOne.btn[curResetBy] }}
                            </v-btn>
                        </template>
                    </app-form>
                </v-stepper-content>

                <!-- Подтверждение кода -->
                <v-stepper-content step="2">
                    <app-form url="/api/checkCode/"
                              :values="{ type, code, ...values }"
                              :error="stepOne.error"
                              width="288"
                              submit-text="Сбросить пароль"
                              @success="onCheckCodeSuccess">
                        <template v-slot:header>
                            <div class="text-h5 mb-8">Восстановление пароля</div>

                            <div class="text-small-1 mb-6">
                                Введите код из письма отправленного на {{ stepTwo.text[curResetBy] }}
                                <a v-if="curResetBy === 'email'"
                                   :href="`mailto:${ values.email }`" class="link">
                                    {{ values.email }}
                                </a>

                                <a v-if="curResetBy === 'phone'"
                                   :href="`tel:7${ values.phone }`" class="link">
                                    7{{ values.phone }}
                                </a>
                            </div>
                        </template>

                        <template v-slot:fields="{ rules, masks }">
                            <v-text-field v-model="code"
                                          v-mask="masks.smsCode"
                                          :rules="[rules.required, rules.smsCode]"
                                          outlined label="Код"/>
                        </template>

                        <template v-slot:footer>
                            <section class="list-mb-4">
                                <v-divider/>

                                <v-btn color="primary" text block
                                       :loading="stepOne.loading"
                                       @click="getNewCode">
                                    Получить новый код
                                </v-btn>

                                <v-divider/>

                                <v-btn color="primary" text block
                                       @click="backToStepOne">
                                    Изменить {{ stepTwo.btn[curResetBy] }}
                                </v-btn>
                            </section>
                        </template>
                    </app-form>
                </v-stepper-content>

                <!-- Смена пароля -->
                <v-stepper-content step="3">
                    <app-form url="/api/changePassword/"
                              :values="{ ...values, password, checkWord }"
                              width="288"
                              submit-text="Подтвердить"
                              :inline-success-message="false">
                        <template v-slot:header>
                            <div class="text-h5 mb-8">Новый пароль</div>
                        </template>

                        <template v-slot:fields="{ rules }">
                            <v-text-field v-model="password"
                                          :rules="[rules.required, rules.password]"
                                          outlined label="Пароль"
                                          :type="isShowPass ? 'text' : 'password'"
                                          :append-icon="isShowPass ? 'visibility_off' : 'visibility'"
                                          @click:append="isShowPass = !isShowPass"/>

                            <v-text-field v-model="passwordConfirm"
                                          :rules="[rules.passwordConfirm]"
                                          outlined label="Подтвердите пароль"
                                          :type="isShowPassConfirm ? 'text' : 'password'"
                                          :append-icon="isShowPassConfirm ? 'visibility_off' : 'visibility'"
                                          @click:append="isShowPassConfirm = !isShowPassConfirm"/>
                        </template>

                        <template v-slot:success>
                            <div class="text-h5 mb-8">Пароль успешно сменён!</div>

                            <div class="text-small-1">
                                Перейти к <span class="link" @click="$emit('success')">авторизации</span>
                            </div>
                        </template>
                    </app-form>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';

    import AppForm       from '~/components/forms/AppForm';
    import { checkType } from '~/lib/classes/validation';

    export default {
        name: 'AppForgotPasswordForm',
        components: { AppForm },
        data: () => ( {
            step: 1,
            curResetBy: 'email',
            stepOne: {
                loading: false,
                error: null,
                text: {
                    email: 'e-mail',
                    phone: 'телефон',
                },
                btn: {
                    email: 'телефона',
                    phone: 'почты',
                },
            },
            stepTwo: {
                url: {
                    email: '/api/confirmEmailCode/',
                    phone: '/api/confirmPhoneCode/',
                },
                text: {
                    email: 'почту',
                    phone: 'телефон',
                },
                btn: {
                    email: 'почту',
                    phone: 'номер',
                },
            },
            type: 'changePassword',
            email: null,
            phone: null,
            code: null,
            checkWord: undefined,
            password: null,
            passwordConfirm: null,
            isShowPass: false,
            isShowPassConfirm: false,
        } ),
        computed: {
            values: vm => ( {
                email: vm.curResetBy === 'email' ? vm.email : null,
                phone: vm.curResetBy === 'phone' ? vm.phone : null,
            } ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            switchResetBy() {
                switch ( this.curResetBy ) {
                    case 'email':
                        this.curResetBy = 'phone';
                        break;
                    case 'phone':
                        this.curResetBy = 'email';
                        break;
                }
            },
            backToStepOne() {
                try {
                    this.$refs.stepOneForm.reload();
                    this.step = 1;
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e.message );
                }
            },
            getNewCode() {
                try {
                    this.$refs.stepOneForm.submit();
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e.message );
                }
            },
            onCheckCodeSuccess( result ) {
                try {
                    this.checkWord = checkType( result, String );
                    this.step = 3;
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e );
                }
            },
        },
    };
</script>