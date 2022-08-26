<template>
    <v-app-bar app
               class="header">
        <v-container class="py-0">
            <v-row dense align="center" justify="space-between">
                <!-- Бургер -->
                <v-col v-if="isMobile"
                       cols="auto">
                    <v-icon :class="{ 'primary--text': appMainMenuDrawerDisplay }"
                            @click="toggleAppDrawer('mainMenu')">
                        mdi-menu
                    </v-icon>
                </v-col>

                <!-- Логотип -->
                <v-col lg="auto">
                    <nuxt-link to="/"
                               class="d-flex justify-center justify-lg-start">
                        <picture>
                            <source srcset="~/assets/img/logo-lg.png" media="(min-width: 992px)">
                            <img class="header__logo" src="~/assets/img/logo-xs.png" alt="Logo">
                        </picture>
                    </nuxt-link>
                </v-col>

                <!-- Меню -->
                <v-col v-if="isDesktop">
                    <header-main-menu class="justify-center"/>
                </v-col>

                <v-col cols="auto">
                    <!-- Авторизованный пользователь -->
                    <template v-if="userIsLogin">
                        <v-layout align-center="">
                            <!-- Уведомления -->
                            <app-notification class="mr-5"/>

                            <!-- Пользователь -->
                            <app-user/>
                        </v-layout>
                    </template>

                    <!-- Не авторизованный пользователь -->
                    <template v-else>
                        <v-btn outlined
                               color="primary"
                               max-height="32"
                               min-width="62"
                               class="mr-sm-3 text-small-1 pa-0"
                               @click="showAppDialog('auth')">
                            Вход
                        </v-btn>

                        <v-btn color="primary"
                               max-height="32"
                               max-width="104"
                               class="text-small-1 pa-0"
                               @click="showAppDialog('registration')">
                            Регистрация
                        </v-btn>
                    </template>
                </v-col>
            </v-row>
        </v-container>

        <!-- Прогресс бар -->
        <v-progress-linear :active="apiLoading"
                           indeterminate height="2"
                           absolute bottom color="primary"/>
    </v-app-bar>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import AppUser                      from '~/components/ui/AppUser';
    import AppNotification              from '~/components/ui/AppNotification';
    import HeaderMainMenu               from '~/components/menus/HeaderMainMenu';

    export default {
        name: 'AppHeader',
        components: { HeaderMainMenu, AppNotification, AppUser },
        computed: {
            ...mapGetters( [ 'appMainMenu' ] ),
            ...mapGetters( 'api', [ 'apiLoading' ] ),
            ...mapGetters( 'ui', [ 'appMainMenuDrawerDisplay' ] ),
            ...mapGetters( 'user', [ 'userIsLogin' ] ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog', 'toggleAppDrawer' ] ),
        },
    };
</script>

<style lang="scss" scoped>
    .header {
        box-shadow: 0 2px 4px rgba(0, 0, 0, .1);

        &__logo {
            display: block;
            width: 72px;
            height: 32px;

            @include media-breakpoint-up(lg) {
                width: 160px;
            }
        }
    }
</style>