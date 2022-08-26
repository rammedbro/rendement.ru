<template>
    <v-card>
        <template v-if="isDesktop">
            <v-container>
                <h1 class="text-h3">{{ h1 }}</h1>
            </v-container>
            <v-divider/>
        </template>

        <v-container class="list-mb-6">
            <!-- Табы -->
            <v-tabs ref="tabs"
                    v-model="activeTab.main"
                    grow>
                <v-tab>Я заказчик</v-tab>
                <v-tab>Я исполнитель</v-tab>
            </v-tabs>

            <!-- Табы: Контент -->
            <v-tabs-items v-model="activeTab.main"
                          touchless>
                <!-- Заказчик -->
                <v-tab-item>
                    <!-- Заказчик: Шапка -->
                    <v-row align="center" justify="space-between">
                        <v-col cols="auto">
                            <div class="text-h5 mb-2">Всего заданий</div>
                            <div class="text-h6 mb-6">{{ authorAllTasksCount }}</div>
                        </v-col>

                        <v-col cols="auto">
                            <!-- Кнопка "Создать задание" -->
                            <v-btn color="primary"
                                   min-width="288"
                                   nuxt to="/create-task/">
                                Создать задание
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-divider class="my-6"/>

                    <!-- Заказчик: Табы -->
                    <v-tabs v-if="authorAllTasksCount > 0"
                            v-model="activeTab.author"
                            hide-slider
                            class="l-tabs--chips mb-6">
                        <v-tab>Все</v-tab>
                        <v-tab>Открытые</v-tab>
                        <v-tab>В процессе</v-tab>
                        <v-tab>Завершенные</v-tab>
                    </v-tabs>

                    <!-- Заказчик: Результаты -->
                    <v-tabs-items v-model="activeTab.author">
                        <!-- Заказчик: Все -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ authorId: userId }"
                                         :count.sync="authorAllTasksCount"
                                         :count-endings="countEndings"
                                         :item-type="taskItemType"
                                         no-result-message="У вас пока нет заданий"
                                         pass-api-key
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <task-card-preview :value="item"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Заказчик: Открытые -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ authorId: userId, statusId: $legacy.constants.TASK_STATUS_OPEN }"
                                         :count-endings="countEndings"
                                         :item-type="taskItemType"
                                         pass-api-key
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <task-card-preview :value="item"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Заказчик: В процессе -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ authorId: userId, statusId: $legacy.constants.TASK_STATUS_RUNNING }"
                                         :count-endings="countEndings"
                                         :item-type="taskItemType"
                                         pass-api-key
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <task-card-preview :value="item"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>

                        <!-- Заказчик: Завершенные -->
                        <v-tab-item>
                            <app-catalog :url="url"
                                         :filter="{ authorId: userId, statusId: $legacy.constants.TASK_STATUS_CLOSE }"
                                         :count-endings="countEndings"
                                         :item-type="taskItemType"
                                         pass-api-key
                                         item-col-width="12">
                                <template v-slot:item="{ item }">
                                    <task-card-preview :value="item"/>
                                </template>
                            </app-catalog>
                        </v-tab-item>
                    </v-tabs-items>
                </v-tab-item>

                <!-- Исполнитель -->
                <v-tab-item>
                    <template v-if="userIsExecutor">
                        <!-- Исполнитель: Шапка -->
                        <v-row align="center" justify="space-between">
                            <v-col cols="auto">
                                <div class="text-h5 mb-2">Всего заданий</div>
                                <div class="text-h6 mb-6">{{ executorAllTasksCount }}</div>
                            </v-col>

                            <v-col cols="auto">
                                <!-- Кнопка "Найти задание" -->
                                <v-btn color="primary"
                                       min-width="288"
                                       nuxt to="/tasks/filter/">
                                    Найти задание
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-divider class="my-6"/>

                        <!-- Исполнитель: Табы -->
                        <v-tabs v-if="executorAllTasksCount > 0"
                                v-model="activeTab.executor"
                                hide-slider
                                class="l-tabs--chips mb-6">
                            <v-tab>Все</v-tab>
                            <v-tab>Открытые</v-tab>
                            <v-tab>В процессе</v-tab>
                            <v-tab>Завершенные</v-tab>
                        </v-tabs>

                        <!-- Исполнитель: Результаты -->
                        <v-tabs-items v-model="activeTab.executor">
                            <!-- Исполнитель: Все -->
                            <v-tab-item>
                                <app-catalog :url="url"
                                             :filter="{ executorId: userId }"
                                             :count.sync="executorAllTasksCount"
                                             :count-endings="countEndings"
                                             :item-type="taskItemType"
                                             no-result-message="Вы не откликнулись ни на одно задание."
                                             pass-api-key
                                             item-col-width="12">
                                    <template v-slot:item="{ item }">
                                        <task-card-preview :value="item"/>
                                    </template>
                                </app-catalog>
                            </v-tab-item>

                            <!-- Исполнитель: Открытые -->
                            <v-tab-item>
                                <app-catalog :url="url"
                                             :filter="{ executorId: userId, statusId: $legacy.constants.TASK_STATUS_OPEN }"
                                             :count-endings="countEndings"
                                             :item-type="taskItemType"
                                             pass-api-key
                                             item-col-width="12">
                                    <template v-slot:item="{ item }">
                                        <task-card-preview :value="item"/>
                                    </template>
                                </app-catalog>
                            </v-tab-item>

                            <!-- Исполнитель: В процессе -->
                            <v-tab-item>
                                <app-catalog :url="url"
                                             :filter="{ executorId: userId, statusId: $legacy.constants.TASK_STATUS_RUNNING }"
                                             :count-endings="countEndings"
                                             :item-type="taskItemType"
                                             pass-api-key
                                             item-col-width="12">
                                    <template v-slot:item="{ item }">
                                        <task-card-preview :value="item"/>
                                    </template>
                                </app-catalog>
                            </v-tab-item>

                            <!-- Исполнитель: Завершенные -->
                            <v-tab-item>
                                <app-catalog :url="url"
                                             :filter="{ executorId: userId, statusId: $legacy.constants.TASK_STATUS_CLOSE }"
                                             :count-endings="countEndings"
                                             :item-type="taskItemType"
                                             pass-api-key
                                             item-col-width="12">
                                    <template v-slot:item="{ item }">
                                        <task-card-preview :value="item"/>
                                    </template>
                                </app-catalog>
                            </v-tab-item>
                        </v-tabs-items>
                    </template>

                    <template v-else>
                        <!-- Блок "Стать исполнителем" -->
                        <app-become-executor/>
                    </template>
                </v-tab-item>
            </v-tabs-items>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { meta }       from '~/mixins/meta';

    import AppCatalog        from '~/components/ui/AppCatalog';
    import TaskCardPreview   from '~/components/ui/task/TaskCardPreview';
    import AppBecomeExecutor from '~/components/blocks/AppBecomeExecutor';
    import {
        IntTaskExecution,
        IntTaskPreview,
    }                        from '~/lib/types/task';

    export default {
        components: { AppBecomeExecutor, TaskCardPreview, AppCatalog },
        mixins: [ meta ],
        data: () => ( {
            title: 'Задания',
            activeTab: {
                main: null,
                author: 0,
                executor: 0,
            },
            url: '/api/getTasks/',
            authorAllTasksCount: undefined,
            executorAllTasksCount: undefined,
            countEndings: [ 'задание', 'задания', 'заданий' ],
            taskItemType: [ IntTaskPreview, IntTaskExecution ],
        } ),
        computed: {
            ...mapGetters( 'user', [ 'userId', 'userIsExecutor' ] ),
        },
    };
</script>