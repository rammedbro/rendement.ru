<template>
    <v-card>
        <template v-if="isDesktop">
            <v-container class="l-border bwb-1">
                <h1 class="text-h3">{{ h1 }}</h1>
            </v-container>
        </template>

        <v-container class="list-mb-6">
            <!-- Табы -->
            <v-tabs ref="tabs"
                    v-model="activeTab.main"
                    grow>
                <v-tab>Мои вакансии</v-tab>
                <v-tab>Мои резюме</v-tab>
            </v-tabs>

            <!-- Табы: Контент -->
            <v-tabs-items v-model="activeTab.main"
                          touchless>
                <!-- Вакансии -->
                <v-tab-item>
                    <!-- Вакансии: Шапка -->
                    <v-row>
                        <v-col cols="12">
                            <div class="text-h5 mb-2">Всего вакансий</div>
                            <div class="text-h6 mb-6">{{ vacancies.allCount }}</div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <!-- Кнопка "Найти вакансию" -->
                            <v-btn color="primary"
                                   block outlined
                                   nuxt to="/find-work/">
                                Найти вакансию
                            </v-btn>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <!-- Кнопка "Создать вакансию" -->
                            <v-btn color="primary"
                                   block
                                   nuxt to="/create-work/?type=vacancies">
                                Создать вакансию
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-divider class="my-6"/>

                    <!-- Вакансии: Табы -->
                    <v-tabs v-if="vacancies.allCount > 0"
                            v-model="activeTab.vacancies"
                            hide-slider
                            class="l-tabs--chips mb-6">
                        <v-tab>Все</v-tab>
                        <v-tab>Открытые</v-tab>
                        <v-tab>Завершенные</v-tab>
                    </v-tabs>

                    <!-- Вакансии: Результаты -->
                    <v-tabs-items v-model="activeTab.vacancies">
                        <!-- Вакансии: Все -->
                        <v-tab-item>
                            <app-catalog :url="vacancies.url"
                                         :filter="{ authorId: userId }"
                                         :count.sync="vacancies.allCount"
                                         :count-endings="vacancies.countEndings"
                                         :item-type="$legacy.types.IntVacancyPreview"
                                         item-col-width="12"
                                         no-result-message="У вас пока нет созданных вакансий">
                                <template v-slot:item="{ item }">
                                    <vacancy-card-preview :value="item"
                                                          display-actions
                                                          min-width="576"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Вакансии: Открытые -->
                        <v-tab-item>
                            <app-catalog :url="vacancies.url"
                                         :filter="{ authorId: userId, statusId: $legacy.constants.TASK_STATUS_OPEN }"
                                         :count-endings="vacancies.countEndings"
                                         :item-type="$legacy.types.IntVacancyPreview"
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <vacancy-card-preview :value="item"
                                                          display-actions
                                                          min-width="576"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Вакансии: Завершенные -->
                        <v-tab-item>
                            <app-catalog :url="vacancies.url"
                                         :filter="{ authorId: userId, statusId: $legacy.constants.TASK_STATUS_CLOSE }"
                                         :count-endings="vacancies.countEndings"
                                         :item-type="$legacy.types.IntVacancyPreview"
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <vacancy-card-preview :value="item"
                                                          display-actions
                                                          min-width="576"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>

                <!-- Резюме -->
                <v-tab-item>
                    <!-- Резюме: Шапка -->
                    <v-row>
                        <v-col cols="12">
                            <div class="text-h5 mb-2">Всего резюме</div>
                            <div class="text-h6 mb-6">{{ resumes.allCount }}</div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <!-- Кнопка "Найти резюме" -->
                            <v-btn color="primary"
                                   block outlined
                                   nuxt to="/find-work/">
                                Найти резюме
                            </v-btn>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <!-- Кнопка "Создать резюме" -->
                            <v-btn color="primary"
                                   block
                                   nuxt to="/create-work/?type=resumes">
                                Создать резюме
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-divider class="my-6"/>

                    <!-- Резюме: Табы -->
                    <v-tabs v-if="resumes.allCount > 0"
                            v-model="activeTab.resumes"
                            hide-slider
                            class="l-tabs--chips mb-6">
                        <v-tab>Все</v-tab>
                        <v-tab>Открытые</v-tab>
                        <v-tab>Завершенные</v-tab>
                    </v-tabs>

                    <!-- Резюме: Результаты -->
                    <v-tabs-items v-model="activeTab.resumes">
                        <!-- Резюме: Все -->
                        <v-tab-item>
                            <app-catalog :url="resumes.url"
                                         :filter="{ authorId: userId }"
                                         :count.sync="resumes.allCount"
                                         :count-endings="resumes.countEndings"
                                         :item-type="$legacy.types.IntResumePreview"
                                         item-col-width="12"
                                         no-result-message="У вас пока нет созданных резюме">
                                <template v-slot:item="{ item }">
                                    <resume-card-preview :value="item"
                                                         display-actions
                                                         min-width="576"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Исполнитель: Открытые -->
                        <v-tab-item>
                            <app-catalog :url="resumes.url"
                                         :filter="{ authorId: userId, statusId: $legacy.constants.TASK_STATUS_OPEN }"
                                         :count-endings="resumes.countEndings"
                                         :item-type="$legacy.types.IntResumePreview"
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <resume-card-preview :value="item"
                                                         display-actions
                                                         min-width="576"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Резюме: Завершенные -->
                        <v-tab-item>
                            <app-catalog :url="resumes.url"
                                         :filter="{ authorId: userId, statusId: $legacy.constants.TASK_STATUS_CLOSE }"
                                         :count-endings="resumes.countEndings"
                                         :item-type="$legacy.types.IntResumePreview"
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <resume-card-preview :value="item"
                                                         display-actions
                                                         min-width="576"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>
            </v-tabs-items>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { meta }       from '~/mixins/meta';

    import AppCatalog         from '~/components/ui/AppCatalog';
    import VacancyCardPreview from '~/components/ui/vacancy/VacancyCardPreview';
    import ResumeCardPreview  from '~/components/ui/resume/ResumeCardPreview';

    export default {
        components: { ResumeCardPreview, VacancyCardPreview, AppCatalog },
        mixins: [ meta ],
        middleware: 'notClientGroup',
        data: () => ( {
            title: 'Вакансии и резюме',
            activeTab: {
                main: null,
                vacancies: 0,
                resumes: 0,
            },
            vacancies: {
                url: '/api/getVacancies/',
                allCount: undefined,
                countEndings: [ 'вакансия', 'вакансии', 'вакансий' ],
            },
            resumes: {
                url: '/api/getResumes/',
                allCount: undefined,
                countEndings: [ 'резюме', 'резюме', 'резюме' ],
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
        },
    };
</script>
