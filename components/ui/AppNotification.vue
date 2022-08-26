<template>
    <div class="notification">
        <v-badge :value="newNotificationCount > 0"
                 :content="newNotificationCount.toString()"
                 color="red"
                 overlap>
            <v-icon :class="{ 'primary--text': menuDisplay }"
                    @click="onNotificationIconClick">
                notifications_none
            </v-icon>
        </v-badge>

        <!-- Десктоп: Выпадающее меню -->
        <v-menu v-if="isDesktop"
                v-model="menuDisplay"
                :attach="$el"
                nudge-bottom="24"
                nudge-left="300"
                nudge-width="324"
                max-height="400"
                content-class="white">
            <notification-menu :key="notificationMenuReloadKey"/>
        </v-menu>

        <!-- Мобайл: Боковое меню -->
        <app-drawer v-if="isMobile"
                    v-model="menuDisplay"
                    right touchless>
            <notification-menu :key="notificationMenuReloadKey"/>
        </app-drawer>
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import NotificationMenu from '~/components/menus/NotificationMenu';
    import AppDrawer        from '~/components/drawers/AppDrawer';
    import { checkType }    from '~/lib/classes/validation';

    export default {
        name: 'AppNotification',
        components: { AppDrawer, NotificationMenu },
        data: () => ( {
            menuDisplay: false,
            newNotificationCount: 0,
            notificationMenuReloadKey: 0,
        } ),
        mounted() {
            this.getUnseenNotificationCount();
            // this.listenToNewNotification();
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiGet', 'apiSSE' ] ),
            onNotificationIconClick() {
                this.menuDisplay = !this.menuDisplay;

                if ( this.newNotificationCount ) {
                    this.setSeenNotifications();
                }
            },
            getUnseenNotificationCount() {
                this.apiGet( { url: '/api/getUnseenNotificationCount/', passApiKey: true } )
                    .then( count => {
                        this.newNotificationCount = checkType( count, Number );
                    } )
                    .catch( e => {
                        this.showAppDialog( 'error' );
                        console.log( e.message );
                    } );
            },
            setSeenNotifications() {
                this.newNotificationCount = 0;
                this.notificationMenuReloadKey++;

                this.apiGet( { url: '/api/seenNotifications/', passApiKey: true } )
                    .catch( e => {
                        this.showAppDialog( 'error' );
                        console.log( e.message );
                    } );
            },
            listenToNewNotification() {
                this.apiSSE( {
                    url: '/api/listenToNewNotification/',
                    onMessageCallback: count => {
                        this.newNotificationCount = checkType( count, Number );
                    },
                } )
                    .catch( e => {
                        this.showAppDialog( 'error' );
                        console.log( e.message );
                    } );
            },
        },
    };
</script>

<style lang="scss" scoped>
    .notification {
        position: relative;
    }
</style>