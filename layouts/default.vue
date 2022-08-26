<template>
    <v-app dark>
        <!-- Хэдер -->
        <app-header/>

        <!-- Контент страницы -->
        <v-main>
            <nuxt/>
        </v-main>

        <!-- Футер -->
        <app-footer/>

        <!-- Боковые меню -->
        <template v-if="isMobile">
            <main-menu-drawer/>
            <user-menu-drawer v-if="userIsLogin"/>
        </template>

        <!-- Авторизация -->
        <app-auth-dialog/>

        <!-- Стать исполнителем -->
        <app-become-executor-dialog/>

        <!-- Сообщение об ошибке -->
        <app-error-dialog/>

        <!-- Написать в тех. поддержку -->
        <app-support-dialog/>

        <!-- Баннер "Регистрация -->
        <banner-registration v-if="!userIsLogin"/>
    </v-app>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';

    import AppHeader               from '~/components/layout/AppHeader';
    import AppFooter               from '~/components/layout/AppFooter';
    import AppAuthDialog           from '~/components/dialogs/AppAuthDialog';
    import MainMenuDrawer          from '~/components/drawers/MainMenuDrawer';
    import UserMenuDrawer          from '~/components/drawers/UserMenuDrawer';
    import AppBecomeExecutorDialog from '~/components/dialogs/AppBecomeExecutorDialog';
    import AppErrorDialog          from '~/components/dialogs/AppErrorDialog';
    import AppSupportDialog        from '~/components/dialogs/AppSupportDialog';
    import BannerRegistration      from '~/components/banners/BannerRegistration';

    export default {
        name: 'LayoutDefault',
        components: {
            BannerRegistration,
            AppErrorDialog,
            AppSupportDialog,
            AppBecomeExecutorDialog,
            UserMenuDrawer,
            MainMenuDrawer,
            AppAuthDialog,
            AppFooter,
            AppHeader,
        },
        head() {
            return {
                link: [
                    {
                        rel: 'canonical',
                        href: process.env.BASE_URL + this.$route.fullPath.replace( this.$route.params.pathMatch, '' ),
                    },
                ],
            };
        },
        computed: {
            ...mapGetters( 'user', [ 'userIsLogin' ] ),
        },
        mounted() {
            if ( this.$router.currentRoute.query['recruiting-agency-registration'] ) {
                if ( this.userIsLogin ) {
                    this.$router.push( '/personal/vacancies' );
                } else {
                    this.showAppDialog( 'recruitingAgencyRegistration' );
                    this.showAppDialog( 'registration' );
                }
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
        },
    };
</script>
