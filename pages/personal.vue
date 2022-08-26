<template>
    <v-container class="px-0 px-lg-8 pt-0">
        <v-row>
            <v-col v-if="isDesktop"
                   cols="3">
                <v-row>
                    <v-col cols="12">
                        <!-- Боковое меню -->
                        <user-menu class="transparent"/>
                    </v-col>

                    <v-col cols="12">
                        <!-- Полезные ссылки -->
                        <app-useful-links theme="lk"/>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" lg="9">
                <!-- Содержимое страницы -->
                <nuxt-child/>
            </v-col>
        </v-row>
        <app-dialog v-model="offerAgreement"
                    max-width="450" persistent>
            <template v-slot:body>
                <div class="l-dialog__content">
                    <div class="text-h5 mb-8">
                        Публичная оферта
                    </div>

                    <v-checkbox v-model="privacy"
                                class="l-checkbox--small">
                        <template v-slot:label>
                            <div>
                                Я ознакомился и принимаю условия
                                <a :href="$legacy.constants.SITE_DOC_OFFER"
                                   target="_blank" class="link link--underline"
                                   @click.stop>
                                    Публичной оферты
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

                    <v-btn ref="submit"
                           :disabled="!privacy"
                           color="primary" block @click="setOfferAgreementCookie">
                        Продолжить
                    </v-btn>
                </div>
            </template>
        </app-dialog>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import AppUsefulLinks from '~/components/ui/AppUsefulLinks';
    import UserMenu       from '~/components/menus/UserMenu';
    import AppDialog      from '~/components/dialogs/AppDialog';

    export default {
        components: {
            AppDialog,
            UserMenu,
            AppUsefulLinks,
        },
        data() {
            return {
                offerAgreement: false,
                privacy: false,
            };
        },
        middleware: 'auth',
        computed: {
            ...mapGetters( 'user', [ 'typeOfUserGroup' ] ),
        },
        created() {
            if ( this.typeOfUserGroup !== this.$legacy.constants.CLIENT_GROUP_USER ) {
                return;
            }
            const cookies = this.$cookies.get( 'offerAgreement' );
            if ( !cookies ) {
                this.offerAgreement = true;
            }
        },
        methods: {
            setOfferAgreementCookie() {
                const date = new Date();
                date.setDate( date.getDate() + 100000 );
                this.$cookies.set( 'offerAgreement', true, { expires: date } );
                this.offerAgreement = false;
            },
        },
    };
</script>
