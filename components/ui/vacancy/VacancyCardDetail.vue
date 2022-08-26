<template>
    <v-card class="vacancy-card-detail">
        <!-- Сообщение о модерации -->
        <div v-if="value.moderation"
             class="text-small-3 pa-4 orange lighten-4">
            После того как ваша вакансия пройдет модерацию, она станет открыта.
        </div>

        <v-container class="list-mb-6">
            <!-- Статус бар -->
            <task-card-status-bar :value="value"
                                  :display-actions="isUserAuthor"
                                  :enable-edit="isEditable"
                                  class="mb-4"
                                  @delete="setVacancyFinished"
                                  @click:edit="$emit('click:edit')"/>

            <!-- Автор -->
            <v-col v-if="isMobile" v-show="!editFormDisplay"
                   cols="12">
                <app-card-detail-author :author="value.author"
                                        :is-user-author="isUserAuthor"
                                        template="vacancy"
                                        @dialogOpen="responseDialogDisplay = true"/>
            </v-col>

            <section>
                <!-- Категория -->
                <div class="text-small-1 mb-1">
                    {{ value.category.name }}
                </div>

                <!-- Заголовок -->
                <h1 class="text-h5 mb-4">{{ h1 }}</h1>

                <!-- Описание -->
                <p v-html="value.description"></p>
            </section>
            <v-divider/>

            <!-- Недропользователь -->
            <section>
                <div class="text-h5 mb-4">Недропользователь</div>

                <app-optional-field :value="value.landOwner">
                    <template v-slot="{ value: landOwner }">
                        <p>{{ landOwner }}</p>
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Адрес месторождения -->
            <section>
                <div class="text-h5 mb-4">Месторождение или населенный пункт</div>

                <app-optional-field :value="value.location">
                    <template v-slot="{ value: location }">
                        <p>
                            {{ location.title }},<br>
                            {{ location.address }}
                        </p>

                        <v-btn color="primary"
                               outlined rounded small
                               @click="mapDialogDisplay = true">
                            Показать на карте
                        </v-btn>

                        <!-- Карта -->
                        <app-fullscreen-dialog v-model="mapDialogDisplay"
                                               title="Карта">
                            <app-map :value="location.id"
                                     :filter="[ location.id ]"
                                     class="flex-grow-1">
                                <template v-slot:balloon>
                                    <vacancy-card-map :value="value"/>
                                </template>
                            </app-map>
                        </app-fullscreen-dialog>
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Зарплата -->
            <section>
                <div class="text-h5 mb-4">Зарплата</div>

                <app-optional-field :value="value.salary">
                    <template v-slot="{ value: salary }">
                        <span class="postfix--rubles">{{ salary.toLocaleString() }}</span>
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Требования -->
            <section>
                <div class="text-h5 mb-4">Требования</div>

                <app-optional-field :value="value.requirements">
                    <template v-slot="{ value: requirements }">
                        {{ requirements.join(', ') }}
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Опыт работы -->
            <section>
                <div class="text-h5 mb-4">Опыт работы</div>

                <app-optional-field :value="experienceFormat"/>
            </section>

            <!-- Кнопка "Откликнуться" -->
            <template v-if="!isUserAuthor">
                <v-divider/>

                <section>
                    <v-tooltip bottom
                               :disabled="!responseCount">
                        <template v-slot:activator="{ on }">
                            <div v-on="on">
                                <v-btn color="primary" block
                                       :loading="userIsLogin && responseCount === null"
                                       :disabled="responseCount > 0"
                                       @click="onResponseBtnClick">
                                    Отликнуться
                                </v-btn>
                            </div>
                        </template>

                        <span>Вы уже откликнулись на вакансию</span>
                    </v-tooltip>

                    <!-- Диалог "Откликнуться" -->
                    <app-dialog :value="responseDialog.display"
                                max-width="768"
                                @input="setResponseDialogDisplay">
                        <!-- Форма -->
                        <app-form url="/api/responseToVacancy/"
                                  :values="responseDialog.values"
                                  :inline-success-message="false"
                                  pass-api-key
                                  class="w-100"
                                  @success="onResponseSuccess">
                            <!-- Шапка -->
                            <template v-slot:header>
                                <div class="text-h5 mb-4">Выберите резюме из списка</div>

                                <p v-if="responseDialog.count > 0"
                                   class="text-body-2">
                                    Выберите из списка резюме, которое хотите предложить
                                    и нажмите кнопку отправить
                                </p>
                            </template>

                            <!-- Поля -->
                            <template v-slot:fields="{ rules }">
                                <app-catalog url="/api/getResumes/"
                                             :filter="{ authorId: userId }"
                                             :limit="5"
                                             :item-type="$legacy.types.IntResumePreview"
                                             :count.sync="responseDialog.count"
                                             :count-endings="responseDialog.countEndings"
                                             class="mb-8">
                                    <template v-slot:items="{ items }">
                                        <!-- Задания -->
                                        <v-radio-group v-model="responseDialog.values.resumeId"
                                                       :rules="[rules.required]"
                                                       class="max-w-100 mx-n4 mx-lg-0">
                                            <v-radio v-for="item in items" :key="item.id"
                                                     :value="item.id"
                                                     class="l-radio l-radio--unstyled l-border bwb-1">
                                                <template v-slot:label>
                                                    <resume-card-map :value="item"
                                                                     :is-link="false"
                                                                     class="transparent w-100"/>
                                                </template>
                                            </v-radio>
                                        </v-radio-group>
                                    </template>

                                    <template v-slot:no-result>
                                        <div class="text-body-2">
                                            У вас нет резюме для отправки,<br>
                                            перейдите в
                                            <nuxt-link to="/personal/vacancies-and-resumes/">личный кабинет</nuxt-link>
                                            и создайте резюме
                                        </div>
                                    </template>
                                </app-catalog>
                            </template>

                            <!-- Кнопка "Отправить" -->
                            <template v-slot:submit="{ loading }">
                                <v-btn color="primary" block
                                       :loading="loading"
                                       :disabled="!responseDialog.count"
                                       type="submit">
                                    Отправить
                                </v-btn>
                            </template>

                            <!-- Успешная отправка -->
                            <template v-slot:success>
                                <div class="text-h5 mb-6">Ваше резюме отправлено</div>

                                <v-btn color="primary" text
                                       width="320" max-width="100%"
                                       @click="responseDialog.display = false">
                                    Ок
                                </v-btn>
                            </template>
                        </app-form>
                    </app-dialog>
                </section>
            </template>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters, mapMutations, mapActions } from 'vuex';
    import AppMap                   from '~/components/ui/AppMap';
    import TaskCardStatusBar        from '~/components/ui/task/TaskCardStatusBar';
    import AppFullscreenDialog      from '~/components/dialogs/AppFullscreenDialog';
    import VacancyCardMap           from '~/components/ui/vacancy/VacancyCardMap';
    import AppOptionalField         from '~/components/ui/AppOptionalField';
    import AppDialog                from '~/components/dialogs/AppDialog';
    import AppForm                  from '~/components/forms/AppForm';
    import AppCatalog               from '~/components/ui/AppCatalog';
    import AppCardDetailAuthor      from '~/components/ui/AppCardDetailAuthor';
    import ResumeCardMap            from '~/components/ui/resume/ResumeCardMap';
    import { TASK_STATUS_OPEN, TASK_STATUS_CLOSE }     from '~/lib/constants/task';
    import { WORK_EXPERIENCE_LIST } from '~/lib/constants/user';

    export default {
        name: 'VacancyCardDetail',
        components: {
            ResumeCardMap,
            VacancyCardMap,
            AppCardDetailAuthor,
            AppCatalog,
            AppForm,
            AppDialog,
            AppOptionalField,
            AppFullscreenDialog,
            AppMap,
            TaskCardStatusBar,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
            title: {
                type: String,
                default: undefined,
            },
            responseCount: {
                type: Number,
                default: null,
            },
            responseDialogDisplay: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            mapDialogDisplay: false,
            responseDialog: {
                display: false,
                values: {
                    vacancyId: vm.value.id,
                    resumeId: null,
                },
                count: 0,
                countEndings: [ 'резюме', 'резюме', 'резюме' ],
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userIsLogin' ] ),
            h1: vm => vm.title || vm.value.title,
            isUserAuthor: vm => vm.value.author.id === vm.userId,
            isEditable: vm => vm.value.statusId === TASK_STATUS_OPEN,
            experienceFormat: vm => {
                const experience = WORK_EXPERIENCE_LIST.find( item => item.value === vm.value.experienceId );
                return experience ? experience.text : null;
            },
            editFormDisplay: vm => {
                const { edit } = vm.$route.query;
                return ( vm.isUserAuthor && vm.isEditable && edit === 'true' );
            },
        },
        watch: {
            responseDialogDisplay( value ) {
                if ( value === this.responseDialog.display ) return;

                if ( value ) {
                    this.onResponseBtnClick();
                } else {
                    this.responseDialog.display = false;
                }
            },
        },
        methods: {
            ...mapActions( 'user', [ 'setVacancyStatus' ] ),
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            onResponseBtnClick() {
                if ( this.userIsLogin ) {
                    this.setResponseDialogDisplay( true );
                } else {
                    this.setResponseDialogDisplay( false );
                    this.showAppDialog( 'auth' );
                }
            },
            setResponseDialogDisplay( state ) {
                this.responseDialog.display = state;
                this.$emit( 'update:response-dialog-display', state );
            },
            onResponseSuccess() {
                this.$emit( 'update:response-count', this.responseCount + 1 );
            },
            setVacancyFinished() {
                this.setVacancyStatus( {
                    id: this.value.id,
                    statusId: TASK_STATUS_CLOSE,
                } )
                    .then( res => {
                        this.value.statusId = TASK_STATUS_CLOSE;
                    } );
            },
        },
    };
</script>
