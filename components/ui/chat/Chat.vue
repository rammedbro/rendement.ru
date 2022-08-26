<template>
    <div class="chat">
        <!-- Информация о чате -->
        <chat-header :template="value.type"
                     :value="value"/>

        <!-- Сообщения -->
        <chat-messages :value="value"
                       :items.sync="messages"/>

        <!-- Форма отправки -->
        <chat-form :value="messageToEdit"
                   :loading="loading"
                   @submit="sendMessage"
                   @edit:cancel="messageToEdit = null"/>
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex';

    import ChatHeader               from '~/components/ui/chat/chat-header/ChatHeader';
    import ChatMessages             from '~/components/ui/chat/ChatMessages';
    import ChatForm                 from '~/components/ui/chat/ChatForm';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { IntChatMessage }       from '~/lib/types/chat';

    export default {
        name: 'Chat',
        components: {
            ChatHeader,
            ChatMessages,
            ChatForm,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        data: () => ( {
            loading: false,
            webSocket: null,
            messages: [],
            retryCount: 0,
            messageToEdit: null,
        } ),
        created() {
            this.$root.$on( 'message:edit', value => {
                this.messageToEdit = value;
            } );

            this.$root.$on( 'message:delete', value => {
                const { id } = value;
                const message = {
                    type: 'message',
                    action: 'delete',
                    data: id,
                };

                this.sendMessage( message );
            } );
        },
        mounted() {
            this.startChat();
        },
        beforeDestroy() {
            this.webSocket.close();
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiGet', 'apiWebSocket' ] ),
            startChat() {
                const { id: chatId } = this.value;

                this.loading = true;

                this.apiWebSocket( {
                    url: '/startChat/',
                    data: { chatId },
                    onMessageCallback: this.onChatReceiveMessage,
                } )
                    .then( ( { webSocket, listener } ) => {
                        this.webSocket = webSocket;
                        listener.catch( this.onChatError );
                    } )
                    .catch( this.onChatError )
                    .finally( () => {
                        this.loading = false;
                    } );
            },
            onChatReceiveMessage( response ) {
                this.loading = false;

                const { type, action, data } = response;

                if ( type === 'auth' || type === 'ping' ) return;

                const message = checkObjectInterface( data, IntChatMessage );

                if ( action === 'add' ) {
                    this.addMessage( message );
                } else if ( action === 'edit' ) {
                    this.updateMessage( message );
                } else if ( action === 'delete' ) {
                    this.updateMessage( message );
                }
            },
            onChatError( e ) {
                console.log( e.message );

                if ( this.retryCount < 3 ) {
                    this.retryCount++;
                    this.startChat();
                } else {
                    this.showAppDialog( 'error' );
                }
            },
            sendMessage( value ) {
                const items = Array.isArray( value ) ? value : [ value ];

                this.messageToEdit = null;
                this.loading = true;

                items.forEach( item => {
                    if ( item instanceof File ) {
                        this.webSocket.send( item );
                    } else {
                        this.webSocket.send( JSON.stringify( item ) );
                    }
                } );
            },
            addMessage( value ) {
                this.messages.unshift( value );
                this.scrollToEnd();
            },
            updateMessage( value ) {
                const message = this.messages.find( item => item.id === value.id );
                Object.assign( message, value );
            },
            scrollToEnd() {
                try {
                    const body = this.$el.querySelector( '.l-catalog__body' );
                    this.$vuetify.goTo( body.scrollHeight, { container: body } );
                } catch ( e ) {
                    console.log( e.message );
                    this.showAppDialog( 'error' );
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .chat {
        display: flex;
        flex-direction: column;
    }
</style>