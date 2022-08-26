<template>
    <v-list-item nuxt :to="link" exact
                 class="chat-list-item"
                 @click="onClick">
        <v-list-item-content>
            <v-row dense>
                <v-col cols="auto">
                    <app-avatar-group :items="avatars">
                        <template v-slot:item="{ item }">
                            <app-avatar :img="item"
                                        bordered
                                        class="white"/>
                        </template>
                    </app-avatar-group>
                </v-col>

                <v-col>
                    <app-text-limiter adaptive>
                        <div :title="title"
                             class="text--primary text-subtitle-1 text-ellipsis">
                            {{ title }}
                        </div>

                        <div :title="subtitle"
                             class="text-small-3 primary--text text-ellipsis">
                            {{ subtitle }}
                        </div>
                    </app-text-limiter>
                </v-col>
            </v-row>
        </v-list-item-content>

        <v-list-item-action class="text-small-3 flex-column align-center">
            <span v-if="lastMessageDateFormat"
                  class="text--primary mb-auto">
                {{ lastMessageDateFormat }}
            </span>

            <v-badge :value="unseenMessageCount > 0"
                     :content="unseenMessageCount.toString()"
                     color="grey" inline/>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    import AppTextLimiter                    from '~/components/ui/AppTextLimiter';
    import { formatLocaleDate }              from '~/lib/classes/utility';
    import AppAvatarGroup                    from '@/components/ui/AppAvatarGroup';
    import AppAvatar                         from '@/components/ui/AppAvatar';
    import { BASE_USER_GROUP, LEGAL_PERSON } from '@/lib/constants/user';

    export default {
        name: 'ChatListItem',
        components: { AppAvatar, AppAvatarGroup, AppTextLimiter },
        props: {
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            ...mapGetters( 'user', [ 'userUnseenMessages' ] ),
            link: vm => `/personal/chats/${ vm.value.id }/`,
            title: vm => {
                const items = [];

                vm.value.users.forEach( user => {
                    let name = user.name;

                    if ( user.lastName !== null ) {
                        name += ' ' + user.lastName.slice( 0, 1 );
                    }

                    items.push( name );
                } );

                return items.join( ', ' );
            },
            subtitle: vm => {
                const { type, data, users } = vm.value;

                if ( type === 'task' ) {
                    return data.task.title;
                }

                const items = [];

                users.forEach( user => {
                    const { userGroup, personTypeId } = user;
                    const { value } = userGroup;
                    let { text } = userGroup;

                    if ( value === BASE_USER_GROUP ) {
                        text = ( personTypeId === LEGAL_PERSON )
                            ? 'Юридическое лицо'
                            : 'Физическое лицо';
                    }

                    items.push( text );
                } );

                return items.join( ', ' );
            },
            avatars: vm => vm.value.users.map( item => item.avatar ),
            fullNameFormat: vm => {
                const { name, lastName, companyName } = vm.value.user;

                if ( companyName ) {
                    return companyName;
                }

                let result = name;

                if ( lastName !== null ) {
                    result += ' ' + lastName.slice( 0, 1 );
                }

                return result;
            },
            lastMessageDateFormat: vm =>
                ( vm.value.lastMessageDate !== null )
                    ? formatLocaleDate( vm.value.lastMessageDate, 'time', {
                        hour: 'numeric', minute: 'numeric',
                    } )
                    : null,
            unseenMessageCount: vm => {
                const unseenChat = ( vm.userUnseenMessages || [] ).find(
                    item => item.chatId === vm.value.id,
                );

                return unseenChat ? unseenChat.count : 0;
            },
        },
        methods: {
            ...mapActions( 'user', [ 'setUserSeenMessages' ] ),
            onClick() {
                this.$emit( 'click', this.value );

                if ( this.unseenMessageCount > 0 ) {
                    this.setUserSeenMessages( this.value.id );
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .chat-list-item {
        align-items: flex-start;
    }
</style>