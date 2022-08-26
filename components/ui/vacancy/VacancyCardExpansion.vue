<template>
    <v-card :min-width="minWidth"
            :max-width="maxWidth"
            hover
            class="resume-card-expansion">
        <v-col>
            <!-- Статус бар -->
            <task-card-status-bar :value="value"
                                  disable-view-count
                                  display-actions
                                  event-on-edit
                                  class="mb-5"
                                  @edit="editClientVacancy"
                                  @delete="closeClientVacancy"/>
            <v-expansion-panels v-model="expansionPanel">
                <v-expansion-panel class="expansion-panel">
                    <!-- Название -->
                    <v-expansion-panel-header class="text-h5 text-ellipsis pa-0"
                                              :title="value.title">
                        <v-badge
                            v-if="expansionPanel !== 0 && value.resumes.length > 0"
                            offset-y="10px"
                            color="red"
                            :content="value.resumes.length">
                            {{ value.title }}
                        </v-badge>
                        <template v-else>
                            {{ value.title }}
                        </template>
                    </v-expansion-panel-header>

                    <!-- Резюме -->
                    <v-expansion-panel-content>
                        <!-- Индикатор загрузки -->
                        <v-overlay v-show="loading"
                                   absolute
                                   opacity="0.3"
                                   z-index="1030"
                                   color="white">
                            <v-progress-circular color="primary" indeterminate
                                                 size="28" width="3"/>
                        </v-overlay>

                        <v-row class="candidate-counter mb-4">
                            {{ value.resumes.length ? 'Кандидатов: ' + value.resumes.length : 'Нет кандидатов' }}
                        </v-row>

                        <template v-if="value.resumes.length > 0">
                            <v-row class="pb-1">
                                <v-col cols="5" class="pl-0 text-small-2">
                                    Резюме
                                </v-col>
                                <v-col cols="7" class="pl-0 text-small-2">
                                    Кандидат
                                </v-col>
                            </v-row>

                            <v-row v-for="resume in value.resumes" :key="resume.id" class="resume-item align-center mt-0 mb-0">
                                <resume-list-item
                                    :key="updateResumeKey"
                                    :loading.sync="loading"
                                    :value="resume"
                                    @edit-resume="distributionResumeStatusAction"
                                    @connect-with-candidate="connectWithCandidate"
                                    @download-resume-file="downloadResumeFile"
                                    @finalize-resume="finalizeResume"
                                    @empty-accounting-url="emptyAccountingUrl"/>
                            </v-row>
                        </template>
                    </v-expansion-panel-content>

                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>

        <!-- Сообщения о недостатке средств -->
        <app-dialog v-model="editVacancyErrorResponseDialog.display">
            {{ editVacancyErrorResponseDialog.message }}
        </app-dialog>

        <!-- Форма связи с кандидатом -->
        <app-communication-dialog v-model="connectWithCandidateDialog.display"
                                  :phone="connectWithCandidateDialog.phone"
                                  :email="connectWithCandidateDialog.email"/>

        <!-- Сообщение о недостатке средств -->
        <app-dialog v-model="noteDialog.display">
            <p class="text-body-2 pa-5">
                Проверьте резюме кандидата
                на соответствие требования
            </p>
        </app-dialog>

        <!-- Сообщение об отсутствии бухгалтерских документов -->
        <app-dialog v-model="emptyAccountingUrlDialog.display">
            <p class="text-body-2 pa-5">
                Бухгалтерские документы еще не готовы или не загружены в Личный кабинет
            </p>
        </app-dialog>

        <!-- Форма доделать резюме -->
        <app-finalize-client-resume-dialog v-model="finalizeResumeDialog.display"
                                           :resume-id="finalizeResumeDialog.resumeId"
                                           url="/api/finalizeResume/"
                                           @success="updatedResumeItem"/>

        <!-- Форма редактирования вакансии -->
        <app-edit-client-vacancy-dialog v-model="editClientVacancyDialog.display"
                                        :current-vacancy="value"/>


        <!-- Форма описать прицину отказа соискателю -->
        <app-action-description-dialog v-model="descriptionForDenyResumeDialog.display"
                                       :resume-id="descriptionForDenyResumeDialog.resumeId"
                                       url="/api/editClientResume/"
                                       :action-status="DENY_RESUME"
                                       @success="updatedResumeItem"/>
    </v-card>
</template>

