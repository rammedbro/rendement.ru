<template>
    <v-container class="pa-0 py-lg-8">
        <v-row>
            <v-col cols="12" lg="7">
                <v-row>
                    <v-col ref="card"
                           cols="12">
                        <!-- Карточка -->
                        <vacancy-card-detail v-show="!editFormDisplay"
                                             :title="h1"
                                             :value="value"
                                             :response-count.sync="responseCount"
                                             :response-dialog-display.sync="responseDialogDisplay"
                                             @update:response-count="responseReloadKey++"/>

                        <!-- Форма редактирования -->
                        <v-card v-if="editFormDisplay">
                            <!-- Тулбар -->
                            <app-toolbar fixed
                                         title="Редактирование вакансии"
                                         @click:close="closeEditForm"/>

                            <v-container>
                                <vacancy-crud-form v-bind="editData"
                                                   @success="onEditSuccess"/>
                            </v-container>
                        </v-card>
                    </v-col>

                    <!-- Отклики -->
                    <v-col v-if="userIsLogin"
                           v-show="!editFormDisplay"
                           id="responses"
                           cols="12">
                        <v-card>
                            <v-container>
                                <div class="text-h5 mb-4">Отклики</div>

                                <app-catalog :key="responseReloadKey"
                                             url="/api/getVacancyResponses/"
                                             :limit="5"
                                             :filter="{ vacancyId: value.id }"
                                             :count.sync="responseCount"
                                             :count-endings="responseCountEndings"
                                             :item-type="$legacy.types.IntResumePreview"
                                             :no-result-message="responseNoResultMessage"
                                             pass-api-key
                                             item-col-width="12">
                                    <template v-slot:item="{ item }">
                                        <resume-card-map :value="item"
                                                         class="px-0 pt-6 l-border bwt-1"/>
                                    </template>
                                </app-catalog>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>

            <v-col>
                <v-row>
                    <!-- Автор -->
                    <v-col v-if="isDesktop" v-show="!editFormDisplay"
                           cols="12">
                        <app-card-detail-author :author="value.author"
                                                :is-user-author="isUserAuthor"
                                                template="vacancy"
                                                @dialogOpen="responseDialogDisplay = true"/>
                    </v-col>

                    <!-- Полезные ссылки -->
                    <v-col cols="12">
                        <v-container class="pt-4">
                            <app-useful-links theme="vacancy"/>
                        </v-container>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { meta }                     from '~/mixins/meta';

    import VacancyCardDetail        from '~/components/ui/vacancy/VacancyCardDetail';
    import AppToolbar               from '~/components/layout/AppToolbar';
    import VacancyCrudForm          from '~/components/ui/vacancy/VacancyCrudForm';
    import AppUsefulLinks           from '~/components/ui/AppUsefulLinks';
    import AppCatalog               from '~/components/ui/AppCatalog';
    import ResumeCardMap            from '~/components/ui/resume/ResumeCardMap';
    import AppCardDetailAuthor      from '~/components/ui/AppCardDetailAuthor';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { IntVacancyDetail }     from '~/lib/types/vacancy';
    import { IntMetaData }          from '~/lib/types/other';
    import { TASK_STATUS_OPEN }     from '~/lib/constants/task';

    export default {
        components: {
            ResumeCardMap,
            AppCatalog,
            AppUsefulLinks,
            AppCardDetailAuthor,
            VacancyCrudForm,
            AppToolbar,
            VacancyCardDetail,
        },
        mixins: [ meta ],
        data: () => ( {
            value: undefined,
            responseCount: null,
            responseCountEndings: [ 'предложение', 'предложения', 'предложений' ],
            responseReloadKey: 0,
            responseDialogDisplay: false,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userIsLogin' ] ),
            isUserAuthor: vm => vm.value.author.id === vm.userId,
            editData: vm => {
                const {
                    id, category, title, landOwner, description,
                    experienceId, location, salary, requirements,
                } = vm.value;

                const categoryCode = category.code;
                const locationId = location ? location.id : null;

                return {
                    id,
                    categoryCode,
                    title,
                    landOwner,
                    description,
                    experienceId,
                    locationId,
                    salary,
                    requirements,
                };
            },
            isEditable: vm => vm.value.statusId === TASK_STATUS_OPEN,
            editFormDisplay: vm => {
                const { edit } = vm.$route.query;
                return ( vm.isUserAuthor && vm.isEditable && edit === 'true' );
            },
            responseNoResultMessage:
                vm => vm.isUserAuthor
                    ? 'У вас ещё нет откликов' : 'Вы ещё не откликались на данную вакансию',
        },
        async asyncData( { route, params, store, error } ) {
            try {
                const value = await store.dispatch(
                    'api/apiGet', { url: '/api/getVacancy/', data: { id: params.id } } );
                const meta = await store.dispatch(
                    'api/apiGet', { url: '/api/getSeo/', data: { path: route.path } } );

                return {
                    value: checkObjectInterface( value, IntVacancyDetail ),
                    meta: checkObjectInterface( meta, IntMetaData ),
                };
            } catch ( e ) {
                console.log( e.message );
                error( e );
            }
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            onEditSuccess( result ) {
                this.value = result;
                this.closeEditForm();

                this.$nextTick( () => {
                    this.$vuetify.goTo( this.$refs.card );
                } );
            },
            closeEditForm() {
                this.$router.push( this.$route.path );
            },
        },
    };
</script>
