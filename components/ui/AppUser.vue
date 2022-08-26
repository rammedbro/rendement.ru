<template>
    <div class="user">
        <!-- Мобайл -->
        <div v-if="isMobile"
             class="pointer"
             @click="toggleAppDrawer('userMenu')">
            <!-- Аватар -->
            <v-badge :value="hasNewNotification"
                     color="red" dot overlap>
                <app-avatar size="32" :img="userData.avatar"/>
            </v-badge>
        </div>

        <!-- Десктоп -->
        <v-row v-if="isDesktop"
               dense
               align="center">
            <v-col cols="auto">
                <!-- Аватар -->
                <nuxt-link to="/personal/">
                    <v-badge :value="hasNewNotification"
                             color="red" dot overlap>
                        <app-avatar size="32" :img="userData.avatar"/>
                    </v-badge>
                </nuxt-link>
            </v-col>

            <v-col>
                <v-menu open-on-hover offset-y
                        bottom left origin="top right"
                        min-width="255">
                    <template v-slot:activator="{ on }">
                        <!-- Имя -->
                        <div class="d-flex align-center text-button pointer"
                             v-on="on">
                            <app-text-limiter max-width="140">
                                <span class="text-button">{{ userData.name }}</span>
                            </app-text-limiter>

                            <v-icon>mdi-chevron-down</v-icon>
                        </div>
                    </template>

                    <!-- Меню -->
                    <user-menu/>
                </v-menu>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';

    import AppAvatar      from '~/components/ui/AppAvatar';
    import UserMenu       from '~/components/menus/UserMenu';
    import AppTextLimiter from '~/components/ui/AppTextLimiter';

    export default {
        name: 'AppUser',
        components: { AppTextLimiter, UserMenu, AppAvatar },
        computed: {
            ...mapGetters( 'user', [ 'userData', 'userUnseenMessageCount' ] ),
            hasNewNotification: vm => vm.userUnseenMessageCount > 0,
        },
        mounted() {
            this.getUserUnseenMessageCount();
            // this.listenToNewMessage();
        },
        methods: {
            ...mapMutations( 'ui', [ 'toggleAppDrawer' ] ),
            ...mapActions( 'user', [ 'getUserUnseenMessageCount', 'listenToNewMessage' ] ),
        },
    };
</script>