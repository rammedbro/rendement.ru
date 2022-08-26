<template>
    <div class="task-execution">
        <!-- Данные автора -->
        <div v-if="showAuthorData"
             class="task-execution-author mb-6 list-mb-6">
            <!-- Рейтинг -->
            <executor-rating-small v-if="execution"
                                   :value="execution.author"/>

            <!-- Контактная информация -->
            <div class="task-execution-author__contacts">
                <template v-if="isAuthorContactsAvailable">
                    <!-- Почта -->
                    <v-layout v-if="execution.author.email"
                              align-center=""
                              class="mb-4">
                        <v-icon color="primary" size="16"
                                class="mr-2">
                            mdi-email
                        </v-icon>

                        <a :href="`mailto:${ execution.author.email }`"
                           class="text-small-3 link--unstyled">
                            {{ execution.author.email }}
                        </a>
                    </v-layout>

                    <!-- Телефон -->
                    <v-layout align-center="">
                        <v-icon color="primary" size="16"
                                class="mr-2">
                            mdi-phone
                        </v-icon>

                        <a :href="`tel:${ execution.author.phone }`"
                           class="text-small-3 link--unstyled">
                            {{ $legacy.formatPhone( execution.author.phone ) }}
                        </a>
                    </v-layout>
                </template>

                <div v-else
                     class="pa-4 grey lighten-5 text-center">
                    <span class="text-small-1 grey--text text--lighten-1">
                        Контактная информация недоступна
                    </span>
                </div>
            </div>

            <!-- Чат -->
            <v-btn color="primary" text block
                   nuxt :to="chatLink"
                   :loading="componentLoading">
                Перейти в чат с заказчиком
            </v-btn>
        </div>

        <!-- Доступные действия -->
        <v-container class="container--dense light-blue lighten-5 text-center">
            <template v-if="isUserTaskExecutor">
                <v-row v-if="execution"
                       v-show="!componentLoading"
                       align="center" justify="center" dense>
                    <!-- Принять предложение заказчика -->
                    <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_BEGIN">
                        <v-col cols="12" sm="auto">
                            <div class="text-subtitle-2 primary--text">
                                Вас выбрали исполнителем
                            </div>
                        </v-col>

                        <v-col cols="auto">
                            <v-btn color="primary"
                                   rounded x-small
                                   min-width="116"
                                   :loading="btnLoading"
                                   @click="confirmExecution">
                                Принять
                            </v-btn>
                        </v-col>
                    </template>

                    <!-- Ожидается оплата от заказчика -->
                    <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_CONFIRMED">
                        <v-col cols="12" sm="auto">
                            <div class="text-subtitle-2 primary--text">
                                Ожидается оплата комиссии со стороны заказчика
                            </div>
                        </v-col>
                    </template>

                    <!-- Начать выполнение задания -->
                    <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_PAYED">
                        <v-col cols="12" sm="auto">
                            <div class="text-subtitle-2 primary--text">
                                Вы можете начать выполнять задание
                            </div>
                        </v-col>

                        <v-col cols="auto">
                            <v-btn color="primary"
                                   rounded x-small
                                   min-width="116"
                                   :loading="btnLoading"
                                   @click="startExecution">
                                Начать
                            </v-btn>
                        </v-col>
                    </template>

                    <!-- Завершить выполнение задание -->
                    <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_STARTED">
                        <v-col cols="12" sm="auto">
                            <div class="text-subtitle-2 primary--text">
                                Если вы закончили выполнять задание - завершите его.
                            </div>
                        </v-col>

                        <v-col cols="auto">
                            <!-- Пожаловаться -->
                            <v-btn color="primary"
                                   outlined rounded x-small
                                   min-width="116"
                                   class="mr-4"
                                   @click="leaveComplainDialog.display = true">
                                Претензия
                            </v-btn>

                            <!-- Завершить -->
                            <v-btn color="primary"
                                   rounded x-small
                                   min-width="116"
                                   :loading="btnLoading"
                                   @click="finishExecution">
                                Завершить
                            </v-btn>
                        </v-col>
                    </template>

                    <!-- Ожидается подтверждение со стороны заказчика -->
                    <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_FINISHED">
                        <v-col cols="12" sm="auto">
                            <div class="text-subtitle-2 primary--text">
                                Ожидается подтверждение со стороны заказчика
                            </div>
                        </v-col>

                        <!-- Оставить отзыв -->
                        <v-col v-if="!execution.isReviewLeft"
                               cols="auto">
                            <v-btn color="primary"
                                   rounded x-small
                                   min-width="116"
                                   @click="leaveReviewDialog.display = true">
                                Оставить отзыв
                            </v-btn>
                        </v-col>
                    </template>

                    <!-- Задание завершено -->
                    <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_END">
                        <v-col cols="12" sm="auto">
                            <div class="text-subtitle-2 primary--text">
                                Заказчик подтвердил выполнение задания.
                            </div>
                        </v-col>

                        <!-- Оставить отзыв -->
                        <v-col v-if="!execution.isReviewLeft"
                               cols="auto">
                            <v-btn color="primary"
                                   rounded x-small
                                   min-width="116"
                                   @click="leaveReviewDialog.display = true">
                                Оставить отзыв
                            </v-btn>
                        </v-col>
                    </template>

                    <!-- Была подана жалоба -->
                    <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_COMPLAINED">
                        <v-col cols="12" sm="auto">
                            <div class="text-subtitle-2 primary--text">
                                Была подана жалоба. Она будет рассмотрена администрацией сервиса.
                            </div>
                        </v-col>
                    </template>
                </v-row>
            </template>

            <v-row v-else-if="isUserResponseToTask"
                   align="center" justify="center" dense>
                <v-col cols="12" sm="auto">
                    <div class="text-subtitle-2 primary--text">
                        Вас ещё не выбрали исполнителем
                    </div>
                </v-col>

                <v-col cols="auto">
                    <v-btn color="primary"
                           rounded x-small
                           min-width="116"
                           :loading="btnLoading"
                           @click="cancelResponse">
                        Отменить предложение
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Индикатор загрузки -->
            <v-row v-show="componentLoading"
                   align="center" justify="center" dense>
                <v-col cols="auto">
                    <v-progress-circular :indeterminate="componentLoading"
                                         color="primary" size="24" width="3"/>
                </v-col>
            </v-row>
        </v-container>

        <!-- Диалог "Оставить жалобу" -->
        <app-dialog v-model="leaveComplainDialog.display">
            <div class="text-h5 mb-4">Открыть претензию</div>

            <p class="text-body-2">
                Опишите детали, которые помогут нам урегулировать спор с заказчиком.
            </p>

            <app-form url="/api/leaveComplainToTaskExecution/"
                      :values="leaveComplainDialog.values"
                      pass-api-key
                      :after-submit-callback="handleRequestResult"
                      @success="leaveComplainDialog.display = false">
                <template v-slot:fields="{ rules }">
                    <v-textarea v-model="leaveComplainDialog.values.comment"
                                :rules="[rules.required]"
                                outlined placeholder="Комментарий к жалобе"/>
                </template>
            </app-form>
        </app-dialog>

        <!-- Диалог "Оставить отзыв" -->
        <app-dialog v-model="leaveReviewDialog.display">
            <div class="text-h5 mb-4">Отзыв</div>

            <div class="text-subtitle-1 mb-6">Оцение заказчика</div>

            <app-form url="/api/leaveReviewToTaskExecution/"
                      :values="leaveReviewDialog.values"
                      pass-api-key
                      @success="onLeaveReviewSuccess">
                <template v-slot:fields="{ rules }">
                    <v-rating v-model="leaveReviewDialog.values.rating"
                              half-increments
                              half-icon="mdi-star-half-full"
                              empty-icon="mdi-star-outline"
                              color="light-blue lighten-2"
                              background-color="grey lighten-2"
                              class="mb-6"/>

                    <v-textarea v-model="leaveReviewDialog.values.comment"
                                :rules="[rules.required]"
                                outlined placeholder="Текст отзыва"/>
                </template>
            </app-form>
        </app-dialog>
    </div>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';

    import AppForm                               from '~/components/forms/AppForm';
    import AppDialog                             from '~/components/dialogs/AppDialog';
    import ExecutorRatingSmall                   from '~/components/ui/executor/ExecutorRatingSmall';
    import { IntTaskExecutionProcessAsExecutor } from '~/lib/types/task';
    import { checkObjectInterface, checkType }   from '~/lib/classes/validation';
    import {
        TASK_EXECUTION_NULL,
        TASK_EXECUTION_COMPLAINED,
        TASK_EXECUTION_CONFIRMED,
    }                                            from '~/lib/constants/task';

    export default {
        name: 'TaskExecutionAsExecutor',
        components: { ExecutorRatingSmall, AppDialog, AppForm },
        props: {
            value: {
                type: Object,
                required: true,
            },
            showAuthorData: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            execution: undefined,
            componentLoading: false,
            btnLoading: false,
            leaveComplainDialog: {
                display: false,
                values: {
                    taskId: vm.value.id,
                    taskSubCategoryId: vm.value.subCategory.id,
                    comment: null,
                },
            },
            leaveReviewDialog: {
                display: false,
                values: {
                    taskId: vm.value.id,
                    taskSubCategoryId: vm.value.subCategory.id,
                    rating: 0,
                    comment: null,
                },
            },
            valueWatch: vm.value,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
            isUserTaskExecutor: vm => {
                const result = vm.valueWatch.executorId === vm.userId;

                if ( result ) {
                    vm.getExecutionInfo();
                }

                return result;
            },
            isUserResponseToTask: vm => vm.valueWatch.arResponseAuthorId.includes( vm.userId ),
            isAuthorContactsAvailable: vm =>
                vm.execution &&
                vm.execution.statusId > TASK_EXECUTION_CONFIRMED &&
                vm.execution.statusId < TASK_EXECUTION_COMPLAINED,
            chatLink: vm =>
                vm.execution ? `/personal/chats/${ vm.execution.author.chatId }/` : null,
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiGet' ] ),
            async sendRequest( url, successCallback ) {
                try {
                    const { id: taskId, subCategory: { id: taskSubCategoryId } } = this.value;
                    const options = {
                        url,
                        data: { taskId, taskSubCategoryId },
                        passApiKey: true,
                        useLoading: false,
                    };

                    const result = await this.apiGet( options );

                    if ( typeof successCallback === 'function' ) {
                        successCallback( result );
                    }
                } catch ( e ) {
                    this.showAppDialog( 'error' );
                    console.log( e.message );
                }
            },
            handleRequestResult( result ) {
                this.execution = checkObjectInterface( result, IntTaskExecutionProcessAsExecutor );

                if ( this.execution.statusId === TASK_EXECUTION_NULL ) {
                    this.value.executorId = null;
                }
            },
            async getExecutionInfo() {
                this.componentLoading = true;
                await this.sendRequest( '/api/getTaskExecution/', this.handleRequestResult );
                this.componentLoading = false;
            },
            async confirmExecution() {
                this.btnLoading = true;
                await this.sendRequest( '/api/confirmTaskExecution/', this.handleRequestResult );
                this.btnLoading = false;
            },
            async startExecution() {
                this.btnLoading = true;
                await this.sendRequest( '/api/startTaskExecution/', this.handleRequestResult );
                this.btnLoading = false;
            },
            async finishExecution() {
                this.btnLoading = true;
                await this.sendRequest( '/api/finishTaskExecution/', this.handleRequestResult );
                this.btnLoading = false;
            },
            onLeaveReviewSuccess() {
                this.execution.isReviewLeft = true;
                this.leaveReviewDialog.display = false;
            },
            async cancelResponse() {
                this.btnLoading = true;
                await this.sendRequest( '/api/cancelTaskResponse/', userId => {
                    if ( userId !== null ) {
                        this.value.executorId = checkType( userId, Number );
                    } else {
                        const { arResponseAuthorId } = this.value;
                        const index = arResponseAuthorId.findIndex( id => id === this.userId );

                        arResponseAuthorId.splice( index, 1 );
                    }
                } );
                this.btnLoading = false;
            },
        },
    };
</script>
