<template>
    <v-card width="608">

        <v-container class="l-border bwb-1">
            <!-- Кнопка "Создать вакансию" -->
            <v-btn color="primary"
                   block
                   @click="createClientVacancy">
                Создать новую вакансию
            </v-btn>
        </v-container>

        <!-- Вакансии -->
        <v-container class="list-mb-6">

            <template v-if="isDesktop">
                <v-row>
                    <v-col cols="12">
                        <h1 class="text-h3">{{ h1 }}</h1>
                    </v-col>
                </v-row>

                <v-divider class="my-6"/>
            </template>

            <!-- Вакансии: Табы -->
            <v-tabs v-model="activeTab.vacancies"
                    hide-slider
                    class="l-tabs--chips mb-6">
                <v-tab>Активные</v-tab>
                <v-tab>Завершенные</v-tab>
            </v-tabs>
            <!-- Вакансии: Результаты -->
            <v-tabs-items v-model="activeTab.vacancies" class="items">
                <!-- Вакансии: Открытые -->
                <v-tab-item>
                    <app-catalog :url="vacancies.url"
                                 :filter="{ statusId: $legacy.constants.TASK_STATUS_OPEN }"
                                 :item-type="$legacy.types.IntClientVacancy"
                                 :count.sync="vacancies.allCount"
                                 :count-endings="vacancies.countEndings"
                                 disable-count
                                 item-col-width="12"
                                 disable-pagination
                                 pass-api-key>
                        <template v-slot:item="{ item }">
                            <vacancy-card-expansion :value="item"/>
                        </template>
                    </app-catalog>
                </v-tab-item>

                <!-- Вакансии: Завершенные -->
                <v-tab-item>
                    <app-catalog :url="vacancies.url"
                                 :filter="{ statusId: $legacy.constants.TASK_STATUS_CLOSE }"
                                 :item-type="$legacy.types.IntClientVacancy"
                                 :count.sync="vacancies.allCount"
                                 disable-count
                                 item-col-width="12" disable-pagination
                                 pass-api-key>
                        <template v-slot:item="{ item }">
                            <vacancy-card-expansion :value="item"/>
                        </template>
                    </app-catalog>
                </v-tab-item>
            </v-tabs-items>
        </v-container>

        <!-- Форма создания вакансии -->
        <app-create-client-vacancy-dialog/>
    </v-card>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    import { meta }                     from '~/mixins/meta';

    import AppCatalog                   from '~/components/ui/AppCatalog';
    import VacancyCardExpansion         from '~/components/ui/vacancy/VacancyCardExpansion';
    import AppCreateClientVacancyDialog from '~/components/dialogs/AppCreateClientVacancyDialog';

    export default {
        components: { AppCreateClientVacancyDialog, VacancyCardExpansion, AppCatalog },
        mixins: [ meta ],
        middleware: 'clientGroup',
        data: () => ( {
            title: 'Вакансии',
            activeTab: {
                vacancies: 0,
            },
            vacancies: {
                url: '/api/getClientVacancies/',
                allCount: undefined,
                countEndings: [ 'вакансия', 'вакансии', 'вакансий' ],
            },
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId' ] ),
        },
        methods: {
            ...mapMutations( 'ui', [ 'showAppDialog' ] ),
            createClientVacancy() {
                this.showAppDialog( 'createClientVacancy' );
            },
        },
    };
</script>
