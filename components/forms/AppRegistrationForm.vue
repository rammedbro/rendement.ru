<template>
    <div class="registration-form">
        <v-stepper v-model="step">
            <v-stepper-items>
                <!-- Выбор типа лица и ввод номера -->
                <v-stepper-content step="1">
                    <app-form ref="stepOneForm"
                              url="/api/sendCode/"
                              :values="{ type, phone: values.phone }"
                              :loading.sync="stepOne.loading"
                              :error.sync="stepOne.error"
                              width="288"
                              submit-id="btn-202"
                              submit-text="Получить код"
                              privacy-check
                              mailing-consent-check
                              @success="step = 2">
                        <template v-slot:header>
                            <div class="text-h5 mb-8">Регистрация</div>

                            <div class="text-small-1 mb-8">
                                Уже зарегистированы?
                                <span class="link" @click="$emit('click:auth')">Войти</span>
                            </div>

                            <v-tabs v-model="values.personType"
                                    grow
                                    class="mb-6">
                                <v-tab v-show="!isRecruitingAgency">Физ. лицо</v-tab>
                                <v-tab>Юр. лицо</v-tab>
                            </v-tabs>
                        </template>

                        <template v-slot:fields="{ rules, masks }">
                            <v-text-field v-model="values.phone"
                                          v-mask="masks.phone"
                                          :rules="[rules.required, rules.phone]"
                                          type="tel" outlined label="Номер телефона"/>
                        </template>
                    </app-form>
                </v-stepper-content>

                <!-- Подтверждение номера -->
                <v-stepper-content step="2">
                    <app-form url="/api/checkCode/"
                              :values="{ type, code, phone: values.phone }"
                              :error="stepOne.error"
                              width="288"
                              submit-text="Подтвердить"
                              @success="step = 3">
                        <template v-slot:header>
                            <div class="text-h5 mb-8">Подтвердите номер телефона</div>

                            <div class="text-small-1 mb-6">
                                Мы отправили код на
                                <a :href="`tel:7${ values.phone }`" class="link">7{{ values.phone }}</a>
                            </div>
                        </template>

                        <template v-slot:fields="{ rules, masks }">
                            <v-text-field v-model="code"
                                          v-mask="masks.smsCode"
                                          :rules="[rules.required, rules.smsCode]"
                                          outlined label="Введите код"/>
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
                                    Изменить номер
                                </v-btn>
                            </section>
                        </template>
                    </app-form>
                </v-stepper-content>

                <!-- Регистрация -->
                <v-stepper-content step="3">
                    <app-form url="/api/registration/"
                              :values="{ ...values, typeOfUserGroup: isRecruitingAgency ? 1 : 0 }"
                              width="288"
                              sumit-text="Зарегистрироваться"
                              :inline-success-message="false"
                              :after-submit-callback="getUser">
                        <template v-slot:header>
                            <div class="text-h5 mb-8">Регистрация</div>
                        </template>

                        <template v-slot:fields="{ rules }">
                            <template v-if="isUserLegal">
                                <v-text-field v-model="values.companyName"
                                              :rules="[rules.required]"
                                              outlined label="Наименование организации"/>
                            </template>

                            <v-text-field v-if="!isRecruitingAgency"
                                          v-model="values.name"
                                          :rules="[rules.required]"
                                          outlined label="Имя"/>

                            <v-text-field v-if="isRecruitingAgency"
                                          v-model="values.inn"
                                          :rules="[rules.required, rules.inn]"
                                          outlined label="ИНН"/>

                            <v-text-field v-model="values.email"
                                          :rules="isUserLegal ? [rules.required, rules.email] : [rules.email]"
                                          outlined
                                          :label="isUserLegal ? 'E-mail' : 'E-mail (необязательно поле)'"/>

                            <v-text-field v-model="values.password"
                                          :rules="[rules.required, rules.password]"
                                          outlined label="Пароль"
                                          :type="isShowPass ? 'text' : 'password'"
                                          :append-icon="isShowPass ? 'visibility_off' : 'visibility'"
                                          @click:append="isShowPass = !isShowPass"/>

                            <v-text-field v-if="isUserLegal"
                                          v-model="values.passwordConfirm"
                                          :rules="[rules.passwordConfirm]"
                                          outlined label="Подтвердите пароль"
                                          :type="isShowPassConfirm ? 'text' : 'password'"
                                          :append-icon="isShowPassConfirm ? 'visibility_off' : 'visibility'"
                                          @click:append="isShowPassConfirm = !isShowPassConfirm"/>
                        </template>

                        <template v-slot:success>
                            <div class="text-center">
                                <div class="text-h5 mb-8">Вы успешно зарегистрированы!</div>

                                <div class="text-small-1 mb-8">
                                    Перейти в

                                    <nuxt-link v-if="!isRecruitingAgency" to="/personal/" class="link">
                                        <span @click="$emit('success')">личный кабинет</span>
                                    </nuxt-link>

                                    <nuxt-link v-else to="/personal/vacancies" class="link">
                                        <span @click="$emit('success')">Кадровое агентство</span>
                                    </nuxt-link>
                                </div>

                                <v-list v-if="!isRecruitingAgency" nav class="list-mb-4">
                                    <v-list-item v-for="( item, index ) in successRegNav" :key="index">
                                        <v-btn color="primary" :outlined="index !== 0"
                                               x-small class="flex-grow-1"
                                               nuxt :to="item.link"
                                               @click="$emit('success')">
                                            {{ item.text }}
                                        </v-btn>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-icon class="ml-2" color="light-blue lighten-4 pointer" v-on="on">mdi-help-circle</v-icon>
                                            </template>
                                            <span>
                                                {{ item.tooltip }}
                                            </span>
                                        </v-tooltip>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </template>
                    </app-form>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import AppForm                       from '~/components/forms/AppForm';
    import { PHYS_PERSON, LEGAL_PERSON } from '~/lib/constants/user';

    export default {
        name: 'AppRegistrationForm',
        components: { AppForm },
        props: {
            isRecruitingAgency: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            step: 1,
            stepOne: {
                loading: false,
                error: null,
            },
            type: 'registration',
            code: null,
            values: {
                personType: PHYS_PERSON,
                name: null,
                inn: null,
                phone: null,
                email: null,
                password: null,
                companyName: null,
            },
            passwordConfirm: null,
            isShowPass: false,
            isShowPassConfirm: false,
            successRegNav: [
                {
                    link: '/create-task',
                    text: 'Создать задание',
                    tooltip: 'Создать задание – заполните форму на сайте и найдите подходящего исполнителя для разовой или постоянной работы.',
                },
                {
                    link: '/personal/?becomeExecutor=true',
                    text: 'Стать исполнителем',
                    tooltip: 'Стать исполнителем – зарегистрируйтесь в качестве исполнителя, подробно заполните Профиль и Портфолио и получайте задания.',
                },
                {
                    link: '/create-work/?type=vacancies',
                    text: 'Создать вакансию',
                    tooltip: 'Создать вакансию – если вы в поисках сотрудников, разместите актуальные вакансии. Их увидят тысячи квалифицированных специалистов.',
                },
                {
                    link: '/create-work/?type=resumes',
                    text: 'Создать резюме',
                    tooltip: 'Создать резюме – если вы в поисках работы, создайте резюме и получайте предложения от проверенных и надежных работодателей.',
                },
            ],
        } ),
        computed: {
            isUserLegal: vm =>
                vm.values.personType === LEGAL_PERSON,
        },
        mounted() {
            if ( this.isRecruitingAgency ) {
                this.values.personType = LEGAL_PERSON;
            } else {
                this.values.personType = PHYS_PERSON;
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'user', [ 'getUser' ] ),
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
        },
    };
</script>
