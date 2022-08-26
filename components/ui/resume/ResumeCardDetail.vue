<template>
    <v-card class="vacancy-card-detail">
        <!-- Сообщение о модерации -->
        <div v-if="value.moderation"
             class="text-small-3 pa-4 orange lighten-4">
            После того как ваше резюме пройдет модерацию, оно станет открыто.
        </div>

        <v-container class="list-mb-6">
            <!-- Статус бар -->
            <task-card-status-bar :value="value"
                                  :display-actions="isUserAuthor"
                                  :enable-edit="isEditable"
                                  class="mb-4"
                                  @delete="setResumeFinished"
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
                <p v-if="value.description" v-html="value.description"></p>
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
                               outlined rounded x-small
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
                                    <resume-card-map :value="value"/>
                                </template>
                            </app-map>
                        </app-fullscreen-dialog>
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Адрес месторождения -->
            <section>
                <div class="text-h5 mb-4">Место жительства</div>

                <app-optional-field :value="value.placeOfResidence">
                    <template v-slot="{ value: placeOfResidence }">
                        <p>
                            {{ placeOfResidence.title }},<br>
                            {{ placeOfResidence.address }}
                        </p>

                        <v-btn color="primary"
                               outlined rounded x-small
                               @click="mapDialogDisplay2 = true">
                            Показать на карте
                        </v-btn>

                        <!-- Карта -->
                        <app-fullscreen-dialog v-model="mapDialogDisplay2"
                                               title="Карта">
                            <app-map :value="placeOfResidence.id"
                                     :filter="[ placeOfResidence.id ]"
                                     class="flex-grow-1">
                                <template v-slot:balloon>
                                    <resume-card-map :value="value"/>
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

            <!-- Навыки -->
            <section>
                <div class="text-h5 mb-4">Ключевые навыки</div>

                <app-optional-field :value="value.skills">
                    <template v-slot="{ value: skills }">
                        {{ skills.join(', ') }}
                    </template>
                </app-optional-field>
            </section>
            <v-divider/>

            <!-- Опыт работы -->
            <section>
                <div class="text-h5 mb-4">Опыт работы</div>

                <app-optional-field :value="experienceFormat"/>
            </section>
            <v-divider/>

            <!-- Документы -->
            <section class="list-mb-4">

                <div class="text-subtitle-1 grey--text lighten-1">Документы</div>

                <app-optional-field :value="value.docs"
                                    message="Нет добавленных документов"
                                    class="list-mb-4">
                    <template v-slot="{ value: docs }">
                        <app-doc-list-item v-for="(item, index) in docs" :key="index"
                                           v-bind="item"/>
                    </template>
                </app-optional-field>
            </section>

            <!-- Возраст -->
            <section>
                <div class="text-h5 mb-4">Возраст</div>

                <app-optional-field :value="ageFormat"/>
            </section>

            <!-- Кнопка "Откликнуться" -->
            <template v-if="!isUserAuthor">
                <v-divider/>

                <section>
                    <v-btn color="primary" block
                           @click="onResponseBtnClick">
                        Предложить вакансию
                    </v-btn>

                    <!-- Диалог "Откликнуться" -->
                    <app-dialog :value="responseDialog.display"
                                max-width="768"
                                @input="setResponseDialogDisplay">
                        <!-- Форма -->
                        <app-form url="/api/offerVacancyToResume/"
                                  :values="responseDialog.values"
                                  :inline-success-message="false"
                                  pass-api-key
                                  class="w-100">
                            <!-- Шапка -->
                            <template v-slot:header>
                                <div class="text-h5 mb-4">Выберите вакансию из списка</div>

                                <p v-if="responseDialog.count > 0"
                                   class="text-body-2">
                                    Выберите из списка вакансию, которую хотите предложить
                                    и нажмите кнопку отправить.
                                </p>
                            </template>

                            <!-- Поля -->
                            <template v-slot:fields="{ rules }">
                                <app-catalog url="/api/getVacancies/"
                                             :filter="{ authorId: userId }"
                                             :limit="5"
                                             :item-type="$legacy.types.IntVacancyMap"
                                             :count.sync="responseDialog.count"
                                             :count-endings="responseDialog.countEndings"
                                             class="mb-8">
                                    <!-- Задания -->
                                    <template v-slot:items="{ items }">
                                        <v-radio-group v-model="responseDialog.values.vacancyId"
                                                       :rules="[rules.required]"
                                                       class="max-w-100 mx-n4 mx-lg-0">
                                            <v-radio v-for="item in items" :key="item.id"
                                                     :value="item.id"
                                                     class="l-radio l-radio--unstyled l-border bwb-1">
                                                <template v-slot:label>
                                                    <vacancy-card-map :value="item"
                                                                      :is-link="false"
                                                                      class="transparent w-100"/>
                                                </template>
                                            </v-radio>
                                        </v-radio-group>
                                    </template>

                                    <template v-slot:no-result>
                                        <div class="text-body-2">
                                            У вас нет вакансий для отправки,<br>
                                            перейдите в
                                            <nuxt-link to="/personal/vacancies-and-resumes/">личный кабинет</nuxt-link>
                                            и создайте вакансию
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
                                <div class="text-h5 mb-6">Ваша вакансия отправлена</div>

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
    import ResumeCardMap            from '~/components/ui/resume/ResumeCardMap';
    import VacancyCardMap           from '~/components/ui/vacancy/VacancyCardMap';
    import AppOptionalField         from '~/components/ui/AppOptionalField';
    import AppDialog                from '~/components/dialogs/AppDialog';
    import AppForm                  from '~/components/forms/AppForm';
    import AppCatalog               from '~/components/ui/AppCatalog';
    import AppDocListItem           from '~/components/ui/AppDocListItem';
    import AppCardDetailAuthor      from '~/components/ui/AppCardDetailAuthor';
    import { TASK_STATUS_OPEN, TASK_STATUS_CLOSE }     from '~/lib/constants/task';
    import { WORK_EXPERIENCE_LIST } from '~/lib/constants/user';
    import {
        formatLocaleDate,
        pickNumeralEnding,
    }                                              from '~/lib/classes/utility';

    export default {
        name: 'ResumeCardDetail',
        components: {
            ResumeCardMap,
            VacancyCardMap,
            AppCatalog,
            AppForm,
            AppDialog,
            AppOptionalField,
            AppFullscreenDialog,
            AppMap,
            AppCardDetailAuthor,
            TaskCardStatusBar,
            AppDocListItem,
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
            responseDialogDisplay: {
                type: Boolean,
                default: false,
            },
        },
        data: vm => ( {
            mapDialogDisplay: false,
            mapDialogDisplay2: false,
            responseDialog: {
                display: false,
                values: {
                    resumeId: vm.value.id,
                    vacancyId: null,
                },
                count: undefined,
                countEndings: [ 'вакансия', 'вакансии', 'вакансий' ],
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
            ageFormat: vm => {
                const { birthDay } = vm.value;

                if ( birthDay === null ) {
                    return null;
                }

                const birthYear = formatLocaleDate( birthDay ).getFullYear();
                const curYear = new Date().getFullYear();
                const diff = curYear - birthYear;

                return `${ diff } ${ pickNumeralEnding( diff, [ 'год', 'года', 'лет' ] ) }`;
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
            ...mapActions( 'user', [ 'setResumeStatus' ] ),
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
            setResumeFinished() {
                this.setResumeStatus( {
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
