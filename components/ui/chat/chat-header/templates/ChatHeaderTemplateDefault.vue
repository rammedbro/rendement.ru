<template>
    <div class="chat-header theme--light">
        <!-- Шапка: Десктоп -->
        <v-container v-if="isDesktop"
                     class="container--dense l-border bwb-1">
            <!-- Краткая информация -->
            <v-row dense
                   class="mb-2">
                <v-col cols="auto">
                    <v-badge :value="currentUser.isOnline"
                             color="green"
                             dot bottom
                             offset-x="10"
                             offset-y="10">
                        <app-avatar :img="currentUser.avatar"
                                    size="40"/>
                    </v-badge>
                </v-col>

                <v-col>
                    <app-text-limiter adaptive>
                        <div :title="fullNameFormat"
                             class="text-subtitle-1 text-ellipsis">
                            {{ fullNameFormat }}
                        </div>

                        <slot name="header-second-line.desktop">
                            <nuxt-link :to="chatUserLink"
                                       :title="userGroupFormat"
                                       class="d-block link text-subtitle-2 text-ellipsis">
                                {{ userGroupFormat }}
                            </nuxt-link>
                        </slot>
                    </app-text-limiter>
                </v-col>
            </v-row>

            <!-- Список пользователей -->
            <v-row v-if="value.users.length > 1"
                   dense
                   align="center">
                <v-col v-for="item in value.users" :key="item.id"
                       cols="auto">
                    <app-avatar :img="item.avatar"
                                size="28"
                                outlined
                                bordered
                                class="pointer"
                                :class="{ primary: currentUser === item }"
                                @click.native="currentUser = item"/>
                </v-col>
            </v-row>
        </v-container>

        <!-- Шапка: Мобайл -->
        <template v-if="isMobile">
            <app-toolbar fixed
                         @click:close="$router.push('/personal/chats/')">
                <template v-slot:title>
                    <v-row>
                        <v-col cols="auto">
                            <v-badge :value="currentUser.isOnline"
                                     color="green"
                                     dot bottom
                                     offset-x="10"
                                     offset-y="10">
                                <app-avatar :img="currentUser.avatar"
                                            size="32"/>
                            </v-badge>
                        </v-col>

                        <v-col>
                            <app-text-limiter adaptive>
                                <div :title="fullNameFormat"
                                     class="text-subtitle-1 text-ellipsis">
                                    {{ fullNameFormat }}
                                </div>

                                <slot name="header-second-line.mobile">
                                    <nuxt-link :to="chatUserLink"
                                               :title="userGroupFormat"
                                               class="d-block link text-small-3 text-ellipsis">
                                        {{ userGroupFormat }}
                                    </nuxt-link>
                                </slot>
                            </app-text-limiter>
                        </v-col>
                    </v-row>
                </template>
            </app-toolbar>

            <!-- Список пользователей -->
            <v-container v-if="value.users.length > 1"
                         class="container--dense l-border bwb-1">
                <v-row dense
                       align="center">
                    <v-col v-for="item in value.users" :key="item.id"
                           cols="auto">
                        <app-avatar :img="item.avatar"
                                    size="28"
                                    outlined
                                    bordered
                                    class="pointer"
                                    :class="{ primary: currentUser === item }"
                                    @click.native="currentUser = item"/>
                    </v-col>

                    <v-col cols="auto"
                           class="ml-auto">
                        <v-icon color="primary"
                                @click="isBottomShow = !isBottomShow">
                            {{ isBottomShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                        </v-icon>
                    </v-col>
                </v-row>
            </v-container>
        </template>

        <!-- Доп. информация -->
        <div v-show="isDesktop || isBottomShow"
             class="chat-header__bottom">
            <!-- Область после хэдера -->
            <slot name="after-header"></slot>

            <!-- Контактная информация -->
            <v-container class="container--dense text-center grey lighten-5">
                <v-row v-if="isUserContactsAvailable"
                       dense align="center" justify="center">
                    <!-- Почта -->
                    <v-col v-if="currentUser.email"
                           cols="auto">
                        <v-icon color="primary" size="16">
                            mdi-email
                        </v-icon>

                        <slot name="contacts.email">
                            <a :href="`mailto:${ currentUser.email }`"
                               class="text-small-3 link--unstyled">
                                {{ currentUser.email }}
                            </a>
                        </slot>
                    </v-col>

                    <!-- Телефон -->
                    <v-col v-if="currentUser.phone"
                           cols="auto">
                        <v-icon color="primary" size="16">
                            mdi-phone
                        </v-icon>

                        <slot v-if="currentUser.phone"
                              name="contacts.phone">
                            <a :href="`tel:${ currentUser.phone }`"
                               class="text-small-3 link--unstyled">
                                {{ $legacy.formatPhone( currentUser.phone ) }}
                            </a>
                        </slot>
                    </v-col>
                </v-row>

                <div v-else
                     class="text-small-1 grey--text text--lighten-1">
                    Контактная информация недоступна
                </div>
            </v-container>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    import AppAvatar                         from '~/components/ui/AppAvatar';
    import AppToolbar                        from '~/components/layout/AppToolbar';
    import AppTextLimiter                    from '~/components/ui/AppTextLimiter';
    import { BASE_USER_GROUP, LEGAL_PERSON } from '@/lib/constants/user';

    export default {
        name: 'ChatHeaderTemplateDefault',
        components: { AppTextLimiter, AppToolbar, AppAvatar },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        data: vm => ( {
            currentUser: vm.value.users[0],
            isBottomShow: false,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
            chatUserLink: vm => `/executors/${ vm.currentUser.id }/`,
            fullNameFormat: vm => {
                const { name, lastName, companyName } = vm.currentUser;

                if ( companyName ) {
                    return companyName;
                }

                let result = name;

                if ( lastName !== null ) {
                    result += ' ' + lastName;
                }

                return result;
            },
            userGroupFormat: vm => {
                const { userGroup, personTypeId } = vm.currentUser;
                const { value, text } = userGroup;

                if ( value === BASE_USER_GROUP ) {
                    return ( personTypeId === LEGAL_PERSON )
                        ? 'Юридическое лицо' : 'Физическое лицо';
                } else {
                    return text;
                }
            },
            isUserContactsAvailable: vm =>
                vm.currentUser.phone || vm.currentUser.email,
        },
    };
</script>