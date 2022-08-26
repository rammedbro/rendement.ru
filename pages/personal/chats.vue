<template>
    <v-card class="chats-page">
        <!-- Заголовок: Десктоп -->
        <v-container v-if="isDesktop"
                     class="l-border bwb-1">
            <h1 class="text-h3">{{ h1 }}</h1>
        </v-container>

        <!-- Чат -->
        <v-row no-gutters>
            <!-- Список чатов -->
            <v-col v-show="isDesktop || !curOpenChat"
                   cols="12" lg="4"
                   class="l-border bwr-1 position-relative">
                <app-catalog url="/api/getChats/"
                             :filter="{ userId }"
                             :item-type="$legacy.types.IntChat"
                             pass-api-key
                             adaptive
                             scroll-pagination
                             disable-count>
                    <template v-slot:items="{ items }">
                        <v-list>
                            <chat-list-item v-for="item in items"
                                            :key="item.id"
                                            :value="item"
                                            @click="onChatListItemClick"/>
                        </v-list>
                    </template>

                    <template v-slot:no-result>
                        <div class="pa-4">У вас пока нет сообщений</div>
                    </template>
                </app-catalog>
            </v-col>

            <!-- Открытый чат -->
            <v-col v-show="isDesktop || curOpenChat"
                   cols="12" lg="8">
                <nuxt-child :key="$route.params.id"
                            :value="curOpenChat"
                            keep-alive
                            class="h-100"/>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { meta }       from '~/mixins/meta';

    import AppCatalog               from '~/components/ui/AppCatalog';
    import ChatListItem             from '~/components/ui/chat/ChatListItem';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { IntChat }              from '~/lib/types/chat';
    import { IntMetaData }          from '~/lib/types/other';

    export default {
        components: { ChatListItem, AppCatalog },
        mixins: [ meta ],
        data: () => ( {
            title: 'Сообщения',
            arOpenChat: [],
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
            curOpenChat: vm => vm.arOpenChat.find( item => item.id === vm.$route.params.id ),
        },
        async asyncData( { route, params, store, error } ) {
            try {
                const result = {};

                if ( params.id !== undefined ) {
                    const chat = await store.dispatch( 'api/apiGet', {
                        url: '/api/getChat/', data: { id: params.id }, passApiKey: true,
                    } );

                    result.arOpenChat = [ checkObjectInterface( chat, IntChat ) ];
                }

                const meta = await store.dispatch(
                    'api/apiGet', { url: '/api/getSeo/', data: { path: route.path } } );
                result.meta = checkObjectInterface( meta, IntMetaData );

                return result;
            } catch ( e ) {
                console.log( e.message );
                error( e );
            }
        },
        methods: {
            onChatListItemClick( chat ) {
                const isChatOpen = this.arOpenChat.find( item => item.id === chat.id );

                if ( !isChatOpen ) {
                    this.arOpenChat.push( chat );
                }
            },
        },
    };
</script>

<style scoped lang="scss">
    .chats-page {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 56px);

        @include media-breakpoint-up(lg) {
            height: calc(100vh - 64px - 32px);
        }
    }
</style>