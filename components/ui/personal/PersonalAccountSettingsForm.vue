<template>
    <app-form url="/api/editAccountSettings/"
              :values="values"
              pass-api-key
              submit-text="Сохранить изменения"
              :after-submit-callback="updateUser"
              @success="$emit('success')">
        <template v-slot:fields="{ rules, masks }">
            <div class="mb-8 list-mb-8">
                <section>
                    <div class="text-h5 mb-4 mb-lg-8">Учетная запись</div>

                    <!-- Почта -->
                    <v-text-field v-model="values.email"
                                  :rules="userIsLegalPerson ? [rules.required, rules.email] : [rules.email]"
                                  outlined label="Почта"/>

                    <!-- Телефон -->
                    <v-text-field v-model="values.phone"
                                  v-mask="masks.phone"
                                  :rules="[rules.required, rules.phone]"
                                  outlined label="Телефон"/>

                    <v-divider/>
                </section>

                <section>
                    <div class="text-h5 mb-4 mb-lg-8">Изменить пароль</div>

                    <!-- Пароль -->
                    <v-text-field v-model="values.password"
                                  :rules="[rules.password]"
                                  outlined label="Пароль"
                                  :type="isShowPass ? 'text' : 'password'"
                                  :append-icon="isShowPass ? 'visibility_off' : 'visibility'"
                                  @click:append="isShowPass = !isShowPass"/>

                    <!-- Подтверждение пароля -->
                    <v-text-field v-model="values.passwordConfirm"
                                  :rules="[rules.passwordConfirm]"
                                  outlined label="Подтвердите пароль"
                                  :type="isShowPassConfirm ? 'text' : 'password'"
                                  :append-icon="isShowPassConfirm ? 'visibility_off' : 'visibility'"
                                  @click:append="isShowPassConfirm = !isShowPassConfirm"/>

                    <v-divider/>
                </section>

                <!-- Настройка уведомлений -->
                <section class="list-mb-8">
                    <div class="text-h5 mb-4">Уведомления</div>

                    <!--Уведомления на почту -->
                    <section>
                        <v-row no-gutters align="center" justify="space-between"
                               class="mb-4">
                            <span class="text-small-1">Уведомления на почту</span>
                            <v-switch v-model="values.emailNotification"
                                      hide-details/>
                        </v-row>

                        <div class="list-mb-2">
                            <div class="text-small-3">Новые задания</div>
                            <div class="text-small-3">Отклики от исполнителей</div>
                        </div>
                    </section>

                    <!-- Уведомления на телефон -->
                    <section>
                        <v-row no-gutters align="center" justify="space-between"
                               class="mb-4">
                            <span class="text-small-1">Уведомления на телефон</span>
                            <v-switch v-model="values.phoneNotification"
                                      hide-details/>
                        </v-row>

                        <div class="list-mb-2">
                            <div class="text-small-3">Новые задания</div>
                            <div class="text-small-3">Отклики от исполнителей</div>
                        </div>
                    </section>
                </section>
            </div>
        </template>
    </app-form>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import AppForm from '~/components/forms/AppForm';

    export default {
        name: 'PersonalAccountSettingsForm',
        components: { AppForm },
        props: {
            email: {
                type: String,
                default: null,
            },
            phone: {
                type: String,
                default: null,
            },
            emailNotification: {
                type: Boolean,
                default: true,
            },
            phoneNotification: {
                type: Boolean,
                default: true,
            },
        },
        data: vm => ( {
            values: {
                email: vm.email,
                phone: vm.phone,
                password: null,
                emailNotification: vm.emailNotification,
                phoneNotification: vm.phoneNotification,
            },
            passwordConfirm: null,
            isShowPass: false,
            isShowPassConfirm: false,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userIsLegalPerson' ] ),
        },
        methods: {
            ...mapMutations( 'user', [ 'updateUser' ] ),
        },
    };
</script>
