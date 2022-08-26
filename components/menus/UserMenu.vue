<template>
    <v-list>
        <v-list-item v-for="(item, index) in ( typeOfUserGroup === $legacy.constants.CLIENT_GROUP_USER ? clientMenu : menu )" :key="index"
                     nuxt :to="item.link" exact
                     class="l-border bwb-1"
                     @click="$emit('click:item')">
            <slot name="item" v-bind="item">
                <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-badge v-if="item.link === '/personal/chats/'"
                             :value="userUnseenMessageCount > 0"
                             :content="userUnseenMessageCount.toString()"
                             color="red" inline>
                        {{ item.text }}
                    </v-badge>

                    <template v-else>
                        {{ item.text }}
                    </template>
                </v-list-item-content>

                <v-list-item-action v-if="withArrow">
                    <v-icon color="primary">mdi-chevron-right</v-icon>
                </v-list-item-action>
            </slot>
        </v-list-item>

        <v-list-item @click="logout">
            <v-list-item-icon>
                <v-icon>exit_to_app</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                Выйти
            </v-list-item-content>
        </v-list-item>
        <v-divider/>
    </v-list>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'UserMenu',
        props: {
            withArrow: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ( {
            menu: [
                { icon: 'person_outline', text: 'Профиль', link: '/personal/' },
                { icon: 'crop_original', text: 'Портфолио', link: '/personal/portfolios/' },
                { icon: 'mdi-clipboard-outline', text: 'Задания', link: '/personal/tasks/' },
                { icon: 'chat_bubble_outline', text: 'Сообщения', link: '/personal/chats/' },
                { icon: 'card_travel', text: 'Вакансии и резюме', link: '/personal/vacancies-and-resumes/' },
                { icon: 'bar_chart', text: 'Отзывы', link: '/personal/reviews/' },
                { icon: 'mdi-wallet-outline', text: 'Баланс', link: '/personal/balance/' },
            ],
            clientMenu: [
                { icon: 'person_outline', text: 'Профиль', link: '/personal/' },
                { icon: 'chat_bubble_outline', text: 'Сообщения', link: '/personal/chats/' },
                { icon: 'card_travel', text: 'Кадровое агентство', link: '/personal/vacancies/' },
                { icon: 'mdi-wallet-outline', text: 'Баланс', link: '/personal/balance/' },
            ],
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userUnseenMessageCount', 'typeOfUserGroup' ] ),
        },
        methods: {
            ...mapActions( 'user', [ 'logout' ] ),
        },
    };
</script>