<script>
    import { mapActions, mapMutations }  from 'vuex';

    import { VCol }                      from 'vuetify/lib';
    import AppActionDescriptionDialog    from '~/components/dialogs/AppActionDescriptionDialog';
    import TaskCardStatusBar             from '~/components/ui/task/TaskCardStatusBar';
    import ResumeListItem                from '~/components/ui/resume/ResumeListItem';
    import {
        USER_ERROR,
    }                                    from '~/lib/constants/error';
    import {
        TASK_STATUS_CLOSE,
    }                                    from '~/lib/constants/task';
    import {
        ACCESS_RESUME,
        DENY_RESUME,
    }                                    from '~/lib/constants/clientResume';
    import AppDialog                     from '~/components/dialogs/AppDialog';
    import AppCommunicationDialog        from '~/components/dialogs/AppCommunicationDialog';
    import AppFinalizeClientResumeDialog from '~/components/dialogs/AppFinalizeClientResumeDialog';
    import AppEditClientVacancyDialog    from '~/components/dialogs/AppEditClientVacancyDialog';

    export default {
        name: 'VacancyCardExpansion',
        components: {
            AppActionDescriptionDialog,
            AppEditClientVacancyDialog,
            AppFinalizeClientResumeDialog,
            AppCommunicationDialog,
            AppDialog,
            ResumeListItem,
            TaskCardStatusBar,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
            minWidth: {
                type: [ Number, String ],
                default: 288,
            },
            maxWidth: {
                type: [ Number, String ],
                default: 576,
            },
        },
        data: () => ( {
            components: {
                VCol,
            },
            DENY_RESUME,
            loading: false,
            expansionPanel: false,
            updateResumeKey: 0,
            editVacancyErrorResponseDialog: {
                display: false,
                message: undefined,
            },
            connectWithCandidateDialog: {
                display: false,
                phone: undefined,
                email: undefined,
            },
            noteDialog: {
                display: false,
            },
            finalizeResumeDialog: {
                display: false,
                resumeId: undefined,
            },
            editClientVacancyDialog: {
                display: false,
            },
            descriptionForDenyResumeDialog: {
                display: false,
                resumeId: undefined,
            },
            emptyAccountingUrlDialog: {
                display: false,
            },
        } ),
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            ...mapActions( 'api', [ 'apiPost', 'apiGet' ] ),
            distributionResumeStatusAction( payload ) {
                const [ actionStatus, resumeObject ] = payload;

                if ( !actionStatus ) return;

                if ( actionStatus === DENY_RESUME ) {
                    this.descriptionForDenyResumeDialog.display = true;
                    this.descriptionForDenyResumeDialog.resumeId = resumeObject.id;
                } else if ( actionStatus === ACCESS_RESUME ) {
                    this.editResumeStatus( payload );
                }
            },
            editResumeStatus( payload ) {
                const [ actionStatus, resumeObject ] = payload;

                if ( !actionStatus ) return;

                this.loading = true;

                this.apiPost( {
                    url: '/api/editClientResume/',
                    data: { id: resumeObject.id, statusId: actionStatus },
                    passApiKey: true,
                } )
                    .then( response => {
                        this.updatedResumeItem( response );
                    } )
                    .catch( e => {
                        if ( e.errorCode === USER_ERROR ) {
                            this.editVacancyErrorResponseDialog.display = true;
                            this.editVacancyErrorResponseDialog.message = e.message;
                        } else {
                            this.showAppDialog( 'error' );
                            console.log( e );
                        }
                    } )
                    .finally( () => {
                        this.loading = false;
                    } );
            },
            emptyAccountingUrl() {
                this.emptyAccountingUrlDialog.display = true;
            },
            connectWithCandidate( resumeObject ) {
                if ( !resumeObject.isDownloaded && !resumeObject.isUnderRevision ) {
                    this.noteDialog.display = true;
                } else {
                    this.loading = true;
                    this.apiGet( {
                        url: '/api/getContactCandidate/',
                        data: { id: resumeObject.id },
                        passApiKey: true,
                    } )
                        .then( response => {
                            const { phone, email } = response;

                            this.connectWithCandidateDialog.display = true;
                            this.connectWithCandidateDialog.email = email;
                            this.connectWithCandidateDialog.phone = phone;
                        } )
                        .catch( e => {
                            console.log( e );
                            this.showAppDialog( 'error' );
                        } )
                        .finally( () => {
                            this.loading = false;
                        } );
                }
            },
            updatedResumeItem( updatedResume ) {
                if ( !updatedResume ) return;

                for ( const key in this.value.resumes ) {
                    if ( +this.value.resumes[ key ].id === +updatedResume.id ) {
                        const {
                            accountingUrl,
                            candidateName,
                            email,
                            id,
                            isDownloaded,
                            isUnderRevision,
                            phone,
                            resumeUrl,
                            statusId,
                        } = updatedResume;

                        this.$set( this.value.resumes, key, {
                            accountingUrl,
                            candidateName,
                            email,
                            id: +id,
                            isDownloaded,
                            isUnderRevision,
                            phone,
                            resumeUrl,
                            statusId: +statusId,
                        } );

                        this.updateResumeKey += 1;
                        return;
                    }
                }
            },
            downloadResumeFile( resumeObject ) {
                this.loading = true;
                this.apiPost( {
                    url: '/api/downloadResumeFile/',
                    data: { id: resumeObject.id },
                    passApiKey: true,
                } )
                    .then( response => {
                        this.updatedResumeItem( response );
                        window.open( response.resumeUrl );
                    } )
                    .catch( e => {
                        console.log( e );
                        this.showAppDialog( 'error' );
                    } )
                    .finally( () => {
                        this.loading = false;
                    } );
            },
            finalizeResume( resumeObject ) {
                this.finalizeResumeDialog.display = true;
                this.finalizeResumeDialog.resumeId = resumeObject.id;
            },
            editClientVacancy() {
                this.editClientVacancyDialog.display = true;
            },
            closeClientVacancy() {
                this.loading = true;
                this.apiPost( {
                    url: '/api/closeClientVacancy/',
                    data: { id: this.value.id },
                    passApiKey: true,
                } )
                    .then( () => {
                        this.value.statusId = TASK_STATUS_CLOSE;
                        this.$emit( 'update:delete', true );
                    } )
                    .catch( e => {
                        console.log( e );
                        this.showAppDialog( 'error' );
                    } )
                    .finally( () => {
                        this.loading = false;
                    } );
            },
        },
    };
</script>

<style scoped lang="scss">
    .expansion-panel {
        &:not(:first-child)::after {
            border: 0;
        }

        &:before {
            box-shadow: none;
        }
    }

    .candidate-counter {
        font-size: 14px;
    }

    .resume-item {
        padding: 10px 0;
        border-top: 1px solid #E8E8E8;

        &:last-child {
            margin-bottom: -24px !important;
        }
    }

    .v-badge {
        flex: none;
    }
</style>
