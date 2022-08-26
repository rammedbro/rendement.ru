<template>
    <div class="chat-message"
         :class="{ 'chat-message--right': isUserAuthor }">
        <v-row dense
               align="center"
               :justify="isUserAuthor ? 'end' : 'start'"
               class="text-small-3"
               :class="{ 'flex-row-reverse': !isUserAuthor }">
            <!-- Имя и время -->
            <v-col cols="auto"
                   :class="{ 'mr-auto': !isUserAuthor }">
                {{ name }}: {{ dateLastOnlineFormat }}
            </v-col>

            <!-- Меню действий -->
            <v-col v-if="isUserAuthor || userIsAdmin"
                   cols="auto">
                <v-menu offset-y
                        :disabled="isDeleted">
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-dots-vertical</v-icon>
                    </template>

                    <v-list>
                        <v-list-item @click="edit">
                            <v-list-item-title class="text-small-1">
                                Редактировать
                            </v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="del">
                            <v-list-item-title class="text-small-1">
                                Удалить
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>
        </v-row>

        <div class="chat-message__text text-subtitle-2 mt-2"
             :class="textCssClass">
            <div v-if="isDeleted"
                 class="d-flex align-center grey--text text--lighten-1">
                <v-icon class="mr-2">mdi-cancel</v-icon>
                Сообщение удалено
            </div>

            <template v-else>
                {{ value.text }}
                <span v-if="isEdited"
                      class="grey--text text--lighten-1">(ред.)</span>
            </template>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    import { formatDateLastOnline }                                   from '~/lib/classes/utility';
    import { CHAT_MESSAGE_STATE_CHANGED, CHAT_MESSAGE_STATE_DELETED } from '@/lib/constants/chat';

    export default {
        name: 'ChatMessage',
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userIsAdmin' ] ),
            isUserAuthor: vm => vm.value.user.id === vm.userId,
            dateLastOnlineFormat: vm => formatDateLastOnline( vm.value.date ),
            name: vm => vm.isUserAuthor
                ? 'Вы'
                : vm.value.isService ? 'Администрация' : vm.value.user.name,
            isEdited: vm => vm.value.stateId === CHAT_MESSAGE_STATE_CHANGED,
            isDeleted: vm => vm.value.stateId === CHAT_MESSAGE_STATE_DELETED,
            textCssClass: vm => ( {
                'grey lighten-5': vm.isDeleted,
                'orange lighten-5': vm.value.isService,
            } ),
        },
        methods: {
            edit() {
                this.$root.$emit( 'message:edit', this.value );
            },
            del() {
                this.$root.$emit( 'message:delete', this.value );
            },
        },
    };
</script>

<style lang="scss" scoped>
    .chat-message {
        display: inline-block;
        width: 100%;

        &--right {
            float: right;
            text-align: right;
        }

        &__text {
            display: inline-block;
            text-align: left;
            word-break: break-word;
            padding: 16px;
            border-radius: 30px;
            background: map_get($light-blue, 'lighten-5');
        }

        @include media-breakpoint-up(sm) {
            max-width: 70%;
        }
    }
</style>