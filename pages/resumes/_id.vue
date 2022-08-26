<template>
    <v-container class="pa-0 py-lg-8">
        <v-row>
            <v-col ref="card"
                   cols="12" lg="7">
                <!-- Карточка -->
                <resume-card-detail v-show="!editFormDisplay"
                                    :title="h1"
                                    :value="value"
                                    :response-dialog-display.sync="responseDialogDisplay"/>

                <!-- Форма редактирования -->
                <v-card v-if="editFormDisplay">
                    <!-- Тулбар -->
                    <app-toolbar fixed
                                 title="Редактирование резюме"
                                 @click:close="closeEditForm"/>

                    <v-container>
                        <resume-crud-form v-bind="editData"
                                          @success="onEditSuccess"/>
                    </v-container>
                </v-card>
            </v-col>

            <v-col>
                <v-row>
                    <!-- Автор -->
                    <v-col v-if="isDesktop" v-show="!editFormDisplay"
                           cols="12">
                        <app-card-detail-author :author="value.author"
                                                :is-user-author="isUserAuthor"
                                                template="resume"
                                                telephone-button-id="btn-tel-resume"
                                                @dialogOpen="responseDialogDisplay = true"/>
                    </v-col>

                    <!-- Полезные ссылки -->
                    <v-col cols="12">
                        <v-container class="pt-4">
                            <app-useful-links theme="resume"/>
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

    import ResumeCardDetail         from '~/components/ui/resume/ResumeCardDetail';
    import ResumeCrudForm           from '~/components/ui/resume/ResumeCrudForm';
    import AppToolbar               from '~/components/layout/AppToolbar';
    import AppUsefulLinks           from '~/components/ui/AppUsefulLinks';
    import AppCardDetailAuthor      from '~/components/ui/AppCardDetailAuthor';
    import { checkObjectInterface } from '~/lib/classes/validation';
    import { IntResumeDetail }      from '~/lib/types/resume';
    import { IntMetaData }          from '~/lib/types/other';
    import { TASK_STATUS_OPEN }     from '~/lib/constants/task';

    export default {
        components: {
            AppCardDetailAuthor,
            ResumeCrudForm,
            ResumeCardDetail,
            AppUsefulLinks,
            AppToolbar,
        },
        mixins: [ meta ],
        data: () => ( {
            value: undefined,
            responseDialogDisplay: false,
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userIsLogin' ] ),
            isUserAuthor: vm => vm.value.author.id === vm.userId,
            editData: vm => {
                const {
                    id, category, title, docs, description,
                    experienceId, location, salary, skills,
                } = vm.value;

                const files = [ ...docs ];
                const categoryCode = category.code;
                const locationId = location ? location.id : null;

                return {
                    id,
                    categoryCode,
                    title,
                    description,
                    experienceId,
                    locationId,
                    files,
                    salary,
                    skills,
                };
            },
            isEditable: vm => vm.value.statusId === TASK_STATUS_OPEN,
            editFormDisplay: vm => {
                const { edit } = vm.$route.query;
                return ( vm.isUserAuthor && vm.isEditable && edit === 'true' );
            },
        },
        async asyncData( { route, params, store, error } ) {
            try {
                const value = await store.dispatch(
                    'api/apiGet', { url: '/api/getResume/', data: { id: params.id } } );
                const meta = await store.dispatch(
                    'api/apiGet', { url: '/api/getSeo/', data: { path: route.path } } );

                return {
                    value: checkObjectInterface( value, IntResumeDetail ),
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
