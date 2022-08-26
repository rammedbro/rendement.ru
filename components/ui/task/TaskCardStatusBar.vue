<template>
    <div class="task-card-status-bar">
        <v-row dense
               align="center" justify="space-between"
               class="text-small-3">
            <!-- Статус -->
            <v-col cols="auto"
                   :class="statusColor">
                {{ statusText }}
            </v-col>

            <v-col cols="auto">
                <v-row no-gutters
                       align="center"
                       class="grey--text text--lighten-1 list-mr-2">
                    <template v-if="!disableViewCount">
                        <!-- Просмотры -->
                        <div :title="value.viewCount"
                             class="d-flex align-center">
                            <v-icon size="16" class="material-icons-outlined mr-2">remove_red_eye</v-icon>
                            {{ viewCountFormat }}
                        </div>

                        <v-divider vertical/>
                    </template>
                    <!-- Дата публикации -->
                    <span>{{ datePublishingFormat }}</span>

                    <v-menu v-if="displayActions"
                            open-on-click
                            offset-y offset-overflow
                            bottom left origin="top right"
                            min-width="225">
                        <template v-slot:activator="{ on }">
                            <v-icon v-on="on"
                                    @click.prevent>
                                mdi-dots-vertical
                            </v-icon>
                        </template>

                        <v-list>
                            <template v-if="eventOnEdit">
                                <v-list-item :disabled="!isEditable"
                                             @click="$emit( 'edit' )">
                                    Редактировать
                                </v-list-item>
                            </template>

                            <template v-else>
                                <v-list-item :disabled="!isEditable"
                                             nuxt :to="`${ link }?edit=true`" exact>
                                    Редактировать
                                </v-list-item>
                            </template>

                            <v-list-item link :disabled="!isEditable"
                                         @click="confirmDialog = true">
                                Завершить
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-row>
            </v-col>
        </v-row>

        <app-confirm-dialog v-model="confirmDialog"
                            @confirm="$emit( 'delete' )"/>
    </div>
</template>

<script>
    import {
        formatLocaleDate,
        formatBigCount,
    }                       from '~/lib/classes/utility';
    import {
        TASK_STATUS_CLOSE,
        TASK_STATUS_COMPLAINED,
        TASK_STATUS_OPEN,
        TASK_STATUS_RUNNING,
    }                       from '~/lib/constants/task';
    import AppConfirmDialog from '~/components/dialogs/AppConfirmDialog';

    export default {
        name: 'TaskCardStatusBar',
        components: {
            AppConfirmDialog,
        },
        props: {
            value: {
                type: Object,
                required: true,
            },
            link: {
                type: String,
                default: '',
            },
            displayActions: {
                type: Boolean,
                default: false,
            },
            disableViewCount: {
                type: Boolean,
                default: false,
            },
            eventOnEdit: {
                type: Boolean,
                default: false,
            },
        },
        data: () => ( {
            confirmDialog: false,
        } ),
        computed: {
            isEditable: vm => vm.value.statusId === TASK_STATUS_OPEN,
            statusText: vm => {
                switch ( vm.value.statusId ) {
                    case TASK_STATUS_OPEN:
                        return 'Открыто';
                    case TASK_STATUS_RUNNING:
                        return 'В процессе';
                    case TASK_STATUS_CLOSE:
                        return 'Завершено';
                    case TASK_STATUS_COMPLAINED:
                        return 'Арбитраж';
                }
            },
            statusColor: vm => {
                switch ( vm.value.statusId ) {
                    case TASK_STATUS_OPEN:
                        return 'green--text';
                    case TASK_STATUS_RUNNING:
                        return 'orange--text';
                    case TASK_STATUS_CLOSE:
                    case TASK_STATUS_COMPLAINED:
                        return 'red--text';
                }
            },
            viewCountFormat: vm => formatBigCount( vm.value.viewCount ),
            datePublishingFormat: vm => {
                const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                const [ date, time ] = formatLocaleDate( vm.value.datePublishing, 'full', options ).split( ', ' );
                return `${ date } в ${ time }`;
            },
        },
    };
</script>
