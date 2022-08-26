<template>
    <v-card>
        <v-container>
            <div class="text-h5 mb-4">
                {{ 'Автор ' + ( template === 'vacancy' ? 'вакансии' : 'резюме' ) }}
            </div>

            <v-row class="mb-4 mb-lg-0">
                <v-col>
                    <executor-rating-small :value="author"/>
                </v-col>
            </v-row>

            <v-row v-if="!isUserAuthor"
                   align="center" justify="center">
                <v-col cols="auto">
                    <v-btn color="primary"
                           outlined rounded
                           x-small width="136" height="32"
                           @click="onChatBtnClick">
                        Написать
                    </v-btn>
                </v-col>

                <v-col cols="auto">
                    <v-btn color="primary"
                           rounded
                           x-small height="32"
                           @click="$emit( 'dialogOpen' )">
                        {{ template === 'vacancy' ? 'Откликнуться' : 'Предложить вакансию' }}
                    </v-btn>
                </v-col>

                <v-col cols="12">
                    <v-container v-if="!userIsLogin"
                                 class="container--dense light-blue lighten-5 text-center">
                        <p class="text-subtitle-2 primary--text">
                            Контактные данные доступны только зарегистрированным пользователям
                        </p>

                        <v-btn :id="template === 'vacancy' ? 'detail_enter_vacancies' : 'detail_enter_resumes'"
                               color="primary"
                               x-small rounded min-width="136"
                               @click="showAppDialog('auth')">
                            Войти
                        </v-btn>
                    </v-container>

                    <app-hidden-phone v-else :phone="author.phone" :telephone-button-id="telephoneButtonId"/>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters, mapMutations, mapActions }      from 'vuex';
    import AppHiddenPhone      from '~/components/ui/AppHiddenPhone';
    import ExecutorRatingSmall from '~/components/ui/executor/ExecutorRatingSmall';

    export default {
        name: 'AppCardDetailAuthor',
        components: {
            AppHiddenPhone,
            ExecutorRatingSmall,
        },
        props: {
            author: {
                type: Object,
                required: true,
            },
            isUserAuthor: {
                type: Boolean,
                required: true,
            },
            template: {
                type: String,
                default: 'vacancy',
            },
            telephoneButtonId: {
                type: String,
                default: 'btn-tel',
            },
        },
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userIsLogin' ] ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'chat', [ 'createChat' ] ),
            onChatBtnClick() {
                if ( this.userIsLogin ) {
                    this.createChat( {
                        type: 'user',
                        arUserId: [ this.userId, this.author.id ],
                    } )
                        .then( id => this.$router.push( `/personal/chats/${ id }/` ) )
                        .catch( () => this.showAppDialog( 'error' ) );
                } else {
                    this.showAppDialog( 'auth' );
                }
            },
        },
    };
</script>
