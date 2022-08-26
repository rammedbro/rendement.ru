<template>
    <div class="task-execution">
        <!-- Данные исполнителя -->
        <div v-if="showExecutorData"
             class="task-execution-executor mb-6 list-mb-6">
            <!-- Рейтинг -->
            <executor-rating-small v-if="execution"
                                   :value="execution.executor"/>

            <!-- Контактная информация -->
            <div class="task-execution-executor__contacts">
                <template v-if="isExecutorContactsAvailable">
                    <!-- Почта -->
                    <v-layout v-if="execution.executor.email"
                              align-center=""
                              class="mb-4">
                        <v-icon color="primary" size="16"
                                class="mr-2">
                            mdi-email
                        </v-icon>

                        <a :href="`mailto:${ execution.executor.email }`"
                           class="text-small-3 link--unstyled">
                            {{ execution.executor.email }}
                        </a>
                    </v-layout>

                    <!-- Телефон -->
                    <v-layout align-center="">
                        <v-icon color="primary" size="16"
                                class="mr-2">
                            mdi-phone
                        </v-icon>

                        <a :href="`tel:${ execution.executor.phone }`"
                           class="text-small-3 link--unstyled">
                            {{ $legacy.formatPhone( execution.executor.phone ) }}
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
                Перейти в чат с исполнителем
            </v-btn>
        </div>

        <!-- Доступные действия -->
        <v-container class="container--dense light-blue lighten-5 text-center">
            <v-row v-if="execution"
                   v-show="!componentLoading"
                   align="center" justify="center" dense>
                <!-- Отменить предложение исполнителя -->
                <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_BEGIN">
                    <v-col cols="12" sm="auto">
                        <div class="text-subtitle-2 primary--text">
                            Исполнитель еще не принял задание
                        </div>
                    </v-col>

                    <v-col cols="auto">
                        <v-btn color="primary"
                               rounded x-small
                               min-width="116"
                               :loading="btnLoading"
                               @click="rejectExecution">
                            Отказать
                        </v-btn>
                    </v-col>
                </template>

                <!-- Оплатить выполнение задания -->
                <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_CONFIRMED">
                    <v-col cols="12" sm="auto">
                        <div class="text-subtitle-2 primary--text">
                            Ожидается оплата комиссии за задание
                            <v-icon color="light-blue lighten-4"
                                    size="16">
                                mdi-help-circle
                            </v-icon>
                        </div>
                    </v-col>

                    <v-col cols="auto">
                        <v-btn v-if="value.safeDeal"
                               color="primary"
                               rounded x-small
                               min-width="116"
                               :href="execution.paymentLink">
                            Оплатить
                        </v-btn>

                        <v-btn v-else
                               color="primary"
                               rounded x-small
                               min-width="116"
                               @click="payCommissionDialog.display = true">
                            Оплатить
                        </v-btn>
                    </v-col>
                </template>

                <!-- Ожидается начало выполнения задания исполнителем -->
                <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_PAYED">
                    <v-col cols="12" sm="auto">
                        <div class="text-subtitle-2 primary--text">
                            Исполнитель еще не начал выполнять задание
                        </div>
                    </v-col>

                    <v-col cols="auto">
                        <!-- Пожаловаться -->
                        <v-btn color="primary"
                               rounded x-small
                               min-width="116"
                               @click="leaveComplainDialog.display = true">
                            Претензия
                        </v-btn>
                    </v-col>
                </template>

                <!-- Ожидается завершение выполнения задания исполнителем -->
                <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_STARTED">
                    <v-col cols="12" sm="auto">
                        <div class="text-subtitle-2 primary--text">
                            Исполнитель начал выполнять задание
                        </div>
                    </v-col>

                    <v-col cols="auto">
                        <!-- Пожаловаться -->
                        <v-btn color="primary"
                               rounded x-small
                               min-width="116"
                               @click="leaveComplainDialog.display = true">
                            Претензия
                        </v-btn>
                    </v-col>
                </template>

                <!-- Подтвердить выполнение задания исполнителем -->
                <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_FINISHED">
                    <v-col cols="12" sm="auto">
                        <div class="text-subtitle-2 primary--text">
                            Исполнитель завершил выполнение задания
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

                        <!-- Оставить отзыв и подтвердить -->
                        <v-btn color="primary"
                               rounded x-small
                               min-width="116"
                               :loading="btnLoading"
                               @click="leaveReviewDialog.display = true">
                            Подтвердить
                        </v-btn>
                    </v-col>
                </template>

                <!-- Задание завершено -->
                <template v-if="execution.statusId === $legacy.constants.TASK_EXECUTION_END">
                    <v-col cols="12" sm="auto">
                        <div class="text-subtitle-2 primary--text">
                            Задание завершено
                        </div>
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

            <!-- Индикатор загрузки -->
            <v-row v-show="componentLoading"
                   align="center" justify="center" dense>
                <v-col cols="auto">
                    <v-progress-circular :indeterminate="componentLoading"
                                         color="primary" size="24" width="3"/>
                </v-col>
            </v-row>
        </v-container>

        <!-- Диалог "Оплата комиссии" -->
        <app-dialog v-model="payCommissionDialog.display">
            <template v-slot>
                <app-form url="/api/payCommissionToTaskExecution/"
                          :values="payCommissionDialog.values"
                          pass-api-key
                          submit-text="Оплатить"
                          :inline-success-message="false"
                          :inline-error-message="false"
                          :after-submit-callback="handleRequestResult">
                    <template v-slot:header>
                        <div class="text-h5 mb-8">Оплата комиссии</div>

                        <p class="text-body-2 mb-8">
                            Для дальнейшего сотрудничества и получения контактов исполнителя,
                            необходимо оплатить комиссию в размере 10% от указанного бюджета.
                        </p>
                    </template>

                    <template v-slot:fields>
                        <v-row no-gutters
                               align="center"
                               justify="space-between"
                               class="py-3 l-border bwb-1">
                            <v-col cols="auto"
                                   class="text-small-1">
                                Бюджет задания:
                            </v-col>

                            <v-col cols="auto"
                                   class="text-small-2 postfix--rubles">
                                {{ value.price.toLocaleString() }}
                            </v-col>
                        </v-row>

                        <v-row no-gutters
                               align="center"
                               justify="space-between"
                               class="py-3 l-border bwb-1">
                            <v-col cols="auto"
                                   class="text-small-1">
                                Комиссия сервиса:
                            </v-col>

                            <v-col cols="auto"
                                   class="text-small-2 postfix--rubles">
                                {{ taskCommissionFormat }}
                            </v-col>
                        </v-row>

                        <v-row no-gutters
                               align="center"
                               justify="space-between"
                               class="py-4 mb-8">
                            <v-col cols="auto"
                                   class="text-small-1">
                                К оплате
                            </v-col>

                            <v-col cols="auto"
                                   class="text-h5 postfix--rubles">
                                {{ taskCommissionFormat }}
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:footer>
                        <a href="/faq/oplata/" target="_blank"
                           class="d-inline-block text-body-2 my-4">
                            Подробнее об оплате
                        </a>

                        <div class="text-small-1 grey--text text--lighten-1">
                            В случае, если исполнитель откажется выполнять задание мы вернем вам оплаченную ранее
                            комиссию
                        </div>
                    </template>

                    <template v-slot:success>
                        <div class="text-h5 mb-4">Оплата прошла успешно</div>

                        <div class="text-h5 mb-4 postfix--rubles">
                            - {{ taskCommissionFormat }}
                        </div>

                        <div class="text-body-2">
                            Теперь вам доступны контакты исполнителя.
                        </div>

                        <!-- Чат -->
                        <v-btn color="primary" text
                               nuxt :to="chatLink">
                            Перейти в чат с исполнителем
                        </v-btn>
                    </template>

                    <template v-slot:error="{ isUserError }">
                        <template v-if="isUserError">
                            <div class="text-h5 mb-4">Ошибка</div>

                            <p class="text-body-2">
                                Операция не может быть выполнена, недостаточно средств на балансе.
                            </p>

                            <v-btn text color="primary"
                                   nuxt to="/personal/balance/">
                                Пополнить баланс
                            </v-btn>
                        </template>
                    </template>
                </app-form>
            </template>
        </app-dialog>

        <!-- Диалог "Оставить жалобу" -->
        <app-dialog v-model="leaveComplainDialog.display">
            <div class="text-h5 mb-4">Открыть претензию</div>

            <p class="text-body-2">
                Опишите детали, которые помогут нам урегулировать спор с исполнителем.
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

            <div class="text-subtitle-1 mb-6">Оцение исполнителя</div>

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
    import { mapMutations, mapActions } from 'vuex';

    import ExecutorRatingSmall                 from '~/components/ui/executor/ExecutorRatingSmall';
    import AppDialog                           from '~/components/dialogs/AppDialog';
    import AppForm                             from '~/components/forms/AppForm';
    import {
        TASK_EXECUTION_NULL,
        TASK_EXECUTION_CONFIRMED,
        TASK_EXECUTION_COMPLAINED,
    }                                          from '~/lib/constants/task';
    import { checkObjectInterface }            from '~/lib/classes/validation';
    import { IntTaskExecutionProcessAsAuthor } from '~/lib/types/task';

    export default {
        name: 'TaskExecutionAsAuthor',
        components: { AppForm, AppDialog, ExecutorRatingSmall },
        props: {
            value: {
                type: Object,
                required: true,
            },
            showExecutorData: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            execution: undefined,
            btnLoading: false,
            componentLoading: false,
            payCommissionDialog: {
                display: false,
                values: {
                    taskId: vm.value.id,
                    taskSubCategoryId: vm.value.subCategory.id,
                },
            },
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
        } ),
        computed: {
            isExecutorContactsAvailable: vm =>
                vm.execution &&
                vm.execution.statusId > TASK_EXECUTION_CONFIRMED &&
                vm.execution.statusId < TASK_EXECUTION_COMPLAINED,
            taskCommissionFormat: vm => vm.value.commission.toLocaleString(),
            chatLink: vm =>
                vm.execution ? `/personal/chats/${ vm.execution.executor.chatId }/` : null,
        },
        created() {
            this.getExecutionInfo();
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
                this.execution = checkObjectInterface( result, IntTaskExecutionProcessAsAuthor );

                if ( this.execution.statusId === TASK_EXECUTION_NULL ) {
                    this.value.executorId = null;
                }
            },
            async getExecutionInfo() {
                this.componentLoading = true;
                await this.sendRequest( '/api/getTaskExecution/', this.handleRequestResult );
                this.componentLoading = false;
            },
            async rejectExecution() {
                this.btnLoading = true;
                await this.sendRequest( '/api/rejectTaskExecution/', this.handleRequestResult );
                this.btnLoading = false;
            },
            async acceptFinishExecution() {
                this.btnLoading = true;
                await this.sendRequest( '/api/acceptFinishTaskExecution/', this.handleRequestResult );
                this.btnLoading = false;
            },
            onLeaveReviewSuccess() {
                this.leaveReviewDialog.display = false;
                this.acceptFinishExecution();
            },
        },
    };
</script>
