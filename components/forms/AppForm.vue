<template>
    <div class="l-form"
         :style="styleObject">
        <!-- Форма -->
        <v-form v-show="isFormShow"
                ref="form"
                class="l-form-inner"
                @submit.prevent="submit">
            <!-- Хэдер -->
            <slot name="header"></slot>

            <!-- Тело формы -->
            <slot name="body"
                  v-bind="{ rules, masks, loading, submit, clear, error: dataError, errorMessage, isUserError }">
                <!-- Поля формы -->
                <slot name="fields" v-bind="{ rules, masks, validate, loading }"></slot>

                <!-- Кнопка "Отправить" -->
                <slot name="submit" v-bind="{ loading, submit }">
                    <v-btn v-if="!disableDefaultSubmit"
                           :id="submitId"
                           ref="submit"
                           color="primary" block
                           :loading="loading" type="submit">
                        {{ submitText }}
                    </v-btn>
                </slot>

                <!-- Результаты отправки формы -->
                <div v-if="inlineSuccessMessage || inlineErrorMessage"
                     class="l-form-message v-messages"
                     :class="{ 'success--text': isSuccess, 'error--text': dataError }">
                    <div class="v-messages__wrapper">
                        <div class="v-messages__message">
                            <!-- Успешная отправка формы -->
                            <slot v-if="isSuccess"
                                  name="success"></slot>

                            <!-- Неудачная отправка формы -->
                            <slot v-if="dataError"
                                  name="error"
                                  v-bind="{ error: dataError, errorMessage, isUserError }">
                                {{ errorMessage }}
                            </slot>
                        </div>
                    </div>
                </div>

                <!-- Согласие с пользовательским соглашением -->
                <slot v-if="privacyCheck"
                      name="privacy">
                    <v-checkbox v-model="privacy"
                                :rules="[rules.privacy]"
                                class="l-checkbox--small"
                                :class="{ 'mt-8': !inlineSuccessMessage && !inlineErrorMessage }">
                        <template v-slot:label>
                            <div>
                                Я ознакомился и принимаю условия
                                <a :href="$legacy.constants.SITE_DOC_USER_AGREEMENT"
                                   target="_blank" class="link link--underline"
                                   @click.stop>
                                    Пользовательского соглашения
                                </a>.
                                <br>
                                Даю согласие на обработку моих персональных данных согласно
                                <a :href="$legacy.constants.SITE_DOC_PRIVACY_POLICY"
                                   target="_blank" class="link link--underline"
                                   @click.stop>
                                    Политике конфиденциальности
                                </a>
                            </div>
                        </template>
                    </v-checkbox>
                </slot>

                <!-- Согласие на получение рассылки -->
                <slot v-if="mailingConsentCheck"
                      name="mailing-consent">
                    <v-checkbox v-model="mailingConsent"
                                class="l-checkbox--small">
                        <template v-slot:label>
                            <div>
                                Даю
                                <a :href="$legacy.constants.SITE_DOC_MAILING_CONSENT"
                                   target="_blank" class="link link--underline"
                                   @click.stop>
                                    согласие
                                </a>
                                на получение рассылки
                            </div>
                        </template>
                    </v-checkbox>
                </slot>
            </slot>

            <!-- Футер -->
            <slot name="footer"></slot>
        </v-form>

        <!-- Успешная отправка формы -->
        <div v-if="!inlineSuccessMessage && isSuccess"
             class="l-form-success list-mb-6">
            <v-icon color="success" size="60"
                    class="d-flex mx-auto mb-4">
                mdi-check-circle
            </v-icon>

            <slot name="success" v-bind="{ reload }"></slot>
        </div>

        <!-- Неудачная отправка формы -->
        <div v-if="!inlineErrorMessage && dataError"
             class="l-form-error list-mb-6">
            <v-icon color="red" size="60"
                    class="mb-4">
                mdi-close-circle
            </v-icon>

            <slot name="error" v-bind="{ error: dataError, errorMessage, isUserError, reload }">
                <div class="text-h5 mb-4">Ошибка</div>

                <p v-if="isUserError"
                   class="text-body-2">
                    {{ errorMessage }}
                </p>

                <template v-else>
                    <p class="text-body-2">
                        Произошла непредвиденная ошибка.
                        Напишите или позвоните нам.
                    </p>

                    <a :href="`tel:${ $legacy.constants.SITE_PHONE }`"
                       class="d-block text-subtitle-1 link--unstyled">
                        {{ $legacy.constants.SITE_PHONE_FORMAT }}
                    </a>
                </template>

                <v-btn color="primary" small
                       @click="reload">
                    Попробовать ещё раз
                </v-btn>
            </slot>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { UserError }  from '~/lib/classes/error';

    export default {
        name: 'AppForm',
        props: {
            url: {
                type: String,
                required: true,
            },
            method: {
                type: String,
                default: null,
            },
            passApiKey: {
                type: Boolean,
                default: false,
            },
            values: {
                type: Object,
                required: true,
            },
            files: {
                type: Object,
                default: () => ( {} ),
            },
            privacyCheck: {
                type: Boolean,
                default: false,
            },
            mailingConsentCheck: {
                type: Boolean,
                default: false,
            },
            width: {
                type: [ Number, String ],
                default: null,
            },
            minWidth: {
                type: [ Number, String ],
                default: null,
            },
            disableDefaultSubmit: {
                type: Boolean,
                default: false,
            },
            submitId: {
                type: String,
                default: null,
            },
            submitText: {
                type: String,
                default: 'Отправить',
            },
            beforeSubmitCallback: {
                type: Function,
                default: null,
            },
            afterSubmitCallback: {
                type: Function,
                default: null,
            },
            error: {
                type: Error,
                default: null,
            },
            inlineSuccessMessage: {
                type: Boolean,
                default: true,
            },
            inlineErrorMessage: {
                type: Boolean,
                default: true,
            },
            unmaskInputs: {
                type: Array,
                default: () => [],
            },
        },
        data: vm => ( {
            loading: false,
            privacy: false,
            mailingConsent: false,
            isSuccess: false,
            dataError: vm.error,
            rules: {
                required: v => {
                    const isEmpty = (
                        v === null ||
                        ( typeof v === 'string' && v.length === 0 ) ||
                        ( Array.isArray( v ) && v.length === 0 ) ||
                        false
                    );

                    return !isEmpty || 'Обязательное поле';
                },
                phone: v => !v || v.length === 10 || 'Телефон не может быть меньше 10 символов',
                smsCode: v => !v || v.length === 4 || 'Код из смс не может быть меньше 4 символов',
                email: v => !v || /.+@.+\..+/.test( v ) || 'Некорректный email',
                password: v => {
                    if ( !v ) return true;

                    if ( !/^[a-zA-Z0-9]+$/.test( v ) ) {
                        return 'Пароль должен содержать только латинские буквы и цифры';
                    }

                    if ( v.length < 6 ) {
                        return 'Пароль должен быть не менее 6 символов';
                    }

                    return true;
                },
                passwordConfirm: v => !vm.values.password || v === vm.values.password || 'Пароли должны совпадать',
                inn: v => !v || [ 10, 12 ].includes( v.length ) || 'ИНН должен содержать либо 10, либо 12 цифр',
                privacy: v => !!v || 'Вы должны согласиться, чтобы продолжить!',
            },
            masks: {
                phone: {
                    mask: '(+7)|8 (999) 999-99-99',
                    autoUnmask: true,
                    showMaskOnHover: false,
                },
                email: {
                    mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
                    definitions: {
                        '*': {
                            validator: '[0-9A-Za-z!#$%&\'*+/=?^_`{|}~-]',
                            casing: 'lower',
                        },
                    },
                    showMaskOnHover: false,
                },
                smsCode: {
                    mask: '9{4}',
                    autoUnmask: true,
                    showMaskOnHover: false,
                },
                inn: {
                    mask: '9{10}[99]',
                    autoUnmask: true,
                    showMaskOnHover: false,
                },
                date: {
                    alias: 'datetime',
                    inputFormat: 'dd.mm.yyyy',
                    placeholder: '_',
                    showMaskOnHover: false,
                },
                currency: {
                    alias: 'currency',
                    groupSeparator: ' ',
                    digits: 0,
                    rightAlign: false,
                    showMaskOnHover: false,
                    autoUnmask: true,
                    unmaskAsNumber: true,
                    allowMinus: false,
                },
            },
        } ),
        computed: {
            styleObject: vm => ( {
                width: vm.width ? vm.width + 'px' : null,
                minWidth: vm.minWidth ? vm.minWidth + 'px' : null,
            } ),
            isFormShow: vm =>
                ( !vm.isSuccess && !vm.dataError ) ||
                ( vm.isSuccess && vm.inlineSuccessMessage ) ||
                ( vm.dataError && vm.inlineErrorMessage ),
            errorMessage: vm => {
                if ( vm.dataError === null ) {
                    return null;
                } else if ( vm.dataError instanceof UserError ) {
                    return vm.dataError.message;
                } else {
                    return 'Произошла ошибка';
                }
            },
            isUserError: vm => ( vm.dataError && vm.dataError instanceof UserError ),
        },
        watch: {
            error( value ) {
                if ( value instanceof Error ) {
                    this.dataError = value;
                }
            },
        },
        methods: {
            ...mapActions( 'api', [ 'apiSendForm', 'apiPost', 'apiGet' ] ),
            submit() {
                setTimeout( async() => {
                    try {
                        this.reload();

                        if ( !this.validate() ) return;

                        this.scrollToSubmit();
                        this.$emit( 'update:loading', this.loading = true );

                        if ( typeof this.beforeSubmitCallback === 'function' ) {
                            this.beforeSubmitCallback();
                        }

                        const { url, passApiKey, files } = this.$props;
                        const method = ( this.$props.method || '' ).toUpperCase();
                        const data = this.unmaskValues();
                        const options = { url, data, useLoading: false, passApiKey };

                        let result;

                        if ( method === 'POST' ) {
                            result = await this.apiPost( options );
                        } else if ( method === 'GET' ) {
                            result = await this.apiGet( options );
                        } else {
                            options.files = files;
                            result = await this.apiSendForm( options );
                        }

                        if ( typeof this.afterSubmitCallback === 'function' ) {
                            this.afterSubmitCallback( result );
                        }

                        this.isSuccess = true;
                        this.$emit( 'success', result );
                    } catch ( e ) {
                        if ( !( e instanceof UserError ) ) {
                            console.log( e.message );
                        }

                        this.$emit( 'update:error', this.dataError = e );
                    } finally {
                        this.$emit( 'update:loading', this.loading = false );
                    }
                }, 0 );
            },
            validate() {
                const result = this.$refs.form.validate();

                for ( const input of this.$refs.form.inputs ) {
                    if ( !input.valid ) {
                        this.scrollTo( input );
                        break;
                    }
                }

                return result;
            },
            unmaskValues() {
                const result = Object.assign( {}, this.values );

                for ( const name of this.unmaskInputs ) {
                    const input = this.$refs.form.inputs.find( item => item.$refs.input.name === name );

                    if ( !input ) continue;

                    const { inputmask } = input.$refs.input;

                    if ( !inputmask ) continue;

                    result[name] = inputmask.unmaskedvalue();
                }

                return result;
            },
            scrollTo( elem ) {
                const options = { offset: 32 };
                const container = this.$el.closest( '.v-dialog' );

                if ( container ) {
                    options.offset = -32;
                    options.container = container;
                }

                this.$vuetify.goTo( elem, options );
            },
            scrollToSubmit() {
                const target = this.$refs.submit || this.$el.querySelector( 'button[type=submit]' ) || null;

                if ( target ) {
                    this.scrollTo( target );
                }
            },
            reload() {
                this.isSuccess = false;
                this.$emit( 'update:error', this.dataError = null );
            },
            clear() {
                this.$refs.form.reset();
            },
        },
    };
</script>

<style lang="scss" scoped>
    .l-form-inner {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .l-form-message {
        min-height: 16px;
        font-size: 11px;
        font-weight: 500;
        margin: 8px 0;
    }
</style>
