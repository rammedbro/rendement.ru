<template>
    <div class="chat-messages">
        <app-catalog url="/api/getChatMessages/"
                     :filter="{ chatId: value.id }"
                     pagination-on-top
                     :pagination-on-bottom="false"
                     scroll-pagination
                     reverse-scroll-pagination
                     disable-count
                     disable-no-result
                     pass-api-key
                     adaptive
                     :page.sync="page"
                     @update:cache="onUpdateMessages">
            <!-- Сообщения из БД -->
            <template v-slot:items>
                <v-container class="container--dense">
                    <v-row dense
                           class="flex-column-reverse">
                        <v-col v-for="item in items" :key="item.id">
                            <chat-message :value="item"/>
                        </v-col>
                    </v-row>
                </v-container>
            </template>

            <!-- Новые сообщения -->
            <template v-slot:no-result>
                <v-container class="container--dense">
                    <v-row dense
                           class="flex-column-reverse">
                        <v-col v-for="item in items" :key="item.id">
                            <chat-message :value="item"/>
                        </v-col>
                    </v-row>
                </v-container>
            </template>
        </app-catalog>
    </div>
</template>

<script>
    import AppCatalog  from '~/components/ui/AppCatalog';
    import ChatMessage from '~/components/ui/chat/ChatMessage';

    export default {
        name: 'ChatMessages',
        components: { ChatMessage, AppCatalog },
        props: {
            value: {
                type: Object,
                required: true,
            },
            items: {
                type: Array,
                required: true,
            },
        },
        data: vm => ( {
            page: 1,
        } ),
        methods: {
            onUpdateMessages( value ) {
                this.$emit( 'update:items', [ ...this.items, ...value[this.page] ] );
            },
        },
    };
</script>

<style lang="scss" scoped>
    .chat-messages {
        position: relative;
        flex: 1;
    }
</style>