<template>
    <div class="task-response">
        <!-- Автор -->
        <executor-rating-small :value="value.author"
                               class="mb-2"/>

        <!-- Комментарий -->
        <div class="text-body-2 mb-6">
            {{ commentFormat }}
            <span v-if="value.comment.length > 140"
                  class="text-button primary--text pointer"
                  @click="isCommentShowFull = !isCommentShowFull">
                {{ !isCommentShowFull ? 'Показать полностью' : 'Свернуть' }}
            </span>
        </div>

        <v-row dense
               align="center" justify="center"
               class="text-center">
            <!-- Чат -->
            <v-col cols="12">
                <v-btn color="primary" text
                       nuxt :to="chatLink">
                    Перейти в чат c {{ isUserResponseAuthor ? 'заказчиком' : 'исполнителем' }}
                </v-btn>
            </v-col>

            <!-- Действия у автора отклика -->
            <v-col v-if="isUserResponseAuthor"
                   cols="12">
                <!-- Отменить предложение -->
                <v-btn color="primary"
                       outlined rounded x-small
                       min-width="116"
                       :loading="cancelLoading"
                       @click="cancelResponse">
                    Отменить предложение
                </v-btn>
            </v-col>

            <!-- Действия у автора задания -->
            <template v-else>
                <v-col cols="auto">
                    <!-- Отклонить предложение -->
                    <v-btn color="primary"
                           outlined rounded x-small
                           min-width="116"
                           :loading="declineLoading"
                           @click="declineResponse">
                        Отказать
                    </v-btn>
                </v-col>

                <v-col cols="auto">
                    <!-- Принять предложение -->
                    <v-btn color="primary"
                           rounded x-small
                           min-width="116"
                           :loading="acceptLoading"
                           @click="acceptResponse">
                        Выбрать
                    </v-btn>
                </v-col>
            </template>
        </v-row>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';

    import ExecutorRatingSmall from '~/components/ui/executor/ExecutorRatingSmall';
    import { checkType }       from '~/lib/classes/validation';

    export default {
        name: 'TaskResponse',
        components: { ExecutorRatingSmall },
        props: {
            value: {
                type: Object,
                required: true,
            },
            task: {
                type: Object,
                required: true,
            },
        },
        data: () => ( {
            acceptLoading: false,
            declineLoading: false,
            cancelLoading: false,
            isCommentShowFull: false,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
            isUserResponseAuthor: vm => vm.value.author.id === vm.userId,
            chatLink: vm => `/personal/chats/${ vm.value.author.chatId }/`,
            commentFormat: vm =>
                ( vm.value.comment.length <= 140 || vm.isCommentShowFull )
                    ? vm.value.comment
                    : `${ vm.value.comment.slice( 0, 140 ) }...`,
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiGet' ] ),
            async sendRequest( url ) {
                try {
                    const { id: responseId, author: { id: responseAuthorId } } = this.value;
                    const { id: taskId, subCategory: { id: taskSubCategoryId } } = this.task;
                    const options = {
                        url,
                        data: { taskId, taskSubCategoryId, responseId },
                        passApiKey: true,
                        useLoading: false,
                    };

                    const userId = await this.apiGet( options );

                    if ( userId !== null ) {
                        this.task.executorId = checkType( userId, Number );
                    } else {
                        const { arResponseAuthorId } = this.task;
                        const index = arResponseAuthorId.findIndex( id => id === responseAuthorId );

                        arResponseAuthorId.splice( index, 1 );
                    }
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e.message );
                }
            },
            async acceptResponse() {
                this.acceptLoading = true;
                await this.sendRequest( '/api/acceptTaskResponse/' );
                this.acceptLoading = false;
            },
            async declineResponse() {
                this.declineLoading = true;
                await this.sendRequest( '/api/declineTaskResponse/' );
                this.declineLoading = false;
            },
            async cancelResponse() {
                this.cancelLoading = true;
                await this.sendRequest( '/api/cancelTaskResponse/' );
                this.cancelLoading = false;
            },
        },
    };
</script>