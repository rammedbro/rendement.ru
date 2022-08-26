<template>
    <v-footer dark
              class="footer">
        <v-container>
            <v-row>
                <!-- Меню -->
                <v-col v-for="(item, index) in menu" :key="index"
                       cols="12" md="auto">
                    <nuxt-link :to="item.link"
                               class="footer-link text-button">
                        {{ item.text }}
                    </nuxt-link>
                </v-col>
                <v-col cols="12" md="auto" align-self="center">
                    <div class="footer-link text-button pointer"
                         @click="showRecruitingAgencyRegistrationDialog">
                        Подбор персонала
                    </div>
                </v-col>
            </v-row>
        </v-container>
        <v-divider/>

        <v-container>
            <v-row align="center" justify="center"
                   class="text-center">
                <!-- Почта -->
                <v-col cols="12" md="auto">
                    <a :href="`mailto:${ $legacy.constants.SITE_EMAIL }`"
                       class="footer-link text-subtitle-1">
                        {{ $legacy.constants.SITE_EMAIL }}
                    </a>
                </v-col>

                <!-- Телефон -->
                <v-col cols="12" md="auto">
                    <a :href="`tel:${ $legacy.constants.SITE_PHONE }`"
                       class="footer-link text-subtitle-1">
                        {{ $legacy.constants.SITE_PHONE_FORMAT }}
                    </a>
                </v-col>

                <!-- Соц. сети -->
                <v-col cols="auto"
                       class="ml-md-auto">
                    <v-layout justify-space-between=""
                              class="list-mr-2">
                        <a v-for="(item, index) in socials" :key="index"
                           :href="item.link" target="_blank"
                           class="footer-link">
                            <svg-icon :name="item.icon"
                                      width="32" height="32"/>
                        </a>
                    </v-layout>
                </v-col>
            </v-row>
        </v-container>
        <v-divider/>

        <v-container>
            <v-row align="center">
                <!-- Платежные системы -->
                <v-col cols="12">
                    <img src="~/assets/img/payment.png"
                         width="288" height="28"
                         alt="Платежные системы">
                </v-col>

                <!-- Копирайт -->
                <v-col cols="auto">
                    <div class="text-small-1">© 2020 Rendement. All rights reserved</div>
                </v-col>

                <!-- Политика конфиденциальности -->
                <v-col cols="auto">
                    <a :href="$legacy.constants.SITE_DOC_PRIVACY_POLICY"
                       target="_blank" class="footer-link text-small-1">
                        Политика конфиденциальности
                    </a>
                </v-col>

                <!-- Разработчик -->
                <v-col cols="auto"
                       class="ml-md-auto">
                    <a href="https://legacystudio.ru" target="_blank"
                       class="footer-link text-small-1">
                        Developed by Legacystudio
                    </a>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import {
        SITE_SOCIAL_FACEBOOK,
        SITE_SOCIAL_INSTAGRAM,
        SITE_SOCIAL_VK,
        SITE_SOCIAL_OK,
        SITE_SOCIAL_TELEGRAM,
        SITE_SOCIAL_WHATSUP,
        SITE_SOCIAL_VIBER,
        SITE_SOCIAL_SKYPE,
        SITE_SOCIAL_YOUTUBE,
    }                                   from '~/lib/constants/site';

    export default {
        name: 'AppFooter',
        data: () => ( {
            menu: [
                { text: 'О компании', link: '/about/' },
                { text: 'Как стать исполнителем', link: '/faq/ispolnitelyam/' },
                { text: 'Часто задаваемые вопросы', link: '/faq/' },
                { text: 'Полезные статьи', link: '/articles/' },
                { text: 'Контакты', link: '/contacts/' },
            ],
            socials: [
                { icon: 'telegram', link: SITE_SOCIAL_TELEGRAM },
                { icon: 'whatsup', link: SITE_SOCIAL_WHATSUP },
                { icon: 'viber', link: SITE_SOCIAL_VIBER },
                { icon: 'skype', link: SITE_SOCIAL_SKYPE },
                { icon: 'youtube', link: SITE_SOCIAL_YOUTUBE },
                { icon: 'ok', link: SITE_SOCIAL_OK },
                { icon: 'vk', link: SITE_SOCIAL_VK },
                { icon: 'instagram', link: SITE_SOCIAL_INSTAGRAM },
                { icon: 'facebook', link: SITE_SOCIAL_FACEBOOK },
            ],
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userIsLogin' ] ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            showRecruitingAgencyRegistrationDialog() {
                if ( this.userIsLogin ) {
                    this.$router.push( '/personal/vacancies' );
                } else {
                    this.showAppDialog( 'recruitingAgencyRegistration' );
                    this.showAppDialog( 'registration' );
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .footer-link {
        text-decoration: none;
        color: #646f7f !important;

        svg {
            width: 24px;
            height: 24px;

            @include media-breakpoint-up(sm) {
                width: 32px;
                height: 32px;
            }

            @include media-breakpoint-up(lg) {
                opacity: .38;
            }
        }

        &:hover {
            color: #b3d4f1 !important;

            svg {
                opacity: 1;
            }
        }
    }
</style>
