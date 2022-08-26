<template>
    <v-container class="pa-0 py-lg-8">
        <v-row>
            <v-col cols="12" lg="7">
                <v-row>
                    <v-col ref="task"
                           cols="12">
                        <!-- Карточка задания -->
                        <task-card-detail v-show="!editTaskDisplay"
                                          :value="task"
                                          :title="h1"
                                          :response-dialog-display.sync="responseDialogDisplay"/>

                        <!-- Форма редактирования задания -->
                        <v-card v-if="editTaskDisplay">
                            <!-- Тулбар -->
                            <app-toolbar fixed
                                         title="Редактирование задания"
                                         @click:close="closeTaskEdit"/>

                            <v-container>
                                <task-crud-form v-bind="taskEditData"
                                                @success="onTaskEditSuccess"/>
                            </v-container>
                        </v-card>
                    </v-col>

                    <!-- Предложения исполнителей -->
                    <v-col v-if="userIsLogin && !task.moderation"
                           v-show="!editTaskDisplay"
                           id="responses"
                           cols="12">
                        <v-card>
                            <v-container>
                                <div class="text-h5 mb-4">Предложения исполнителей</div>

                                <!-- Пользователь - Автор -->
                                <template v-if="isUserTaskAuthor">
                                    <app-catalog v-if="isTaskHasResponse && !isTaskHasExecutor"
                                                 :key="taskResponsesReloadKey"
                                                 url="/api/getTaskResponses/"
                                                 :limit="5"
                                                 :filter="{ taskId: task.id, taskSubCategoryId: task.subCategory.id }"
                                                 :count-endings="responseCountEndings"
                                                 :item-type="$legacy.types.IntTaskResponse"
                                                 pass-api-key
                                                 item-col-width="12">
                                        <template v-slot:item="{ item }">
                                            <task-response :value="item"
                                                           :task="task"
                                                           class="l-border bwt-1 pt-6"/>
                                        </template>
                                    </app-catalog>

                                    <template v-else-if="!isTaskHasResponse">
                                        У Вас ещё нет откликов
                                    </template>

                                    <template v-else>
                                        Вы уже выбрали исполнителя
                                    </template>
                                </template>

                                <!-- Пользователь - Исполнитель -->
                                <template v-else-if="isUserResponseToTask">
                                    <app-catalog v-if="!isUserTaskExecutor"
                                                 :key="taskResponsesReloadKey"
                                                 url="/api/getTaskResponses/"
                                                 :limit="5"
                                                 :filter="{ taskId: task.id, taskSubCategoryId: task.subCategory.id }"
                                                 :count-endings="responseCountEndings"
                                                 :item-type="$legacy.types.IntTaskResponse"
                                                 pass-api-key
                                                 item-col-width="12">
                                        <template v-slot:item="{ item }">
                                            <task-response :value="item"
                                                           :task="task"
                                                           class="l-border bwt-1 pt-6"/>
                                        </template>
                                    </app-catalog>

                                    <template v-else>
                                        Вас уже выбрали исполнителем
                                    </template>
                                </template>

                                <!-- Пользователь - Никто -->
                                <template v-else>
                                    Вы ещё не откликались на задание
                                </template>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>

            <v-col>
                <v-row>
                    <!-- Прогресс выполнения задания -->
                    <v-col v-show="!editTaskDisplay"
                           cols="12">
                        <v-card ref="execution">
                            <v-container>
                                <!-- Пользователь - Автор -->
                                <template v-if="isUserTaskAuthor">
                                    <div class="text-h5 mb-4">Выбранный исполнитель</div>

                                    <!-- Прогресс сделки -->
                                    <task-execution-as-author v-if="isTaskHasExecutor"
                                                              ref="execution"
                                                              :value="task"
                                                              show-executor-data/>

                                    <!-- Исполнитель не выбран -->
                                    <template v-else>
                                        <p>Вы ещё не выбрали исполнителя</p>

                                        <v-btn color="primary" block
                                               nuxt to="/executors/filter/">
                                            Найти исполнителя
                                        </v-btn>
                                    </template>
                                </template>

                                <!-- Пользователь - Любой -->
                                <template v-else>
                                    <div class="text-h5 mb-4">Заказчик задания</div>

                                    <!-- Прогресс сделки -->
                                    <task-execution-as-executor v-if="isUserTaskExecutor"
                                                                ref="execution"
                                                                :value="task"
                                                                show-author-data
                                                                class="mt-6"/>

                                    <!-- Автор задания -->
                                    <template v-else>
                                        <v-row>
                                            <v-col>
                                                <executor-rating-small :value="task.author"/>
                                            </v-col>
                                        </v-row>

                                        <!-- Кнопки -->
                                        <v-container class="pa-0"
                                                     :class="{ 'fixed-bottom pa-4 light-blue lighten-5': isMobile }">
                                            <v-row v-if="!isUserResponseToTask"
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
                                                           x-small width="136" height="32"
                                                           @click="responseDialogDisplay = true">
                                                        Откликнуться
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </template>
                                </template>
                            </v-container>
                        </v-card>
                    </v-col>

                    <!-- Полезные ссылки -->
                    <v-col cols="12">
                        <v-container class="pt-4">
                            <app-useful-links theme="task"/>
                        </v-container>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';
    import { meta }                                 from '~/mixins/meta';

    import AppUsefulLinks           from '~/components/ui/AppUsefulLinks';
    import TaskCardDetail           from '~/components/ui/task/TaskCardDetail';
    import TaskResponse             from '~/components/ui/task/TaskResponse';
    import AppCatalog               from '~/components/ui/AppCatalog';
    import ExecutorRatingSmall      from '~/components/ui/executor/ExecutorRatingSmall';
    import TaskExecutionAsAuthor    from '~/components/ui/task/TaskExecutionAsAuthor';
    import TaskExecutionAsExecutor  from '~/components/ui/task/TaskExecutionAsExecutor';
    import TaskCrudForm             from '~/components/ui/task/TaskCrudForm';
    import AppToolbar               from '~/components/layout/AppToolbar';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { formatLocaleDate }     from '~/lib/classes/utility';
    import { IntTaskDetail }        from '~/lib/types/task';
    import { IntMetaData }          from '~/lib/types/other';
    import { TASK_STATUS_OPEN }     from '~/lib/constants/task';

    export default {
        components: {
            TaskCrudForm,
            TaskExecutionAsExecutor,
            TaskExecutionAsAuthor,
            ExecutorRatingSmall,
            AppCatalog,
            TaskResponse,
            TaskCardDetail,
            AppUsefulLinks,
            AppToolbar,
        },
        mixins: [ meta ],
        data: () => ( {
            task: undefined,
            responseCountEndings: [ 'предложение', 'предложения', 'предложений' ],
            taskResponsesReloadKey: 0,
            responseDialogDisplay: false,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userIsLogin', 'userIsExecutor', 'userIsCardBind' ] ),
            isUserTaskAuthor: vm => vm.task.author.id === vm.userId,
            isUserTaskExecutor: vm => vm.task.executorId === vm.userId,
            isUserResponseToTask: vm => vm.task.arResponseAuthorId.includes( vm.userId ),
            isTaskHasResponse: vm => vm.task.arResponseAuthorId.length > 0,
            isTaskHasExecutor: vm => vm.task.executorId !== null,
            isTaskEditable: vm => vm.task.statusId === TASK_STATUS_OPEN,
            taskEditData: vm => {
                const {
                    id, category, subCategory, title, safeDeal, paymentsByAgreement,
                    location, requirements, description, dateStart, dateEnd, price,
                    images, hiddenImages, docs, hiddenDocs,
                } = vm.task;

                const categoryCode = category.code;
                const subCategoryId = subCategory.id;
                const files = [ ...images, ...docs ];
                const hiddenFiles = [ ...hiddenImages, ...hiddenDocs ];

                const result = {
                    id,
                    title,
                    description,
                    price,
                    safeDeal,
                    paymentsByAgreement,
                    requirements,
                    categoryCode,
                    subCategoryId,
                    files,
                    hiddenFiles,
                };

                if ( location !== null ) {
                    result.locationId = location.id;
                }

                result.dateRange = [];
                if ( dateStart !== null ) {
                    result.dateRange.push( formatLocaleDate( dateStart, 'date' ) );
                }
                if ( dateEnd !== null ) {
                    result.dateRange.push( formatLocaleDate( dateEnd, 'date' ) );
                }

                return result;
            },
            editTaskDisplay: vm => {
                const { edit } = vm.$route.query;
                return ( vm.isUserTaskAuthor && vm.isTaskEditable && edit === 'true' );
            },
        },
        async asyncData( { route, params, store, error } ) {
            try {
                const task = await store.dispatch(
                    'api/apiGet', { url: '/api/getTask/', data: { id: params.id } } );
                const meta = await store.dispatch(
                    'api/apiGet', { url: '/api/getSeo/', data: { path: route.path } } );

                return {
                    task: checkObjectInterface( task, IntTaskDetail ),
                    meta: checkObjectInterface( meta, IntMetaData ),
                };
            } catch ( e ) {
                console.log( e.message );
                error( e );
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'chat', [ 'createChat' ] ),
            onTaskEditSuccess( result ) {
                this.task = result;
                this.closeTaskEdit();

                this.$nextTick( () => {
                    this.$vuetify.goTo( this.$refs.task );
                } );
            },
            closeTaskEdit() {
                this.$router.push( this.$route.path );
            },
            onChatBtnClick() {
                if ( this.userIsLogin ) {
                    this.createChat( {
                        type: 'user',
                        arUserId: [ this.userId, this.task.author.id ],
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
